import { Request, Response } from 'express';
import prisma from '../utils/db.client';

export const getPaymentMethods = async (req: Request, res: Response) => {
  res.json({
    methods: [
      { id: 'stripe', name: 'Credit/Debit Card', icon: 'card', gateway: 'Stripe' },
      { id: 'upi', name: 'UPI / PhonePe / GPay', icon: 'upi', gateway: 'Razorpay' },
      { id: 'netbanking', name: 'Net Banking', icon: 'bank', gateway: 'Razorpay' },
      { id: 'wallet', name: 'Digital Wallet', icon: 'wallet', gateway: 'Paytm' }
    ]
  });
};

export const initiatePayment = async (req: Request, res: Response) => {
  const { booking_id, amount, method } = req.body;
  const user_id = (req as any).user.user_id;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: booking_id }
    });

    if (!booking) {
      return res.status(404).json({ detail: 'Booking not found' });
    }

    // In a production app, we would call Stripe or Razorpay API here
    const transaction = await prisma.paymentTransaction.create({
      data: {
        user_id,
        booking_id,
        amount,
        status: 'pending',
        stripe_payment_id: `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`
      }
    });

    res.json({
      transaction_id: transaction.id,
      gateway_id: transaction.stripe_payment_id,
      status: 'pending',
      checkout_url: `https://goflex-checkout.com/pay/${transaction.stripe_payment_id}`
    });

  } catch (error) {
    console.error('Payment Initiation Error:', error);
    res.status(500).json({ detail: 'Internal server error during payment initiation' });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const { transaction_id, status } = req.body; // In real life, verify Stripe/Razorpay signature

  try {
    const transaction = await prisma.paymentTransaction.update({
      where: { stripe_payment_id: transaction_id },
      data: { status }
    });

    if (status === 'completed' && transaction.booking_id) {
      await prisma.booking.update({
        where: { id: transaction.booking_id },
        data: { status: 'confirmed' }
      });
      
      // Also initialize Escrow (Fintech logic)
      await prisma.escrowAccount.upsert({
        where: { booking_id: transaction.booking_id as number },
        update: { amount_held: { increment: transaction.amount } },
        create: {
          booking_id: transaction.booking_id as number,
          user_id: transaction.user_id,
          amount_held: transaction.amount,
          status: 'held'
        }
      });
    }

    res.json({ message: 'Webhook processed', transaction_status: status });
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ detail: 'Internal server error during webhook processing' });
  }
};
