import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Pessoa } from "./Pessoa";

@Entity("contato")
export class Contato {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "boolean", nullable: false })
  tipo!: boolean;

  @Column({ type: "varchar", length: 100, nullable: false })
  descricao!: string;

  @ManyToOne(() => Pessoa, (pessoa: Pessoa) => pessoa.contatos, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "idPessoa" })
  pessoa!: Pessoa;

  ehEmail(): boolean {
    return this.tipo === true;
  }
}
