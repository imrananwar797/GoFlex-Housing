import { Request, Response } from 'express';
import prisma from '../utils/db.client';

export const createBooking = async (req: Request, res: Response) => {
  const { property_id, check_in_date, check_out_date, total_amount } = req.body;
  const user_id = (req as any).user.user_id;

  try {
    const booking = await prisma.booking.create({
      data: {
        user_id,
        property_id,
        check_in_date: new Date(check_in_date),
        check_out_date: new Date(check_out_date),
        total_amount,
        status: 'pending'
      }
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ detail: 'Error creating booking' });
  }
};

export const getMyBookings = async (req: Request, res: Response) => {
  const user_id = (req as any).user.user_id;
  try {
    const bookings = await prisma.booking.findMany({
      where: { user_id },
      include: { property: true }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ detail: 'Error fetching bookings' });
  }
};
