'use server';

import { revalidatePath } from 'next/cache';
import { getEmpresaAtual } from '@/src/lib/empresa-atual';
import { atualizarPlanoEmpresa } from '@/src/db/queries/empresas';
import { getPlanoPorSlug, type PlanoSlug } from '@/src/data/planos';
import { atualizarValorAssinaturaAsaas } from '@/src/lib/asaas';

/**
 * Troca de plano. Se a empresa ainda não tem assinatura ativa no Asaas, é
 * só uma troca manual (honestidade, provisório). Se já tem, sincroniza o
 * valor cobrado no Asaas também — senão continuaria cobrando o valor do
 * plano antigo nos próximos ciclos.
 */
export async function atualizarPlanoAction(novoPlano: PlanoSlug, _formData: FormData) {
  const plano = getPlanoPorSlug(novoPlano);
  if (!plano) {
    throw new Error('Plano inválido.');
  }

  const empresa = await getEmpresaAtual();

  if (empresa.asaasSubscriptionId) {
    await atualizarValorAssinaturaAsaas(empresa.asaasSubscriptionId, plano.preco);
  }

  await atualizarPlanoEmpresa(empresa.id, novoPlano);
  revalidatePath(`/${empresa.slug}/configuracoes`);
}
