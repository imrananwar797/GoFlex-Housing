import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import prisma from '../utils/db.client';

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error('FATAL: JWT_SECRET environment variable not set.');
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    // Decode the token payload (without verification) to inspect issuer claims
    let decoded: any = null;
    try {
      decoded = jwt.decode(token);
    } catch (decodeErr) {
      // If we cannot decode it, treat it as invalid
      return res.sendStatus(403);
    }

    const isSupabaseToken = decoded && (
      decoded.iss === 'supabase' ||
      (decoded.iss && (
        decoded.iss.includes('.supabase.co/auth/v1') ||
        decoded.iss.includes('/auth/v1') ||
        decoded.iss.includes('supabase')
      ))
    );

    if (isSupabaseToken) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('⚠️ Supabase URL or Anon Key is missing from backend env configuration.');
        return res.sendStatus(403);
      }

      const normalizedSupabaseUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;

      // Delegate verification of token to Supabase Auth API
      axios.get(`${normalizedSupabaseUrl}/auth/v1/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: supabaseAnonKey,
        }
      })
      .then(async (response) => {
        const supabaseUser = response.data;
        if (!supabaseUser || !supabaseUser.email) {
          return res.sendStatus(403);
        }

        try {
          // Find the corresponding user in public.users database
          let dbUser = await prisma.user.findFirst({
            where: { email: supabaseUser.email }
          });

          // Auto-register user in DB if they exist in Supabase but not in our public schema
          if (!dbUser) {
            console.log(`[OAuth Sync] Auto-registering Google user: ${supabaseUser.email}`);
            const baseUsername = supabaseUser.email.split('@')[0];
            const suffix = Math.random().toString(36).substring(2, 6);
            const uniqueUsername = `${baseUsername}_${suffix}`;
            
            dbUser = await prisma.user.create({
              data: {
                username: uniqueUsername,
                email: supabaseUser.email,
                password_hash: 'OAUTH_USER', // placeholder since authenticating via Google
                role: 'RESIDENT',
                full_name: supabaseUser.user_metadata?.full_name || baseUsername,
              }
            });
          }

          (req as any).user = {
            sub: dbUser.username,
            user_id: dbUser.id,
            role: dbUser.role
          };
          next();
        } catch (dbErr) {
          console.error('❌ Error finding/creating user from Supabase OAuth token:', dbErr);
          res.sendStatus(500);
        }
      })
      .catch((apiErr) => {
        console.error('⚠️ Failed to verify token with Supabase Auth API:', apiErr.message);
        res.sendStatus(403);
      });
    } else {
      // Normal application-issued JWT token verification
      jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
        if (err) {
          return res.sendStatus(403);
        }

        (req as any).user = user;
        next();
      });
    }
  } else {
    res.sendStatus(401);
  }
};

export const authorizeRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (user && user.role === role.toUpperCase()) {
      next();
    } else {
      res.status(403).json({ detail: 'Insufficient permissions' });
    }
  };
};

// Alias for cleaner imports
export const authenticate = authenticateJWT;

// Multi-role authorization factory: requireRole('ADMIN', 'OWNER')
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (user && roles.map(r => r.toUpperCase()).includes(user.role?.toUpperCase())) {
      next();
    } else {
      res.status(403).json({ detail: 'Insufficient permissions. Required role: ' + roles.join(' or ') });
    }
  };
};
