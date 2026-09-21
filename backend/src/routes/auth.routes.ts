import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const router: Router = Router();
const authController: AuthController = new AuthController();

router.post("/login", (req, res) => authController.login(req, res));

export { router as authRoutes };
