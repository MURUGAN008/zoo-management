import express from "express";
import { sendInvitation, getInvitations, validateInvitation } from "../controllers/invitation.controller";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";

const invitationRoutes = express.Router();

// Send invitation (only admins can send invitations - enforced in controller)
invitationRoutes.post("/send", authMiddleware, sendInvitation);

// Get all invitations sent by the current user (enforced in controller)
invitationRoutes.get("/sent", authMiddleware, getInvitations);

// Validate invitation token (public endpoint)
invitationRoutes.get("/validate/:token", validateInvitation);

export default invitationRoutes;
