import express from "express";
import { and, desc, eq, inArray } from "drizzle-orm";

import { db } from "../db/index";
import { documents, documentUsers, users } from "../db/schema";
import { authenticateToken } from "../utils";

const router = express.Router();

function getUserId(req: express.Request) {
  return (
    req as express.Request & {
      user: { userId: number };
    }
  ).user.userId;
}

// CREATE DOCUMENT
router.post("/", authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  const userId = getUserId(req);

  if (!title) {
    return res.status(400).json({
      error: "Title is required",
    });
  }

  try {
    const document = await db.transaction(async (tx) => {
      const result = await tx
        .insert(documents)
        .values({
          title,
          content: content || "",
        })
        .returning();

      const document = result[0];

      await tx.insert(documentUsers).values({
        documentId: document.id,
        userId,
      });

      return document;
    });

    res.status(201).json(document);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Database error",
    });
  }
});

// GET ALL DOCUMENTS
router.get("/", authenticateToken, async (req, res) => {
  const userId = getUserId(req);

  try {
    const documentRows = await db
      .select({
        id: documents.id,
        title: documents.title,
        content: documents.content,
      })
      .from(documents)
      .innerJoin(
        documentUsers,
        eq(documentUsers.documentId, documents.id),
      )
      .where(eq(documentUsers.userId, userId))
      .orderBy(desc(documents.id));

    if (documentRows.length === 0) {
      return res.json([]);
    }

    const documentIds = documentRows.map((document) => document.id);

    const memberRows = await db
      .select({
        documentId: documentUsers.documentId,
        id: users.id,
        email: users.email,
      })
      .from(documentUsers)
      .innerJoin(users, eq(users.id, documentUsers.userId))
      .where(inArray(documentUsers.documentId, documentIds));

    const result = documentRows.map((document) => ({
      ...document,

      members: memberRows
        .filter((member) => member.documentId === document.id)
        .map((member) => ({
          id: member.id,
          email: member.email,
        })),
    }));

    res.json(result);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Database error",
    });
  }
});

// GET ONE DOCUMENT
router.get("/:id", authenticateToken, async (req, res) => {
  const documentId = Number(req.params.id);
  const userId = getUserId(req);

  try {
    const result = await db
      .select({
        id: documents.id,
        title: documents.title,
        content: documents.content,
      })
      .from(documents)
      .innerJoin(
        documentUsers,
        eq(documentUsers.documentId, documents.id),
      )
      .where(
        and(
          eq(documents.id, documentId),
          eq(documentUsers.userId, userId),
        ),
      )
      .limit(1);

    const document = result[0];

    if (!document) {
      return res.status(404).json({
        error: "Document not found",
      });
    }

    const members = await db
      .select({
        id: users.id,
        email: users.email,
      })
      .from(documentUsers)
      .innerJoin(users, eq(users.id, documentUsers.userId))
      .where(eq(documentUsers.documentId, documentId));

    res.json({
      ...document,
      members,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Database error",
    });
  }
});

// UPDATE DOCUMENT
router.patch("/:id", authenticateToken, async (req, res) => {
  const documentId = Number(req.params.id);
  const userId = getUserId(req);

  const { title, content } = req.body;

  try {
    const access = await db
      .select()
      .from(documentUsers)
      .where(
        and(
          eq(documentUsers.documentId, documentId),
          eq(documentUsers.userId, userId),
        ),
      )
      .limit(1);

    if (access.length === 0) {
      return res.status(403).json({
        error: "You don't have access to this document",
      });
    }

    const result = await db
      .update(documents)
      .set({
        title,
        content,
        updatedAt: new Date(),
      })
      .where(eq(documents.id, documentId))
      .returning();

    res.json(result[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Database error",
    });
  }
});

// ADD USER TO DOCUMENT
router.post("/:id/users", authenticateToken, async (req, res) => {
  const documentId = Number(req.params.id);
  const currentUserId = getUserId(req);
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      error: "userId is required",
    });
  }

  try {
    const access = await db
      .select()
      .from(documentUsers)
      .where(
        and(
          eq(documentUsers.documentId, documentId),
          eq(documentUsers.userId, currentUserId),
        ),
      )
      .limit(1);

    if (access.length === 0) {
      return res.status(403).json({
        error: "You don't have access to this document",
      });
    }

    await db.insert(documentUsers).values({
      documentId,
      userId,
    });

    res.status(201).json({
      message: "User added to document",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Database error",
    });
  }
});

// DELETE DOCUMENT
router.delete("/:id", authenticateToken, async (req, res) => {
  const documentId = Number(req.params.id);
  const userId = getUserId(req);

  try {
    const access = await db
      .select()
      .from(documentUsers)
      .where(
        and(
          eq(documentUsers.documentId, documentId),
          eq(documentUsers.userId, userId),
        ),
      )
      .limit(1);

    if (access.length === 0) {
      return res.status(403).json({
        error: "You don't have access to this document",
      });
    }

    await db
      .delete(documents)
      .where(eq(documents.id, documentId));

    res.status(200).json({
      message: "Document deleted",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Database error",
    });
  }
});

export default router;