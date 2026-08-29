const express = require("express");
const db = require("../db");
const { authenticateToken } = require("../utils");

const router = express.Router();


// GET all todos
router.get("/", authenticateToken, async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM todos ORDER BY id"
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Database error"
        });
    }
});


// POST a new todo
router.post("/", authenticateToken, async (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    try {
        const result = await db.query(
            "INSERT INTO todos (title) VALUES ($1) RETURNING *",
            [title]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Database error"
        });
    }
});

module.exports = router;