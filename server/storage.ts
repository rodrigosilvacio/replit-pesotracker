import { users, weights, type User, type InsertUser, type Weight, type InsertWeight } from "@shared/schema";
import { db } from "./db";
import { eq, asc, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<Pick<User, "goalWeight">>): Promise<User | undefined>;
  
  getAllWeights(userId: string): Promise<Weight[]>;
  getWeight(id: number): Promise<Weight | undefined>;
  getWeightByDateTime(userId: string, date: string, time: string): Promise<Weight | undefined>;
  createWeight(weight: InsertWeight): Promise<Weight>;
  updateWeight(id: number, data: Partial<Pick<InsertWeight, "date" | "time" | "weight">>): Promise<Weight | undefined>;
  deleteWeight(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<Pick<User, "goalWeight">>): Promise<User | undefined> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async getAllWeights(userId: string): Promise<Weight[]> {
    return await db.select().from(weights)
      .where(eq(weights.userId, userId))
      .orderBy(asc(weights.date), asc(weights.time));
  }

  async getWeight(id: number): Promise<Weight | undefined> {
    const [weight] = await db.select().from(weights).where(eq(weights.id, id));
    return weight || undefined;
  }

  async getWeightByDateTime(userId: string, date: string, time: string): Promise<Weight | undefined> {
    const [weight] = await db.select().from(weights).where(
      and(eq(weights.userId, userId), eq(weights.date, date), eq(weights.time, time))
    );
    return weight || undefined;
  }

  async createWeight(insertWeight: InsertWeight): Promise<Weight> {
    const [weight] = await db.insert(weights).values(insertWeight).returning();
    return weight;
  }

  async updateWeight(id: number, data: Partial<Pick<InsertWeight, "date" | "time" | "weight">>): Promise<Weight | undefined> {
    const [weight] = await db
      .update(weights)
      .set(data)
      .where(eq(weights.id, id))
      .returning();
    return weight || undefined;
  }

  async deleteWeight(id: number): Promise<boolean> {
    const result = await db.delete(weights).where(eq(weights.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
