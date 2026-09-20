import { ContatoRepository } from "../repositories/ContatoRepository";
import { PessoaRepository } from "../repositories/PessoaRepository";
import { Contato } from "../entities/Contato";
import { ContatoNaoEncontradoError } from "../errors/ContatoNaoEncontradoError";
import { PessoaNaoEncontradaError } from "../errors/PessoaNaoEncontradaError";
import { LimiteContatoExcedidoError } from "../errors/LimiteContatoExcedidoError";

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
    const pessoa = await this.pessoaRepository.buscarPorId(idPessoa);
    if (!pessoa) {
      throw new PessoaNaoEncontradaError();
    }

    const quantidade = await this.contatoRepository.contarPorPessoaETipo(
      idPessoa,
      tipo,
    );
    if (quantidade >= 5) {
      throw new LimiteContatoExcedidoError();
    }

    const contato = new Contato();
    contato.tipo = tipo;
    contato.descricao = descricao;
    contato.pessoa = pessoa;

    return this.contatoRepository.criar(contato);
  }

  async atualizarContato(id: number, descricao: string): Promise<Contato> {
    const contato = await this.contatoRepository.buscarPorId(id);
    if (!contato) {
      throw new ContatoNaoEncontradoError();
    }
    const atualizado = await this.contatoRepository.atualizar(id, {
      descricao,
    });
    return atualizado as Contato;
  }

  async deletarContato(id: number): Promise<void> {
    const contato = await this.contatoRepository.buscarPorId(id);
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
