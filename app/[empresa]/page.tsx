import { notFound } from 'next/navigation';
import { AppShell } from '@/src/components/AppShell';
import { HomeClient } from '@/src/components/HomeClient';
import { getPlantoesForEmpresa } from '@/src/db/queries/plantoes';
import { getVisitanteDaEmpresa } from '@/src/lib/empresa-atual';
import { getPlanoPorSlug } from '@/src/data/planos';

export default async function Home({ params }: { params: Promise<{ empresa: string }> }) {
  const { empresa: slug } = await params;
  const visitante = await getVisitanteDaEmpresa(slug);

  if (!visitante) notFound();

  const { empresa, isAdmin } = visitante;
  const plantoes = await getPlantoesForEmpresa(empresa.id);
  const plano = getPlanoPorSlug(empresa.plano)!;

  const conteudo = (
    <HomeClient
      plantoes={plantoes}
      empresaNome={empresa.nome}
      isAdmin={isAdmin}
      whatsappHabilitado={plano.acionamentoWhatsapp}
      emailHabilitado={plano.acionamentoEmail}
    />
  );

  return isAdmin ? <AppShell>{conteudo}</AppShell> : conteudo;
}
