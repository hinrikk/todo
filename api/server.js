const express = require("express");
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todos");
const documentRoutes = require("./routes/documents");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);
app.use("/documents", documentRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});