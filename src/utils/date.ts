export function getTodayISO() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/** Soma dias a uma data (ISO ou Date) e devolve ISO (YYYY-MM-DD). */
export function somarDiasISO(data: Date | string, dias: number) {
  const base = typeof data === 'string' ? new Date(data) : data;
  const resultado = new Date(base);
  resultado.setDate(resultado.getDate() + dias);

  const year = resultado.getFullYear();
  const month = String(resultado.getMonth() + 1).padStart(2, '0');
  const day = String(resultado.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Diferença em dias inteiros entre hoje e uma data (ISO ou Date) no futuro. Negativo se já passou. */
export function diasAte(data: Date | string) {
  const base = typeof data === 'string' ? new Date(data) : data;
  const hoje = new Date();
  const msPorDia = 1000 * 60 * 60 * 24;
  const diffMs =
    Date.UTC(base.getFullYear(), base.getMonth(), base.getDate()) -
    Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  return Math.round(diffMs / msPorDia);
}

export function formatarDataLonga(dataISO?: string) {
  if (!dataISO || !dataISO.includes('-')) return '';

  const parts = dataISO.split('-');
  if (parts.length !== 3) return '';

  const [year, month, day] = parts.map(Number);
  const date = new Date(year, month - 1, day);

  if (isNaN(date.getTime())) return '';

  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
}
