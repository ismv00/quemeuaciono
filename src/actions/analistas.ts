'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getEmpresaAtual } from '@/src/lib/empresa-atual';
import { arquivarAnalista, atualizarAnalista, criarAnalista } from '@/src/db/queries/analistas';

const analistaSchema = z.object({
  nome: z.string().trim().min(1, 'Nome é obrigatório'),
  categoria: z.string().trim(),
  area: z.string().trim(),
  whatsapp: z.string().trim(),
  email: z.union([z.literal(''), z.email('E-mail inválido')]),
});

export type AnalistaFormState =
  | {
      error?: string;
      fieldErrors?: Partial<Record<'nome' | 'categoria' | 'area' | 'whatsapp' | 'email', string[]>>;
    }
  | undefined;

function isUniqueViolation(erro: unknown) {
  return (
    typeof erro === 'object' && erro !== null && (erro as { code?: string }).code === '23505'
  );
}

function parseFormData(formData: FormData) {
  return analistaSchema.safeParse({
    nome: formData.get('nome'),
    categoria: formData.get('categoria'),
    area: formData.get('area'),
    whatsapp: formData.get('whatsapp'),
    email: formData.get('email'),
  });
}

export async function criarAnalistaAction(
  _prevState: AnalistaFormState,
  formData: FormData
): Promise<AnalistaFormState> {
  const resultado = parseFormData(formData);

  if (!resultado.success) {
    return { fieldErrors: resultado.error.flatten().fieldErrors };
  }

  const empresa = await getEmpresaAtual();

  try {
    await criarAnalista(empresa.id, resultado.data);
  } catch (erro) {
    if (isUniqueViolation(erro)) {
      return { fieldErrors: { nome: ['Já existe um analista com esse nome.'] } };
    }
    throw erro;
  }

  revalidatePath(`/${empresa.slug}/analistas`);
  redirect(`/${empresa.slug}/analistas`);
}

export async function atualizarAnalistaAction(
  id: string,
  _prevState: AnalistaFormState,
  formData: FormData
): Promise<AnalistaFormState> {
  const resultado = parseFormData(formData);

  if (!resultado.success) {
    return { fieldErrors: resultado.error.flatten().fieldErrors };
  }

  const empresa = await getEmpresaAtual();

  try {
    const atualizado = await atualizarAnalista(id, empresa.id, resultado.data);
    if (!atualizado) {
      return { error: 'Analista não encontrado.' };
    }
  } catch (erro) {
    if (isUniqueViolation(erro)) {
      return { fieldErrors: { nome: ['Já existe um analista com esse nome.'] } };
    }
    throw erro;
  }

  revalidatePath(`/${empresa.slug}/analistas`);
  redirect(`/${empresa.slug}/analistas`);
}

export async function arquivarAnalistaAction(id: string, _formData: FormData) {
  const empresa = await getEmpresaAtual();
  await arquivarAnalista(id, empresa.id);
  revalidatePath(`/${empresa.slug}/analistas`);
  redirect(`/${empresa.slug}/analistas`);
}
