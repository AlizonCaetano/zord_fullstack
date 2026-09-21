import { PessoaRepository } from "../repositories/PessoaRepository";
import { Pessoa } from "../entities/Pessoa";
import { Contato } from "../entities/Contato";
import { validarCpf } from "../utils/validarCpf";
import { validarNome } from "../utils/validarNome";
import { validarDescricaoContato } from "../utils/validarContato";
import { CpfInvalidoError } from "../errors/CpfInvalidoError";
import { CpfDuplicadoError } from "../errors/CpfDuplicadoError";
import { NomeInvalidoError } from "../errors/NomeInvalidoError";
import { PessoaNaoEncontradaError } from "../errors/PessoaNaoEncontradaError";
import { ContatoInvalidoError } from "../errors/ContatoInvalidoError";
import { LimiteContatoExcedidoError } from "../errors/LimiteContatoExcedidoError";

export type NovoContato = {
  tipo: boolean;
  descricao: string;
};

const LIMITE_CONTATOS_POR_TIPO: number = 5;

export class PessoaService {
  constructor(private repository: PessoaRepository) {}

  async criarPessoa(
    nome: string,
    cpf: string,
    contatos: NovoContato[] = [],
  ): Promise<Pessoa> {
    if (!validarNome(nome)) {
      throw new NomeInvalidoError();
    }
    if (!validarCpf(cpf)) {
      throw new CpfInvalidoError();
    }
    this.validarContatos(contatos);

    const existente: Pessoa | null = await this.repository.buscarPorCpf(cpf);
    if (existente) {
      throw new CpfDuplicadoError();
    }

    const pessoa: Pessoa = new Pessoa();
    pessoa.nome = nome;
    pessoa.cpf = cpf;
    pessoa.contatos = contatos.map((entrada: NovoContato): Contato => {
      const contato: Contato = new Contato();
      contato.tipo = entrada.tipo;
      contato.descricao = entrada.descricao;
      return contato;
    });

    return this.repository.criar(pessoa);
  }

  async atualizarPessoa(
    id: number,
    nome: string,
    cpf: string,
  ): Promise<Pessoa> {
    const pessoa: Pessoa | null = await this.repository.buscarPorId(id);
    if (!pessoa) {
      throw new PessoaNaoEncontradaError();
    }
    if (!validarNome(nome)) {
      throw new NomeInvalidoError();
    }
    if (!validarCpf(cpf)) {
      throw new CpfInvalidoError();
    }

    const outraPessoaComMesmoCpf: Pessoa | null =
      await this.repository.buscarPorCpf(cpf);
    if (outraPessoaComMesmoCpf && outraPessoaComMesmoCpf.id !== id) {
      throw new CpfDuplicadoError();
    }

    const atualizada: Pessoa | null = await this.repository.atualizar(id, {
      nome,
      cpf,
    });
    if (!atualizada) {
      throw new PessoaNaoEncontradaError();
    }
    return atualizada;
  }

  async deletarPessoa(id: number): Promise<void> {
    const pessoa: Pessoa | null = await this.repository.buscarPorId(id);
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

  private validarContatos(contatos: NovoContato[]): void {
    for (const contato of contatos) {
      if (!validarDescricaoContato(contato.tipo, contato.descricao)) {
        throw new ContatoInvalidoError();
      }
    }

    const emails: number = contatos.filter(
      (c: NovoContato): boolean => c.tipo,
    ).length;
    const telefones: number = contatos.length - emails;
    if (
      emails > LIMITE_CONTATOS_POR_TIPO ||
      telefones > LIMITE_CONTATOS_POR_TIPO
    ) {
      throw new LimiteContatoExcedidoError();
    }
  }
}
