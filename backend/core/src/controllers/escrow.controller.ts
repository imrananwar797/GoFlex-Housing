import { Request, Response } from 'express';
import prisma from '../utils/db.client';

export const getEscrowStatus = async (req: Request, res: Response) => {
  const user_id = (req as any).user.user_id;

  try {
    const escrow = await prisma.escrowAccount.findUnique({
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
    const escrow = await prisma.escrowAccount.update({
      where: { user_id },
      data: {
        status: 'disputed',
        disputed_total: { increment: 1 } // Tracking number of disputes
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
    const escrow = await prisma.escrowAccount.update({
      where: { user_id: resident_user_id },
      data: {
        status: 'active',
        held_amount: 0,
        balance: { decrement: 0 } // In a real app, transfer to owner balance
      }
    });

    res.json({ message: 'Funds released from escrow', status: 'released' });
  } catch (error) {
    res.status(500).json({ detail: 'Error releasing escrow' });
  }
};
