import { validarNome } from "./validarNome";

describe("validarNome", () => {
  it("aceita nome com 4 caracteres, no limite mínimo", () => {
    expect(validarNome("Anaa")).toBe(true);
  });

  it("rejeita nome com exatamente 3 caracteres", () => {
    expect(validarNome("Ana")).toBe(false);
  });

  it("aceita nome composto com espaço", () => {
    expect(validarNome("Maria Silva")).toBe(true);
  });

  it("aceita nome com acentuação", () => {
    expect(validarNome("José André")).toBe(true);
  });

  it("rejeita nome com número no meio", () => {
    expect(validarNome("Maria123")).toBe(false);
  });

  it("rejeita nome só com espaço", () => {
    expect(validarNome("   ")).toBe(false);
  });

  it("rejeita string vazia", () => {
    expect(validarNome("")).toBe(false);
  });
});
