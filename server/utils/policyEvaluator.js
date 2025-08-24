export function hasPermission(policyDoc, action, resource) {
  const statements = policyDoc?.statements || [];

  const match = (val, arr) =>
    Array.isArray(arr) && arr.some(x => x === '*' || x === val);

  const denied = statements.some(st =>
    (String(st.effect || '').toLowerCase() === 'deny') &&
    match(action, st.action) &&
    match(resource, st.resource)
  );
  if (denied) return false;

  const allowed = statements.some(st =>
    (String(st.effect || '').toLowerCase() === 'allow') &&
    match(action, st.action) &&
    match(resource, st.resource)
  );
  return !!allowed;
}
