import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Contato } from "../entities/Contato";

export class ContatoRepository {
  private repository: Repository<Contato>;

  constructor() {
    this.repository = AppDataSource.getRepository(Contato);
  }

  async criar(contato: Contato): Promise<Contato> {
    return this.repository.save(contato);
  }

  async buscarPorId(id: number): Promise<Contato | null> {
    return this.repository.findOneBy({ id });
  }

  async listarPorPessoa(idPessoa: number): Promise<Contato[]> {
    return this.repository.find({
      where: { pessoa: { id: idPessoa } },
      order: { id: "ASC" },
    });
  }

  async listarTodos(): Promise<Contato[]> {
    return this.repository.find({
      relations: { pessoa: true },
      order: { id: "ASC" },
    });
  }

  async contarPorPessoaETipo(idPessoa: number, tipo: boolean): Promise<number> {
    return this.repository.count({
      where: { pessoa: { id: idPessoa }, tipo },
    });
  }

  async atualizar(
    id: number,
    dados: Partial<Contato>,
  ): Promise<Contato | null> {
    await this.repository.update(id, dados);
    return this.buscarPorId(id);
  }

  async deletar(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
