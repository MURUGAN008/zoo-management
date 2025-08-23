import express from "express";
import { createTicket, getTicketStats, getTicketById } from "../controllers/ticket.controller";
import { authMiddleware } from "../middleware/authMiddleware";
const ticketRoutes = express.Router();

// Public endpoints - anyone can book tickets and view specific tickets
ticketRoutes.post("/create", createTicket);
ticketRoutes.get("/get/:id", getTicketById);

// Admin-only endpoints
ticketRoutes.get("/stats", authMiddleware, getTicketStats); // Statistics endpoint for admins

export default ticketRoutes;