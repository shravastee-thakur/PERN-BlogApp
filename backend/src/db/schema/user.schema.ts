import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  refreshToken: text("refresh_token").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const userSchema = createInsertSchema(users, {
  name: (schema) =>
    schema
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be at most 50 characters"),

  email: (schema) => schema.email("Invalid email address"),

  password: (schema) =>
    schema
      .min(6, "Password must be at least 6 characters")
      .max(14, "Password must be at most 14 characters"),
});

export const registerUserSchema = userSchema.pick({
  name: true,
  email: true,
  password: true,
});

export const loginUserSchema = userSchema.pick({
  email: true,
  password: true,
});

export type RegisterInput = z.infer<typeof registerUserSchema>;
export type LoginInput = z.infer<typeof loginUserSchema>;
