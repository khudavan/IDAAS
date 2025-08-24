// server/models/policyModel.js
import { getPrisma } from '../config/db.js';
const prisma = getPrisma();

export async function listTemplates() {
  return prisma.policyTemplate.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function saveTemplates(templates) {
  // naive replace-all for simplicity:
  const tx = await prisma.$transaction(async (trx) => {
    await trx.policyTemplate.deleteMany({});
    if (!Array.isArray(templates)) return [];
    const created = [];
    for (const t of templates) {
      created.push(await trx.policyTemplate.create({
        data: {
          name: t.name ?? `template_${Date.now()}`,
          document: t.document ?? t
        }
      }));
    }
    return created;
  });
  return tx;
}






















// // server/models/policyModel.js
// import { readJson, writeJson } from './_storage.js';

// const FNAME = 'policies.json';

// /**
//  * Simple top-level policy store for templates or other global policies.
//  * For per-user policies the userModel includes a `policy` field.
//  */

// export async function listTemplates() {
//   return await readJson(FNAME, []);
// }

// export async function saveTemplates(templates) {
//   await writeJson(FNAME, templates);
// }
