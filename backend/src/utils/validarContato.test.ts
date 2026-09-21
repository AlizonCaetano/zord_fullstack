import {
  validarDescricaoContato,
  validarEmail,
  validarTelefone,
} from "./validarContato";

describe("validarEmail", () => {
  it("aceita e-mail com domínio e extensão", () => {
    expect(validarEmail("alison@magazord.com.br")).toBe(true);
  });

  it("rejeita texto sem arroba", () => {
    expect(validarEmail("alison.magazord.com")).toBe(false);
  });

  it("rejeita e-mail sem extensão", () => {
    expect(validarEmail("alison@magazord")).toBe(false);
  });

  it("rejeita e-mail com espaço", () => {
    expect(validarEmail("ali son@magazord.com")).toBe(false);
  });
});

describe("validarTelefone", () => {
  it("aceita celular com máscara", () => {
    expect(validarTelefone("(47) 99999-1234")).toBe(true);
  });

  it("aceita fixo só com dígitos", () => {
    expect(validarTelefone("4733331234")).toBe(true);
  });

  it("rejeita letras", () => {
    expect(validarTelefone("47 9999A-1234")).toBe(false);
  });

  it("rejeita número curto", () => {
    expect(validarTelefone("99999-1234")).toBe(false);
  });

  it("rejeita DDD começando com zero", () => {
    expect(validarTelefone("0479999912345")).toBe(false);
  });
});

describe("validarDescricaoContato", () => {
  it("valida como e-mail quando tipo é true", () => {
    expect(validarDescricaoContato(true, "a@b.com")).toBe(true);
    expect(validarDescricaoContato(true, "(47) 99999-1234")).toBe(false);
  });

  it("valida como telefone quando tipo é false", () => {
    expect(validarDescricaoContato(false, "(47) 99999-1234")).toBe(true);
    expect(validarDescricaoContato(false, "a@b.com")).toBe(false);
  });
});
