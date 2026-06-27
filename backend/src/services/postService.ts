import * as postRepo from "../repository/postRepo";
import { ApiError } from "../utils/apiError";
import { InsertPost } from "../db/schema/post.schema";

export const createPost = async (author_id: number, data: InsertPost) => {
  return await postRepo.createPost(author_id, data);
};

export const getFeed = async () => {
  return await postRepo.findAllPostsWithAuthors();
};

export const getPostDetails = async (postId: number) => {
  const post = await postRepo.findPostByIdWithComments(postId);
  if (!post) {
    throw new ApiError(404, "Blog post not found");
  }

  return post;
};
