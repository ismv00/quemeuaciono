import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { PhoneCall } from 'lucide-react';

export default async function LandingPage() {
  const { orgSlug } = await auth();

  if (orgSlug) {
    redirect(`/${orgSlug}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg px-4 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
        <PhoneCall size={26} className="text-white" />
      </div>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">Quem eu aciono?</h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
          Gestão de plantões e escalas de suporte técnico. Chega de descobrir quem está de
          plantão numa planilha perdida.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/sign-in"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white"
        >
          Entrar
        </Link>
        <Link
          href="/sign-up"
          className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-bold text-ink"
        >
          Criar conta
        </Link>
      </div>
    </main>
  );
}
