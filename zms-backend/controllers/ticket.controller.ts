import { Prisma, PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import { createTicketSchema } from "../schema/schmea";

const prisma = new PrismaClient();

export async function createTicket(req: Request, res: Response) {
  const { success } = createTicketSchema.safeParse(req.body);

  if (!success) {
    res.status(400).json({ error: "Invlid inputs" });
    return;
  }

  const ticket = await prisma.ticket.create({
    data: {
      name: req.body.name,
      dateOfVisit: req.body.dateOfVisit,
      description: req.body.description,
      passType: req.body.passType,
      passStatus: req.body.passStatus,
      userType: req.body.userType,
    },
  });

  if (!ticket) {
    res.status(400).json({ error: "Failed to create ticket" });
    return;
  }
  res.status(201).json(ticket);
}



export async function getTicketStats(req: Request, res: Response) {
  try {
    // Only admins can view ticket statistics
    if (req.user.role !== "ADMIN") {
      res.status(403).json({ 
        error: "Access denied. Only administrators can view ticket statistics." 
      });
      return;
    }

    // Get ticket statistics
    const totalTickets = await prisma.ticket.count();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayTickets = await prisma.ticket.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Get tickets by pass type
    const ticketsByType = await prisma.ticket.groupBy({
      by: ['passType'],
      _count: {
        passType: true,
      },
    });

    // Get tickets by status
    const ticketsByStatus = await prisma.ticket.groupBy({
      by: ['passStatus'],
      _count: {
        passStatus: true,
      },
    });

    const stats = {
      totalTickets,
      todayTickets,
      ticketsByType: ticketsByType.map(item => ({
        type: item.passType,
        count: item._count.passType,
      })),
      ticketsByStatus: ticketsByStatus.map(item => ({
        status: item.passStatus,
        count: item._count.passStatus,
      })),
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching ticket statistics:", error);
    res.status(500).json({ error: "Failed to fetch ticket statistics" });
  }
}

export async function getTicketById(req: Request, res: Response) {
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: req.params.id,
    },
  });
  if (!ticket) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }
  res.status(200).json(ticket);
}
