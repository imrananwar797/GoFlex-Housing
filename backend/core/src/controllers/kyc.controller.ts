import { Request, Response } from 'express';
import prisma from '../utils/db.client';
import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || '';

// ─── Mock AI Liveness/Document Verifier (Fallback) ───
async function verifyDocumentAI(payload: { user_id: number; document_url: string; document_type: string }) {
  if (AI_SERVICE_URL) {
    try {
      const res = await axios.post(`${AI_SERVICE_URL}/api/kyc/verify`, payload, { timeout: 3000 });
      return res.data;
    } catch {
      console.warn('[KYC AI] Unavailable, using rule-based fallback.');
    }
  }
  // Rule-based fallback: accept if document_url is provided
  if (payload.document_url && payload.document_type) {
    return { status: 'pending', risk_score: 0.15, message: 'Document received — manual review initiated.' };
  }
  return { status: 'rejected', risk_score: 0.9, message: 'Insufficient data provided.' };
}

export const uploadKYCDocument = async (req: Request, res: Response) => {
  const { document_type, document_number, document_url } = req.body;
  const user_id = (req as any).user.user_id;

  try {
    // Check for existing KYC
    const existing = await prisma.kYC.findUnique({ where: { user_id } });
    if (existing) {
      if (existing.status === 'verified') {
        return res.status(400).json({ detail: 'KYC is already verified.' });
      }
      // Update existing record
      await prisma.kYC.update({
        where: { user_id },
        data: { document_type, document_url: document_url || existing.document_url, status: 'pending' }
      });
    } else {
      await prisma.kYC.create({
        data: { user_id, document_type, document_url: document_url || 'pending_upload', status: 'pending' }
      });
    }

    // Trigger AI verification (with fallback)
    try {
      const aiResponse = await verifyDocumentAI({ user_id, document_url, document_type });
      if (aiResponse.status === 'verified') {
        await prisma.kYC.update({ where: { user_id }, data: { status: 'verified' } });
        return res.json({ message: 'KYC verified successfully.', status: 'verified', ai_score: aiResponse.risk_score });
      }
      return res.json({ message: 'KYC submitted. Manual review initiated.', status: 'pending' });
    } catch {
      return res.json({ message: 'KYC submitted. Verification in progress.', status: 'pending', is_fallback: true });
    }

  } catch (error) {
    console.error('KYC Upload Error:', error);
    res.status(500).json({ detail: 'Internal server error during KYC submission' });
  }
};

export const getKYCStatus = async (req: Request, res: Response) => {
  const user_id = (req as any).user.user_id;
  try {
    const kyc = await prisma.kYC.findUnique({ where: { user_id } });
    res.json(kyc || { status: 'none' });
  } catch (error) {
    res.status(500).json({ detail: 'Error fetching KYC status' });
  }
};

export const getAllKYC = async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where: any = {};
    if (status) where.status = status;
    const [kycs, total] = await Promise.all([
      prisma.kYC.findMany({
        where,
        include: { user: { select: { id: true, full_name: true, email: true, username: true } } },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { created_at: 'desc' },
      }),
      prisma.kYC.count({ where }),
    ]);
    res.json({ kycs, total });
  } catch (err) {
    res.status(500).json({ detail: 'Failed to fetch KYC records' });
  }
};

export const reviewKYC = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, review_notes } = req.body;
  const reviewer_id = (req as any).user.user_id;
  if (!['verified', 'rejected'].includes(status)) {
    return res.status(400).json({ detail: 'Status must be verified or rejected.' });
  }
  try {
    const kyc = await prisma.kYC.update({
      where: { id: Number(id) },
      data: { status, review_notes, reviewed_by: reviewer_id },
    });
    res.json(kyc);
  } catch {
    res.status(500).json({ detail: 'Failed to update KYC.' });
  }
};

export const uploadFile = async (req: Request, res: Response) => {
  // Mock file upload — in production hook up to Supabase Storage
  res.json({ url: 'https://wzrphhppwzfczkxyhiyy.supabase.co/storage/v1/object/public/kyc/mock-upload.jpg' });
};
