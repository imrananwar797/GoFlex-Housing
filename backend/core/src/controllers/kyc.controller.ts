import { Request, Response } from 'express';
import prisma from '../utils/db.client';
import { aiService } from '../services/ai.service';

export const uploadKYCDocument = async (req: Request, res: Response) => {
  const { document_type, document_number, document_url } = req.body;
  const user_id = (req as any).user.user_id;

  try {
    // 1. Save to Database (Core Action)
    const kyc = await prisma.kYC.create({
      data: {
        user_id,
        document_type,
        document_number,
        document_url,
        status: 'pending'
      }
    });

    // 2. Trigger AI Biometric Liveness / Document Verification (Intelligence Action)
    // We use the AIService which is wrapped in a Circuit Breaker
    try {
      const aiResponse = await aiService.verifyLiveness({
        user_id,
        document_url,
        document_type
      });

      // If AI service is healthy and responds
      if (aiResponse.status === 'verified') {
        await prisma.kYC.update({
          where: { id: kyc.id },
          data: { status: 'verified' }
        });
        
        await prisma.user.update({
          where: { id: user_id },
          data: { role: 'RESIDENT' } // Example: upgrade role upon verification
        });

        return res.json({ 
          message: 'KYC verified successfully by AI', 
          status: 'verified',
          ai_score: aiResponse.risk_score 
        });
      }

      return res.json({ 
        message: 'KYC submitted. Verification in progress.', 
        status: 'pending' 
      });

    } catch (error: any) {
      // 3. Handle Fallback (Circuit Breaker Triggered or AI Error)
      console.warn('⚠️ AI Service Fallback Triggered in KYC Flow');
      
      return res.json({
        message: 'KYC submitted. Initializing Secure AI... Just a moment while we verify your data.',
        status: 'pending_manual_review',
        is_fallback: true
      });
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

export const uploadFile = async (req: Request, res: Response) => {
  // Mock file upload to S3
  res.json({ url: 'https://goflex-storage.s3.amazonaws.com/kyc/mock-upload.jpg' });
};
