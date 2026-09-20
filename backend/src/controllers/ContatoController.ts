import { Request, Response } from "express";
import { ContatoService } from "../services/ContatoService";
import { ContatoRepository } from "../repositories/ContatoRepository";
import { PessoaRepository } from "../repositories/PessoaRepository";
import {
  criarContatoSchema,
  atualizarContatoSchema,
} from "./contato.validation";
import { PessoaNaoEncontradaError } from "../errors/PessoaNaoEncontradaError";
import { ContatoNaoEncontradoError } from "../errors/ContatoNaoEncontradoError";
import { LimiteContatoExcedidoError } from "../errors/LimiteContatoExcedidoError";

const contatoService = new ContatoService(
  new ContatoRepository(),
  new PessoaRepository(),
);

export class ContatoController {
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
      if (err instanceof PessoaNaoEncontradaError) {
        res.status(404).json({ message: (err as Error).message });
        return;
      }
      if (err instanceof LimiteContatoExcedidoError) {
        res.status(422).json({ message: (err as Error).message });
        return;
      }
      res.status(500).json({ message: "Erro interno" });
    }
  }

  async listarPorPessoa(req: Request, res: Response): Promise<void> {
    try {
      const idPessoa = Number(req.params.idPessoa);
      const contatos = await contatoService.listarPorPessoa(idPessoa);
      res.status(200).json(contatos);
    } catch (err) {
      res.status(500).json({ message: "Erro interno" });
    }
  }

  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const dados = atualizarContatoSchema.parse(req.body);
      const contato = await contatoService.atualizarContato(
        id,
        dados.descricao,
      );
      res.status(200).json(contato);
    } catch (err) {
      if (err instanceof ContatoNaoEncontradoError) {
        res.status(404).json({ message: (err as Error).message });
        return;
      }
      res.status(500).json({ message: "Erro interno" });
    }
  }

  async deletar(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      await contatoService.deletarContato(id);
      res.status(204).send();
    } catch (err) {
      if (err instanceof ContatoNaoEncontradoError) {
        res.status(404).json({ message: (err as Error).message });
        return;
      }
      res.status(500).json({ message: "Erro interno" });
    }
  }
}
