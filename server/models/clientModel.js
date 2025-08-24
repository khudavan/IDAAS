import { getPrisma } from '../config/db.js';
import { v4 as uuid } from 'uuid';
const prisma = getPrisma();

export async function listClients() {
  return prisma.oAuthClient.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function saveClients(list) {
  for (const c of list) {
    await prisma.oAuthClient.upsert({
      where: { clientId: c.clientId },
      update: { name: c.name, secret: c.secret },
      create: { id: uuid(), name: c.name, clientId: c.clientId, secret: c.secret }
    });
  }
  return listClients();
}
