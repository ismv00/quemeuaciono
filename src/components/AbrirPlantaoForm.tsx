'use client';

import { useActionState } from 'react';
import { abrirPlantaoAction } from '../actions/plantoes';

export function AbrirPlantaoForm() {
  const [state, formAction, pending] = useActionState(abrirPlantaoAction, undefined);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-bold text-ink">Data do plantão</span>
        <input
          type="date"
          name="data"
          required
          className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-5 py-2.5 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Abrindo…' : 'Abrir data'}
      </button>

      {state?.error && (
        <span className="w-full text-xs font-semibold text-sobreaviso-fg">{state.error}</span>
      )}
    </form>
  );
}
