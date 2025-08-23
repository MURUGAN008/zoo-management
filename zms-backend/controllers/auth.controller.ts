import type { Request, Response } from "express"
import { RegisterWithInvitationSchema, LoginSchema } from "../schema/schmea";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function login (req:Request, res:Response) {
    const { success, data } = LoginSchema.safeParse(req.body);

    if(!success){
        res.status(400).json({ error: "Invalid inputs" });
        return;
    }

    try {
        const admin = await prisma.admin.findUnique({
            where: {
                email: data.email,
            }
        });

        if(!admin){
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(data.password, admin.password);
        
        if(!isPasswordValid){
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        
        const token = jwt.sign(
            { id: admin.id, role: admin.role }, 
            process.env.JWT_SECRET as string, 
            { expiresIn: "24h" }
        );
        
        res.status(200).json({
            message: "Login successful",
            token: token,
            admin: {
                id: admin.id,
                fullName: admin.fullName,
                email: admin.email,
                role: admin.role,
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login failed" });
    }
}

export async function registerWithInvitation(req: Request, res: Response) {
    const { success, data } = RegisterWithInvitationSchema.safeParse(req.body);

    if (!success) {
        res.status(400).json({ error: "Invalid inputs" });
        return;
    }

    try {
        // Validate invitation token
        const invitation = await prisma.invitation.findUnique({
            where: { token: data.token },
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
            await prisma.invitation.update({
                where: { id: invitation.id },
                data: { status: "EXPIRED" },
            });
            res.status(400).json({ error: "Invitation has expired" });
            return;
        }

        if (invitation.email !== data.email) {
            res.status(400).json({ error: "Email does not match invitation" });
            return;
        }

        // Check if admin already exists
        const existingAdmin = await prisma.admin.findUnique({
            where: { email: data.email },
        });

        if (existingAdmin) {
            res.status(400).json({ error: "Admin with this email already exists" });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create admin and update invitation in a transaction
        const result = await prisma.$transaction(async (prisma) => {
            const admin = await prisma.admin.create({
                data: {
                    fullName: data.fullName,
                    email: data.email,
                    password: hashedPassword,
                    role: invitation.role, // Use role from invitation
                },
            });

            await prisma.invitation.update({
                where: { id: invitation.id },
                data: { status: "ACCEPTED" },
            });

            return admin;
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: result.id, role: result.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "24h" }
        );

        res.status(201).json({
            message: `${result.role} account created successfully`,
            token: token,
            user: {
                id: result.id,
                fullName: result.fullName,
                email: result.email,
                role: result.role,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Failed to create account" });
    }
}
