import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Pessoa } from "../entities/Pessoa";

export class PessoaRepository {
  private repository: Repository<Pessoa>;

  constructor() {
    this.repository = AppDataSource.getRepository(Pessoa);
  }

  async criar(pessoa: Pessoa): Promise<Pessoa> {
    return this.repository.save(pessoa);
  }

  async buscarPorId(id: number): Promise<Pessoa | null> {
    return this.repository.findOneBy({ id });
  }

  async buscarPorCpf(cpf: string): Promise<Pessoa | null> {
    return this.repository.findOneBy({ cpf });
  }

  async buscarPorNome(nome: string): Promise<Pessoa[]> {
    return this.repository
      .createQueryBuilder("pessoa")
      .leftJoinAndSelect("pessoa.contatos", "contato")
      .where("pessoa.nome ILIKE :nome", { nome: `%${nome}%` })
      .orderBy("pessoa.nome", "ASC")
      .addOrderBy("contato.id", "ASC")
      .getMany();
  }

  async listarTodas(): Promise<Pessoa[]> {
    return this.repository.find({
      relations: { contatos: true },
      order: { nome: "ASC", contatos: { id: "ASC" } },
    });
  }

  async atualizar(id: number, dados: Partial<Pessoa>): Promise<Pessoa | null> {
    await this.repository.update(id, dados);
    return this.buscarPorId(id);
  }

  async deletar(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
