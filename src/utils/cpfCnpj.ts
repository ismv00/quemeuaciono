function somenteDigitos(valor: string) {
  return valor.replace(/\D/g, '');
}

function validarCpf(cpf: string) {
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  for (let posicaoDigito = 9; posicaoDigito <= 10; posicaoDigito++) {
    let soma = 0;
    for (let i = 0; i < posicaoDigito; i++) {
      soma += Number(cpf[i]) * (posicaoDigito + 1 - i);
    }
    const resto = (soma * 10) % 11;
    const digitoEsperado = resto === 10 ? 0 : resto;
    if (digitoEsperado !== Number(cpf[posicaoDigito])) return false;
  }

  return true;
}

function validarCnpj(cnpj: string) {
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

  const calcularDigito = (base: string) => {
    const pesos = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const soma = base
      .split('')
      .reduce((acc, digito, i) => acc + Number(digito) * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const primeiroDigito = calcularDigito(cnpj.slice(0, 12));
  const segundoDigito = calcularDigito(cnpj.slice(0, 12) + primeiroDigito);

  return primeiroDigito === Number(cnpj[12]) && segundoDigito === Number(cnpj[13]);
}

/** Aceita CPF (11 dígitos) ou CNPJ (14 dígitos), com ou sem máscara. */
export function validarCpfCnpj(valor: string) {
  const digitos = somenteDigitos(valor);
  if (digitos.length === 11) return validarCpf(digitos);
  if (digitos.length === 14) return validarCnpj(digitos);
  return false;
}

export function formatarCpfCnpjParaAsaas(valor: string) {
  return somenteDigitos(valor);
}
