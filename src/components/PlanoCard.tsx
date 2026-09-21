import Link from 'next/link';
import { atualizarPlanoAction } from '@/src/actions/empresa';
import { planos, type Plano } from '@/src/data/planos';

type Props = {
  planoAtual: Plano;
  totalAnalistas: number;
  totalCategorias: number;
};

function linhaUso(label: string, atual: number, limite: number | null) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="text-muted-2">{label}</span>
      <span className="font-bold text-ink">{limite === null ? `${atual} (ilimitado)` : `${atual} / ${limite}`}</span>
    </div>
  );
}

export function PlanoCard({ planoAtual, totalAnalistas, totalCategorias }: Props) {
  return (
    <div className="rounded-[20px] border border-line bg-white p-6 shadow-[0_1px_2px_rgba(20,20,20,0.04)] md:p-[30px]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-extrabold text-ink">Seu plano</h2>
        <span className="rounded-full bg-tint px-3 py-1 text-xs font-bold text-[#57534E]">
          {planoAtual.nome}
        </span>
      </div>

      <div className="mb-5 flex flex-col gap-2 rounded-2xl border border-[#ECEAE3] p-4">
        {linhaUso('Analistas cadastrados', totalAnalistas, planoAtual.maxAnalistas)}
        {linhaUso('Categorias em uso', totalCategorias, planoAtual.maxCategorias)}
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-muted-2">Acionamento via WhatsApp</span>
          <span className="font-bold text-ink">
            {planoAtual.acionamentoWhatsapp ? 'Disponível' : 'Não incluído'}
          </span>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-muted-2">Acionamento via e-mail</span>
          <span className="font-bold text-ink">
            {planoAtual.acionamentoEmail ? 'Disponível' : 'Não incluído'}
          </span>
        </div>
      </div>

      <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-3">
        Trocar de plano
      </div>
      <div className="flex flex-wrap gap-2">
        {planos.map((plano) => (
          <form key={plano.slug} action={atualizarPlanoAction.bind(null, plano.slug)}>
            <button
              type="submit"
              disabled={plano.slug === planoAtual.slug}
              className={`rounded-full px-4 py-2 text-[13px] font-bold transition ${
                plano.slug === planoAtual.slug
                  ? 'cursor-default bg-ink text-white'
                  : 'border border-line bg-white text-ink hover:bg-tint'
              }`}
            >
              {plano.nome}
            </button>
          </form>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted-2">
        Troca manual, sem cobrança automática ainda — isso muda quando o pagamento for integrado.{' '}
        <Link href="/#planos" className="font-bold text-ink underline">
          Ver detalhes dos planos
        </Link>
        .
      </p>
    </div>
  );
}
