import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';

import { connectMongo } from './config/db.mongo.js';
import { initSQLite } from './config/db.sqlite.js';
import { initSocket } from './config/socket.js';
import { errorHandler } from './middleware/error.middleware.js';


import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import complaintRoutes from './routes/complaint.routes.js';
import visitorRoutes from './routes/visitor.routes.js';
import noticeRoutes from './routes/notice.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import billingRoutes from './routes/billing.routes.js';
import pollRoutes from './routes/poll.routes.js';
import facilityRoutes from './routes/facility.routes.js';
import parkingRoutes from './routes/parking.routes.js';
import marketplaceRoutes from './routes/marketplace.routes.js';
import sosRoutes from './routes/sos.routes.js';
import incidentRoutes from './routes/incident.routes.js';
import vehicleRoutes from './routes/vehicle.routes.js';
import eventRoutes from './routes/event.routes.js';
import lostFoundRoutes from './routes/lostfound.routes.js';

const app = express();
const httpServer = createServer(app);


app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
import path from 'path';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/lost-found', lostFoundRoutes);


app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


app.use(errorHandler);


const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    
    await connectMongo();
    await initSQLite();

    
    initSocket(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`\n🚀 Smart Society Hub Server running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}\n`);
    });
  } catch (err) {
    console.error('❌ Server startup failed:', err);
    process.exit(1);
  }
}

startServer();

