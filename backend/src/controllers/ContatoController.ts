import { Request, Response } from "express";
import { ZodError } from "zod";
import { ContatoService } from "../services/ContatoService";
import { ContatoRepository } from "../repositories/ContatoRepository";
import { PessoaRepository } from "../repositories/PessoaRepository";
import {
  criarContatoSchema,
  atualizarContatoSchema,
} from "./contato.validation";
import { parseId } from "../utils/parseId";
import { ContatoNaoEncontradoError } from "../errors/ContatoNaoEncontradoError";
import { ContatoInvalidoError } from "../errors/ContatoInvalidoError";
import { PessoaNaoEncontradaError } from "../errors/PessoaNaoEncontradaError";
import { LimiteContatoExcedidoError } from "../errors/LimiteContatoExcedidoError";

const contatoService: ContatoService = new ContatoService(
  new ContatoRepository(),
  new PessoaRepository(),
);

export class ContatoController {
  async listarTodos(_req: Request, res: Response): Promise<void> {
    try {
      const contatos = await contatoService.listarTodos();
      res.status(200).json(contatos);
    } catch {
      res.status(500).json({ message: "Erro interno" });
    }
  }

  async listarPorPessoa(req: Request, res: Response): Promise<void> {
    const idPessoa: number | null = parseId(req.params.idPessoa);
    if (idPessoa === null) {
      res.status(400).json({ message: "Id inválido" });
      return;
    }

    try {
      const contatos = await contatoService.listarPorPessoa(idPessoa);
      res.status(200).json(contatos);
    } catch {
      res.status(500).json({ message: "Erro interno" });
    }
  }

  async criar(req: Request, res: Response): Promise<void> {
    try {
      const dados = criarContatoSchema.parse(req.body);
      const contato = await contatoService.criarContato(
        dados.idPessoa,
        dados.tipo,
        dados.descricao,
      );
      res.status(201).json(contato);
    } catch (err) {
      if (err instanceof ZodError) {
        res
          .status(400)
          .json({ message: "Dados inválidos", issues: err.issues });
        return;
      }
      if (err instanceof PessoaNaoEncontradaError) {
        res.status(404).json({ message: err.message });
        return;
      }
      if (
        err instanceof ContatoInvalidoError ||
        err instanceof LimiteContatoExcedidoError
      ) {
        res.status(422).json({ message: err.message });
        return;
      }
      res.status(500).json({ message: "Erro interno" });
    }
  }

  async atualizar(req: Request, res: Response): Promise<void> {
    const id: number | null = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ message: "Id inválido" });
      return;
    }

    try {
      const dados = atualizarContatoSchema.parse(req.body);
      const contato = await contatoService.atualizarContato(
        id,
        dados.descricao,
      );
      res.status(200).json(contato);
    } catch (err) {
      if (err instanceof ZodError) {
        res
          .status(400)
          .json({ message: "Dados inválidos", issues: err.issues });
        return;
      }
      if (err instanceof ContatoNaoEncontradoError) {
        res.status(404).json({ message: err.message });
        return;
      }
      if (err instanceof ContatoInvalidoError) {
        res.status(422).json({ message: err.message });
        return;
      }
      res.status(500).json({ message: "Erro interno" });
    }
  }

  async deletar(req: Request, res: Response): Promise<void> {
    const id: number | null = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ message: "Id inválido" });
      return;
    }

    try {
      await contatoService.deletarContato(id);
      res.status(204).send();
    } catch (err) {
      if (err instanceof ContatoNaoEncontradoError) {
        res.status(404).json({ message: err.message });
        return;
      }
      res.status(500).json({ message: "Erro interno" });
    }
  }
}
