'use client';

import { useActionState } from 'react';
import type { AnalistaFormState } from '../actions/analistas';

type Props = {
  action: (prevState: AnalistaFormState, formData: FormData) => Promise<AnalistaFormState>;
  defaultValues?: {
    nome: string;
    categoria: string;
    area: string;
    whatsapp: string;
    email: string;
  };
  textoBotao: string;
};

export function AnalistaForm({ action, defaultValues, textoBotao }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state?.error && (
        <p className="rounded-xl bg-sobreaviso-bg px-4 py-3 text-sm font-semibold text-sobreaviso-fg">
          {state.error}
        </p>
      )}

      <Campo
        label="Nome"
        name="nome"
        defaultValue={defaultValues?.nome}
        erro={state?.fieldErrors?.nome}
        required
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo
          label="Categoria"
          name="categoria"
          defaultValue={defaultValues?.categoria}
          erro={state?.fieldErrors?.categoria}
        />
        <Campo
          label="Área"
          name="area"
          defaultValue={defaultValues?.area}
          erro={state?.fieldErrors?.area}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo
          label="WhatsApp"
          name="whatsapp"
          defaultValue={defaultValues?.whatsapp}
          erro={state?.fieldErrors?.whatsapp}
          placeholder="67999999999"
        />
        <Campo
          label="E-mail"
          name="email"
          type="email"
          defaultValue={defaultValues?.email}
          erro={state?.fieldErrors?.email}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit rounded-full bg-accent px-5 py-2.5 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Salvando…' : textoBotao}
      </button>
    </form>
  );
}

function Campo({
  label,
  name,
  defaultValue,
  erro,
  type = 'text',
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  erro?: string[];
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-bold text-ink">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink"
      />
      {erro && <span className="mt-1 block text-xs font-semibold text-sobreaviso-fg">{erro[0]}</span>}
    </label>
  );
}
