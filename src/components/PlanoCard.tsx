import Link from 'next/link';
import { atualizarPlanoAction } from '@/src/actions/empresa';
import { AtivarAssinaturaForm } from '@/src/components/AtivarAssinaturaForm';
import { planos, DIAS_TESTE_GRATIS, type Plano } from '@/src/data/planos';
import type { StatusAssinatura } from '@/src/db/queries/empresas';
import { diasAte, somarDiasISO } from '@/src/utils/date';

type Props = {
  planoAtual: Plano;
  totalAnalistas: number;
  totalCategorias: number;
  nomeEmpresa: string;
  statusAssinatura: StatusAssinatura;
  asaasSubscriptionId: string | null;
  criadoEm: Date;
};

function linhaUso(label: string, atual: number, limite: number | null) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="text-muted-2">{label}</span>
      <span className="font-bold text-ink">{limite === null ? `${atual} (ilimitado)` : `${atual} / ${limite}`}</span>
    </div>
  );
}

const badgePorStatus: Record<StatusAssinatura, { texto: string; classe: string }> = {
  trial: { texto: 'Teste grátis', classe: 'bg-tint text-[#57534E]' },
  ativa: { texto: 'Assinatura ativa', classe: 'bg-ativo-bg text-ativo-fg' },
  atrasada: { texto: 'Pagamento atrasado', classe: 'bg-sobreaviso-bg text-sobreaviso-fg' },
  cancelada: { texto: 'Assinatura cancelada', classe: 'bg-[#EDECE7] text-[#7A776F]' },
};

export function PlanoCard({
  planoAtual,
  totalAnalistas,
  totalCategorias,
  nomeEmpresa,
  statusAssinatura,
  asaasSubscriptionId,
  criadoEm,
}: Props) {
  const badge = badgePorStatus[statusAssinatura];
  const fimDoTrial = somarDiasISO(criadoEm, DIAS_TESTE_GRATIS);
  const diasRestantes = diasAte(fimDoTrial);
  // Cancelada: precisa criar uma assinatura nova no Asaas, então volta a
  // mostrar o formulário de ativação mesmo já tendo tido uma antes.
  const precisaAtivar = !asaasSubscriptionId || statusAssinatura === 'cancelada';

  return (
    <div className="rounded-[20px] border border-line bg-white p-6 shadow-[0_1px_2px_rgba(20,20,20,0.04)] md:p-[30px]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[15px] font-extrabold text-ink">Seu plano</h2>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${badge.classe}`}>
            {badge.texto}
            {statusAssinatura === 'trial' && diasRestantes >= 0 && ` — ${diasRestantes} dias`}
          </span>
          <span className="rounded-full bg-tint px-3 py-1 text-xs font-bold text-[#57534E]">
            {planoAtual.nome}
          </span>
        </div>
      </div>

      {statusAssinatura === 'atrasada' && (
        <p className="mb-4 rounded-xl bg-sobreaviso-bg px-4 py-3 text-[13px] font-semibold text-sobreaviso-fg">
          O último pagamento não foi confirmado. O Asaas já reenviou a cobrança pro seu e-mail —
          seu calendário continua funcionando normalmente enquanto isso.
        </p>
      )}

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
      <div className="mb-5 flex flex-wrap gap-2">
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

      {precisaAtivar ? (
        <>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-3">
            Ativar assinatura
          </div>
          <AtivarAssinaturaForm nomeInicial={nomeEmpresa} />
        </>
      ) : (
        <p className="text-xs text-muted-2">
          Trocar de plano aqui já atualiza o valor cobrado nos próximos ciclos da sua assinatura.
        </p>
      )}

      <p className="mt-4 text-xs text-muted-2">
        <Link href="/#planos" className="font-bold text-ink underline">
          Ver detalhes dos planos
        </Link>
        .
      </p>
    </div>
  );
}
