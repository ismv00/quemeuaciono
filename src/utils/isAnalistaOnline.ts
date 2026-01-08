import { Analista } from '../types/Analista';

/**Verifica se o analista está online com base no horario
 * atual e no periodo de plantao
 */

export function isAnalistaOnline(analista: Analista): boolean {
  if (!analista.inicio || !analista.fim) {
    return false;
  }

  const agora = new Date();

  const [horaInicio, minutoInicio] = analista.inicio.split(':').map(Number);
  const [horaFim, minutoFim] = analista.fim.split(':').map(Number);

  const inicio = new Date();
  inicio.setHours(horaInicio, minutoInicio, 0, 0);

  const fim = new Date();
  fim.setHours(horaFim, minutoFim, 0, 0);

  return agora >= inicio && agora <= fim;
}
