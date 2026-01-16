import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const weights = pgTable("weights", {
  id: serial("id").primaryKey(),
  date: text("date").notNull().unique(),
  weight: real("weight").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWeightSchema = createInsertSchema(weights).pick({
  date: true,
  weight: true,
});

export const updateWeightSchema = z.object({
  date: z.string().optional(),
  weight: z.number().positive().max(500).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Weight = typeof weights.$inferSelect;
export type InsertWeight = z.infer<typeof insertWeightSchema>;
