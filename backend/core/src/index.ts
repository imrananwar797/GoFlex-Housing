import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import authRoutes from './routes/auth.routes';
import propertyRoutes from './routes/property.routes';
import bookingRoutes from './routes/booking.routes';
import paymentRoutes from './routes/payment.routes';
import aiRoutes from './routes/ai.routes';
import kycRoutes from './routes/kyc.routes';
import escrowRoutes from './routes/escrow.routes';
import referralRoutes from './routes/referral.routes';
import blogRoutes from './routes/blog.routes';
import subscriptionRoutes from './routes/subscription.routes';
import ownerRoutes from './routes/owner.routes';
import complaintRoutes from './routes/complaint.routes';
import agreementRoutes from './routes/agreement.routes';
import communityRoutes from './routes/community.routes';
import servicesRoutes from './routes/services.routes';
import rateLimit from 'express-rate-limit';
import prisma from './utils/db.client';

const app = express();

// Trust proxy for Vercel/reverse proxy environments
app.set('trust proxy', 1);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: { detail: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // Increased for smoother testing and validation
  message: { detail: 'Too many login attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false }
});

app.use('/api', apiLimiter);

const PORT = process.env.PORT || 8001;

app.use(cors({
  origin: true, // Reflect request origin in production
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Normalize Vercel/Vite rewritten URLs starting with /api/v1/core
// Removed URL rewriting middleware – Vercel now forwards paths directly.
// If needed, additional middleware can be added here.


import analyticsRoutes from './routes/analytics.routes';

// Routes
app.use('/api/auth', loginLimiter, authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/ai', aiRoutes);
// Ecosystem routes
app.use('/api/complaints', complaintRoutes);
app.use('/api/agreements', agreementRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/services', servicesRoutes);

let cachedStats: any = {
  active_nodes: 3,
  total_residents: 142,
  energy_saved_kwh: 1775,
  network_trust_score: 94.2,
  timestamp: new Date().toISOString()
};
let lastFetch = 0;
const CACHE_TTL = 300 * 1000; // 5 minutes

const refreshStats = async () => {
  try {
    const [nodeCount, residentCount, occupancySum] = await Promise.all([
      prisma.property.count({ where: { active: true } }),
      prisma.user.count({ where: { role: 'RESIDENT' } }),
      prisma.property.aggregate({ _sum: { occupancy: true } })
    ]);

    cachedStats = {
      active_nodes: nodeCount || 0,
      total_residents: residentCount || 0,
      energy_saved_kwh: Math.floor((occupancySum._sum.occupancy || 0) * 12.5),
      network_trust_score: 94.2,
      timestamp: new Date().toISOString()
    };
    lastFetch = Date.now();
  } catch (error) {
    console.error('Failed to refresh stats:', error);
  }
};

// Initial fetch
refreshStats();

app.get('/api/v1/network/stats', async (req, res) => {
  const now = Date.now();
  
  // Serve cache if exists, regardless of age
  if (cachedStats) {
    res.json({ ...cachedStats, source: 'cache' });
    
    // Background refresh if expired
    if (now - lastFetch > CACHE_TTL) {
      refreshStats();
    }
    return;
  }

  // If no cache, perform blocking fetch (first time only)
  await refreshStats();
  res.json(cachedStats || { detail: 'Service warming up' });
});

// Primary health endpoint used by Vercel rewrites
app.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (e) {
    console.error('⚠️ DB Health Check Failed:', e);
  }

  res.json({ 
    status: dbStatus === 'connected' ? 'ok' : 'degraded', 
    service: 'GoFlex Core - Next-Generation Housing Management System',
    database: dbStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Expose the same health check under the Vercel‑rewritten path for convenience
app.get('/api/v1/core/health', async (req, res, next) => {
  // Reuse the health logic above
  req.url = '/health';
  next();
});

// For local Docker/development / production deployments (excluding serverless like Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Node.js Core Backend running on port ${PORT}`);
  });
}

// Catch‑all route for unknown API paths – returns JSON 404
app.use((req, res) => {
  res.status(404).json({ detail: 'Not Found', path: req.originalUrl });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Backend Error:', err);
  res.status(err.status || 500).json({
    detail: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

export default app;
