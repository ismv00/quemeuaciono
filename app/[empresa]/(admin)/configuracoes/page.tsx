import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { PageHeader } from '@/src/components/PageHeader';
import { AbrirPlantaoForm } from '@/src/components/AbrirPlantaoForm';
import { EmptyStateAnalistas } from '@/src/components/EmptyStateAnalistas';
import { PlanoCard } from '@/src/components/PlanoCard';
import { listarPlantoesResumo } from '@/src/db/queries/plantoes';
import { getAnalistasDaEmpresa, getCategoriasDaEmpresa } from '@/src/db/queries/analistas';
import { getEmpresaAtual } from '@/src/lib/empresa-atual';
import { getPlanoPorSlug } from '@/src/data/planos';
import { formatarDataLonga } from '@/src/utils/date';

export const metadata: Metadata = {
  title: 'Configurações — Quem eu aciono?',
};

export default async function ConfiguracoesPage() {
  const empresa = await getEmpresaAtual();
  const [plantoes, analistas, categorias] = await Promise.all([
    listarPlantoesResumo(empresa.id),
    getAnalistasDaEmpresa(empresa.id),
    getCategoriasDaEmpresa(empresa.id),
  ]);
  const planoAtual = getPlanoPorSlug(empresa.plano)!;

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-8 md:px-10 md:py-9">
      <PageHeader
        eyebrow="GESTÃO"
        title="Configurações"
        lede="Monte a escala: abra uma data e escale quem trabalha nela."
      />

      <PlanoCard
        planoAtual={planoAtual}
        totalAnalistas={analistas.length}
        totalCategorias={categorias.length}
        nomeEmpresa={empresa.nome}
        statusAssinatura={empresa.statusAssinatura}
        asaasSubscriptionId={empresa.asaasSubscriptionId}
        criadoEm={empresa.createdAt}
      />

      <div className="rounded-[20px] border border-line bg-white p-6 shadow-[0_1px_2px_rgba(20,20,20,0.04)] md:p-[30px]">
        <h2 className="mb-4 text-[15px] font-extrabold text-ink">Abrir um novo plantão</h2>
        <AbrirPlantaoForm />
      </div>

      <div className="rounded-[20px] border border-line bg-white p-6 shadow-[0_1px_2px_rgba(20,20,20,0.04)] md:p-[30px]">
        <h2 className="mb-4 text-[15px] font-extrabold text-ink">Plantões cadastrados</h2>

        {plantoes.length === 0 ? (
          <EmptyStateAnalistas mensagem="Nenhum plantão cadastrado ainda. Abra uma data acima pra começar." />
        ) : (
          <div className="flex flex-col gap-2.5">
            {plantoes.map((p) => (
              <Link
                key={p.id}
                href={`/${empresa.slug}/configuracoes/${p.data}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[#ECEAE3] p-3.5 transition hover:border-line hover:shadow-sm"
              >
                <span className="flex items-center gap-2.5 text-sm font-bold capitalize text-ink">
                  <Calendar size={15} className="shrink-0 text-muted-2" />
                  {formatarDataLonga(p.data)}
                </span>
                <span className="shrink-0 text-[13px] font-semibold text-muted-2">
                  {p.totalEscalas} escala{p.totalEscalas === 1 ? '' : 's'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
