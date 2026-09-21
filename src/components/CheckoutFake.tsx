'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { formatarPreco, type Plano } from '../data/planos';

type Props = {
  plano: Plano;
  diasTeste: number;
};

export function CheckoutFake({ plano, diasTeste }: Props) {
  const [estado, setEstado] = useState<'form' | 'processando' | 'sucesso'>('form');

  function confirmar() {
    setEstado('processando');
    setTimeout(() => {
      // Lido por getEmpresaAtual() no primeiro login pra herdar o plano
      // escolhido aqui ao criar a empresa. TTL curto: só precisa sobreviver
      // ao trajeto checkout -> criar conta, feito na mesma sessão.
      document.cookie = `plano_selecionado=${plano.slug}; path=/; max-age=3600; samesite=lax`;
      setEstado('sucesso');
    }, 1200);
  }

  if (estado === 'sucesso') {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[20px] border border-line bg-white p-7 text-center shadow-[0_1px_2px_rgba(20,20,20,0.04)]">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ativo-bg">
          <CheckCircle2 size={28} className="text-ativo-fg" />
        </div>
        <h1 className="text-lg font-extrabold text-ink">Teste grátis ativado!</h1>
        <p className="text-sm text-muted-2">
          Você tem {diasTeste} dias no plano {plano.nome} sem cobrança. Agora crie sua conta pra
          começar a cadastrar sua equipe e sua escala.
        </p>
        <Link
          href="/sign-up"
          className="mt-2 w-full rounded-full bg-accent px-5 py-3 text-center text-sm font-extrabold text-white transition hover:brightness-95"
        >
          Criar minha conta
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-[20px] border border-line bg-white p-7 shadow-[0_1px_2px_rgba(20,20,20,0.04)]">
      <div className="mb-5 flex items-center justify-between border-b border-[#EFEDE7] pb-5">
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-muted-3">Plano</div>
          <div className="text-lg font-extrabold text-ink">{plano.nome}</div>
          <div className="text-xs text-muted-2">{plano.limiteAnalistas}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-extrabold text-ink">{formatarPreco(plano.preco)}</div>
          <div className="text-xs text-muted-2">/mês após o teste</div>
        </div>
      </div>

      <div className="mb-5 rounded-xl bg-tint px-4 py-3 text-[13px] text-[#57534E]">
        {diasTeste} dias grátis — você só é cobrado depois disso, e pode cancelar quando quiser.
      </div>

      <p className="mb-4 text-[11px] font-semibold uppercase tracking-wide text-muted-3">
        Ambiente de demonstração — nenhum pagamento real é processado aqui.
      </p>

      <button
        type="button"
        onClick={confirmar}
        disabled={estado === 'processando'}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-extrabold text-white transition disabled:cursor-not-allowed disabled:opacity-70"
      >
        {estado === 'processando' && <Loader2 size={16} className="animate-spin" />}
        {estado === 'processando' ? 'Confirmando…' : `Começar teste grátis de ${diasTeste} dias`}
      </button>
    </div>
  );
}
