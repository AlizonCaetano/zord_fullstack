import { Request, Response } from "express";
import { PessoaService } from "../services/PessoaService";
import { PessoaRepository } from "../repositories/PessoaRepository";
import { criarPessoaSchema, atualizarPessoaSchema } from "./pessoa.validation";
import { NomeInvalidoError } from "../errors/NomeInvalidoError";
import { CpfInvalidoError } from "../errors/CpfInvalidoError";
import { CpfDuplicadoError } from "../errors/CpfDuplicadoError";
import { PessoaNaoEncontradaError } from "../errors/PessoaNaoEncontradaError";
import { ZodError } from "zod";

const pessoaService = new PessoaService(new PessoaRepository());

export class PessoaController {
  async criar(req: Request, res: Response): Promise<void> {
    try {
      const dados = criarPessoaSchema.parse(req.body);
      const pessoa = await pessoaService.criarPessoa(dados.nome, dados.cpf);
      res.status(201).json(pessoa);
    } catch (err) {
      if (err instanceof ZodError) {
        res
          .status(400)
          .json({ message: "Dados inválidos", issues: err.issues });
        return;
      }
      if (err instanceof NomeInvalidoError || err instanceof CpfInvalidoError) {
        res.status(422).json({ message: (err as Error).message });
        return;
      }
      if (err instanceof CpfDuplicadoError) {
        res.status(409).json({ message: (err as Error).message });
        return;
      }
      res.status(500).json({ message: "Erro interno" });
    }
  }

  async listar(req: Request, res: Response): Promise<void> {
    try {
      const nome = req.query.nome as string | undefined;
      const pessoas = nome
        ? await pessoaService.buscarPorNome(nome)
        : await pessoaService.listarTodas();
      res.status(200).json(pessoas);
    } catch (err) {
      res.status(500).json({ message: "Erro interno" });
    }
  }

  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const dados = atualizarPessoaSchema.parse(req.body);
      const pessoa = await pessoaService.atualizarPessoa(
        id,
        dados.nome,
        dados.cpf,
      );
      res.status(200).json(pessoa);
    } catch (err) {
      if (err instanceof PessoaNaoEncontradaError) {
        res.status(404).json({ message: (err as Error).message });
        return;
      }
      if (err instanceof NomeInvalidoError || err instanceof CpfInvalidoError) {
        res.status(422).json({ message: (err as Error).message });
        return;
      }
      if (err instanceof CpfDuplicadoError) {
        res.status(409).json({ message: (err as Error).message });
        return;
      }
      res.status(500).json({ message: "Erro interno" });
    }
  }

  async deletar(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      await pessoaService.deletarPessoa(id);
      res.status(204).send();
    } catch (err) {
      if (err instanceof PessoaNaoEncontradaError) {
        res.status(404).json({ message: (err as Error).message });
        return;
      }
      res.status(500).json({ message: "Erro interno" });
    }
  }
}
