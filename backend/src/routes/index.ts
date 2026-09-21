import { Router } from "express";
import { pessoaRoutes } from "./pessoa.routes";
import { contatoRoutes } from "./contato.routes";

const router: Router = Router();

router.use("/pessoas", pessoaRoutes);
router.use("/contatos", contatoRoutes);

export { router };
