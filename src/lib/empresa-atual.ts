import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getEmpresaBySlug, getOrCreateEmpresa } from '@/src/db/queries/empresas';
import { getPlanoPorSlug } from '@/src/data/planos';

const COOKIE_PLANO_SELECIONADO = 'plano_selecionado';

/**
 * Lê o plano escolhido no checkout fake (cookie gravado por CheckoutFake.tsx
 * ao confirmar). Só importa no primeiro get-or-create de uma empresa nova —
 * ver comentário em getOrCreateEmpresa.
 */
async function getPlanoEscolhidoNoCheckout() {
  const jar = await cookies();
  const valor = jar.get(COOKIE_PLANO_SELECIONADO)?.value;
  return valor ? (getPlanoPorSlug(valor)?.slug ?? undefined) : undefined;
}

/**
 * Resolve a empresa (linha no nosso banco) da organização Clerk ativa na
 * sessão. `auth.protect()` já garante que o usuário está autenticado —
 * checagem de recurso, não de middleware (ver proxy.ts). Memoizado por
 * requisição (React cache): layout e página podem chamar sem duplicar a
 * consulta ao banco.
 */
export const getEmpresaAtual = cache(async () => {
  const { orgId, orgSlug } = await auth.protect();

  if (!orgId || !orgSlug) {
    redirect('/sign-in');
  }

  const planoInicial = await getPlanoEscolhidoNoCheckout();
  return getOrCreateEmpresa({ clerkOrgId: orgId, slug: orgSlug, planoInicial });
});

/**
 * Resolve a empresa a partir do slug na URL, sem exigir login — usada pela
 * página pública do calendário. `isAdmin` diz se quem está olhando é um
 * usuário logado *desta* empresa específica.
 *
 * Só cria a linha no banco (get-or-create) quando a sessão do Clerk já
 * prova que quem está olhando é dono desta organização exata — o mesmo
 * critério de confiança do `getEmpresaAtual`. Essa é a única forma de uma
 * empresa nova ganhar sua linha: antes disso, o calendário exigia login
 * pra tudo, então a primeira visita autenticada já disparava esse
 * get-or-create; agora que o calendário é público, é aqui que isso
 * precisa acontecer, senão uma empresa recém-criada nunca aparece.
 * Um visitante anônimo (ou logado em outra empresa) nunca cria nada — só
 * lê o que já existe.
 */
export async function getVisitanteDaEmpresa(slug: string) {
  const { orgId, orgSlug } = await auth();

  if (orgId && orgSlug === slug) {
    const planoInicial = await getPlanoEscolhidoNoCheckout();
    const empresa = await getOrCreateEmpresa({ clerkOrgId: orgId, slug, planoInicial });
    return { empresa, isAdmin: true };
  }

  const empresa = await getEmpresaBySlug(slug);
  if (!empresa) return null;

  return { empresa, isAdmin: false };
}
