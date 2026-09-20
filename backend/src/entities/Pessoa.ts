import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Contato } from "./Contato";

@Entity("pessoa")
export class Pessoa {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  nome!: string;

  @Column({ type: "varchar", length: 11, unique: true, nullable: false })
  cpf!: string;

  @OneToMany(() => Contato, (contato: Contato) => contato.pessoa)
  contatos!: Contato[];

  possuiContatos(): boolean {
    return this.contatos.length > 0;
  }
}
