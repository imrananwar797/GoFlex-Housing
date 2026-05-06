import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
// @ts-ignore
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import crypto from 'crypto';
import prisma from '../utils/db.client';

// const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findFirst({ 
      where: { 
        OR: [
          { username },
          { email: username }
        ]
      } 
    });
    if (!user) return res.status(401).json({ detail: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ detail: 'Invalid credentials' });

    if (user.two_factor_enabled) {
      const tempToken = jwt.sign(
        { sub: user.username, user_id: user.id, role: user.role, scope: '2fa_pending' },
        process.env.SECRET_KEY || 'secret',
        { expiresIn: '5m' }
      );
      return res.json({ requires_2fa: true, temp_token: tempToken });
    }

    const token = jwt.sign(
      { sub: user.username, user_id: user.id, role: user.role },
      process.env.SECRET_KEY || 'secret',
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
      process.env.SECRET_KEY || 'secret',
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
    const payload: any = jwt.verify(temp_token, process.env.SECRET_KEY || 'secret');
    if (payload.scope !== '2fa_pending') throw new Error();

    const user = await prisma.user.findUnique({ where: { id: payload.user_id } });
    if (!user || !user.two_factor_secret) return res.status(401).json({ detail: 'Invalid session' });

    const isValid = authenticator.check(code, user.two_factor_secret);
    if (!isValid) return res.status(400).json({ detail: 'Invalid code' });

    const token = jwt.sign(
      { sub: user.username, user_id: user.id, role: user.role },
      process.env.SECRET_KEY || 'secret',
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
