import { Request, Response, NextFunction } from "express";
import * as postService from "../services/postService.js";
import { insertPostSchema } from "../db/schema/post.schema.js";

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authorId = parseInt(req.user!.id, 10);
    const validatedData = insertPostSchema.parse(req.body);

    const newPost = await postService.createPost(authorId, validatedData);

    res.status(201).json({
      success: true,
      message: "Post published successfully",
      data: newPost,
    });
  } catch (error) {
    next(error);
  }
};

export const getFeed = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const posts = await postService.getFeed();

    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

export const getSinglePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const postId = parseInt(req.params.id as string, 10);
    if (isNaN(postId)) throw new Error("Invalid post ID format");

    const post = await postService.getPostDetails(postId);

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};
