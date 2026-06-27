import { eq, desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { posts } from "../db/schema/post.schema.js";
import { comments } from "../db/schema/comment.schema.js";
import { users } from "../db/schema/user.schema.js";
import { InsertPost } from "../db/schema/post.schema.js";

export const createPost = async (author_id: number, data: InsertPost) => {
  const [newPost] = await db
    .insert(posts)
    .values({ author_id, title: data.title, content: data.content })
    .returning();
  return newPost;
};

// THE INNER JOIN: Get all posts, but attach the author's name.
// Every post MUST have an author, so an Inner Join is perfect.

export const findAllPostsWithAuthors = async () => {
  const data = await db
    .select({
      id: posts.id,
      title: posts.title,
      createdAt: posts.created_at,
      authorName: users.name,
    })
    .from(posts)
    .innerJoin(users, eq(posts.author_id, users.id))
    .orderBy(desc(posts.created_at));

  return data;
};

// THE LEFT JOIN: Get a single post, its author, and ALL comments.
// A post might have 0 comments. If we used an Inner Join, a post with 0 comments 
// would return "Not Found". A Left Join guarantees the post always returns!

export const findPostByIdWithComments = async (postId: number) => {
  const rows = await db
    .select({
      post: posts,
      author: { id: users.id, name: users.name },
      comment: comments,
    })
    .from(posts)
    .innerJoin(users, eq(posts.author_id, users.id))
    .leftJoin(comments, eq(posts.id, comments.postId))
    .where(eq(posts.id, postId));

  if (rows.length === 0) return null;

  const result = {
    id: rows[0].post.id,
    title: rows[0].post.title,
    content: rows[0].post.content,
    createdAt: rows[0].post.created_at,
    author: rows[0].author,

    comments: rows.map((row) => row.comment).filter((c) => c !== null),
  };

  return result;
};
