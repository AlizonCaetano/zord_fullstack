import { Router } from "express";
import { pessoaRoutes } from "./pessoa.routes";
import { contatoRoutes } from "./contato.routes";
import { authRoutes } from "./auth.routes";
import { autenticar } from "../middlewares/auth.middleware";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/pessoas", autenticar, pessoaRoutes);
router.use("/contatos", autenticar, contatoRoutes);

export { router };
