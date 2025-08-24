import { getPrisma } from '../config/db.js';
import { v4 as uuid } from 'uuid';
const prisma = getPrisma();

export async function listTokens() {
  return prisma.token.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function saveTokens(toks) {
  if (!Array.isArray(toks)) return [];
  for (const t of toks) {
    await prisma.token.create({
      data: {
        id: uuid(),
        subject: t.subject ?? '',
        type: t.type ?? 'unknown',
        meta: t.meta ?? {}
      }
    });
  }
  return listTokens();
}
