import { Request, Response } from 'express';
import prisma from '../utils/db.client';

// ─── Create Booking ───
export const createBooking = async (req: Request, res: Response) => {
  const { property_id, room_id, check_in_date, check_out_date, total_amount } = req.body;
  const user_id = (req as any).user.user_id;

  if (!property_id || !check_in_date || !check_out_date || !total_amount) {
    return res.status(400).json({ detail: 'property_id, check_in_date, check_out_date, and total_amount are required.' });
  }

  try {
    // Check room availability
    if (room_id) {
      const room = await prisma.room.findUnique({ where: { id: Number(room_id) } });
      if (!room) return res.status(404).json({ detail: 'Room not found.' });
      if (room.is_occupied) return res.status(400).json({ detail: 'Room is already occupied.' });
    }

    const booking = await prisma.booking.create({
      data: {
        resident_id: user_id,
        property_id: Number(property_id),
        room_id: room_id ? Number(room_id) : undefined,
        check_in_date: new Date(check_in_date),
        check_out_date: new Date(check_out_date),
        total_amount: Number(total_amount),
        status: 'pending',
        payment_status: 'pending',
      },
      include: {
        property: { select: { name: true, city: true, address: true } },
        room: { select: { name: true, type: true } },
      },
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ detail: 'Failed to create booking.' });
  }
};

// ─── Get My Bookings (Resident) ───
export const getMyBookings = async (req: Request, res: Response) => {
  const user_id = (req as any).user.user_id;
  try {
    const bookings = await prisma.booking.findMany({
      where: { resident_id: user_id },
      include: {
        property: { select: { id: true, name: true, city: true, address: true, featured_image: true } },
        room: { select: { id: true, name: true, type: true, floor: true } },
        payment_transactions: { select: { id: true, amount: true, status: true, created_at: true } },
      },
      orderBy: { created_at: 'desc' },
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to fetch bookings.' });
  }
};

// ─── Get Booking by ID ───
export const getBookingById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user_id = (req as any).user.user_id;
  const user_role = (req as any).user.role;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
      include: {
        resident: { select: { id: true, full_name: true, email: true, phone: true } },
        property: { include: { photos: true, owner: { select: { id: true, full_name: true, phone: true } } } },
        room: true,
        payment_transactions: true,
      },
    });

    if (!booking) return res.status(404).json({ detail: 'Booking not found.' });

    // Access control
    if (user_role === 'RESIDENT' && booking.resident_id !== user_id) {
      return res.status(403).json({ detail: 'Access denied.' });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to fetch booking.' });
  }
};

// ─── Cancel Booking ───
export const cancelBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user_id = (req as any).user.user_id;

  try {
    const booking = await prisma.booking.findFirst({
      where: { id: Number(id), resident_id: user_id },
    });
    if (!booking) return res.status(404).json({ detail: 'Booking not found.' });
    if (booking.status === 'cancelled') return res.status(400).json({ detail: 'Booking already cancelled.' });

    const updated = await prisma.booking.update({
      where: { id: Number(id) },
      data: { status: 'cancelled', payment_status: 'refunded' },
    });

    // Free the room
    if (booking.room_id) {
      await prisma.room.update({ where: { id: booking.room_id }, data: { is_occupied: false } });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to cancel booking.' });
  }
};

// ─── Confirm Booking (Owner/Admin) ───
export const confirmBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const booking = await prisma.booking.findUnique({ where: { id: Number(id) } });
    if (!booking) return res.status(404).json({ detail: 'Booking not found.' });

    const updated = await prisma.booking.update({
      where: { id: Number(id) },
      data: { status: 'confirmed', payment_status: 'paid' },
    });

    // Mark room as occupied
    if (booking.room_id) {
      await prisma.room.update({ where: { id: booking.room_id }, data: { is_occupied: true } });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to confirm booking.' });
  }
};
