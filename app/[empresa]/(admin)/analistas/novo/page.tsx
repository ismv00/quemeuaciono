import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AnalistaForm } from '@/src/components/AnalistaForm';
import { criarAnalistaAction } from '@/src/actions/analistas';
import { getEmpresaAtual } from '@/src/lib/empresa-atual';

export const metadata: Metadata = {
  title: 'Novo analista — Quem eu aciono?',
};

export default async function NovoAnalistaPage() {
  const empresa = await getEmpresaAtual();

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
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">Novo analista</h1>
      </div>

      <div className="max-w-xl rounded-[20px] border border-line bg-white p-6 shadow-[0_1px_2px_rgba(20,20,20,0.04)] md:p-[30px]">
        <AnalistaForm action={criarAnalistaAction} textoBotao="Cadastrar analista" />
      </div>
    </div>
  );
}
