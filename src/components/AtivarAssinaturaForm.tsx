'use client';

import { useActionState } from 'react';
import { ativarAssinaturaAction, type AssinaturaFormState } from '../actions/assinatura';

type Props = {
  nomeInicial: string;
};

export function AtivarAssinaturaForm({ nomeInicial }: Props) {
  const [state, formAction, pending] = useActionState<AssinaturaFormState, FormData>(
    ativarAssinaturaAction,
    undefined
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.error && (
        <p className="rounded-xl bg-sobreaviso-bg px-4 py-3 text-sm font-semibold text-sobreaviso-fg">
          {state.error}
        </p>
      )}

      <Campo
        label="Nome ou razão social"
        name="nome"
        defaultValue={nomeInicial}
        erro={state?.fieldErrors?.nome}
        required
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo
          label="CPF ou CNPJ"
          name="cpfCnpj"
          erro={state?.fieldErrors?.cpfCnpj}
          placeholder="Só números"
          required
        />
        <Campo
          label="Telefone"
          name="telefone"
          erro={state?.fieldErrors?.telefone}
          placeholder="67999999999"
        />
      </div>

      <Campo
        label="E-mail de cobrança"
        name="email"
        type="email"
        erro={state?.fieldErrors?.email}
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-1 w-fit rounded-full bg-accent px-5 py-2.5 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Ativando…' : 'Ativar assinatura'}
      </button>

      <p className="text-xs text-muted-2">
        Você vai ser redirecionado pra uma página do Asaas pra escolher PIX ou cartão. Nós nunca
        vemos os dados do seu cartão.
      </p>
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
