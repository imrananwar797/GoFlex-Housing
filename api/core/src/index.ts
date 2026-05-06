import express from 'express';
import cors from 'cors';
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

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: true, // Reflect request origin in production
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/owner', ownerRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'GoFlex Core' });
});

// For local Docker/development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Node.js Core Backend running on port ${PORT}`);
  });
}

export default app;
