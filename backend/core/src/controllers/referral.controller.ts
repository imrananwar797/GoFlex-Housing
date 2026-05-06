import { Request, Response } from 'express';
import prisma from '../utils/db.client';

export const getReferralStats = async (req: Request, res: Response) => {
  const user_id = (req as any).user.user_id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: user_id },
      select: { referral_code: true }
    });

    const referrals = await prisma.user.findMany({
      where: { referred_by: user?.referral_code },
      select: {
        id: true,
        username: true,
        created_at: true,
        role: true
      }
    });

    const totalEarned = referrals.filter(r => r.role === 'RESIDENT').length * 500; // ₹500 per resident referral

    res.json({
      referral_code: user?.referral_code,
      total_referrals: referrals.length,
      successful_referrals: referrals.filter(r => r.role === 'RESIDENT').length,
      total_credits_earned: totalEarned,
      referral_history: referrals
    });

  } catch (error) {
    res.status(500).json({ detail: 'Error fetching referral stats' });
  }
};
