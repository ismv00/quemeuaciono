'use server';

import { revalidatePath } from 'next/cache';
import { getEmpresaAtual } from '@/src/lib/empresa-atual';
import { atualizarPlanoEmpresa } from '@/src/db/queries/empresas';
import { getPlanoPorSlug, type PlanoSlug } from '@/src/data/planos';

/**
 * Troca manual de plano, sem cobrança — provisória até o pagamento real
 * estar integrado. Qualquer admin logado da empresa pode trocar o próprio
 * plano (honestidade, igual ao teste grátis do checkout fake).
 */
export async function atualizarPlanoAction(novoPlano: PlanoSlug, _formData: FormData) {
  if (!getPlanoPorSlug(novoPlano)) {
    throw new Error('Plano inválido.');
  }

  const empresa = await getEmpresaAtual();
  await atualizarPlanoEmpresa(empresa.id, novoPlano);
  revalidatePath(`/${empresa.slug}/configuracoes`);
}
