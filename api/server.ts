import express from "express";
import authRoutes from "./routes/auth";
import documentRoutes from "./routes/documents";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/documents", documentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});