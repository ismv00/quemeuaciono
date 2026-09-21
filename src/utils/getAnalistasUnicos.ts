import { Analista } from '../types/Analista';
import { Plantao } from '../types/Plantao';

export function getAnalistasUnicos(plantoes: Plantao[]): Analista[] {
  const vistos = new Map<string, Analista>();

  for (const plantao of plantoes) {
    for (const analista of plantao.analistas) {
      if (!analista.nome) continue;

      const chave = analista.nome.toLowerCase();

      if (!vistos.has(chave)) {
        vistos.set(chave, analista);
      }
    }
  }

  return Array.from(vistos.values()).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}
