import { PessoaService } from "./PessoaService";
import { PessoaRepository } from "../repositories/PessoaRepository";
import { CpfInvalidoError } from "../errors/CpfInvalidoError";
import { CpfDuplicadoError } from "../errors/CpfDuplicadoError";
import { NomeInvalidoError } from "../errors/NomeInvalidoError";
import { PessoaNaoEncontradaError } from "../errors/PessoaNaoEncontradaError";

describe("PessoaService", () => {
  it("cria pessoa com sucesso quando dados são válidos", async () => {
    const repositoryFalso = {
      buscarPorCpf: async () => null,
      criar: async (p: any) => ({ ...p, id: 1 }),
    } as unknown as PessoaRepository;

    const service = new PessoaService(repositoryFalso);
    const pessoa = await service.criarPessoa("Maria Silva", "52998224725");

    expect(pessoa.nome).toBe("Maria Silva");
  });

  it("cria pessoa com nome no limite mínimo de 4 caracteres", async () => {
    const repositoryFalso = {
      buscarPorCpf: async () => null,
      criar: async (p: any) => ({ ...p, id: 1 }),
    } as unknown as PessoaRepository;

    const service = new PessoaService(repositoryFalso);
    const pessoa = await service.criarPessoa("Anaa", "52998224725");

    expect(pessoa.nome).toBe("Anaa");
  });

  it("lança NomeInvalidoError com nome de exatamente 3 caracteres", async () => {
    const repositoryFalso = {
      buscarPorCpf: async () => null,
      criar: async (p: any) => p,
    } as unknown as PessoaRepository;

    const service = new PessoaService(repositoryFalso);

    await expect(service.criarPessoa("Ana", "52998224725")).rejects.toThrow(
      NomeInvalidoError,
    );
  });

  it("lança CpfInvalidoError com CPF de dígitos repetidos", async () => {
    const repositoryFalso = {
      buscarPorCpf: async () => null,
      criar: async (p: any) => p,
    } as unknown as PessoaRepository;

    const service = new PessoaService(repositoryFalso);

    await expect(
      service.criarPessoa("Maria Silva", "11111111111"),
    ).rejects.toThrow(CpfInvalidoError);
  });

  it("lança CpfDuplicadoError quando CPF já existe", async () => {
    const repositoryFalso = {
      buscarPorCpf: async () => ({
        id: 1,
        nome: "Outra Pessoa",
        cpf: "52998224725",
      }),
      criar: async (p: any) => p,
    } as unknown as PessoaRepository;

    const service = new PessoaService(repositoryFalso);

    await expect(
      service.criarPessoa("Maria Silva", "52998224725"),
    ).rejects.toThrow(CpfDuplicadoError);
  });

  it("lança PessoaNaoEncontradaError ao atualizar pessoa inexistente", async () => {
    const repositoryFalso = {
      buscarPorId: async () => null,
    } as unknown as PessoaRepository;

    const service = new PessoaService(repositoryFalso);

    await expect(
      service.atualizarPessoa(999, "Nome Valido", "52998224725"),
    ).rejects.toThrow(PessoaNaoEncontradaError);
  });

  it("lança PessoaNaoEncontradaError ao deletar pessoa inexistente", async () => {
    const repositoryFalso = {
      buscarPorId: async () => null,
    } as unknown as PessoaRepository;

    const service = new PessoaService(repositoryFalso);

    await expect(service.deletarPessoa(999)).rejects.toThrow(
      PessoaNaoEncontradaError,
    );
  });

  it("lança CpfDuplicadoError ao atualizar pessoa com CPF de outra pessoa existente", async () => {
    const repositoryFalso = {
      buscarPorId: async () => ({ id: 1, nome: "Maria", cpf: "52998224725" }),
      buscarPorCpf: async () => ({ id: 2, nome: "Outra", cpf: "11144477735" }),
    } as unknown as PessoaRepository;

    const service = new PessoaService(repositoryFalso);

    await expect(
      service.atualizarPessoa(1, "Maria Silva", "11144477735"),
    ).rejects.toThrow(CpfDuplicadoError);
  });

  it("permite atualizar pessoa mantendo o próprio CPF sem disparar duplicidade", async () => {
    const repositoryFalso = {
      buscarPorId: async () => ({ id: 1, nome: "Maria", cpf: "52998224725" }),
      buscarPorCpf: async () => ({ id: 1, nome: "Maria", cpf: "52998224725" }),
      atualizar: async () => ({
        id: 1,
        nome: "Maria Silva",
        cpf: "52998224725",
      }),
    } as unknown as PessoaRepository;

    const service = new PessoaService(repositoryFalso);
    const pessoa = await service.atualizarPessoa(
      1,
      "Maria Silva",
      "52998224725",
    );

    expect(pessoa.nome).toBe("Maria Silva");
  });
});
