import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    const { usuario, senha } = req.body;

    if (usuario !== process.env.AUTH_USER || senha !== process.env.AUTH_PASS) {
      res.status(401).json({ message: "Usuário ou senha inválidos" });
      return;
    }

    const token: string = jwt.sign(
      { usuario },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    res.status(200).json({ token });
  }
}
