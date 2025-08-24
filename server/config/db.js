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
