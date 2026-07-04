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
