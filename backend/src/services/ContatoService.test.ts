import { ContatoService } from "./ContatoService";
import { ContatoRepository } from "../repositories/ContatoRepository";
import { PessoaRepository } from "../repositories/PessoaRepository";
import { PessoaNaoEncontradaError } from "../errors/PessoaNaoEncontradaError";
import { LimiteContatoExcedidoError } from "../errors/LimiteContatoExcedidoError";

describe("ContatoService", () => {
  it("cria contato com sucesso quando pessoa existe e não excedeu limite", async () => {
    const contatoRepositoryFalso = {
      contarPorPessoaETipo: async () => 2,
      criar: async (c: any) => ({ ...c, id: 1 }),
    } as unknown as ContatoRepository;

    const pessoaRepositoryFalso = {
      buscarPorId: async () => ({ id: 1, nome: "Maria", cpf: "52998224725" }),
    } as unknown as PessoaRepository;

    const service = new ContatoService(
      contatoRepositoryFalso,
      pessoaRepositoryFalso,
    );
    const contato = await service.criarContato(1, true, "maria@email.com");

    expect(contato.descricao).toBe("maria@email.com");
  });

  it("lança PessoaNaoEncontradaError quando pessoa não existe", async () => {
    const contatoRepositoryFalso = {} as unknown as ContatoRepository;
    const pessoaRepositoryFalso = {
      buscarPorId: async () => null,
    } as unknown as PessoaRepository;

    const service = new ContatoService(
      contatoRepositoryFalso,
      pessoaRepositoryFalso,
    );

    await expect(
      service.criarContato(999, true, "maria@email.com"),
    ).rejects.toThrow(PessoaNaoEncontradaError);
  });

  it("permite criar o quinto contato do mesmo tipo, no limite exato", async () => {
    const contatoRepositoryFalso = {
      contarPorPessoaETipo: async () => 4,
      criar: async (c: any) => ({ ...c, id: 5 }),
    } as unknown as ContatoRepository;

    const pessoaRepositoryFalso = {
      buscarPorId: async () => ({ id: 1, nome: "Maria", cpf: "52998224725" }),
    } as unknown as PessoaRepository;

    const service = new ContatoService(
      contatoRepositoryFalso,
      pessoaRepositoryFalso,
    );
    const contato = await service.criarContato(1, true, "quinto@email.com");

    expect(contato.descricao).toBe("quinto@email.com");
  });

  it("lança LimiteContatoExcedidoError ao tentar criar o sexto contato do mesmo tipo", async () => {
    const contatoRepositoryFalso = {
      contarPorPessoaETipo: async () => 5,
    } as unknown as ContatoRepository;

    const pessoaRepositoryFalso = {
      buscarPorId: async () => ({ id: 1, nome: "Maria", cpf: "52998224725" }),
    } as unknown as PessoaRepository;

    const service = new ContatoService(
      contatoRepositoryFalso,
      pessoaRepositoryFalso,
    );

    await expect(
      service.criarContato(1, true, "sexto@email.com"),
    ).rejects.toThrow(LimiteContatoExcedidoError);
  });

  it("permite criar email mesmo com limite de telefone já atingido, provando que a contagem separa por tipo", async () => {
    let tipoRecebido: boolean | undefined;

    const contatoRepositoryFalso = {
      contarPorPessoaETipo: async (idPessoa: number, tipo: boolean) => {
        tipoRecebido = tipo;
        return tipo === false ? 5 : 0;
      },
      criar: async (c: any) => ({ ...c, id: 10 }),
    } as unknown as ContatoRepository;

    const pessoaRepositoryFalso = {
      buscarPorId: async () => ({ id: 1, nome: "Maria", cpf: "52998224725" }),
    } as unknown as PessoaRepository;

    const service = new ContatoService(
      contatoRepositoryFalso,
      pessoaRepositoryFalso,
    );
    const contato = await service.criarContato(1, true, "novo@email.com");

    expect(tipoRecebido).toBe(true);
    expect(contato.descricao).toBe("novo@email.com");
  });
});
