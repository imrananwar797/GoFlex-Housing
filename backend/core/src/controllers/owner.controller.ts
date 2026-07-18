import { Request, Response } from 'express';
import prisma from '../utils/db.client';

// ─── Owner Dashboard Stats ───
export const getOwnerDashboard = async (req: Request, res: Response) => {
  const user_id = (req as any).user.user_id;
  try {
    const properties = await prisma.property.findMany({
      where: { owner_id: user_id },
      include: { rooms: true, bookings: { where: { status: 'confirmed' } } },
    });

    const totalProperties = properties.length;
    const totalRooms = properties.reduce((sum, p) => sum + p.rooms.length, 0);
    const occupiedRooms = properties.reduce((sum, p) => sum + p.rooms.filter(r => r.is_occupied).length, 0);
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    // Revenue from payments
    const propertyIds = properties.map(p => p.id);
    const payments = await prisma.paymentTransaction.findMany({
      where: {
        booking: { property_id: { in: propertyIds } },
        status: 'completed',
      },
      select: { amount: true, created_at: true },
    });

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    // Monthly revenue (last 6 months)
    const monthlyRevenue: Record<string, number> = {};
    payments.forEach(p => {
      const key = new Date(p.created_at!).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
      monthlyRevenue[key] = (monthlyRevenue[key] || 0) + p.amount;
    });

    const activeBookings = await prisma.booking.count({
      where: { property_id: { in: propertyIds }, status: 'confirmed' },
    });

    const openComplaints = await prisma.complaint.count({
      where: { property_id: { in: propertyIds }, status: { in: ['open', 'in_progress'] } },
    });

    res.json({
      totalProperties,
      totalRooms,
      occupiedRooms,
      availableRooms: totalRooms - occupiedRooms,
      occupancyRate,
      totalRevenue,
      activeBookings,
      openComplaints,
      monthlyRevenue: Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ detail: 'Failed to fetch dashboard data.' });
  }
};

// ─── Get Owner Properties ───
export const getOwnerProperties = async (req: Request, res: Response) => {
  const user_id = (req as any).user.user_id;
  try {
    const properties = await prisma.property.findMany({
      where: { owner_id: user_id },
      include: {
        rooms: { select: { id: true, name: true, type: true, rent: true, is_occupied: true } },
        _count: { select: { bookings: true, complaints: true, reviews: true } },
      },
      orderBy: { created_at: 'desc' },
    });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to fetch properties.' });
  }
};

// ─── Create Property ───
export const createProperty = async (req: Request, res: Response) => {
  const user_id = (req as any).user.user_id;
  const { name, description, city, state, state_iso, address, beds, baths, rent, amenities, featured_image } = req.body;

  if (!name || !city || !rent) {
    return res.status(400).json({ detail: 'Name, city, and rent are required.' });
  }

  try {
    const property = await prisma.property.create({
      data: {
        owner_id: user_id,
        name, description, city,
        state: state || '',
        state_iso: state_iso || '',
        address: address || '',
        beds: beds ? Number(beds) : 0,
        baths: baths ? Number(baths) : 0,
        rent: Number(rent),
        amenities: amenities || [],
        featured_image: featured_image || null,
        verified: false,
        active: true,
        occupancy: 0,
      },
    });
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to create property.' });
  }
};

// ─── Update Property ───
export const updateProperty = async (req: Request, res: Response) => {
  const user_id = (req as any).user.user_id;
  const { id } = req.params;

  try {
    const existing = await prisma.property.findFirst({ where: { id: Number(id), owner_id: user_id } });
    if (!existing) return res.status(404).json({ detail: 'Property not found.' });

    const property = await prisma.property.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.json(property);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to update property.' });
  }
};

// ─── Get Owner Residents ───
export const getOwnerResidents = async (req: Request, res: Response) => {
  const user_id = (req as any).user.user_id;
  try {
    const myProperties = await prisma.property.findMany({
      where: { owner_id: user_id },
      select: { id: true },
    });
    const propertyIds = myProperties.map(p => p.id);

    const bookings = await prisma.booking.findMany({
      where: { property_id: { in: propertyIds }, status: 'confirmed' },
      include: {
        resident: { select: { id: true, full_name: true, email: true, phone: true, goflex_score: true } },
        property: { select: { name: true, city: true } },
        room: { select: { name: true, type: true, rent: true } },
      },
      orderBy: { created_at: 'desc' },
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to fetch residents.' });
  }
};

// ─── Get Owner Revenue ───
export const getOwnerRevenue = async (req: Request, res: Response) => {
  const user_id = (req as any).user.user_id;
  const { year = new Date().getFullYear() } = req.query;

  try {
    const myProperties = await prisma.property.findMany({
      where: { owner_id: user_id },
      select: { id: true },
    });
    const propertyIds = myProperties.map(p => p.id);

    const payments = await prisma.paymentTransaction.findMany({
      where: {
        booking: { property_id: { in: propertyIds } },
        status: 'completed',
        created_at: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
      include: { booking: { include: { property: { select: { name: true } } } } },
      orderBy: { created_at: 'asc' },
    });

    const totalRevenue = payments.reduce((s, p) => s + p.amount, 0);

    // Group by month
    const byMonth = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString('en-IN', { month: 'short' }),
      revenue: 0,
      payments: 0,
    }));

    payments.forEach(p => {
      const m = new Date(p.created_at!).getMonth();
      byMonth[m].revenue += p.amount;
      byMonth[m].payments += 1;
    });

    res.json({ totalRevenue, year: Number(year), monthly: byMonth, payments });
  } catch (err) {
    res.status(500).json({ detail: 'Failed to fetch revenue data.' });
  }
};

// ─── Get Owner Bookings ───
export const getOwnerBookings = async (req: Request, res: Response) => {
  const user_id = (req as any).user.user_id;
  const { status } = req.query;

  try {
    const myProperties = await prisma.property.findMany({
      where: { owner_id: user_id },
      select: { id: true },
    });
    const propertyIds = myProperties.map(p => p.id);
    const where: any = { property_id: { in: propertyIds } };
    if (status) where.status = status;

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        resident: { select: { id: true, full_name: true, email: true, phone: true } },
        property: { select: { name: true, city: true } },
        room: { select: { name: true, type: true } },
      },
      orderBy: { created_at: 'desc' },
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to fetch bookings.' });
  }
};

// ─── Get Owner Agreements ───
export const getOwnerAgreements = async (req: Request, res: Response) => {
  const user_id = (req as any).user.user_id;
  try {
    const agreements = await prisma.rentalAgreement.findMany({
      where: { owner_id: user_id },
      include: {
        resident: { select: { id: true, full_name: true, email: true, phone: true } },
        property: { select: { name: true, city: true } },
      },
      orderBy: { created_at: 'desc' },
    });
    res.json(agreements);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to fetch agreements.' });
  }
};

// ─── Sign Agreement (Owner) ───
export const ownerSignAgreement = async (req: Request, res: Response) => {
  const user_id = (req as any).user.user_id;
  const { id } = req.params;
  try {
    const agreement = await prisma.rentalAgreement.findFirst({
      where: { id: Number(id), owner_id: user_id },
    });
    if (!agreement) return res.status(404).json({ detail: 'Agreement not found.' });

    const updated = await prisma.rentalAgreement.update({
      where: { id: Number(id) },
      data: {
        owner_signed: true,
        owner_signed_at: new Date(),
        status: agreement.resident_signed ? 'signed' : 'sent',
      },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to sign agreement.' });
  }
};
