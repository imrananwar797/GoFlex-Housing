import { Request, Response } from 'express';
import prisma from '../utils/db.client';

// ─── Get All Properties (with search & filters) ───
export const getProperties = async (req: Request, res: Response) => {
  const { city, minPrice, maxPrice, type, page = '1', limit = '12', featured } = req.query;
  const where: any = { active: true };

  if (city) where.city = { contains: String(city), mode: 'insensitive' };
  if (minPrice || maxPrice) {
    where.rent = {};
    if (minPrice) where.rent.gte = Number(minPrice);
    if (maxPrice) where.rent.lte = Number(maxPrice);
  }
  if (featured === 'true') where.verified = true;

  try {
    const skip = (Number(page) - 1) * Number(limit);
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          owner: { select: { id: true, full_name: true, goflex_score: { select: { overall_score: true, verification_badge: true } } } },
          photos: { take: 3 },
          rooms: { select: { id: true, name: true, type: true, rent: true, is_occupied: true, capacity: true } },
          _count: { select: { reviews: true, bookings: true } },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.property.count({ where }),
    ]);
    res.json({ properties, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ detail: 'Failed to fetch properties.' });
  }
};

// ─── Get Featured Properties ───
export const getFeaturedProperties = async (req: Request, res: Response) => {
  try {
    const properties = await prisma.property.findMany({
      where: { verified: true, active: true },
      include: {
        owner: { select: { id: true, full_name: true } },
        photos: { take: 1 },
        rooms: { select: { id: true, type: true, rent: true, is_occupied: true }, take: 5 },
        _count: { select: { reviews: true } },
      },
      orderBy: { occupancy: 'desc' },
      take: 6,
    });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to fetch featured properties.' });
  }
};

// ─── Get Property by ID ───
export const getPropertyById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const property = await prisma.property.findUnique({
      where: { id: Number(id) },
      include: {
        owner: { select: { id: true, full_name: true, phone: true, goflex_score: { select: { overall_score: true, verification_badge: true, is_verified: true } } } },
        photos: true,
        rooms: { orderBy: [{ floor: 'asc' }, { name: 'asc' }] },
        reviews: {
          include: { user: { select: { id: true, full_name: true, username: true } } },
          orderBy: { created_at: 'desc' },
          take: 10,
        },
        _count: { select: { reviews: true, bookings: true } },
      },
    });

    if (!property) return res.status(404).json({ detail: 'Property not found.' });

    // Calculate average rating
    const avgRating = property.reviews.length > 0
      ? property.reviews.reduce((sum, r) => sum + r.rating, 0) / property.reviews.length
      : 0;

    res.json({ ...property, avg_rating: Math.round(avgRating * 10) / 10 });
  } catch (err) {
    res.status(500).json({ detail: 'Failed to fetch property.' });
  }
};

// ─── Search Properties ───
export const searchProperties = async (req: Request, res: Response) => {
  const { q, city, minPrice, maxPrice } = req.query;
  const where: any = { active: true };

  if (q) {
    where.OR = [
      { name: { contains: String(q), mode: 'insensitive' } },
      { description: { contains: String(q), mode: 'insensitive' } },
      { city: { contains: String(q), mode: 'insensitive' } },
      { address: { contains: String(q), mode: 'insensitive' } },
    ];
  }
  if (city) where.city = { contains: String(city), mode: 'insensitive' };
  if (minPrice || maxPrice) {
    where.rent = {};
    if (minPrice) where.rent.gte = Number(minPrice);
    if (maxPrice) where.rent.lte = Number(maxPrice);
  }

  try {
    const properties = await prisma.property.findMany({
      where,
      include: {
        photos: { take: 1 },
        rooms: { select: { id: true, type: true, rent: true, is_occupied: true }, take: 3 },
        _count: { select: { reviews: true } },
      },
      take: 20,
    });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ detail: 'Search failed.' });
  }
};

// ─── Get Distinct Cities ───
export const getCities = async (req: Request, res: Response) => {
  try {
    const cities = await prisma.property.findMany({
      where: { active: true },
      select: { city: true },
      distinct: ['city'],
      orderBy: { city: 'asc' },
    });
    res.json(cities.map(c => c.city));
  } catch (err) {
    res.status(500).json({ detail: 'Failed to fetch cities.' });
  }
};
