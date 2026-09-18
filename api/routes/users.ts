import express, { Request, Response } from "express";
import { ilike } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { authenticateToken } from "../utils";

const router = express.Router();

router.get("/search", authenticateToken, async (req: Request, res: Response) => {
  const query = req.query.q;

  if (typeof query !== "string") {
    return res.status(400).json({
      error: "Query must be a string",
    });
  }

  const search = query.trim();

  if (search.length < 3) {
    return res.json([]);
  }

  try {
    const result = await db
      .select({
        id: users.id,
        email: users.email,
      })
      .from(users)
      .where(ilike(users.email, `%${search}%`))
      .limit(10);

    return res.json(result);
  } catch (err) {
    console.error("User search failed:", err);

    return res.status(500).json({
      error: "Database error",
    });
  }
});

export default router;