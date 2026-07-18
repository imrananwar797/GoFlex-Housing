import { Request, Response } from 'express';
import prisma from '../utils/db.client';

// ─── Platform Stats (Admin) ───
export const getSystemStats = async (req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      totalResidents,
      totalOwners,
      totalProperties,
      totalRooms,
      occupiedRooms,
      totalBookings,
      activeBookings,
      openComplaints,
      pendingKYC,
      totalPayments,
      revenueAgg,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'RESIDENT' } }),
      prisma.user.count({ where: { role: 'OWNER' } }),
      prisma.property.count(),
      prisma.room.count(),
      prisma.room.count({ where: { is_occupied: true } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'confirmed' } }),
      prisma.complaint.count({ where: { status: { in: ['open', 'in_progress'] } } }),
      prisma.kYC.count({ where: { status: 'pending' } }),
      prisma.paymentTransaction.count({ where: { status: 'completed' } }),
      prisma.paymentTransaction.aggregate({ where: { status: 'completed' }, _sum: { amount: true } }),
    ]);

    const totalRevenue = revenueAgg._sum.amount || 0;
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    // Monthly revenue last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const payments = await prisma.paymentTransaction.findMany({
      where: { status: 'completed', created_at: { gte: sixMonthsAgo } },
      select: { amount: true, created_at: true },
    });

    const monthlyRevenue: Record<string, number> = {};
    payments.forEach(p => {
      const key = new Date(p.created_at!).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
      monthlyRevenue[key] = (monthlyRevenue[key] || 0) + p.amount;
    });

    // User growth last 6 months
    const users = await prisma.user.findMany({
      where: { created_at: { gte: sixMonthsAgo } },
      select: { created_at: true, role: true },
    });

    const userGrowth: Record<string, number> = {};
    users.forEach(u => {
      const key = new Date(u.created_at!).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
      userGrowth[key] = (userGrowth[key] || 0) + 1;
    });

    res.json({
      totalUsers, totalResidents, totalOwners,
      totalProperties, totalRooms, occupiedRooms,
      availableRooms: totalRooms - occupiedRooms,
      occupancyRate,
      totalBookings, activeBookings,
      openComplaints, pendingKYC,
      totalPayments, totalRevenue,
      monthlyRevenue: Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue })),
      userGrowth: Object.entries(userGrowth).map(([month, count]) => ({ month, count })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ detail: 'Failed to fetch system stats.' });
  }
};

// ─── Get All Users ───
export const getAllUsers = async (req: Request, res: Response) => {
  const { role, page = '1', limit = '20', search } = req.query;
  const where: any = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { full_name: { contains: String(search), mode: 'insensitive' } },
      { email: { contains: String(search), mode: 'insensitive' } },
      { username: { contains: String(search), mode: 'insensitive' } },
    ];
  }

  try {
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          kyc: { select: { status: true, document_type: true } },
          goflex_score: { select: { overall_score: true, verification_badge: true, is_verified: true } },
          _count: { select: { bookings: true, owned_properties: true, complaints: true } },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.user.count({ where }),
    ]);

    const safeUsers = users.map(({ password_hash, ...u }) => u);
    res.json({ users: safeUsers, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ detail: 'Failed to fetch users.' });
  }
};

// ─── Update User Role ───
export const updateUserRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  const validRoles = ['ADMIN', 'OWNER', 'RESIDENT', 'STAFF'];

  if (!validRoles.includes(role)) {
    return res.status(400).json({ detail: 'Invalid role.' });
  }

  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { role },
      select: { id: true, username: true, email: true, role: true },
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to update user role.' });
  }
};

// ─── Get All KYC Requests ───
export const getAllKYCRequests = async (req: Request, res: Response) => {
  const { status = 'pending' } = req.query;
  try {
    const kycs = await prisma.kYC.findMany({
      where: status === 'all' ? {} : { status: String(status) },
      include: {
        user: { select: { id: true, full_name: true, email: true, phone: true, role: true, username: true } },
      },
      orderBy: { created_at: 'desc' },
    });
    res.json(kycs);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to fetch KYC requests.' });
  }
};

// ─── Review KYC ───
export const reviewKYC = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, review_notes } = req.body;
  const reviewer_id = (req as any).user.user_id;

  if (!['verified', 'rejected'].includes(status)) {
    return res.status(400).json({ detail: 'Status must be "verified" or "rejected".' });
  }

  try {
    const kyc = await prisma.kYC.update({
      where: { id: Number(id) },
      data: { status, reviewed_by: reviewer_id, review_notes },
      include: { user: { select: { id: true, full_name: true, email: true } } },
    });

    // Update GoFlex score if verified
    if (status === 'verified' && kyc.user_id) {
      const existingScore = await prisma.goFlexScore.findUnique({ where: { user_id: kyc.user_id } });
      if (existingScore) {
        await prisma.goFlexScore.update({
          where: { user_id: kyc.user_id },
          data: { verification_score: 100, is_verified: true },
        });
      } else {
        await prisma.goFlexScore.create({
          data: { user_id: kyc.user_id, verification_score: 100, is_verified: true },
        });
      }
    }

    res.json(kyc);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to review KYC.' });
  }
};

// ─── Get All Fraud Alerts (Admin) ───
export const getAllFraudAlerts = async (req: Request, res: Response) => {
  const { status } = req.query;
  try {
    const alerts = await prisma.fraudAlert.findMany({
      where: status ? { status: String(status) } : {},
      include: {
        user: { select: { id: true, full_name: true, email: true, username: true } },
        booking: { select: { id: true, total_amount: true, status: true } },
      },
      orderBy: { created_at: 'desc' },
    });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to fetch fraud alerts.' });
  }
};

// ─── Get All Bookings (Admin) ───
export const getAllBookingsAdmin = async (req: Request, res: Response) => {
  const { status, page = '1', limit = '20' } = req.query;
  const where: any = {};
  if (status) where.status = status;

  try {
    const skip = (Number(page) - 1) * Number(limit);
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          resident: { select: { id: true, full_name: true, email: true } },
          property: { select: { name: true, city: true } },
          room: { select: { name: true } },
          payment_transactions: { select: { amount: true, status: true } },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.booking.count({ where }),
    ]);
    res.json({ bookings, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ detail: 'Failed to fetch bookings.' });
  }
};

// ─── Toggle Property Verification (Admin) ───
export const togglePropertyVerification = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const property = await prisma.property.findUnique({ where: { id: Number(id) } });
    if (!property) return res.status(404).json({ detail: 'Property not found.' });

    const updated = await prisma.property.update({
      where: { id: Number(id) },
      data: { verified: !property.verified },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to toggle verification.' });
  }
};
