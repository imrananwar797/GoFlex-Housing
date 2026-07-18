import { Request, Response } from 'express';
import prisma from '../utils/db.client';

// ─── Get My Payments ───
export const getMyPayments = async (req: Request, res: Response) => {
  const user_id = (req as any).user.user_id;
  const { page = '1', limit = '20' } = req.query;

  try {
    const skip = (Number(page) - 1) * Number(limit);
    const [payments, total] = await Promise.all([
      prisma.paymentTransaction.findMany({
        where: { user_id },
        include: {
          booking: {
            include: {
              property: { select: { id: true, name: true, city: true } },
              room: { select: { name: true, type: true } },
            },
          },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.paymentTransaction.count({ where: { user_id } }),
    ]);
    res.json({ payments, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ detail: 'Failed to fetch payments.' });
  }
};

// ─── Get Payment Receipt (Single) ───
export const getPaymentReceipt = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user_id = (req as any).user.user_id;

  try {
    const payment = await prisma.paymentTransaction.findFirst({
      where: { id: Number(id), user_id },
      include: {
        booking: {
          include: {
            property: true,
            room: true,
            resident: { select: { id: true, full_name: true, email: true, phone: true } },
          },
        },
      },
    });

    if (!payment) return res.status(404).json({ detail: 'Payment not found.' });

    const convenienceFee = payment.amount * 0.01;
    const agreementFee = payment.amount * 0.025;

    res.json({
      ...payment,
      receipt: {
        receipt_no: `GFX-${payment.id.toString().padStart(6, '0')}`,
        rent_amount: payment.amount,
        convenience_fee: convenienceFee,
        agreement_fee: agreementFee,
        total_paid: payment.amount + convenienceFee,
        payment_date: payment.created_at,
        property_name: payment.booking?.property?.name,
        property_address: payment.booking?.property?.address,
        room_name: payment.booking?.room?.name,
        resident_name: payment.booking?.resident?.full_name,
        currency: 'INR',
      },
    });
  } catch (err) {
    res.status(500).json({ detail: 'Failed to fetch receipt.' });
  }
};

// ─── Initialize Mock Payment ───
export const initializePayment = async (req: Request, res: Response) => {
  const user_id = (req as any).user.user_id;
  const { booking_id, amount, payment_method = 'UPI' } = req.body;

  if (!booking_id || !amount) {
    return res.status(400).json({ detail: 'booking_id and amount are required.' });
  }

  try {
    // Simulate payment gateway response
    const mockOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const mockPaymentId = `pay_GFX${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create payment record as 'pending' first
    const payment = await prisma.paymentTransaction.create({
      data: {
        booking_id: Number(booking_id),
        user_id,
        stripe_payment_id: mockPaymentId,
        amount: Number(amount),
        currency: 'INR',
        status: 'pending',
      },
    });

    // Simulate instant success (mock flow — no real gateway)
    const completed = await prisma.paymentTransaction.update({
      where: { id: payment.id },
      data: { status: 'completed' },
    });

    // Auto-confirm the booking
    await prisma.booking.update({
      where: { id: Number(booking_id) },
      data: { status: 'confirmed', payment_status: 'paid' },
    });

    res.status(201).json({
      payment: completed,
      order_id: mockOrderId,
      payment_id: mockPaymentId,
      receipt_no: `GFX-${completed.id.toString().padStart(6, '0')}`,
      message: 'Payment successful!',
    });
  } catch (err) {
    res.status(500).json({ detail: 'Payment initialization failed.' });
  }
};

// ─── Get All Payments Summary (Owner) ───
export const getOwnerPaymentsSummary = async (req: Request, res: Response) => {
  const user_id = (req as any).user.user_id;
  try {
    const myProperties = await prisma.property.findMany({
      where: { owner_id: user_id },
      select: { id: true },
    });
    const propertyIds = myProperties.map(p => p.id);

    const payments = await prisma.paymentTransaction.findMany({
      where: {
        booking: { property_id: { in: propertyIds } },
      },
      include: {
        booking: {
          include: {
            property: { select: { name: true } },
            resident: { select: { full_name: true, email: true } },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    const totalCollected = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
    const pendingAmount = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);

    res.json({ payments, totalCollected, pendingAmount });
  } catch (err) {
    res.status(500).json({ detail: 'Failed to fetch payments.' });
  }
};
