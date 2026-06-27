import { Request, Response, NextFunction } from "express";
import * as commentService from "../services/commentService.js";

export const postComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = parseInt(req.user!.id, 10);
    const postId = parseInt(req.params.postId as string, 10);
    const { text } = req.body;

    if (!text || text.trim() === "")
      throw new Error("Comment text is required");

    const comment = await commentService.addComment(postId, userId, text);

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = parseInt(req.user!.id, 10);
    const commentId = parseInt(req.params.commentId as string, 10);

    await commentService.removeComment(commentId, userId);

    res.json({ success: true, message: "Comment deleted" });
  } catch (error) {
    next(error);
  }
};
