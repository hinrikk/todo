const { createClient } = require("./db");

const client = createClient();

// Initializes the database
// called from db-init.yaml  
async function init() {
    try {
        await client.connect();
        console.log("Connected to PostgreSQL");

        // Users --------------------
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL
            );
        `);

        console.log("Users table initialized");

        // Todos --------------------
        await client.query(`
            CREATE TABLE IF NOT EXISTS todos (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                completed BOOLEAN DEFAULT FALSE
            );
        `);

        console.log("Todos table initialized");

    } catch (err) {
        console.error("Database initialization failed:", err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

init();