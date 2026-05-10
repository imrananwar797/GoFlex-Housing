import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
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
import rateLimit from 'express-rate-limit';
import prisma from './utils/db.client';

dotenv.config();

const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: { detail: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // Increased for smoother testing and validation
  message: { detail: 'Too many login attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);

const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: true, // Reflect request origin in production
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

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

app.get('/api/v1/network/stats', async (req, res) => {
  try {
    const [nodeCount, residentCount, occupancySum] = await Promise.all([
      prisma.property.count({ where: { active: true } }),
      prisma.user.count({ where: { role: 'RESIDENT' } }),
      prisma.property.aggregate({ _sum: { occupancy: true } })
    ]);

    res.json({
      active_nodes: nodeCount || 0,
      total_residents: residentCount || 0,
      energy_saved_kwh: Math.floor((occupancySum._sum.occupancy || 0) * 12.5), // Simulated energy saving based on occupancy
      network_trust_score: 94.2,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ detail: 'Failed to fetch network telemetry' });
  }
});

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
    service: 'GoFlex Core',
    database: dbStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// For local Docker/development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Node.js Core Backend running on port ${PORT}`);
  });
}

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Backend Error:', err);
  res.status(err.status || 500).json({
    detail: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

export default app;
