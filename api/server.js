const express = require("express");
const { createClient } = require("./db");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;

app.use(express.json());

const client = createClient();

client.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch(err => console.error("Database connection error:", err));


// GET all todos
app.get("/todos", async (req, res) => {
    try {
        const result = await client.query(
            "SELECT * FROM todos ORDER BY id"
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});


// POST a new todo
app.post("/todos", async (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    try {
        const result = await client.query(
            "INSERT INTO todos (title) VALUES ($1) RETURNING *",
            [title]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

app.post("/register", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "Email and password are required"
        });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 12);

        const result = await client.query(
            `
            INSERT INTO users (email, password_hash)
            VALUES ($1, $2)
            RETURNING id, email
            `,
            [email, passwordHash]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err);

        if (err.code === "23505") {
            return res.status(409).json({
                error: "User already exists"
            });
        }

        res.status(500).json({
            error: "Database error"
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});