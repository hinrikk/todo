const express = require("express");
const db = require("../db");
const { authenticateToken } = require("../utils");

const router = express.Router();

// POST document as logged-in user
router.post("/", authenticateToken, async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.userId;

    if (!title) {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    try {
        // Create document
        const result = await db.query(
            `
            INSERT INTO documents (title, content)
            VALUES ($1, $2)
            RETURNING *
            `,
            [title, content || ""]
        );

        const document = result.rows[0];

        // Add creator to document
        await db.query(
            `
            INSERT INTO document_users (document_id, user_id)
            VALUES ($1, $2)
            `,
            [document.id, userId]
        );

        res.status(201).json(document);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Database error"
        });
    }
});

// GET all documents for logged-in user
router.get("/", authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        const result = await db.query(
            `
            SELECT d.*
            FROM documents d
            JOIN document_users du
                ON d.id = du.document_id
            WHERE du.user_id = $1
            ORDER BY d.id
            `,
            [userId]
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Database error"
        });
    }
});



// POST document_users 
// Add other user to document of logged in user 
// Add only if logged in user is member of the document 
// id = document id, users belonging to this document 
router.post("/:id/users", authenticateToken, async (req, res) => {
    const documentId = req.params.id;
    const currentUserId = req.user.userId;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({
            error: "userId is required"
        });
    }

    try {
        // Check that current user belongs to the document
        const access = await db.query(
            `
            SELECT *
            FROM document_users
            WHERE document_id = $1 AND user_id = $2
            `,
            [documentId, currentUserId]
        );

        if (access.rows.length === 0) {
            return res.status(403).json({
                error: "You don't have access to this document"
            });
        }

        // Add the new user
        await db.query(
            `
            INSERT INTO document_users (document_id, user_id)
            VALUES ($1, $2)
            `,
            [documentId, userId]
        );

        res.status(201).json({
            message: "User added to document"
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Database error"
        });
    }
});

module.exports = router;