import { z } from "zod";

export const createTicketSchema = z.object({
    name: z.string().min(1),
    dateOfVisit: z.date(),
    description: z.string().min(1),
    passType: z.enum(["ONE_TIME", "MONTHLY", "YEARLY"]),
    passStatus: z.enum(["NORMAL", "VIP"]),
    userType: z.enum(["INDIVIDUAL", "GROUP"]),
});

export const AnimalSchema = z.object({
    species: z.string().min(1),
    gender: z.enum(["MALE", "FEMALE"]),
    isChild: z.boolean(),
    age: z.number().min(0),
    weight: z.number().min(0),
});

export const InviteAdminSchema = z.object({
    email: z.email(),
    role: z.enum(["ADMIN", "STAFF"]).optional().default("ADMIN"),
});

export const RegisterWithInvitationSchema = z.object({
    fullName: z.string().min(1),
    email: z.email(),
    password: z.string().min(6),
    token: z.string().min(1),
});

export const LoginSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});

export const UpdateAdminSchema = z.object({
    fullName: z.string().min(1).optional(),
    email: z.email().optional(),
    password: z.string().min(6).optional(),
}).refine((data) => {
    return data.fullName || data.email || data.password;
}, {
    message: "At least one field (fullName, email, password) must be provided",
});
