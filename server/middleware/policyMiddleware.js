import { findUserById } from '../models/userModel.js';

export function hasPermission(policyDoc, action, resource) {
  const statements = policyDoc?.statements || [];

  const match = (val, arr) =>
    Array.isArray(arr) && arr.some(x => x === '*' || x === val);

  // check explicit deny
  const denied = statements.some(st =>
    (String(st.effect || '').toLowerCase() === 'deny') &&
    match(action, st.action) &&
    match(resource, st.resource)
  );
  if (denied) return false;

  // check allow
  const allowed = statements.some(st =>
    (String(st.effect || '').toLowerCase() === 'allow') &&
    match(action, st.action) &&
    match(resource, st.resource)
  );
  return !!allowed;
}

export function enforce(action, resource) {
  return async (req, res, next) => {
    try {
      const userId = req.user?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ error: 'missing user' });
      const user = await findUserById(userId);
      if (!user) return res.status(404).json({ error: 'user not found' });
      const ok = hasPermission(user.policy || {}, action, resource);
      if (!ok) return res.status(403).json({ error: 'access denied' });
      return next();
    } catch (e) {
      return res.status(500).json({ error: 'policy evaluation failed' });
    }
  };
}
