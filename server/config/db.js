// server/config/db.js
import { PrismaClient } from '@prisma/client';

let prisma;

export function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

export async function connect() {
  const db = getPrisma();
  await db.$connect();
  // eslint-disable-next-line no-console
  console.log('Connected to database');
}

export async function disconnect() {
  if (!prisma) return;
  await prisma.$disconnect();
}












// // server/config/db.js
// // This file is a placeholder for Postgres connection in Week 6.
// // Currently storage uses JSON files under server/storage/*.json
// // When migrating, replace exports with actual DB client (pg/Prisma/etc).

// export function connect() {
//   // no-op for JSON-file storage
//   return Promise.resolve();
// }
