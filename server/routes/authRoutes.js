// server/routes/authRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { getPrisma } from "../config/db.js";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";

import {
  findUserByEmail,
  findUserById,
  verifyPassword,
  createUser,
  listUsers,
} from "../models/userModel.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = getPrisma();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Environment configs
const SECRET = process.env.JWT_SECRET || "dev-secret-key";
const TTL = process.env.JWT_TTL || "1h";

// File paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_POLICY_FILE = path.resolve(
  __dirname,
  "..",
  "permissions",
  "iam-policy-template.json"
);

/**
 * Seed initial admin user if DB is empty
 */
async function ensureAdmin() {
  try {
    const users = await listUsers();
    if (!users || users.length === 0) {
      const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
      const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";

      const tpl = JSON.parse(await fs.readFile(TEMPLATE_POLICY_FILE, "utf-8"));

      await createUser({
        name: "System Admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        policy: tpl,
      });

      console.log(
        `✅ Seeded admin account -> Email: ${adminEmail} | Password: ${adminPassword}`
      );
    }
  } catch (err) {
    console.error("Error ensuring admin user:", err.message);
  }
}

// Ensure admin at startup
await ensureAdmin();

/**
 * @route POST /auth/login
 * @desc Authenticate user and issue JWT
 */
// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      // ❌ Log failed attempt for unknown user
      await prisma.loginActivity.create({
        data: {
          userId: null,
          email,
          success: false,
          ip: req.ip,
          userAgent: req.headers["user-agent"] || null,
        },
      });
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await verifyPassword(user, password);
    if (!ok) {
      // ❌ Log failed attempt with known user
      await prisma.loginActivity.create({
        data: {
          userId: user.id,
          email,
          success: false,
          ip: req.ip,
          userAgent: req.headers["user-agent"] || null,
        },
      });
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ✅ Successful login → update lastLogin
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, SECRET, { expiresIn: TTL });

    // ✅ Log successful attempt
    await prisma.loginActivity.create({
      data: {
        userId: user.id,
        email,
        success: true,
        ip: req.ip,
        userAgent: req.headers["user-agent"] || null,
      },
    });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});



// // User Login
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body || {};

//     if (!email || !password) {
//       return res.status(400).json({ error: "Email and password are required" });
//     }

//     const user = await findUserByEmail(email);
//     if (!user) return res.status(401).json({ error: "Invalid credentials" });

//     const ok = await verifyPassword(user, password);
//     if (!ok) return res.status(401).json({ error: "Invalid credentials" });

//     // 🔹 Update last login
//     await prisma.user.update({
//       where: { id: user.id },
//       data: { lastLogin: new Date() },
//     });

//     const payload = { sub: user.id, email: user.email, role: user.role };
//     const token = jwt.sign(payload, SECRET, { expiresIn: TTL });

//     return res.json({
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     console.error("Login error:", err.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

/**
 * @route GET /auth/me
 * @desc Return current authenticated user
 */
router.get("/me", authRequired, async (req, res) => {
  try {
    const userId = req.user?.sub || req.user?.id;
    const user = await findUserById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    // Exclude sensitive data
    const { passwordHash, ...pub } = user;
    res.json(pub);
  } catch (err) {
    console.error("Whoami error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @route POST /auth/google
 * @desc Login/signup with Google ID Token
 */
// router.post("/google", async (req, res) => {
//   try {
//     const { credential } = req.body; // from frontend Google login
//     if (!credential) return res.status(400).json({ error: "Missing credential" });

//     // Verify Google token
//     const ticket = await googleClient.verifyIdToken({
//       idToken: credential,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const email = payload.email;
//     const name = payload.name;

//     // Find existing user or create new
//     let user = await findUserByEmail(email);
//     if (!user) {
//       const tpl = JSON.parse(await fs.readFile(TEMPLATE_POLICY_FILE, "utf-8"));
//       user = await createUser({
//         name,
//         email,
//         password: uuid(), // random password, not used
//         role: "user",
//         policy: tpl,
//       });
//     }

//     // Issue JWT from *your system*
//     const jwtPayload = { sub: user.id, email: user.email, role: user.role };
//     const token = jwt.sign(jwtPayload, SECRET, { expiresIn: TTL });

//     res.json({
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     console.error("Google login error:", err.message);
//     res.status(401).json({ error: "Invalid Google login" });
//   }
// });

// ================================
// GOOGLE LOGIN (fixed with googleClient)
// ================================
router.post("/google", async (req, res) => {
  try {
    // accept both "credential" (from Google One Tap) and "token" (mobile/web OAuth)
    const idToken = req.body.token || req.body.credential;
    if (!idToken) {
      return res.status(400).json({ error: "Google token is required" });
    }

    // ✅ Verify Google token using googleClient
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // ✅ Find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || "Google User",
          profilePic: picture || null,
          // provider: "GOOGLE",
        },
      });
    }

    // ✅ Generate JWT
    const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Log Google login attempt (success)
    await prisma.loginActivity.create({
      data: {
        userId: user.id,
        email: user.email,
        success: true,
        ip: req.ip,
        userAgent: req.headers["user-agent"] || null,
      },
    });

    res.json({
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.error("Google login error:", err.message);

    // ❌ Log failed attempt
    try {
      await prisma.loginActivity.create({
        data: {
          userId: null,
          email: req.body?.email || "unknown",
          success: false,
          ip: req.ip,
          userAgent: req.headers["user-agent"] || null,
        },
      });
    } catch (logErr) {
      console.error("Failed to log Google login error:", logErr.message);
    }

    res.status(401).json({ error: "Invalid Google login" });
  }
});


export default router;
