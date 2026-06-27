import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { comments } from "../db/schema/comment.schema.js";

export const createComment = async (
  postId: number,
  userId: number,
  text: string,
) => {
  const [newComment] = await db
    .insert(comments)
    .values({ postId, userId, text })
    .returning();
  return newComment;
};

export const deleteComment = async (commentId: number, userId: number) => {
  // Only allow users to delete their OWN comments
  const result = await db
    .delete(comments)
    .where(and(eq(comments.id, commentId), eq(comments.userId, userId)));

  return result.rowCount !== 0; // Return true if a row was actually deleted
};
