import { PhoneCall } from 'lucide-react';

export function Header() {
  return (
    <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-500 to-brand-400 px-6 py-14 text-white shadow-sm md:px-10">
      <div className="mb-6 flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-medium  backdrop-full">
          <PhoneCall size={14} />
          Suporte 24/7 nos finais de semana.
        </span>
      </div>

      {/**CONTEUDO PRINCIPAL */}
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Quem eu aciono?</h1>
        <p className="mt-4 text-sm text-white/90 md:text-base">
          Encontre rapidamente o analista de plantão para o suporte técnico que você precisa nos
          finais de semana.
        </p>
      </div>
    </header>
  );
}
