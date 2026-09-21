import { PessoaService } from "./PessoaService";
import type { NovoContato } from "./PessoaService";
import { PessoaRepository } from "../repositories/PessoaRepository";
import { Pessoa } from "../entities/Pessoa";
import { ContatoInvalidoError } from "../errors/ContatoInvalidoError";
import { LimiteContatoExcedidoError } from "../errors/LimiteContatoExcedidoError";

jest.mock("../repositories/PessoaRepository");

describe("PessoaService.criarPessoa com contatos", () => {
  const cpfValido: string = "52998224725";
  let repository: jest.Mocked<PessoaRepository>;
  let service: PessoaService;

  beforeEach(() => {
    repository = new PessoaRepository() as jest.Mocked<PessoaRepository>;
    repository.buscarPorCpf.mockResolvedValue(null);
    repository.criar.mockImplementation(
      async (pessoa: Pessoa): Promise<Pessoa> => pessoa,
    );
    service = new PessoaService(repository);
  });

  it("cria a pessoa com os contatos vinculados", async () => {
    const contatos: NovoContato[] = [
      { tipo: true, descricao: "alison@magazord.com.br" },
      { tipo: false, descricao: "(47) 99999-1234" },
    ];

    const pessoa: Pessoa = await service.criarPessoa(
      "Alison Caetano",
      cpfValido,
      contatos,
    );

    expect(pessoa.contatos).toHaveLength(2);
    expect(repository.criar).toHaveBeenCalledTimes(1);
  });

  it("não grava nada se um contato for inválido", async () => {
    const contatos: NovoContato[] = [
      { tipo: true, descricao: "alison@magazord.com.br" },
      { tipo: true, descricao: "nao-e-email" },
    ];

    await expect(
      service.criarPessoa("Alison Caetano", cpfValido, contatos),
    ).rejects.toThrow(ContatoInvalidoError);
    expect(repository.buscarPorCpf).not.toHaveBeenCalled();
    expect(repository.criar).not.toHaveBeenCalled();
  });

  it("rejeita mais de 5 contatos do mesmo tipo", async () => {
    const contatos: NovoContato[] = Array.from(
      { length: 6 },
      (_, i: number): NovoContato => ({
        tipo: false,
        descricao: `(47) 99999-000${i}`,
      }),
    );

    await expect(
      service.criarPessoa("Alison Caetano", cpfValido, contatos),
    ).rejects.toThrow(LimiteContatoExcedidoError);
    expect(repository.criar).not.toHaveBeenCalled();
  });

  it("aceita 5 telefones e 5 e-mails, porque a contagem é por tipo", async () => {
    const telefones: NovoContato[] = Array.from(
      { length: 5 },
      (_, i: number): NovoContato => ({
        tipo: false,
        descricao: `(47) 99999-000${i}`,
      }),
    );
    const emails: NovoContato[] = Array.from(
      { length: 5 },
      (_, i: number): NovoContato => ({
        tipo: true,
        descricao: `pessoa${i}@magazord.com.br`,
      }),
    );

    const pessoa: Pessoa = await service.criarPessoa(
      "Alison Caetano",
      cpfValido,
      [...telefones, ...emails],
    );

    expect(pessoa.contatos).toHaveLength(10);
  });
});
