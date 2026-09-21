import { Analista, Regime } from '../types/Analista';
import { Plantao } from '../types/Plantao';

function parseRegime(value: string): Regime {
  if (value === 'Presencial' || value === 'Sobreaviso') {
    return value;
  }

  return 'Sobreaviso';
}

export async function fetchPlantoes(): Promise<Plantao[]> {
  let res: Response;

  try {
    res = await fetch(process.env.PLANTOES_CSV_URL!, {
      next: { revalidate: 60 },
    });
  } catch {
    return [];
  }

  if (!res.ok) {
    return [];
  }

  const text = await res.text();
  const rows = text.split(/\r\n|\n/).slice(1);

  const map = new Map<string, Analista[]>();

  for (const row of rows) {
    if (!row.trim()) continue;

    const [data, nome, categoria, area, regime, inicio, fim, whatsapp, email] = row
      .split(',')
      .map((field) => field.trim());

    if (!data) continue;

    if (!map.has(data)) {
      map.set(data, []);
    }

    map.get(data)!.push({
      nome,
      categoria,
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
