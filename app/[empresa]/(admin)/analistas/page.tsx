import type { Metadata } from 'next';
import { AnalistasClient } from '@/src/components/AnalistasClient';
import { getAnalistasDaEmpresa } from '@/src/db/queries/analistas';
import { getEmpresaAtual } from '@/src/lib/empresa-atual';

export const metadata: Metadata = {
  title: 'Analistas — Quem eu aciono?',
};

export default async function AnalistasPage() {
  const empresa = await getEmpresaAtual();
  const analistas = await getAnalistasDaEmpresa(empresa.id);

  return <AnalistasClient analistas={analistas} empresaSlug={empresa.slug} />;
}
