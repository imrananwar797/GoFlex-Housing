import axios from 'axios';
import prisma from '../utils/db.client';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || '';
const AI_TIMEOUT = 3000;

export interface RecommendationRequest {
  budget: number;
  city?: string;
  amenities?: string[];
  user_id?: number;
}

export interface PropertyRecommendation {
  property_id: number;
  name: string;
  city: string;
  rent: number;
  match_score: number;
  featured_image?: string;
  amenities?: any;
  available_rooms: number;
}

// ─── Rule-Based Fallback Engine ───
async function ruleBasedRecommendations(req: RecommendationRequest): Promise<PropertyRecommendation[]> {
  const budget = req.budget || 10000;
  const minBudget = budget * 0.6;
  const maxBudget = budget * 1.3;

  const properties = await prisma.property.findMany({
    where: {
      active: true,
      rent: { gte: minBudget, lte: maxBudget },
      ...(req.city ? { city: { contains: req.city, mode: 'insensitive' } } : {}),
    },
    include: {
      rooms: { where: { is_occupied: false }, select: { id: true } },
      photos: { take: 1 },
    },
    take: 10,
  });

  const scored: PropertyRecommendation[] = properties.map(p => {
    const priceDiff = Math.abs(p.rent - budget) / budget;
    const priceScore = Math.max(0, 1 - priceDiff) * 50; // 0-50 points
    const cityScore = req.city && p.city.toLowerCase().includes(req.city.toLowerCase()) ? 30 : 10;
    const occupancyScore = Math.min(20, (p.occupancy || 0) * 0.2); // higher occupancy = popular
    const matchScore = Math.min(99, Math.round(priceScore + cityScore + occupancyScore));

    return {
      property_id: p.id,
      name: p.name,
      city: p.city,
      rent: p.rent,
      match_score: matchScore,
      featured_image: p.featured_image || undefined,
      amenities: p.amenities,
      available_rooms: p.rooms.length,
    };
  });

  return scored.sort((a, b) => b.match_score - a.match_score).slice(0, 5);
}

// ─── Smart Recommendations (AI service with rule-based fallback) ───
export async function getRecommendations(req: RecommendationRequest): Promise<PropertyRecommendation[]> {
  if (AI_SERVICE_URL) {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/api/recommendations`, req, {
        timeout: AI_TIMEOUT,
      });
      return response.data;
    } catch (err) {
      console.warn('[AI Service] Unavailable, falling back to rule-based recommendations.');
    }
  }
  return ruleBasedRecommendations(req);
}

// ─── GoFlex Score Calculator ───
export async function calculateGoFlexScore(user_id: number): Promise<number> {
  try {
    const [payments, openComplaints, totalComplaints, kyc, agreements] = await Promise.all([
      prisma.paymentTransaction.findMany({ where: { user_id }, select: { status: true } }),
      prisma.complaint.count({ where: { resident_id: user_id, status: { in: ['open', 'in_progress'] } } }),
      prisma.complaint.count({ where: { resident_id: user_id } }),
      prisma.kYC.findUnique({ where: { user_id } }),
      prisma.rentalAgreement.findMany({ where: { resident_id: user_id }, select: { resident_signed: true } }),
    ]);

    // Payment score: (completed / total) * 40
    const totalPayments = payments.length;
    const completedPayments = payments.filter(p => p.status === 'completed').length;
    const paymentScore = totalPayments > 0 ? (completedPayments / totalPayments) * 40 : 30;

    // Compliance score: signed agreements / total * 30
    const signedAgreements = agreements.filter(a => a.resident_signed).length;
    const complianceScore = agreements.length > 0 ? (signedAgreements / agreements.length) * 30 : 25;

    // Complaint score: 20 - (open complaints * 5) capped at 0
    const complaintScore = Math.max(0, 20 - (openComplaints * 5));

    // Verification score
    const verificationScore = kyc?.status === 'verified' ? 10 : 0;

    const totalScore = Math.min(100, Math.round(paymentScore + complianceScore + complaintScore + verificationScore));

    // Update in DB
    const existing = await prisma.goFlexScore.findUnique({ where: { user_id } });
    const badge = totalScore >= 90 ? 'platinum' : totalScore >= 80 ? 'gold' : totalScore >= 65 ? 'silver' : 'bronze';

    if (existing) {
      await prisma.goFlexScore.update({
        where: { user_id },
        data: {
          overall_score: totalScore,
          payment_score: paymentScore,
          compliance_score: complianceScore,
          complaint_score: complaintScore,
          verification_score: verificationScore,
          verification_badge: badge,
          is_verified: kyc?.status === 'verified',
        },
      });
    } else {
      await prisma.goFlexScore.create({
        data: {
          user_id,
          overall_score: totalScore,
          payment_score: paymentScore,
          compliance_score: complianceScore,
          complaint_score: complaintScore,
          verification_score: verificationScore,
          verification_badge: badge,
          is_verified: kyc?.status === 'verified',
        },
      });
    }

    return totalScore;
  } catch (err) {
    console.error('[GoFlex Score] Calculation error:', err);
    return 75;
  }
}
