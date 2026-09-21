'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getEmpresaAtual } from '@/src/lib/empresa-atual';
import {
  adicionarEscala,
  atualizarEscala,
  getEscalaComEmpresa,
  getOrCreatePlantao,
  removerEscala,
} from '@/src/db/queries/plantoes';

const regimeValues = ['Presencial', 'Sobreaviso'] as const;
const horarioRegex = /^\d{2}:\d{2}$/;

const escalaSchema = z.object({
  analistaId: z.uuid('Selecione um analista'),
  regime: z.enum(regimeValues),
  inicio: z.string().regex(horarioRegex, 'Horário inválido'),
  fim: z.string().regex(horarioRegex, 'Horário inválido'),
});

const edicaoEscalaSchema = z.object({
  regime: z.enum(regimeValues),
  inicio: z.string().regex(horarioRegex, 'Horário inválido'),
  fim: z.string().regex(horarioRegex, 'Horário inválido'),
});

export type EscalaFormState =
  | {
      error?: string;
      fieldErrors?: Partial<Record<'analistaId' | 'regime' | 'inicio' | 'fim', string[]>>;
    }
  | undefined;

export async function abrirPlantaoAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  const data = formData.get('data');

  if (typeof data !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return { error: 'Escolha uma data válida.' };
  }

  const empresa = await getEmpresaAtual();
  redirect(`/${empresa.slug}/configuracoes/${data}`);
}

export async function adicionarEscalaAction(
  data: string,
  _prevState: EscalaFormState,
  formData: FormData
): Promise<EscalaFormState> {
  const resultado = escalaSchema.safeParse({
    analistaId: formData.get('analistaId'),
    regime: formData.get('regime'),
    inicio: formData.get('inicio'),
    fim: formData.get('fim'),
  });

  if (!resultado.success) {
    return { fieldErrors: resultado.error.flatten().fieldErrors };
  }

  const empresa = await getEmpresaAtual();
  const plantao = await getOrCreatePlantao(empresa.id, data);

  await adicionarEscala({ plantaoId: plantao.id, ...resultado.data });

  revalidatePath(`/${empresa.slug}/configuracoes/${data}`);
  revalidatePath(`/${empresa.slug}/configuracoes`);
  revalidatePath(`/${empresa.slug}`);
  redirect(`/${empresa.slug}/configuracoes/${data}`);
}

export async function atualizarEscalaAction(
  escalaId: string,
  _prevState: EscalaFormState,
  formData: FormData
): Promise<EscalaFormState> {
  const resultado = edicaoEscalaSchema.safeParse({
    regime: formData.get('regime'),
    inicio: formData.get('inicio'),
    fim: formData.get('fim'),
  });

  if (!resultado.success) {
    return { fieldErrors: resultado.error.flatten().fieldErrors };
  }

  const empresa = await getEmpresaAtual();
  const escala = await getEscalaComEmpresa(escalaId);

  if (!escala || escala.empresaId !== empresa.id) {
    return { error: 'Escala não encontrada.' };
  }

  await atualizarEscala(escalaId, resultado.data);

  revalidatePath(`/${empresa.slug}/configuracoes/${escala.data}`);
  revalidatePath(`/${empresa.slug}`);
  redirect(`/${empresa.slug}/configuracoes/${escala.data}`);
}

export async function removerEscalaAction(escalaId: string, _formData: FormData) {
  const empresa = await getEmpresaAtual();
  const escala = await getEscalaComEmpresa(escalaId);

  if (!escala || escala.empresaId !== empresa.id) {
    return;
  }

  await removerEscala(escalaId);

  revalidatePath(`/${empresa.slug}/configuracoes/${escala.data}`);
  revalidatePath(`/${empresa.slug}/configuracoes`);
  revalidatePath(`/${empresa.slug}`);
  redirect(`/${empresa.slug}/configuracoes/${escala.data}`);
}
