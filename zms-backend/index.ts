import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import animalRoutes from "./routes/animalRoutes";
import ticketRoutes from "./routes/ticketRoutes";
import invitationRoutes from "./routes/invitationRoutes";

const PORT = process.env.PORT || 3000;

const app = express();
const prisma = new PrismaClient();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is healthy");
});

app.use("/api/auth", authRoutes);
app.use("/api/animal", animalRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/invitation", invitationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Prisma client connected to database");
});
