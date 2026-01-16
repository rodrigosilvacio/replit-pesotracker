import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  goalWeight: real("goal_weight"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const weights = pgTable("weights", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: text("date").notNull(),
  time: text("time").notNull(),
  weight: real("weight").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  goalWeight: true,
});

export const registerUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  goalWeight: z.number().positive().max(500).optional(),
});

export const loginUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const insertWeightSchema = createInsertSchema(weights).pick({
  userId: true,
  date: true,
  time: true,
  weight: true,
});

export const updateWeightSchema = z.object({
  date: z.string().optional(),
  time: z.string().optional(),
  weight: z.number().positive().max(500).optional(),
});

export const updateUserSchema = z.object({
  goalWeight: z.number().positive().max(500).optional().nullable(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Weight = typeof weights.$inferSelect;
export type InsertWeight = z.infer<typeof insertWeightSchema>;
