import Link from 'next/link';
import { Check } from 'lucide-react';
import { formatarPreco, type Plano } from '../data/planos';

export function PricingCard({ plano }: { plano: Plano }) {
  const destaque = plano.destaque ?? false;

  return (
    <div
      className={`flex flex-col rounded-[20px] border p-7 ${
        destaque ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink'
      }`}
    >
      <div className="mb-3 h-5">
        {destaque && (
          <span className="w-fit rounded-full bg-accent px-3 py-1 text-[11px] font-extrabold text-white">
            Mais popular
          </span>
        )}
      </div>

      <h3 className="text-lg font-extrabold">{plano.nome}</h3>
      <p className={`mt-1 text-sm ${destaque ? 'text-white/70' : 'text-muted-2'}`}>
        {plano.descricao}
      </p>

      <div className="mt-5 flex items-baseline gap-1">
        <span className="text-3xl font-extrabold">{formatarPreco(plano.preco)}</span>
        <span className={`text-sm ${destaque ? 'text-white/70' : 'text-muted-2'}`}>/mês</span>
      </div>
      <div
        className={`mt-1 text-xs font-bold uppercase tracking-wide ${
          destaque ? 'text-white/60' : 'text-muted-3'
        }`}
      >
        {plano.limiteAnalistas}
      </div>

      <ul className="mt-6 flex flex-col gap-2.5 text-sm">
        {plano.recursos.map((recurso) => (
          <li key={recurso} className="flex items-start gap-2">
            <Check size={16} className={`mt-0.5 shrink-0 ${destaque ? 'text-accent' : 'text-ativo-fg'}`} />
            <span>{recurso}</span>
          </li>
        ))}
      </ul>

      <Link
        href={`/assinar/${plano.slug}`}
        className={`mt-7 rounded-full px-5 py-3 text-center text-sm font-extrabold transition ${
          destaque ? 'bg-accent text-white hover:brightness-95' : 'bg-ink text-white hover:opacity-90'
        }`}
      >
        Começar teste grátis
      </Link>
    </div>
  );
}
