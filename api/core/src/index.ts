import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.routes';
import propertyRoutes from './routes/property.routes';
import bookingRoutes from './routes/booking.routes';
import paymentRoutes from './routes/payment.routes';
import aiRoutes from './routes/ai.routes';
import kycRoutes from './routes/kyc.routes';
import escrowRoutes from './routes/escrow.routes';
import referralRoutes from './routes/referral.routes';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 8000;

app.use(cors());
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

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'GoFlex Core' });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Node.js Core Backend running on port ${PORT}`);
});
