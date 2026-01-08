import { Analista } from '../types/Analista';

/**Verifica se o analista está online com base no horario
 * atual e no periodo de plantao
 */

export function isAnalistaOnline(analista: Analista, dataPlantao: string): boolean {
  if (!analista.inicio || !analista.fim) {
    return false;
  }

  const agora = new Date();

  // Verificar se o dia atual é o dia do plantão
  const [ano, mes, dia] = dataPlantao.split('-').map(Number);
  const dataDoPlantao = new Date(ano, mes - 1, dia);

  // Se não for o dia do plantão, retorna como offline'
  if (
    agora.getFullYear() !== dataDoPlantao.getFullYear() ||
    agora.getMonth() !== dataDoPlantao.getMonth() ||
    agora.getDate() !== dataDoPlantao.getDate()
  ) {
    return false;
  }

  const [horaInicio, minutoInicio] = analista.inicio.split(':').map(Number);
  const [horaFim, minutoFim] = analista.fim.split(':').map(Number);

  const inicio = new Date(dataDoPlantao);
  inicio.setHours(horaInicio, minutoInicio, 0, 0);

  const fim = new Date(dataDoPlantao);
  fim.setHours(horaFim, minutoFim, 0, 0);

  return agora >= inicio && agora <= fim;
}
