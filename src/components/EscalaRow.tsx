'use client';

import { useActionState } from 'react';
import { atualizarEscalaAction, removerEscalaAction } from '../actions/plantoes';
import type { EscalaComAnalista } from '../db/queries/plantoes';

type Props = {
  escala: EscalaComAnalista;
};

export function EscalaRow({ escala }: Props) {
  const atualizarComId = atualizarEscalaAction.bind(null, escala.id);
  const removerComId = removerEscalaAction.bind(null, escala.id);
  const [state, formAction, pending] = useActionState(atualizarComId, undefined);

  return (
    <div className="rounded-2xl border border-[#ECEAE3] p-3.5">
      <div className="mb-3 text-sm font-bold text-ink">{escala.nome}</div>

      <form action={formAction} className="flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-3">
            Regime
          </span>
          <select
            name="regime"
            defaultValue={escala.regime}
            className="rounded-lg border border-line px-2.5 py-2 text-sm text-ink"
          >
            <option value="Presencial">Presencial</option>
            <option value="Sobreaviso">Sobreaviso</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-3">
            Início
          </span>
          <input
            type="time"
            name="inicio"
            defaultValue={escala.inicio}
            required
            className="rounded-lg border border-line px-2.5 py-2 text-sm text-ink"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-3">
            Fim
          </span>
          <input
            type="time"
            name="fim"
            defaultValue={escala.fim}
            required
            className="rounded-lg border border-line px-2.5 py-2 text-sm text-ink"
          />
        </label>

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? 'Salvando…' : 'Salvar'}
        </button>
      </form>

      {state?.error && <p className="mt-2 text-xs font-semibold text-sobreaviso-fg">{state.error}</p>}

      <form action={removerComId} className="mt-2.5">
        <button type="submit" className="text-xs font-bold text-sobreaviso-fg">
          Remover escala
        </button>
      </form>
    </div>
  );
}
