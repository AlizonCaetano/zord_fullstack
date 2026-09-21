import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function autenticar(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Token não informado" });
    return;
  }

  const token: string = authHeader.replace("Bearer ", "");

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    next();
  } catch {
    res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
