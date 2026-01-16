import type { Express, Request, Response } from "express";
import { createServer, type Server } from "node:http";
import session from "express-session";
import { storage } from "./storage";
import { registerUserSchema, loginUserSchema, updateWeightSchema, updateUserSchema } from "@shared/schema";
import { hashPassword, verifyPassword, requireAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "peso-tracker-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
      },
    })
  );

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const parsed = registerUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Invalid data",
          errors: parsed.error.flatten().fieldErrors,
        });
      }

      const { username, password, goalWeight } = parsed.data;

      const existing = await storage.getUserByUsername(username);
      if (existing) {
        return res.status(409).json({ message: "Username already exists" });
      }

      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        goalWeight: goalWeight || null,
      });

      req.session.userId = user.id;

      res.status(201).json({
        id: user.id,
        username: user.username,
        goalWeight: user.goalWeight,
      });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const parsed = loginUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Invalid data",
          errors: parsed.error.flatten().fieldErrors,
        });
      }

      const { username, password } = parsed.data;

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const validPassword = await verifyPassword(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      req.session.userId = user.id;

      res.json({
        id: user.id,
        username: user.username,
        goalWeight: user.goalWeight,
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      username: user.username,
      goalWeight: user.goalWeight,
    });
  });

  app.put("/api/auth/me", requireAuth, async (req: Request, res: Response) => {
    try {
      const parsed = updateUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Invalid data",
          errors: parsed.error.flatten().fieldErrors,
        });
      }

      const updated = await storage.updateUser(req.user!.id, parsed.data);
      res.json({
        id: updated!.id,
        username: updated!.username,
        goalWeight: updated!.goalWeight,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.get("/api/weights", requireAuth, async (req: Request, res: Response) => {
    try {
      const weights = await storage.getAllWeights(req.user!.id);
      res.json(weights);
    } catch (error) {
      console.error("Error fetching weights:", error);
      res.status(500).json({ message: "Failed to fetch weights" });
    }
  });

  app.post("/api/weights", requireAuth, async (req: Request, res: Response) => {
    try {
      const { date, time, weight } = req.body;

      if (!date || !time || weight === undefined) {
        return res.status(400).json({ message: "Date, time, and weight are required" });
      }

      if (typeof weight !== "number" || weight <= 0 || weight >= 500) {
        return res.status(400).json({ message: "Weight must be between 0 and 500 kg" });
      }

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        return res.status(400).json({ message: "Date must be in YYYY-MM-DD format" });
      }

      const timeRegex = /^\d{2}:\d{2}$/;
      if (!timeRegex.test(time)) {
        return res.status(400).json({ message: "Time must be in HH:MM format" });
      }

      const newWeight = await storage.createWeight({
        userId: req.user!.id,
        date,
        time,
        weight,
      });
      res.status(201).json(newWeight);
    } catch (error) {
      console.error("Error creating weight:", error);
      res.status(500).json({ message: "Failed to create weight record" });
    }
  });

  app.put("/api/weights/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const existing = await storage.getWeight(id);
      if (!existing) {
        return res.status(404).json({ message: "Weight record not found" });
      }

      if (existing.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const parsed = updateWeightSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Invalid data",
          errors: parsed.error.flatten().fieldErrors,
        });
      }

      const { date, time, weight } = parsed.data;

      if (weight !== undefined && (weight <= 0 || weight >= 500)) {
        return res.status(400).json({ message: "Weight must be between 0 and 500 kg" });
      }

      if (date !== undefined) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
          return res.status(400).json({ message: "Date must be in YYYY-MM-DD format" });
        }
      }

      if (time !== undefined) {
        const timeRegex = /^\d{2}:\d{2}$/;
        if (!timeRegex.test(time)) {
          return res.status(400).json({ message: "Time must be in HH:MM format" });
        }
      }

      const updated = await storage.updateWeight(id, { date, time, weight });
      res.json(updated);
    } catch (error) {
      console.error("Error updating weight:", error);
      res.status(500).json({ message: "Failed to update weight record" });
    }
  });

  app.delete("/api/weights/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const existing = await storage.getWeight(id);
      if (!existing) {
        return res.status(404).json({ message: "Weight record not found" });
      }

      if (existing.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
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
