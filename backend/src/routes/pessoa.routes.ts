import { Router, Request, Response } from "express";
import { PessoaController } from "../controllers/PessoaController";

const router: Router = Router();
const pessoaController: PessoaController = new PessoaController();

router.get("/", (req: Request, res: Response): Promise<void> =>
  pessoaController.listar(req, res),
);
router.post("/", (req: Request, res: Response): Promise<void> =>
  pessoaController.criar(req, res),
);
router.put("/:id", (req: Request, res: Response): Promise<void> =>
  pessoaController.atualizar(req, res),
);
router.delete("/:id", (req: Request, res: Response): Promise<void> =>
  pessoaController.deletar(req, res),
);

export { router as pessoaRoutes };
