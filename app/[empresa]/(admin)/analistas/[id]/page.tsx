import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AnalistaForm } from '@/src/components/AnalistaForm';
import { ArquivarAnalistaButton } from '@/src/components/ArquivarAnalistaButton';
import { arquivarAnalistaAction, atualizarAnalistaAction } from '@/src/actions/analistas';
import { getAnalistaById } from '@/src/db/queries/analistas';
import { getEmpresaAtual } from '@/src/lib/empresa-atual';

export const metadata: Metadata = {
  title: 'Editar analista — Quem eu aciono?',
};

export default async function EditarAnalistaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const empresa = await getEmpresaAtual();
  const analista = await getAnalistaById(id, empresa.id);

  if (!analista) notFound();

  const atualizarComId = atualizarAnalistaAction.bind(null, id);
  const arquivarComId = arquivarAnalistaAction.bind(null, id);

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-8 md:px-10 md:py-9">
      <div>
        <Link
          href={`/${empresa.slug}/analistas`}
          className="mb-4 flex w-fit items-center gap-1.5 text-[13px] font-bold text-muted"
        >
          <ArrowLeft size={14} />
          Voltar para Analistas
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">Editar analista</h1>
      </div>

      <div className="max-w-xl rounded-[20px] border border-line bg-white p-6 shadow-[0_1px_2px_rgba(20,20,20,0.04)] md:p-[30px]">
        <AnalistaForm action={atualizarComId} defaultValues={analista} textoBotao="Salvar alterações" />

        <div className="mt-6 border-t border-[#EFEDE7] pt-6">
          <ArquivarAnalistaButton action={arquivarComId} nome={analista.nome} />
        </div>
      </div>
    </div>
  );
}
