import dotenv from "dotenv";
dotenv.config();
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { ApiError } from "../utils/apiError";

if (!process.env.DATABASE_URL) {
  throw new ApiError(
    401,
    "DATABASE_URL is not defined in the environment variables.",
  );
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);
