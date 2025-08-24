// server/models/clientModel.js
import { getPrisma } from '../config/db.js';
import { v4 as uuid } from 'uuid';
const prisma = getPrisma();

export async function listClients() {
  return prisma.oAuthClient.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function saveClients(list) {
  // naive upsert by clientId (dev placeholder)
  for (const c of list) {
    await prisma.oAuthClient.upsert({
      where: { clientId: c.clientId },
      update: { name: c.name, secret: c.secret },
      create: { id: uuid(), name: c.name, clientId: c.clientId, secret: c.secret }
    });
  }
  return listClients();
}























// // server/models/clientModel.js
// // Placeholder for OAuth clients storage. For Week 1-5, no clients used.
// // Keep structure for later migration.

// import { readJson, writeJson } from './_storage.js';
// const FNAME = 'clients.json';

// export async function listClients() {
//   return await readJson(FNAME, []);
// }
// export async function saveClients(list) {
//   await writeJson(FNAME, list);
// }
