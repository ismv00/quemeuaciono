import { notFound } from 'next/navigation';
import { AppShell } from '@/src/components/AppShell';
import { HomeClient } from '@/src/components/HomeClient';
import { getPlantoesForEmpresa } from '@/src/db/queries/plantoes';
import { getVisitanteDaEmpresa } from '@/src/lib/empresa-atual';

export default async function Home({ params }: { params: Promise<{ empresa: string }> }) {
  const { empresa: slug } = await params;
  const visitante = await getVisitanteDaEmpresa(slug);

  if (!visitante) notFound();

  const { empresa, isAdmin } = visitante;
  const plantoes = await getPlantoesForEmpresa(empresa.id);

  const conteudo = <HomeClient plantoes={plantoes} empresaNome={empresa.nome} isAdmin={isAdmin} />;

  return isAdmin ? <AppShell>{conteudo}</AppShell> : conteudo;
}
