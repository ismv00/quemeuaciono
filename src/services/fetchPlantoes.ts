import { Plantao } from '../types/Plantao';

export async function fetchPlantoes(): Promise<Plantao[]> {
  const res = await fetch(process.env.PLANTOES_CSV_URL!, {
    next: { revalidate: 60 },
  });

  const text = await res.text();
  const rows = text.split('\n').slice(1);

  const map = new Map<string, any[]>();

  for (const row of rows) {
    const [data, nome, area, regime, inicio, fim, whatsapp, email] = row.split(',');

    if (!map.has(data)) {
      map.set(data, []);
    }

    map.get(data)!.push({
      nome,
      area,
      regime,
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
