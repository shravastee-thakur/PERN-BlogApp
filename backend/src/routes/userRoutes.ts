import express from "express";
import * as userController from "../controllers/userController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/refresh", userController.refreshToken);
router.post("/logout", authenticate, userController.logout);

export default router;
