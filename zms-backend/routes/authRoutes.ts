import express from "express";
import { login, registerWithInvitation } from "../controllers/auth.controller";

const authRoutes = express.Router();

// Invitation-based registration
authRoutes.post("/register-with-invitation", registerWithInvitation);

authRoutes.post("/login", login);

export default authRoutes;