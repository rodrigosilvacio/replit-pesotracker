import type { Express, Request, Response } from "express";
import { createServer, type Server } from "node:http";
import { storage } from "./storage";
import { insertWeightSchema, updateWeightSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/weights", async (_req: Request, res: Response) => {
    try {
      const weights = await storage.getAllWeights();
      res.json(weights);
    } catch (error) {
      console.error("Error fetching weights:", error);
      res.status(500).json({ message: "Failed to fetch weights" });
    }
  });

  app.post("/api/weights", async (req: Request, res: Response) => {
    try {
      const parsed = insertWeightSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          message: "Invalid data", 
          errors: parsed.error.flatten().fieldErrors 
        });
      }

      const { date, weight } = parsed.data;

      if (weight <= 0 || weight >= 500) {
        return res.status(400).json({ message: "Weight must be between 0 and 500 kg" });
      }

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        return res.status(400).json({ message: "Date must be in YYYY-MM-DD format" });
      }

      const existingWeight = await storage.getWeightByDate(date);
      if (existingWeight) {
        return res.status(409).json({ 
          message: "A weight record already exists for this date. Please edit the existing record instead.",
          existingId: existingWeight.id
        });
      }

      const newWeight = await storage.createWeight({ date, weight });
      res.status(201).json(newWeight);
    } catch (error) {
      console.error("Error creating weight:", error);
      res.status(500).json({ message: "Failed to create weight record" });
    }
  });

  app.put("/api/weights/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const existing = await storage.getWeight(id);
      if (!existing) {
        return res.status(404).json({ message: "Weight record not found" });
      }

      const parsed = updateWeightSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          message: "Invalid data", 
          errors: parsed.error.flatten().fieldErrors 
        });
      }

      const { date, weight } = parsed.data;

      if (weight !== undefined && (weight <= 0 || weight >= 500)) {
        return res.status(400).json({ message: "Weight must be between 0 and 500 kg" });
      }

      if (date !== undefined) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
          return res.status(400).json({ message: "Date must be in YYYY-MM-DD format" });
        }

        if (date !== existing.date) {
          const existingForDate = await storage.getWeightByDate(date);
          if (existingForDate) {
            return res.status(409).json({ 
              message: "A weight record already exists for this date" 
            });
          }
        }
      }

      const updated = await storage.updateWeight(id, { date, weight });
      res.json(updated);
    } catch (error) {
      console.error("Error updating weight:", error);
      res.status(500).json({ message: "Failed to update weight record" });
    }
  });

  app.delete("/api/weights/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const existing = await storage.getWeight(id);
      if (!existing) {
        return res.status(404).json({ message: "Weight record not found" });
      }

      await storage.deleteWeight(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting weight:", error);
      res.status(500).json({ message: "Failed to delete weight record" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
