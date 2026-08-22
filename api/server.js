const express = require("express");
const { createClient } = require("./db");

const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todos");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});