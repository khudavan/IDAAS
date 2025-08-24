// server/routes/adminRoutes.js
import express from 'express';
import { authRequired, adminOnly } from '../middleware/authMiddleware.js';
import { listUsers, createUser, updateUser, removeUser, findUserById } from '../models/userModel.js';
import { listAlerts, createAlert, findAlertById, removeAlert } from "../models/alertModel.js";
import { getPrisma } from "../config/db.js";

const prisma = getPrisma();
const router = express.Router();

// List users (admin)
router.get('/users', authRequired, adminOnly, async (_req, res) => {
  const users = await listUsers();
  const publicUsers = users.map(u => {
    const { passwordHash, ...pub } = u;
    return pub;
  });
  res.json(publicUsers);
});

// Create user (admin)
router.post('/users', authRequired, adminOnly, async (req, res) => {
  try {
    const { name, email, password, role, policy } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    const u = await createUser({ name, email, password, role, policy });
    const { passwordHash, ...pub } = u;
    res.status(201).json(pub);
  } catch (e) {
    if (e.message === 'email_exists') return res.status(409).json({ error: 'email already exists' });
    return res.status(500).json({ error: 'failed' });
  }
});

// Update user (admin)
router.put('/users/:id', authRequired, adminOnly, async (req, res) => {
  try {
    const u = await findUserById(req.params.id);
    if (!u) return res.status(404).json({ error: 'not found' });

    // 🚫 Prevent editing the system admin from .env
    if (u.email.toLowerCase().trim() === process.env.ADMIN_EMAIL.toLowerCase().trim()) {
      return res.status(403).json({ error: 'System admin cannot be edited' });
    }

    const updated = await updateUser(req.params.id, req.body || {});
    const { passwordHash, ...pub } = updated;
    res.json(pub);
  } catch (e) {
    if (e.message === 'not_found') return res.status(404).json({ error: 'not found' });
    if (e.message === 'email_exists') return res.status(409).json({ error: 'email exists' });
    return res.status(500).json({ error: 'failed' });
  }
});

// Delete user (admin)
router.delete('/users/:id', authRequired, adminOnly, async (req, res) => {
  try {
    const u = await findUserById(req.params.id);
    if (!u) return res.status(404).json({ error: 'not found' });

    // 🚫 Prevent deletion of system admin from .env
    if (u.email.toLowerCase().trim() === process.env.ADMIN_EMAIL.toLowerCase().trim()) {
      return res.status(403).json({ error: 'System admin cannot be deleted' });
    }

    const removed = await removeUser(req.params.id);
    const { passwordHash, ...pub } = removed;
    res.json(pub);
  } catch (e) {
    return res.status(500).json({ error: 'failed' });
  }
});

// user policy get/put
router.get('/users/:id/policy', authRequired, adminOnly, async (req, res) => {
  const u = await findUserById(req.params.id);
  if (!u) return res.status(404).json({ error: 'not found' });
  res.json(u.policy || {});
});

router.put('/users/:id/policy', authRequired, adminOnly, async (req, res) => {
  try {
    const u = await findUserById(req.params.id);
    if (!u) return res.status(404).json({ error: 'not found' });

    // 🚫 Prevent editing system admin's policy
    if (u.email.toLowerCase().trim() === process.env.ADMIN_EMAIL.toLowerCase().trim()) {
      return res.status(403).json({ error: 'System admin policy cannot be edited' });
    }

    await updateUser(req.params.id, { policy: req.body || {} });
    res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'failed' });
  }
});

// List alerts
router.get("/alerts", async (req, res) => {
  try {
    const alerts = await listAlerts();
    res.json(alerts);
  } catch (err) {
    console.error("Error listing alerts:", err);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

// Create alert
router.post("/alerts", async (req, res) => {
  try {
    const { type, message, severity, userId } = req.body;
    if (!type || !message) {
      return res.status(400).json({ error: "Type and message required" });
    }
    const alert = await createAlert({
      type,
      message,
      severity,
      userId: userId || null,
    });
    res.status(201).json(alert);
  } catch (err) {
    console.error("Error creating alert:", err);
    res.status(500).json({ error: "Failed to create alert" });
  }
});

// Get single alert
router.get("/alerts/:id", async (req, res) => {
  try {
    const alert = await findAlertById(req.params.id);
    if (!alert) return res.status(404).json({ error: "Alert not found" });
    res.json(alert);
  } catch (err) {
    console.error("Error fetching alert:", err);
    res.status(500).json({ error: "Failed to fetch alert" });
  }
});

// Delete alert
router.delete("/alerts/:id", async (req, res) => {
  try {
    await removeAlert(req.params.id);
    res.json({ message: "Alert deleted successfully" });
  } catch (err) {
    console.error("Error deleting alert:", err);
    res.status(500).json({ error: "Failed to delete alert" });
  }
});

router.get("/admin-info", (req, res) => {
  res.json({ email: process.env.ADMIN_EMAIL || null });
});

// // Admin: view all login activities
// router.get("/reports/login-activity", authRequired, adminOnly, async (req, res) => {
//   try {
//     const logs = await prisma.loginActivity.findMany({
//       orderBy: { createdAt: "desc" },
//       include: {
//         user: {
//           select: { id: true, name: true, email: true, role: true }
//         }
//       }
//     });
//     res.json(logs);
//   } catch (err) {
//     console.error("Error fetching login report:", err);
//     res.status(500).json({ error: "Failed to fetch report" });
//   }
// });

// ✅ Admin: view all login activities
router.get("/login-activity", authRequired, adminOnly, async (req, res) => {
  try {
    const logs = await prisma.loginActivity.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    res.json(logs);
  } catch (err) {
    console.error("Error fetching login report:", err);
    res.status(500).json({ error: "Failed to fetch report" });
  }
});

export default router;
