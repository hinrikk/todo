import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export type AuthenticatedRequest = Request & {
  user: {
    userId: number;
    email: string;
  };
};

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "Token required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
    };

    (req as AuthenticatedRequest).user = decoded;

    next();
  } catch {
    return res.status(403).json({
      error: "Invalid token",
    });
  }
}