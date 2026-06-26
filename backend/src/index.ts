import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorMiddleware";
import userRoutes from "./routes/userRoutes";

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
// http://localhost:5000/api/auth/register
// app.use("/api/blog", );
// http://localhost:5000/api/notes/

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port: http://localhost:${PORT}`);
});
