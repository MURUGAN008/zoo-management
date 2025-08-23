import type { Request, Response } from "express";
import { InviteAdminSchema } from "../schema/schmea";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function sendInvitation(req: Request, res: Response) {
  const { success, data } = InviteAdminSchema.safeParse(req.body);

  if (!success) {
    res.status(400).json({ error: "Invalid inputs" });
    return;
  }

  try {
    // Check if the current user is ADMIN - only ADMINs can create STAFF accounts
    if (data.role === "STAFF" && req.user.role !== "ADMIN") {
      res.status(403).json({ 
        error: "Only admins can create staff accounts" 
      });
      return;
    }

    // STAFF users cannot create any accounts (admin or staff)
    if (req.user.role === "STAFF") {
      res.status(403).json({ 
        error: "Staff members cannot create accounts. Only admins can send invitations." 
      });
      return;
    }
    // Check if user already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: data.email },
    });

    if (existingAdmin) {
      res.status(400).json({ error: "Admin with this email already exists" });
      return;
    }

    // Check if there's already a pending invitation for this email
    const existingInvitation = await prisma.invitation.findUnique({
      where: { email: data.email },
    });

    if (existingInvitation && existingInvitation.status === "PENDING") {
      res.status(400).json({ error: "Invitation already sent to this email" });
      return;
    }

    // Delete any existing expired or accepted invitations for this email
    if (existingInvitation) {
      await prisma.invitation.delete({
        where: { id: existingInvitation.id },
      });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    
    // Set expiration to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        email: data.email,
        token: token,
        invitedBy: req.user.id, // From auth middleware
        role: data.role, // Role for the invited user
        expiresAt: expiresAt,
        status: "PENDING",
      },
      include: {
        inviter: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Invitation sent successfully",
      invitation: {
        id: invitation.id,
        email: invitation.email,
        token: invitation.token,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
        status: invitation.status,
        invitedBy: invitation.inviter,
      },
    });
  } catch (error) {
    console.error("Error sending invitation:", error);
    res.status(500).json({ error: "Failed to send invitation" });
  }
}

export async function getInvitations(req: Request, res: Response) {
  try {
    // STAFF users cannot view invitations - only ADMINs can
    if (req.user.role === "STAFF") {
      res.status(403).json({ 
        error: "Staff members cannot view invitations. Only admins have access to invitation management." 
      });
      return;
    }
    const invitations = await prisma.invitation.findMany({
      where: { invitedBy: req.user.id },
      include: {
        inviter: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(invitations);
  } catch (error) {
    console.error("Error fetching invitations:", error);
    res.status(500).json({ error: "Failed to fetch invitations" });
  }
}

export async function validateInvitation(req: Request, res: Response) {
  const { token } = req.params;

  if (!token) {
    res.status(400).json({ error: "Token is required" });
    return;
  }

  try {
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: {
        inviter: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!invitation) {
      res.status(404).json({ error: "Invalid invitation token" });
      return;
    }

    if (invitation.status !== "PENDING") {
      res.status(400).json({ error: "Invitation is no longer valid" });
      return;
    }

    if (invitation.expiresAt < new Date()) {
      // Update status to expired
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: "EXPIRED" },
      });
      res.status(400).json({ error: "Invitation has expired" });
      return;
    }

    res.status(200).json({
      message: "Invitation is valid",
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
        invitedBy: invitation.inviter,
      },
    });
  } catch (error) {
    console.error("Error validating invitation:", error);
    res.status(500).json({ error: "Failed to validate invitation" });
  }
}
