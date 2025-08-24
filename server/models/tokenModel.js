// server/models/tokenModel.js
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
























// // server/models/tokenModel.js
// // Placeholder for tokens (access/refresh) persistence. Currently tokens are stateless JWTs.
// // When refresh tokens are needed, implement persistence here.

// import { readJson, writeJson } from './_storage.js';
// const FNAME = 'tokens.json';

// export async function listTokens() {
//   return await readJson(FNAME, []);
// }
// export async function saveTokens(toks) {
//   await writeJson(FNAME, toks);
// }
