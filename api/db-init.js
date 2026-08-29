const db = require("./db");

async function init() {
    try {
        console.log("Connected to PostgreSQL");

        // Users --------------------
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL
            );
        `);
        console.log("users table initialized");

        // Document Users --------------------
        await db.query(`
            CREATE TABLE IF NOT EXISTS documents (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT DEFAULT '',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("documents table initialized");

        // Document Users --------------------
        // stores relation between users and documents
        await db.query(`
            CREATE TABLE IF NOT EXISTS document_users (
                document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                PRIMARY KEY (document_id, user_id)
            );
        `);
        console.log("document_user table initialized");

        // Todos --------------------
        await db.query(`
            CREATE TABLE IF NOT EXISTS todos (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                completed BOOLEAN DEFAULT FALSE
            );
        `);
        console.log("todos table initialized");

    } catch (err) {
        console.error("Database initialization failed:", err);
        process.exit(1);
    } finally {
        await db.end();
    }
}

init();