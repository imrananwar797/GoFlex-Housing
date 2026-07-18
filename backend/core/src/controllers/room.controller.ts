import { Request, Response } from 'express';
import prisma from '../utils/db.client';

// ─── Get Rooms by Property ───
export const getRoomsByProperty = async (req: Request, res: Response) => {
  const { property_id } = req.params;
  try {
    const rooms = await prisma.room.findMany({
      where: { property_id: Number(property_id) },
      orderBy: [{ floor: 'asc' }, { name: 'asc' }],
    });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to fetch rooms.' });
  }
};

// ─── Create Room ───
export const createRoom = async (req: Request, res: Response) => {
  const { property_id, name, type, floor, capacity, rent, amenities } = req.body;
  if (!property_id || !name || !rent) {
    return res.status(400).json({ detail: 'property_id, name, and rent are required.' });
  }
  try {
    const room = await prisma.room.create({
      data: {
        property_id: Number(property_id),
        name,
        type: type || 'single',
        floor: floor ? Number(floor) : null,
        capacity: capacity ? Number(capacity) : 1,
        rent: Number(rent),
        is_occupied: false,
        amenities: amenities || [],
      },
    });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to create room.' });
  }
};

// ─── Update Room ───
export const updateRoom = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, type, floor, capacity, rent, is_occupied, amenities } = req.body;
  try {
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (type !== undefined) data.type = type;
    if (floor !== undefined) data.floor = Number(floor);
    if (capacity !== undefined) data.capacity = Number(capacity);
    if (rent !== undefined) data.rent = Number(rent);
    if (is_occupied !== undefined) data.is_occupied = Boolean(is_occupied);
    if (amenities !== undefined) data.amenities = amenities;

    const room = await prisma.room.update({
      where: { id: Number(id) },
      data,
    });

    // Update property occupancy
    const allRooms = await prisma.room.findMany({ where: { property_id: room.property_id } });
    const occupancyRate = allRooms.length > 0 ? (allRooms.filter(r => r.is_occupied).length / allRooms.length) * 100 : 0;
    await prisma.property.update({ where: { id: room.property_id }, data: { occupancy: occupancyRate } });

    res.json(room);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to update room.' });
  }
};

// ─── Delete Room ───
export const deleteRoom = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.room.delete({ where: { id: Number(id) } });
    res.json({ detail: 'Room deleted successfully.' });
  } catch (err) {
    res.status(500).json({ detail: 'Failed to delete room.' });
  }
};
