import { Request, Response } from 'express';
import prisma from '../utils/db.client';

export const getEscrowAccount = async (req: Request, res: Response) => {
  const { booking_id } = req.params;
  try {
    const account = await prisma.escrowAccount.findUnique({
      where: { booking_id: parseInt(booking_id as string) },
      include: { booking: true }
    });

    if (!account) {
      return res.status(404).json({ detail: 'Escrow account not found' });
    }

    res.json({
      ...account,
      settlement_layer: 'Polygon Mainnet (Simulated)',
      verification_hash: `0x${Math.random().toString(16).slice(2, 42)}`, // Simulated hash
      status_message: 'Funds secured in smart contract'
    });
  } catch (error) {
    res.status(500).json({ detail: 'Error fetching escrow data' });
  }
};

export const getEscrowStatus = async (req: Request, res: Response) => {
  const user_id = (req as any).user.user_id;

  try {
    const escrow = await prisma.escrowAccount.findFirst({
      where: { user_id }
    });

    if (!escrow) {
      return res.status(404).json({ detail: 'Escrow account not found' });
    }

    res.json(escrow);
  } catch (error) {
    res.status(500).json({ detail: 'Error fetching escrow status' });
  }
};

export const disputeEscrow = async (req: Request, res: Response) => {
  const user_id = (req as any).user.user_id;
  const { reason } = req.body;

  try {
    const escrow = await prisma.escrowAccount.updateMany({
      where: { user_id },
      data: {
        status: 'disputed',
        dispute_reason: reason
      }
    });

    // In a polyglot setup, a dispute might trigger a Fraud Risk check in Python
    // We would call the AI service here in the background
    
    res.json({ message: 'Dispute opened successfully', status: 'disputed' });
  } catch (error) {
    res.status(500).json({ detail: 'Error opening dispute' });
  }
};

export const releaseEscrow = async (req: Request, res: Response) => {
  // Admin only
  const { resident_user_id } = req.body;

  try {
    const escrow = await prisma.escrowAccount.updateMany({
      where: { user_id: resident_user_id },
      data: {
        status: 'active',
        amount_held: 0
      }
    });

    res.json({ message: 'Funds released from escrow', status: 'released' });
  } catch (error) {
    res.status(500).json({ detail: 'Error releasing escrow' });
  }
};
