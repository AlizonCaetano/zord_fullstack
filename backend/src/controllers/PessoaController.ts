import { Request, Response } from "express";
import { ZodError } from "zod";
import { PessoaService } from "../services/PessoaService";
import { PessoaRepository } from "../repositories/PessoaRepository";
import { criarPessoaSchema, atualizarPessoaSchema } from "./pessoa.validation";
import { parseId } from "../utils/parseId";
import { NomeInvalidoError } from "../errors/NomeInvalidoError";
import { CpfInvalidoError } from "../errors/CpfInvalidoError";
import { CpfDuplicadoError } from "../errors/CpfDuplicadoError";
import { PessoaNaoEncontradaError } from "../errors/PessoaNaoEncontradaError";
import { ContatoInvalidoError } from "../errors/ContatoInvalidoError";
import { LimiteContatoExcedidoError } from "../errors/LimiteContatoExcedidoError";

const pessoaService: PessoaService = new PessoaService(new PessoaRepository());

export class PessoaController {
  async criar(req: Request, res: Response): Promise<void> {
    try {
      const dados = criarPessoaSchema.parse(req.body);
      const pessoa = await pessoaService.criarPessoa(
        dados.nome,
        dados.cpf,
        dados.contatos,
      );
      res.status(201).json(pessoa);
    } catch (err) {
      if (err instanceof ZodError) {
        res
          .status(400)
          .json({ message: "Dados inválidos", issues: err.issues });
        return;
      }
      if (
        err instanceof NomeInvalidoError ||
        err instanceof CpfInvalidoError ||
        err instanceof ContatoInvalidoError ||
        err instanceof LimiteContatoExcedidoError
      ) {
        res.status(422).json({ message: err.message });
        return;
      }
      if (err instanceof CpfDuplicadoError) {
        res.status(409).json({ message: err.message });
        return;
      }
      res.status(500).json({ message: "Erro interno" });
    }
  }

  async listar(req: Request, res: Response): Promise<void> {
    try {
      const nome: string | undefined =
        typeof req.query.nome === "string" ? req.query.nome : undefined;
      const pessoas = nome
        ? await pessoaService.buscarPorNome(nome)
        : await pessoaService.listarTodas();
      res.status(200).json(pessoas);
    } catch {
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
      const dados = atualizarPessoaSchema.parse(req.body);
      const pessoa = await pessoaService.atualizarPessoa(
        id,
        dados.nome,
        dados.cpf,
      );
      res.status(200).json(pessoa);
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
      if (err instanceof NomeInvalidoError || err instanceof CpfInvalidoError) {
        res.status(422).json({ message: err.message });
        return;
      }
      if (err instanceof CpfDuplicadoError) {
        res.status(409).json({ message: err.message });
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
      await pessoaService.deletarPessoa(id);
      res.status(204).send();
    } catch (err) {
      if (err instanceof PessoaNaoEncontradaError) {
        res.status(404).json({ message: err.message });
        return;
      }
      res.status(500).json({ message: "Erro interno" });
    }
  }
}
