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
import clientRoutes from './routes/clientRoutes.js'; 
import mainRoutes from './routes/mainRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => res.json({ ok: true, service: 'IDaaS (dev)' }));

// API mount points
app.use('/auth', authRoutes); 
app.use('/main', mainRoutes); 
app.use('/admin', adminRoutes);
app.use('/policy', policyRoutes);

app.use('/clients', clientRoutes);

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
