import express from "express";
import * as commentController from "../controllers/commentController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/:postId", authenticate, commentController.postComment);
router.delete("/:commentId", authenticate, commentController.deleteComment);

export default router;
