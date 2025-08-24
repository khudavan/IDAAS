// server/server.js
import dotenv from 'dotenv';
dotenv.config();
import { connect, disconnect } from './config/db.js';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import policyRoutes from './routes/policyRoutes.js';
import clientRoutes from './routes/clientRoutes.js'; // placeholder for future
import mainRoutes from './routes/mainRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

// simple root
app.get('/', (_req, res) => res.json({ ok: true, service: 'IDaaS (dev)' }));

// API mount points
app.use('/auth', authRoutes);       // login / me
app.use('/main', mainRoutes);       // main app endpoints with permission checks
app.use('/admin', adminRoutes);     // admin user-management / policy endpoints
app.use('/policy', policyRoutes);   // generic policy CRUD (admin)
// app.use("/api", adminRoutes);

// placeholder for OAuth clients management (future)
app.use('/clients', clientRoutes);

// ... after app setup
await connect();

process.on('SIGINT', async () => {
  await disconnect();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on ${PORT}`);
});
