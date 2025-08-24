// server/models/userModel.js
import { getPrisma } from '../config/db.js';
import { v4 as uuid } from 'uuid';
import argon2 from 'argon2';

const prisma = getPrisma();

/**
 * Fetch all users (latest first)
 */
export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, role: true, createdAt: true, policy: true }
  });
}

/**
 * Find a user by email
 */
export async function findUserByEmail(email) {
  if (!email) return null;
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });
}

/**
 * Find a user by ID
 */
export async function findUserById(id) {
  if (!id) return null;
  return prisma.user.findUnique({
    where: { id }
  });
}

/**
 * Create a new user (with hashed password + role validation)
 */
export async function createUser({ name, email, password, role = 'USER', policy = { statements: [] } }) {
  if (!email || !password) throw new Error('email_password_required');

  const passwordHash = await argon2.hash(password);

  // Normalize role (enum ADMIN | USER)
  const upperRole = (role || 'USER').toString().toUpperCase();
  if (!['ADMIN', 'USER'].includes(upperRole)) {
    throw new Error(`invalid_role: ${role}`);
  }

  try {
    return await prisma.user.create({
      data: {
        id: uuid(),
        name: name ?? email.split('@')[0],
        email: email.toLowerCase(),
        role: upperRole,
        passwordHash,
        policy
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
  } catch (e) {
    if (String(e?.code) === 'P2002') throw new Error('email_exists'); // unique constraint
    throw e;
  }
}

/**
 * Update an existing user (role + password normalization)
 */
export async function updateUser(id, { name, email, role, password, policy }) {
  const data = {};
  if (name !== undefined) data.name = name;
  if (email !== undefined) data.email = email.toLowerCase();

  if (role !== undefined) {
    const upperRole = role.toString().toUpperCase();
    if (!['ADMIN', 'USER'].includes(upperRole)) {
      throw new Error(`invalid_role: ${role}`);
    }
    data.role = upperRole;
  }

  if (policy !== undefined) data.policy = policy;
  if (password) data.passwordHash = await argon2.hash(password);

  try {
    return await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
  } catch (e) {
    if (String(e?.code) === 'P2025') throw new Error('not_found');
    if (String(e?.code) === 'P2002') throw new Error('email_exists');
    throw e;
  }
}

/**
 * Delete a user
 */
export async function removeUser(id) {
  try {
    return await prisma.user.delete({
      where: { id },
      select: { id: true, email: true }
    });
  } catch (e) {
    if (String(e?.code) === 'P2025') throw new Error('not_found');
    throw e;
  }
}

/**
 * Verify plaintext password against stored hash
 */
export async function verifyPassword(user, plaintext) {
  if (!user) return false;
  return argon2.verify(user.passwordHash, plaintext);
}