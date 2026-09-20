import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePessoaEContato1789931340429 implements MigrationInterface {
    name = 'CreatePessoaEContato1789931340429'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contato" ("id" SERIAL NOT NULL, "tipo" boolean NOT NULL, "descricao" character varying(100) NOT NULL, "idPessoa" integer NOT NULL, CONSTRAINT "PK_9592a5553a9dfaeebe7d0cd0e5b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pessoa" ("id" SERIAL NOT NULL, "nome" character varying(50) NOT NULL, "cpf" character varying(11) NOT NULL, CONSTRAINT "UQ_ee80cc840596cc1bca8a149bcd5" UNIQUE ("cpf"), CONSTRAINT "PK_bb879ac36994545a5a917a09ba5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contato" ADD CONSTRAINT "FK_555bfb3ddf1097e6f3663be86cd" FOREIGN KEY ("idPessoa") REFERENCES "pessoa"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contato" DROP CONSTRAINT "FK_555bfb3ddf1097e6f3663be86cd"`);
        await queryRunner.query(`DROP TABLE "pessoa"`);
        await queryRunner.query(`DROP TABLE "contato"`);
    }

}
