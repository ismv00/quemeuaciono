'use client';

import { useActionState } from 'react';
import { adicionarEscalaAction } from '../actions/plantoes';

type Props = {
  data: string;
  analistas: { id: string; nome: string }[];
};

export function AdicionarEscalaForm({ data, analistas }: Props) {
  const adicionarNaData = adicionarEscalaAction.bind(null, data);
  const [state, formAction, pending] = useActionState(adicionarNaData, undefined);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-bold text-ink">Analista</span>
        <select
          name="analistaId"
          required
          defaultValue=""
          className="min-w-[200px] rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink"
        >
          <option value="" disabled>
            Selecione
          </option>
          {analistas.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nome}
            </option>
          ))}
        </select>
        {state?.fieldErrors?.analistaId && (
          <span className="mt-1 block text-xs font-semibold text-sobreaviso-fg">
            {state.fieldErrors.analistaId[0]}
          </span>
        )}
      </label>

      <label className="block">
        <span className="mb-1.5 block text-[13px] font-bold text-ink">Regime</span>
        <select
          name="regime"
          defaultValue="Sobreaviso"
          className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink"
        >
          <option value="Presencial">Presencial</option>
          <option value="Sobreaviso">Sobreaviso</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-[13px] font-bold text-ink">Início</span>
        <input
          type="time"
          name="inicio"
          required
          className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink"
        />
        {state?.fieldErrors?.inicio && (
          <span className="mt-1 block text-xs font-semibold text-sobreaviso-fg">
            {state.fieldErrors.inicio[0]}
          </span>
        )}
      </label>

      <label className="block">
        <span className="mb-1.5 block text-[13px] font-bold text-ink">Fim</span>
        <input
          type="time"
          name="fim"
          required
          className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink"
        />
        {state?.fieldErrors?.fim && (
          <span className="mt-1 block text-xs font-semibold text-sobreaviso-fg">
            {state.fieldErrors.fim[0]}
          </span>
        )}
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-accent px-5 py-2.5 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Adicionando…' : 'Adicionar escala'}
      </button>
    </form>
  );
}
