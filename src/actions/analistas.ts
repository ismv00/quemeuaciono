'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getEmpresaAtual } from '@/src/lib/empresa-atual';
import {
  arquivarAnalista,
  atualizarAnalista,
  criarAnalista,
  getAnalistasDaEmpresa,
  getCategoriasDaEmpresa,
} from '@/src/db/queries/analistas';
import { getPlanoPorSlug } from '@/src/data/planos';
import { normalizeText } from '@/src/utils/normalizeText';

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

/**
 * Categoria nova em relação ao que a empresa já usa (fora do limite do
 * plano)? `categoriasExistentes` já deve excluir o próprio analista, no
 * caso de edição — ver chamada em atualizarAnalistaAction.
 */
async function erroLimiteCategoria(
  empresaId: string,
  maxCategorias: number | null,
  categoria: string,
  excluirAnalistaId?: string
) {
  if (maxCategorias === null || !categoria) return null;

  const categoriasExistentes = await getCategoriasDaEmpresa(empresaId, excluirAnalistaId);
  const jaExiste = categoriasExistentes.some((c) => normalizeText(c) === normalizeText(categoria));

  if (!jaExiste && categoriasExistentes.length >= maxCategorias) {
    return `Seu plano permite até ${maxCategorias} categorias diferentes. Use uma categoria já cadastrada ou faça upgrade.`;
  }
  return null;
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
  const plano = getPlanoPorSlug(empresa.plano)!;

  if (plano.maxAnalistas !== null) {
    const analistasAtuais = await getAnalistasDaEmpresa(empresa.id);
    if (analistasAtuais.length >= plano.maxAnalistas) {
      return {
        error: `Seu plano (${plano.nome}) permite até ${plano.maxAnalistas} analistas. Faça upgrade pra cadastrar mais.`,
      };
    }
  }

  const erroCategoria = await erroLimiteCategoria(
    empresa.id,
    plano.maxCategorias,
    resultado.data.categoria
  );
  if (erroCategoria) return { error: erroCategoria };

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
  const plano = getPlanoPorSlug(empresa.plano)!;

  const erroCategoria = await erroLimiteCategoria(
    empresa.id,
    plano.maxCategorias,
    resultado.data.categoria,
    id
  );
  if (erroCategoria) return { error: erroCategoria };

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
