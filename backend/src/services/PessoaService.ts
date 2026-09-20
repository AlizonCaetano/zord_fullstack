import { PessoaRepository } from "../repositories/PessoaRepository";
import { Pessoa } from "../entities/Pessoa";
import { validarCpf } from "../utils/validarCpf";
import { validarNome } from "../utils/validarNome";
import { CpfInvalidoError } from "../errors/CpfInvalidoError";
import { CpfDuplicadoError } from "../errors/CpfDuplicadoError";
import { NomeInvalidoError } from "../errors/NomeInvalidoError";
import { PessoaNaoEncontradaError } from "../errors/PessoaNaoEncontradaError";

export class PessoaService {
  constructor(private repository: PessoaRepository) {}

  async criarPessoa(nome: string, cpf: string): Promise<Pessoa> {
    if (!validarNome(nome)) {
      throw new NomeInvalidoError();
    }
    if (!validarCpf(cpf)) {
      throw new CpfInvalidoError();
    }

    const existente = await this.repository.buscarPorCpf(cpf);
    if (existente) {
      throw new CpfDuplicadoError();
    }

    const pessoa = new Pessoa();
    pessoa.nome = nome;
    pessoa.cpf = cpf;

    return this.repository.criar(pessoa);
  }

  async atualizarPessoa(
    id: number,
    nome: string,
    cpf: string,
  ): Promise<Pessoa> {
    const pessoa = await this.repository.buscarPorId(id);
    if (!pessoa) {
      throw new PessoaNaoEncontradaError();
    }
    if (!validarNome(nome)) {
      throw new NomeInvalidoError();
    }
    if (!validarCpf(cpf)) {
      throw new CpfInvalidoError();
    }

    const outraPessoaComMesmoCpf = await this.repository.buscarPorCpf(cpf);
    if (outraPessoaComMesmoCpf && outraPessoaComMesmoCpf.id !== id) {
      throw new CpfDuplicadoError();
    }

    const atualizada = await this.repository.atualizar(id, { nome, cpf });
    return atualizada as Pessoa;
  }

  async deletarPessoa(id: number): Promise<void> {
    const pessoa = await this.repository.buscarPorId(id);
    if (!pessoa) {
      throw new PessoaNaoEncontradaError();
    }
    await this.repository.deletar(id);
  }

  async buscarPorNome(nome: string): Promise<Pessoa[]> {
    return this.repository.buscarPorNome(nome);
  }

  async listarTodas(): Promise<Pessoa[]> {
    return this.repository.listarTodas();
  }
}
