import express from "express";
import { createAnimal, getAnimals, getAnimalById, updateAnimal, deleteAnimal } from "../controllers/animal.controller";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";

const animalRoutes = express.Router();

// Staff can access all animal data - only admin operations require adminMiddleware
animalRoutes.post("/create", authMiddleware, createAnimal);
animalRoutes.get("/get", authMiddleware, getAnimals);
animalRoutes.get("/get/:id", authMiddleware, getAnimalById);
animalRoutes.put("/update/:id", authMiddleware, updateAnimal);
animalRoutes.delete("/delete/:id", authMiddleware, adminMiddleware, deleteAnimal); // Only admins can delete

export default animalRoutes;