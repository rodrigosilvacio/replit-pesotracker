import { Request, Response, NextFunction } from "express";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User } from "@shared/schema";

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, hash] = storedHash.split(":");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  const storedKey = Buffer.from(hash, "hex");
  return timingSafeEqual(derivedKey, storedKey);
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const user = await storage.getUser(req.session.userId);
  if (!user) {
    req.session.destroy(() => {});
    return res.status(401).json({ message: "User not found" });
  }

  req.user = user;
  next();
}
