import { validarCpf } from "./validarCpf";

describe("validarCpf", () => {
  it("aceita CPF válido sem máscara", () => {
    expect(validarCpf("52998224725")).toBe(true);
  });

  it("aceita CPF válido com máscara", () => {
    expect(validarCpf("529.982.247-25")).toBe(true);
  });

  it("rejeita CPF com menos de 11 dígitos", () => {
    expect(validarCpf("5299822472")).toBe(false);
  });

  it("rejeita CPF com mais de 11 dígitos", () => {
    expect(validarCpf("529982247256")).toBe(false);
  });

  it("rejeita CPF com todos os dígitos iguais", () => {
    expect(validarCpf("11111111111")).toBe(false);
  });

  it("rejeita CPF com letra no meio", () => {
    expect(validarCpf("5299822472a")).toBe(false);
  });

  it("rejeita CPF com formato correto mas dígito verificador errado", () => {
    expect(validarCpf("52998224700")).toBe(false);
  });

  it("rejeita string vazia", () => {
    expect(validarCpf("")).toBe(false);
  });
});
