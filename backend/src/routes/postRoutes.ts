import express from "express";
import * as postController from "../controllers/postController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticate, postController.createPost);
router.get("/", postController.getFeed);
router.get("/:id", postController.getSinglePost);

export default router;
