import express from "express";
import authRoutes from "./routes/auth";
import documentRoutes from "./routes/documents";
import usersRoutes from "./routes/users";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/documents", documentRoutes);
app.use("/users", usersRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});