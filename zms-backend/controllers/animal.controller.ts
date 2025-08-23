import type { Request, Response } from "express";
import { AnimalSchema } from "../schema/schmea";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createAnimal(req: Request, res: Response) {
  try {
    // Both ADMIN and STAFF can create animals
    if (req.user.role !== "ADMIN" && req.user.role !== "STAFF") {
      res.status(403).json({ 
        error: "Access denied. Only administrators and staff can create animals." 
      });
      return;
    }

    const { success } = AnimalSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({ error: "Invalid inputs" });
      return;
    }

    const animal = await prisma.animal.create({
      data: {
        species: req.body.species,
        gender: req.body.gender,
        isChild: req.body.isChild,
        age: req.body.age,
        weight: req.body.weight,
      },
    });

    res.status(201).json(animal);
  } catch (error) {
    console.error("Error creating animal:", error);
    res.status(500).json({ error: "Failed to create animal" });
  }
}

export async function getAnimals(req: Request, res: Response) {
  try {
    // Both ADMIN and STAFF can view animals
    if (req.user.role !== "ADMIN" && req.user.role !== "STAFF") {
      res.status(403).json({ 
        error: "Access denied. Only administrators and staff can view animals." 
      });
      return;
    }

    const animals = await prisma.animal.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(animals);
  } catch (error) {
    console.error("Error fetching animals:", error);
    res.status(500).json({ error: "Failed to fetch animals" });
  }
}

export async function getAnimalById(req: Request, res: Response) {
  try {
    // Both ADMIN and STAFF can view animal details
    if (req.user.role !== "ADMIN" && req.user.role !== "STAFF") {
      res.status(403).json({ 
        error: "Access denied. Only administrators and staff can view animal details." 
      });
      return;
    }

    const animal = await prisma.animal.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!animal) {
      res.status(404).json({ error: "Animal not found" });
      return;
    }

    res.status(200).json(animal);
  } catch (error) {
    console.error("Error fetching animal:", error);
    res.status(500).json({ error: "Failed to fetch animal" });
  }
}

export async function updateAnimal(req: Request, res: Response) {
  try {
    // Both ADMIN and STAFF can update animals
    if (req.user.role !== "ADMIN" && req.user.role !== "STAFF") {
      res.status(403).json({ 
        error: "Access denied. Only administrators and staff can update animals." 
      });
      return;
    }

    const { success } = AnimalSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({ error: "Invalid inputs" });
      return;
    }

    const animal = await prisma.animal.update({
      where: {
        id: req.params.id,
      },
      data: {
        species: req.body.species,
        gender: req.body.gender,
        isChild: req.body.isChild,
        age: req.body.age,
        weight: req.body.weight,
      },
    });

    res.status(200).json(animal);
  } catch (error) {
    console.error("Error updating animal:", error);
    res.status(500).json({ error: "Failed to update animal" });
  }
}

export async function deleteAnimal(req: Request, res: Response) {
  try {
    // Only ADMIN can delete animals (staff cannot delete)
    if (req.user.role !== "ADMIN") {
      res.status(403).json({ 
        error: "Access denied. Only administrators can delete animals." 
      });
      return;
    }

    const animal = await prisma.animal.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      message: "Animal deleted successfully",
      animal: animal,
    });
  } catch (error) {
    console.error("Error deleting animal:", error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Animal not found" });
    } else {
      res.status(500).json({ error: "Failed to delete animal" });
    }
  }
}
