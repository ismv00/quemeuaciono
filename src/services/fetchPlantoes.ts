import { Analista, Regime } from '../types/Analista';
import { Plantao } from '../types/Plantao';

function parseRegime(value: string): Regime {
  if (value === 'Presencial' || value === 'Sobreaviso') {
    return value;
  }

  return 'Sobreaviso';
}

export async function fetchPlantoes(): Promise<Plantao[]> {
  const res = await fetch(process.env.PLANTOES_CSV_URL!, {
    next: { revalidate: 60 },
  });

  const text = await res.text();
  const rows = text.split('\n').slice(1);

  const map = new Map<string, Analista[]>();

  for (const row of rows) {
    if (!row.trim()) continue;
    const [data, nome, area, regime, inicio, fim, whatsapp, email] = row.split(',');

    if (!map.has(data)) {
      map.set(data, []);
    }

    map.get(data)!.push({
      nome,
      area,
      regime: parseRegime(regime),
      inicio,
      fim,
      whatsapp,
      email,
    });
  }

  return Array.from(map.entries()).map(([data, analistas]) => ({
    data,
    analistas,
  }));
}
