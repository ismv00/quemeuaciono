export function getTodayISO() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
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
