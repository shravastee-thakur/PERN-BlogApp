import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorMiddleware";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
app.use(cookieParser());

app.use("/api/auth", userRoutes);
// http://localhost:3000/api/auth/register

app.use("/api/post", postRoutes);
// http://localhost:3000/api/post/

app.use("/api/comment", commentRoutes);
// http://localhost:3000/api/comment/

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port: http://localhost:${PORT}`);
});
