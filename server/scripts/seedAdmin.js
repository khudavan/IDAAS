import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPrisma } from '../config/db.js';
import { createUser, findUserByEmail } from '../models/userModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const prisma = getPrisma();
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

  const existing = await findUserByEmail(adminEmail);
  if (existing) {
    console.log('✅ Admin already exists');
    await prisma.$disconnect();
    process.exit(0);
  }

  // Load default policy template
  const policyPath = path.resolve(__dirname, '..', 'permissions', 'iam-policy-template.json');
  const tpl = JSON.parse(await fs.readFile(policyPath, 'utf-8'));

  // ✅ Must pass Prisma enum value
  const admin = await createUser({
    name: 'System Admin',
    email: adminEmail,
    password: adminPassword,
    role: 'ADMIN',  
    policy: tpl
  });

  console.log(`✅ Seeded admin: ${admin.email} (role: ${admin.role})`);
  await prisma.$disconnect();
}

run().catch(async (e) => {
  console.error('❌ Seeding failed:', e);
  const prisma = getPrisma();
  await prisma.$disconnect();
  process.exit(1);
});
