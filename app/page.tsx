import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { Calendar, Clock, MessageCircle, PhoneCall, ShieldCheck } from 'lucide-react';
import { PricingCard } from '@/src/components/PricingCard';
import { RevealOnScroll } from '@/src/components/RevealOnScroll';
import { DIAS_TESTE_GRATIS, planos } from '@/src/data/planos';

const recursos = [
  {
    icon: Clock,
    title: 'Acesso rápido',
    description: 'Qualquer funcionário abre o link e vê quem está de plantão em segundos.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp direto',
    description: 'Acione quem está escalado com um clique, sem procurar contato perdido.',
  },
  {
    icon: ShieldCheck,
    title: 'Sem mais planilha',
    description: 'Cadastre analistas e escalas pelo próprio app — a planilha fica pra trás.',
  },
];

export default async function LandingPage() {
  const { orgSlug } = await auth();

  if (orgSlug) {
    redirect(`/${orgSlug}`);
  }

  return (
    <main className="bg-bg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 md:px-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent">
            <PhoneCall size={18} className="text-white" />
          </div>
          <span className="text-[15px] font-extrabold text-ink">Quem eu aciono?</span>
        </div>

        <Link
          href="/sign-in"
          className="rounded-full border border-line bg-white px-4 py-2 text-[13px] font-bold text-ink"
        >
          Já tenho conta — Entrar
        </Link>
      </div>

      <RevealOnScroll>
        <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-16 text-center md:py-24">
          <div className="text-[11px] font-extrabold tracking-[0.08em] text-accent">
            SUPORTE TÉCNICO SEM PLANILHA
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
            Quem eu aciono?
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Gestão de plantões e escalas de suporte técnico. Divulgue um link pra sua equipe e
            chega de descobrir quem está de plantão numa planilha perdida.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#planos"
              className="rounded-full bg-accent px-6 py-3 text-sm font-extrabold text-white transition hover:brightness-95"
            >
              Ver planos e começar teste grátis
            </a>
            <Link
              href="/sign-up"
              className="rounded-full border border-line bg-white px-6 py-3 text-sm font-extrabold text-ink"
            >
              Criar conta
            </Link>
          </div>
        </section>
      </RevealOnScroll>

      <section className="mx-auto max-w-6xl px-4 pb-16 md:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          {recursos.map(({ icon: Icon, title, description }, index) => (
            <RevealOnScroll key={title} delay={index * 120}>
              <div className="flex items-start gap-3.5 rounded-2xl border border-line bg-white p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-tint">
                  <Icon size={19} className="text-[#57534E]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-ink">{title}</div>
                  <div className="mt-0.5 text-[13px] leading-relaxed text-muted-2">
                    {description}
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section id="planos" className="mx-auto max-w-6xl px-4 py-16 md:px-10">
        <RevealOnScroll>
          <div className="mx-auto mb-10 max-w-xl text-center">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-tint px-3.5 py-1.5 text-xs font-bold text-[#57534E]">
              <Calendar size={13} />
              {DIAS_TESTE_GRATIS} dias grátis em qualquer plano
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
              Planos pra empresas de qualquer tamanho
            </h2>
            <p className="mt-2 text-sm text-muted">
              Teste grátis por {DIAS_TESTE_GRATIS} dias, sem compromisso. Cancele quando quiser.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid gap-5 md:grid-cols-3">
          {planos.map((plano, index) => (
            <RevealOnScroll key={plano.slug} delay={index * 120}>
              <PricingCard plano={plano} />
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </main>
  );
}
