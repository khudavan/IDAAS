import express from 'express';
import { authRequired, adminOnly } from '../middleware/authMiddleware.js';
import { listTemplates, saveTemplates } from '../models/policyModel.js';
import { listUsers, updateUser, findUserById } from '../models/userModel.js';

const router = express.Router();

router.get('/templates', authRequired, adminOnly, async (_req, res) => {
  const t = await listTemplates();
  res.json(t);
});

router.put('/templates', authRequired, adminOnly, async (req, res) => {
  await saveTemplates(req.body || []);
  res.json({ ok: true });
});


// Admin: list all users
router.get('/users', authRequired, adminOnly, async (_req, res) => {
  const users = await listUsers();
  res.json(users);
});

// Admin: update user (role / policy)
router.put('/users/:id', authRequired, adminOnly, async (req, res) => {
  const { id } = req.params;
  const { role, policy, name, email, password } = req.body || {};

  const existing = await findUserById(id);
  if (!existing) return res.status(404).json({ error: 'user_not_found' });

  try {
    const updated = await updateUser(id, { role, policy, name, email, password });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
