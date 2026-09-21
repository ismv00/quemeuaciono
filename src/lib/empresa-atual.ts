import { cache } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getEmpresaBySlug, getOrCreateEmpresa } from '@/src/db/queries/empresas';

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

  return getOrCreateEmpresa({ clerkOrgId: orgId, slug: orgSlug });
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
    const empresa = await getOrCreateEmpresa({ clerkOrgId: orgId, slug });
    return { empresa, isAdmin: true };
  }

  const empresa = await getEmpresaBySlug(slug);
  if (!empresa) return null;

  return { empresa, isAdmin: false };
}
