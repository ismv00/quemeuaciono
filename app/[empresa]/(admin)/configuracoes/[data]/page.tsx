import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AdicionarEscalaForm } from '@/src/components/AdicionarEscalaForm';
import { EscalaRow } from '@/src/components/EscalaRow';
import { EmptyStateAnalistas } from '@/src/components/EmptyStateAnalistas';
import { getAnalistasDaEmpresa } from '@/src/db/queries/analistas';
import { getPlantaoComEscalas } from '@/src/db/queries/plantoes';
import { getEmpresaAtual } from '@/src/lib/empresa-atual';
import { formatarDataLonga } from '@/src/utils/date';

export const metadata: Metadata = {
  title: 'Plantão — Quem eu aciono?',
};

export default async function PlantaoDoDiaPage({
  params,
}: {
  params: Promise<{ data: string }>;
}) {
  const { data } = await params;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    notFound();
  }

  const empresa = await getEmpresaAtual();
  const [{ escalas }, roster] = await Promise.all([
    getPlantaoComEscalas(empresa.id, data),
    getAnalistasDaEmpresa(empresa.id),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-8 md:px-10 md:py-9">
      <div>
        <Link
          href={`/${empresa.slug}/configuracoes`}
          className="mb-4 flex w-fit items-center gap-1.5 text-[13px] font-bold text-muted"
        >
          <ArrowLeft size={14} />
          Voltar para Configurações
        </Link>
        <h1 className="text-2xl font-extrabold capitalize tracking-tight text-ink">
          {formatarDataLonga(data)}
        </h1>
      </div>

      <div className="rounded-[20px] border border-line bg-white p-6 shadow-[0_1px_2px_rgba(20,20,20,0.04)] md:p-[30px]">
        <h2 className="mb-4 text-[15px] font-extrabold text-ink">Escalas do dia</h2>

        {escalas.length === 0 ? (
          <EmptyStateAnalistas mensagem="Nenhuma escala nesse dia ainda." />
        ) : (
          <div className="flex flex-col gap-3">
            {escalas.map((escala) => (
              <EscalaRow key={escala.id} escala={escala} />
            ))}
          </div>
        )}
      </div>

      <div className="rounded-[20px] border border-line bg-white p-6 shadow-[0_1px_2px_rgba(20,20,20,0.04)] md:p-[30px]">
        <h2 className="mb-4 text-[15px] font-extrabold text-ink">Adicionar escala</h2>

        {roster.length === 0 ? (
          <p className="text-sm text-muted-2">
            Não há nenhum analista cadastrado ainda.{' '}
            <Link href={`/${empresa.slug}/analistas/novo`} className="font-bold text-accent">
              Cadastre um analista
            </Link>{' '}
            primeiro.
          </p>
        ) : (
          <AdicionarEscalaForm data={data} analistas={roster} />
        )}
      </div>
    </div>
  );
}
