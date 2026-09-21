import { redirect } from 'next/navigation';
import { AppShell } from '@/src/components/AppShell';
import { getEmpresaAtual } from '@/src/lib/empresa-atual';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ empresa: string }>;
}) {
  const { empresa: empresaNaUrl } = await params;
  const empresa = await getEmpresaAtual();

  if (empresa.slug !== empresaNaUrl) {
    redirect(`/${empresa.slug}`);
  }

  return <AppShell>{children}</AppShell>;
}
