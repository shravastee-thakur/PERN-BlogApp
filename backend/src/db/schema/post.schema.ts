import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: varchar("content", { length: 10000 }).notNull(),
  author_id: integer("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const insertPostSchema = createInsertSchema(posts, {
  title: (schema) =>
    schema
      .min(3, "Title must be at least 3 characters")
      .max(255, "Title must be at most 255 characters"),
  content: (schema) =>
    schema
      .min(10, "Content must be at least 10 characters")
      .max(10000, "Content must be at most 10000 characters"),
}).omit({
  id: true,
  author_id: true,
  created_at: true,
  updated_at: true,
});

export type InsertPost = z.infer<typeof insertPostSchema>;

export const updatePostSchema = createUpdateSchema(posts).omit({
  id: true,
  author_id: true,
  created_at: true,
  updated_at: true,
});

export type UpdatePost = z.infer<typeof updatePostSchema>;
