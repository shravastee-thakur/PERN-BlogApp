import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { posts } from "./post.schema";
import { users } from "./user.schema";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  text: varchar("text", { length: 2000 }).notNull(),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
