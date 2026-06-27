import * as commentRepo from "../repository/commentRepo.js";
import * as postRepo from "../repository/postRepo.js";
import { ApiError } from "../utils/apiError.js";

export const addComment = async (
  postId: number,
  userId: number,
  text: string,
) => {
  const post = await postRepo.findPostByIdWithComments(postId);
  if (!post) {
    throw new ApiError(404, "Cannot comment on a non-existent post");
  }

  return await commentRepo.createComment(postId, userId, text);
};

export const removeComment = async (commentId: number, userId: number) => {
  const deleted = await commentRepo.deleteComment(commentId, userId);
  if (!deleted) {
    throw new ApiError(404, "Comment not found or unauthorized");
  }
};
