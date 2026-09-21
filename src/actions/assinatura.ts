'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getEmpresaAtual } from '@/src/lib/empresa-atual';
import { salvarAssinaturaAsaas } from '@/src/db/queries/empresas';
import { criarAssinaturaAsaas, criarClienteAsaas, buscarPrimeiraCobranca } from '@/src/lib/asaas';
import { DIAS_TESTE_GRATIS, getPlanoPorSlug } from '@/src/data/planos';
import { validarCpfCnpj, formatarCpfCnpjParaAsaas } from '@/src/utils/cpfCnpj';
import { getTodayISO, somarDiasISO } from '@/src/utils/date';

const assinaturaSchema = z.object({
  nome: z.string().trim().min(1, 'Nome é obrigatório'),
  cpfCnpj: z.string().trim().refine(validarCpfCnpj, 'CPF ou CNPJ inválido'),
  email: z.union([z.literal(''), z.email('E-mail inválido')]),
  telefone: z.string().trim(),
});

export type AssinaturaFormState =
  | {
      error?: string;
      fieldErrors?: Partial<Record<'nome' | 'cpfCnpj' | 'email' | 'telefone', string[]>>;
    }
  | undefined;

export async function ativarAssinaturaAction(
  _prevState: AssinaturaFormState,
  formData: FormData
): Promise<AssinaturaFormState> {
  const resultado = assinaturaSchema.safeParse({
    nome: formData.get('nome'),
    cpfCnpj: formData.get('cpfCnpj'),
    email: formData.get('email'),
    telefone: formData.get('telefone'),
  });

  if (!resultado.success) {
    return { fieldErrors: resultado.error.flatten().fieldErrors };
  }

  const empresa = await getEmpresaAtual();
  const plano = getPlanoPorSlug(empresa.plano)!;

  const fimDoTrial = somarDiasISO(empresa.createdAt, DIAS_TESTE_GRATIS);
  const nextDueDate = fimDoTrial > getTodayISO() ? fimDoTrial : getTodayISO();

  let invoiceUrl: string | null;

  try {
    // Reativação após cancelamento: reaproveita o cliente que já existe no
    // Asaas em vez de criar um duplicado.
    const customerId =
      empresa.asaasCustomerId ??
      (await criarClienteAsaas({
        nome: resultado.data.nome,
        cpfCnpj: formatarCpfCnpjParaAsaas(resultado.data.cpfCnpj),
        email: resultado.data.email || undefined,
        telefone: resultado.data.telefone || undefined,
      }));

    const subscriptionId = await criarAssinaturaAsaas({
      customerId,
      value: plano.preco,
      nextDueDate,
      description: `Quem eu aciono? — Plano ${plano.nome}`,
      externalReference: empresa.id,
    });

    await salvarAssinaturaAsaas(empresa.id, {
      asaasCustomerId: customerId,
      asaasSubscriptionId: subscriptionId,
    });

    invoiceUrl = await buscarPrimeiraCobranca(subscriptionId);
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : 'Erro ao ativar assinatura.';
    return { error: mensagem };
  }

  revalidatePath(`/${empresa.slug}/configuracoes`);

  if (invoiceUrl) {
    redirect(invoiceUrl);
  }

  redirect(`/${empresa.slug}/configuracoes`);
}
