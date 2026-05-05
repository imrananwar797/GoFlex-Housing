import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import prisma from '../utils/db.client';

// const prisma = new PrismaClient();

export const getAllProperties = async (req: Request, res: Response) => {
  try {
    const properties = await prisma.property.findMany();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ detail: 'Internal server error' });
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const property = await prisma.property.findUnique({ where: { id: parseInt(id) } });
    if (!property) return res.status(404).json({ detail: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ detail: 'Internal server error' });
  }
};
