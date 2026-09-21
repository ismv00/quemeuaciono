import { Plantao } from '../types/Plantao';

export type RelatorioAnalista = {
  nome: string;
  categoria: string;
  area: string;
  total: number;
};

export type RelatorioContagem = {
  label: string;
  total: number;
};

export type Relatorio = {
  totalPlantoes: number;
  totalEscalacoes: number;
  totalAnalistas: number;
  periodo: { inicio: string; fim: string } | null;
  porAnalista: RelatorioAnalista[];
  porCategoria: RelatorioContagem[];
  porArea: RelatorioContagem[];
  porRegime: { presencial: number; sobreaviso: number };
};

export function getRelatorio(plantoes: Plantao[]): Relatorio {
  const porAnalistaMap = new Map<string, RelatorioAnalista>();
  const porCategoriaMap = new Map<string, number>();
  const porAreaMap = new Map<string, number>();
  let presencial = 0;
  let sobreaviso = 0;
  let totalEscalacoes = 0;

  for (const plantao of plantoes) {
    for (const analista of plantao.analistas) {
      if (!analista.nome) continue;
      totalEscalacoes++;

      const chave = analista.nome.toLowerCase();
      const atual = porAnalistaMap.get(chave);
      if (atual) {
        atual.total++;
      } else {
        porAnalistaMap.set(chave, {
          nome: analista.nome,
          categoria: analista.categoria,
          area: analista.area,
          total: 1,
        });
      }

      const categoria = analista.categoria || 'Sem categoria';
      porCategoriaMap.set(categoria, (porCategoriaMap.get(categoria) ?? 0) + 1);

      const area = analista.area || 'Sem área';
      porAreaMap.set(area, (porAreaMap.get(area) ?? 0) + 1);

      if (analista.regime === 'Presencial') {
        presencial++;
      } else {
        sobreaviso++;
      }
    }
  }

  const datas = plantoes
    .map((p) => p.data)
    .filter(Boolean)
    .sort();

  return {
    totalPlantoes: plantoes.length,
    totalEscalacoes,
    totalAnalistas: porAnalistaMap.size,
    periodo: datas.length ? { inicio: datas[0], fim: datas[datas.length - 1] } : null,
    porAnalista: Array.from(porAnalistaMap.values()).sort((a, b) => b.total - a.total),
    porCategoria: Array.from(porCategoriaMap.entries())
      .map(([label, total]) => ({ label, total }))
      .sort((a, b) => b.total - a.total),
    porArea: Array.from(porAreaMap.entries())
      .map(([label, total]) => ({ label, total }))
      .sort((a, b) => b.total - a.total),
    porRegime: { presencial, sobreaviso },
  };
}

const MESES_ABREVIADOS = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
];

export function formatarDataCurta(dataISO: string) {
  const [ano, mes, dia] = dataISO.split('-').map(Number);
  if (!ano || !mes || !dia) return dataISO;

  return `${String(dia).padStart(2, '0')} ${MESES_ABREVIADOS[mes - 1]}`;
}

export function formatarPeriodo(periodo: Relatorio['periodo']) {
  if (!periodo) return 'Sem dados';

  const anoInicio = periodo.inicio.split('-')[0];
  const anoFim = periodo.fim.split('-')[0];

  if (periodo.inicio === periodo.fim) {
    return `${formatarDataCurta(periodo.inicio)} de ${anoInicio}`;
  }

  if (anoInicio === anoFim) {
    return `${formatarDataCurta(periodo.inicio)} – ${formatarDataCurta(periodo.fim)} de ${anoFim}`;
  }

  return `${formatarDataCurta(periodo.inicio)} de ${anoInicio} – ${formatarDataCurta(periodo.fim)} de ${anoFim}`;
}
