// server/models/alertModel.js
import { getPrisma } from "../config/db.js";

// Create alert
export async function createAlert({ type, message, severity = "info", userId }) {
  const prisma = getPrisma();
  return prisma.alert.create({
    data: {
      type,
      message,
      severity,
      userId: userId || null,   // ✅ keep UUID string, no parseInt
    },
  });
}

// List alerts
export async function listAlerts() {
  const prisma = getPrisma();
  return prisma.alert.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } }, // join user info
    },
  });
}

// List alerts for a given user (global + user-specific)
export async function listUserAlerts(userId) {
  const prisma = getPrisma();
  return prisma.alert.findMany({
    where: {
      OR: [{ userId: null }, { userId }],
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
}

// Get single alert
export async function findAlertById(id) {
  const prisma = getPrisma();
  return prisma.alert.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
}

// Delete alert
export async function removeAlert(id) {
  const prisma = getPrisma();
  return prisma.alert.delete({
    where: { id: parseInt(id) },
  });
}
