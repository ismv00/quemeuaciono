import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, PhoneCall } from 'lucide-react';
import { CheckoutFake } from '@/src/components/CheckoutFake';
import { DIAS_TESTE_GRATIS, getPlanoPorSlug } from '@/src/data/planos';

export const metadata: Metadata = {
  title: 'Assinar — Quem eu aciono?',
};

export default async function AssinarPage({
  params,
}: {
  params: Promise<{ plano: string }>;
}) {
  const { plano: slug } = await params;
  const plano = getPlanoPorSlug(slug);

  if (!plano) notFound();

  return (
    <main className="flex min-h-screen flex-col bg-bg">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 md:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent">
            <PhoneCall size={18} className="text-white" />
          </div>
          <span className="text-[15px] font-extrabold text-ink">Quem eu aciono?</span>
        </Link>
        <Link href="/sign-in" className="text-[13px] font-bold text-muted">
          Já tenho conta
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Link
            href="/#planos"
            className="mb-6 flex w-fit items-center gap-1.5 text-[13px] font-bold text-muted"
          >
            <ArrowLeft size={14} />
            Voltar pros planos
          </Link>

          <CheckoutFake plano={plano} diasTeste={DIAS_TESTE_GRATIS} />
        </div>
      </div>
    </main>
  );
}
