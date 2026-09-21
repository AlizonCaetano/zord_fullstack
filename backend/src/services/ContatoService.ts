import { ContatoRepository } from "../repositories/ContatoRepository";
import { PessoaRepository } from "../repositories/PessoaRepository";
import { Contato } from "../entities/Contato";
import { Pessoa } from "../entities/Pessoa";
import { validarDescricaoContato } from "../utils/validarContato";
import { ContatoNaoEncontradoError } from "../errors/ContatoNaoEncontradoError";
import { ContatoInvalidoError } from "../errors/ContatoInvalidoError";
import { PessoaNaoEncontradaError } from "../errors/PessoaNaoEncontradaError";
import { LimiteContatoExcedidoError } from "../errors/LimiteContatoExcedidoError";

const LIMITE_CONTATOS_POR_TIPO: number = 5;

export class ContatoService {
  constructor(
    private contatoRepository: ContatoRepository,
    private pessoaRepository: PessoaRepository,
  ) {}

  async criarContato(
    idPessoa: number,
    tipo: boolean,
    descricao: string,
  ): Promise<Contato> {
    if (!validarDescricaoContato(tipo, descricao)) {
      throw new ContatoInvalidoError();
    }

    const pessoa: Pessoa | null =
      await this.pessoaRepository.buscarPorId(idPessoa);
    if (!pessoa) {
      throw new PessoaNaoEncontradaError();
    }

    const quantidade: number =
      await this.contatoRepository.contarPorPessoaETipo(idPessoa, tipo);
    if (quantidade >= LIMITE_CONTATOS_POR_TIPO) {
      throw new LimiteContatoExcedidoError();
    }

    const contato: Contato = new Contato();
    contato.tipo = tipo;
    contato.descricao = descricao;
    contato.pessoa = pessoa;

    return this.contatoRepository.criar(contato);
  }

  async atualizarContato(id: number, descricao: string): Promise<Contato> {
    const contato: Contato | null =
      await this.contatoRepository.buscarPorId(id);
    if (!contato) {
      throw new ContatoNaoEncontradoError();
    }
    if (!validarDescricaoContato(contato.tipo, descricao)) {
      throw new ContatoInvalidoError();
    }

    const atualizado: Contato | null = await this.contatoRepository.atualizar(
      id,
      { descricao },
    );
    if (!atualizado) {
      throw new ContatoNaoEncontradoError();
    }
    return atualizado;
  }

  async deletarContato(id: number): Promise<void> {
    const contato: Contato | null =
      await this.contatoRepository.buscarPorId(id);
    if (!contato) {
      throw new ContatoNaoEncontradoError();
    }
    await this.contatoRepository.deletar(id);
  }

  async listarPorPessoa(idPessoa: number): Promise<Contato[]> {
    return this.contatoRepository.listarPorPessoa(idPessoa);
  }

  async listarTodos(): Promise<Contato[]> {
    return this.contatoRepository.listarTodos();
  }
}
