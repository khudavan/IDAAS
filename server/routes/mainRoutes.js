// server/routes/mainRoutes.js
import express from 'express';
import { authRequired, adminOnly } from '../middleware/authMiddleware.js';
import { enforce, hasPermission } from '../middleware/policyMiddleware.js';
import { findUserById } from '../models/userModel.js';
import { listAlerts } from '../models/alertModel.js';
import { listUserAlerts } from "../models/alertModel.js";

const router = express.Router();

// health
router.get('/health', (_req, res) => res.json({ ok: true }));

// dashboard - requires read on service:dashboard
router.get(
  "/dashboard",
  authRequired,
  enforce("read", "service:dashboard"),
  async (req, res) => {
    try {
      const userId = req.user?.sub || req.user?.id;
      const user = await findUserById(userId);

      // 🔹 Alerts
      const alerts = await listAlerts();
      const alertCount = alerts.length;

      // 🔹 Reports (replace with real prisma query if you have Report model)
      // Example: const reportCount = await prisma.report.count();
      const reportCount = 12;

      // 🔹 Last login (assumes user has lastLogin field, fallback to createdAt)
      const lastLogin = user?.lastLogin || user?.createdAt;

      res.json({
        stats: {
          reports: reportCount,
          alerts: alertCount,
          lastLogin,
        },
      });
    } catch (err) {
      console.error("Dashboard fetch failed", err);
      res.status(500).json({ error: "failed to load dashboard" });
    }
  }
);

// reports read
router.get('/reports', authRequired, enforce('read', 'service:reports'), async (_req, res) => {
  res.json({
    items: [
      { id: 'r1', name: 'Monthly Summary', createdAt: '2025-08-01' },
      { id: 'r2', name: 'Usage Breakdown', createdAt: '2025-08-15' }
    ]
  });
});

// create report (write permission)
router.post('/reports', authRequired, enforce('write', 'service:reports'), async (req, res) => {
  const { name } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name required' });
  res.status(201).json({ id: `r${Date.now()}`, name, createdAt: new Date().toISOString() });
});

// profile (protected, no extra permission required)
router.get('/profile', authRequired, async (req, res) => {
  const id = req.user?.sub || req.user?.id;
  const user = await findUserById(id);
  if (!user) return res.status(404).json({ error: 'not found' });
  const { passwordHash, policy, ...pub } = user;
  res.json(pub);
});

// user alerts (global + personal)
router.get("/alerts", authRequired, async (req, res) => {
  try {
    const userId = req.user?.sub || req.user?.id;
    const alerts = await listUserAlerts(userId);
    res.json(alerts);
  } catch (err) {
    console.error("Error fetching user alerts:", err);
    res.status(500).json({ error: "failed to load alerts" });
  }
});

// permission check endpoint for UI
router.post('/permissions/check', authRequired, async (req, res) => {
  const { action, resource } = req.body || {};
  if (!action || !resource) return res.status(400).json({ error: 'action/resource required' });
  const id = req.user?.sub || req.user?.id;
  const user = await findUserById(id);
  if (!user) return res.status(404).json({ error: 'not found' });
  const allow = hasPermission(user.policy || {}, action, resource);
  res.json({ allow });
});

// // Get login activity report (only admins)
// router.get("/reports/login-activity", authRequired, adminOnly, async (req, res) => {
//   if (req.user.role !== "ADMIN") {
//     return res.status(403).json({ error: "Forbidden" });
//   }

//   try {
//     const logs = await prisma.loginActivity.findMany({
//       orderBy: { createdAt: "desc" },
//       take: 50,
//       include: {
//         user: {
//           select: { id: true, email: true, name: true },
//         },
//       },
//     });
//     res.json(logs);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

export default router;
