import { Request, Response } from 'express';
import prisma from '../utils/db.client';

// const prisma = new PrismaClient();

export const getAllProperties = async (req: Request, res: Response) => {
  try {
    const { stateIso, city, minRent, maxRent, beds, search } = req.query;

    const where: any = {};

    if (stateIso) {
      where.state_iso = {
        equals: stateIso as string,
        mode: 'insensitive'
      };
    }

    if (city) {
      where.city = {
        equals: city as string,
        mode: 'insensitive'
      };
    }

    if (minRent || maxRent) {
      where.rent = {};
      if (minRent) {
        where.rent.gte = parseFloat(minRent as string);
      }
      if (maxRent) {
        where.rent.lte = parseFloat(maxRent as string);
      }
    }

    if (beds && beds !== 'All') {
      let bedsCount = 1;
      if (beds === 'Double') bedsCount = 2;
      if (beds === 'Triple') bedsCount = 3;
      where.beds = bedsCount;
    }

    if (search) {
      const searchStr = search as string;
      where.OR = [
        { name: { contains: searchStr, mode: 'insensitive' } },
        { description: { contains: searchStr, mode: 'insensitive' } },
        { city: { contains: searchStr, mode: 'insensitive' } },
        { address: { contains: searchStr, mode: 'insensitive' } }
      ];
    }

    const properties = await prisma.property.findMany({ where });
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const property = await prisma.property.findUnique({ 
      where: { id: parseInt(id as string) },
      include: { owner: { select: { full_name: true, email: true } } }
    });
    if (!property) return res.status(404).json({ detail: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ detail: 'Internal server error' });
  }
};

export const createProperty = async (req: Request, res: Response) => {
  const { name, description, state_iso, city, rent, beds, cover_image_url } = req.body;
  const owner_id = (req as any).user.user_id;

  try {
    const property = await prisma.property.create({
      data: {
        owner_id,
        name,
        description,
        state_iso,
        city,
        rent: parseFloat(rent),
        beds,
        cover_image_url
      }
    });
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ detail: 'Error creating property' });
  }
};

export const updateProperty = async (req: Request, res: Response) => {
  const { id } = req.params;
  const owner_id = (req as any).user.user_id;
  const data = req.body;

  try {
    const property = await prisma.property.update({
      where: { id: parseInt(id as string), owner_id },
      data
    });
    res.json(property);
  } catch (error) {
    res.status(500).json({ detail: 'Error updating property' });
  }
};

export const deleteProperty = async (req: Request, res: Response) => {
  const { id } = req.params;
  const owner_id = (req as any).user.user_id;

  try {
    await prisma.property.delete({
      where: { id: parseInt(id as string), owner_id }
    });
    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ detail: 'Error deleting property' });
  }
};
