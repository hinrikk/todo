const { Client } = require("pg");

const client = new Client({
    host: "postgres-service",
    port: 5432,
    user: "admin",
    password: "password",
    database: "tododb"
});


// Initializes the database
// called from db-init.yaml  
async function init() {
    try {
        await client.connect();
        console.log("Connected to PostgreSQL");

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