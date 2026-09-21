import type { Metadata } from 'next';
import { PageHeader } from '@/src/components/PageHeader';
import { StatTile } from '@/src/components/StatTile';
import { BarList } from '@/src/components/BarList';
import { RegimeSplit } from '@/src/components/RegimeSplit';
import { getPlantoesForEmpresa } from '@/src/db/queries/plantoes';
import { getEmpresaAtual } from '@/src/lib/empresa-atual';
import { formatarPeriodo, getRelatorio } from '@/src/utils/getRelatorio';

export const metadata: Metadata = {
  title: 'Relatórios — Quem eu aciono?',
};

export default async function RelatoriosPage() {
  const empresa = await getEmpresaAtual();
  const plantoes = await getPlantoesForEmpresa(empresa.id);
  const relatorio = getRelatorio(plantoes);

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-8 md:px-10 md:py-9">
      <PageHeader
        eyebrow="GESTÃO"
        title="Relatórios"
        lede="Números da escala de plantão com base nos dados cadastrados."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Plantões cadastrados" value={String(relatorio.totalPlantoes)} />
        <StatTile label="Analistas únicos" value={String(relatorio.totalAnalistas)} />
        <StatTile label="Escalações no total" value={String(relatorio.totalEscalacoes)} />
        <StatTile label="Período coberto" value={formatarPeriodo(relatorio.periodo)} />
      </div>

      <BarList
        titulo="Escalações por analista"
        itens={relatorio.porAnalista.map((a) => ({
          label: a.nome,
          sublabel: `${a.categoria} · ${a.area}`,
          total: a.total,
        }))}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <BarList
          titulo="Escalações por categoria"
          itens={relatorio.porCategoria.map((c) => ({ label: c.label, total: c.total }))}
        />
        <BarList
          titulo="Escalações por área"
          itens={relatorio.porArea.map((a) => ({ label: a.label, total: a.total }))}
        />
      </div>

      <RegimeSplit
        presencial={relatorio.porRegime.presencial}
        sobreaviso={relatorio.porRegime.sobreaviso}
      />
    </div>
  );
}
