/**
 * `pg` avisa (e o overlay de erro do Next.js em dev mostra isso como se
 * fosse erro) que os modos `sslmode=prefer|require|verify-ca` vão parar de
 * ser tratados como alias de `verify-full` numa versão futura do driver.
 * Hoje eles já se comportam exatamente como `verify-full` — só deixamos
 * isso explícito na string de conexão pra silenciar o aviso sem mudar
 * nada no comportamento real.
 */
export function comSslVerifyFull(connectionString: string) {
  const url = new URL(connectionString);

  if (url.searchParams.has('sslmode')) {
    url.searchParams.set('sslmode', 'verify-full');
  }

  return url.toString();
}
