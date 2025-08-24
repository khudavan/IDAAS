import { getPrisma } from '../config/db.js';
const prisma = getPrisma();

export async function listTemplates() {
  return prisma.policyTemplate.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function saveTemplates(templates) {
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
