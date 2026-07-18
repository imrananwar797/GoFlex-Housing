import { Request, Response } from 'express';
import prisma from '../utils/db.client';

// ─── Create Complaint ───
export const createComplaint = async (req: Request, res: Response) => {
  const user_id = (req as any).user.user_id;
  const { property_id, room_id, category, priority, title, description } = req.body;

  if (!category || !title) {
    return res.status(400).json({ detail: 'Category and title are required.' });
  }

  try {
    const complaint = await prisma.complaint.create({
      data: {
        resident_id: user_id,
        property_id: property_id ? Number(property_id) : undefined,
        room_id: room_id ? Number(room_id) : undefined,
        category,
        priority: priority || 'medium',
        title,
        description,
        status: 'open',
      },
      include: { property: { select: { name: true, city: true } } },
    });
    res.status(201).json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ detail: 'Failed to create complaint.' });
  }
};

// ─── Get My Complaints (Resident) ───
export const getMyComplaints = async (req: Request, res: Response) => {
  const user_id = (req as any).user.user_id;
  try {
    const complaints = await prisma.complaint.findMany({
      where: { resident_id: user_id },
      include: {
        property: { select: { name: true, city: true } },
        room: { select: { name: true } },
      },
      orderBy: { created_at: 'desc' },
    });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to fetch complaints.' });
  }
};

// ─── Get All Complaints (Admin) ───
export const getAllComplaints = async (req: Request, res: Response) => {
  const { status, priority, category, page = '1', limit = '20' } = req.query;
  const where: any = {};
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (category) where.category = category;

  try {
    const skip = (Number(page) - 1) * Number(limit);
    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        include: {
          resident: { select: { id: true, full_name: true, email: true, username: true } },
          property: { select: { name: true, city: true } },
          room: { select: { name: true } },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.complaint.count({ where }),
    ]);
    res.json({ complaints, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ detail: 'Failed to fetch complaints.' });
  }
};

// ─── Get Property Complaints (Owner) ───
export const getPropertyComplaints = async (req: Request, res: Response) => {
  const user_id = (req as any).user.user_id;
  try {
    const myProperties = await prisma.property.findMany({
      where: { owner_id: user_id },
      select: { id: true },
    });
    const propertyIds = myProperties.map(p => p.id);

    const complaints = await prisma.complaint.findMany({
      where: { property_id: { in: propertyIds } },
      include: {
        resident: { select: { id: true, full_name: true, email: true, phone: true } },
        property: { select: { name: true, city: true } },
        room: { select: { name: true } },
      },
      orderBy: { created_at: 'desc' },
    });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to fetch complaints.' });
  }
};

// ─── Update Complaint Status ───
export const updateComplaintStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, resolution_notes } = req.body;

  const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ detail: 'Invalid status value.' });
  }

  try {
    const data: any = { status };
    if (status === 'resolved') data.resolved_at = new Date();

    const complaint = await prisma.complaint.update({
      where: { id: Number(id) },
      data,
      include: {
        resident: { select: { id: true, full_name: true, email: true } },
        property: { select: { name: true } },
      },
    });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to update complaint.' });
  }
};

// ─── Get Single Complaint ───
export const getComplaintById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const complaint = await prisma.complaint.findUnique({
      where: { id: Number(id) },
      include: {
        resident: { select: { id: true, full_name: true, email: true } },
        property: { select: { name: true, city: true } },
        room: { select: { name: true } },
      },
    });
    if (!complaint) return res.status(404).json({ detail: 'Complaint not found.' });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ detail: 'Failed to fetch complaint.' });
  }
};
