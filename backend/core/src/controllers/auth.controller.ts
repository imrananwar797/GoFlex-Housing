import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// @ts-ignore
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import crypto from 'crypto';
import prisma from '../utils/db.client';

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error('FATAL: JWT_SECRET environment variable not set.');
}

// const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    console.log(`[DEBUG] Login attempt for: ${username}`);
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: username }, { username: username }] }
    });

    if (!user) {
      console.log(`[DEBUG] User not found: ${username}`);
      return res.status(401).json({ detail: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log(`[DEBUG] Password match: ${isMatch}`);
    
    if (!isMatch) return res.status(401).json({ detail: 'Invalid credentials' });

    if (user.two_factor_enabled) {
      const tempToken = jwt.sign(
        { sub: user.username, user_id: user.id, role: user.role, scope: '2fa_pending' },
        SECRET_KEY,
        { expiresIn: '5m' }
      );
      return res.json({ requires_2fa: true, temp_token: tempToken });
    }

    const token = jwt.sign(
      { sub: user.username, user_id: user.id, role: user.role },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      requires_2fa: false
    });
  } catch (error) {
    res.status(500).json({ detail: 'Internal server error' });
  }
};

export const register = async (req: Request, res: Response) => {
  const { username, email, password, full_name, role, referred_by } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password_hash: hashedPassword,
        full_name,
        role: role.toUpperCase(),
        referral_code: referralCode,
        referred_by: referred_by || null
      }
    });

    const token = jwt.sign(
      { sub: user.username, user_id: user.id, role: user.role },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.json({ 
      id: user.id, 
      username: user.username, 
      email: user.email, 
      role: user.role, 
      referral_code: referralCode,
      access_token: token
    });
  } catch (error) {
    res.status(400).json({ detail: 'User already exists' });
  }
};

export const validate2FA = async (req: Request, res: Response) => {
  const { code, temp_token } = req.body;

  try {
    const payload: any = jwt.verify(temp_token, SECRET_KEY);
    if (payload.scope !== '2fa_pending') throw new Error();

    const user = await prisma.user.findUnique({ where: { id: payload.user_id } });
    if (!user || !user.two_factor_secret) return res.status(401).json({ detail: 'Invalid session' });

    const isValid = authenticator.check(code, user.two_factor_secret);
    if (!isValid) return res.status(400).json({ detail: 'Invalid code' });

    const token = jwt.sign(
      { sub: user.username, user_id: user.id, role: user.role },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(401).json({ detail: 'Invalid or expired session' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ detail: 'Not authenticated' });

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.user_id },
      include: {
        goflex_score: true,
        kyc: { select: { status: true, document_type: true } },
        _count: { select: { bookings: true, complaints: true, owned_properties: true } },
      },
    });

    if (!dbUser) return res.status(404).json({ detail: 'User not found' });

    const { password_hash, ...safeUser } = dbUser;
    res.json(safeUser);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const user_id = (req as any).user.user_id;
  const { full_name, phone } = req.body;
  try {
    const updated = await prisma.user.update({
      where: { id: user_id },
      data: { full_name, phone },
      select: { id: true, username: true, email: true, full_name: true, phone: true, role: true },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to update profile.' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const user_id = (req as any).user.user_id;
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password) {
    return res.status(400).json({ detail: 'current_password and new_password are required.' });
  }
  try {
    const user = await prisma.user.findUnique({ where: { id: user_id } });
    if (!user) return res.status(404).json({ detail: 'User not found.' });

    const isMatch = await bcrypt.compare(current_password, user.password_hash);
    if (!isMatch) return res.status(400).json({ detail: 'Current password is incorrect.' });

    const hashed = await bcrypt.hash(new_password, 10);
    await prisma.user.update({ where: { id: user_id }, data: { password_hash: hashed } });
    res.json({ detail: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ detail: 'Failed to change password.' });
  }
};
