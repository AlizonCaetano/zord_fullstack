import { Router, Request, Response } from "express";
import { ContatoController } from "../controllers/ContatoController";

const router: Router = Router();
const contatoController: ContatoController = new ContatoController();

router.get("/pessoa/:idPessoa", (req: Request, res: Response): Promise<void> =>
  contatoController.listarPorPessoa(req, res),
);
router.post("/", (req: Request, res: Response): Promise<void> =>
  contatoController.criar(req, res),
);
router.put("/:id", (req: Request, res: Response): Promise<void> =>
  contatoController.atualizar(req, res),
);
router.delete("/:id", (req: Request, res: Response): Promise<void> =>
  contatoController.deletar(req, res),
);

export { router as contatoRoutes };
