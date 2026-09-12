import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

import { db } from "../db/index";
import { users } from "../db/schema";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required",
    });
  }

  try {
    const result = await db
      .select({
        id: users.id,
        email: users.email,
        passwordHash: users.passwordHash,
      })
      .from(users)
      .where(eq(users.email, email));

    if (result.length === 0) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const user = result[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.json({
      token,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Database error",
    });
  }
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required",
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await db
      .insert(users)
      .values({
        email,
        passwordHash,
      })
      .returning({
        id: users.id,
        email: users.email,
      });

    res.status(201).json(result[0]);
  } catch (err: any) {
    console.error(err);

    if (err.code === "23505") {
      return res.status(409).json({
        error: "User already exists",
      });
    }

    res.status(500).json({
      error: "Database error",
    });
  }
});

export default router;