import { eq } from 'drizzle-orm';
import { clerkClient } from '@clerk/nextjs/server';
import { getDb } from '../index';
import { empresas } from '../schema';

export async function getEmpresaByClerkOrgId(clerkOrgId: string) {
  const db = getDb();
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.clerkOrgId, clerkOrgId))
    .limit(1);

  return empresa ?? null;
}

export async function getEmpresaBySlug(slug: string) {
  const db = getDb();
  const [empresa] = await db.select().from(empresas).where(eq(empresas.slug, slug)).limit(1);

  return empresa ?? null;
}

/**
 * Uma organização pode ser criada direto pela UI do Clerk (ex: tela de
 * "escolher organização"), sem passar por um cadastro nosso. Por isso toda
 * página de empresa resolve a empresa por aqui em vez de só buscar.
 *
 * - Se já existe: mantém o slug sincronizado com o Clerk (fonte da verdade)
 *   e retorna sem chamar a API do Clerk de novo.
 * - Se não existe: busca o nome no Clerk só nesse primeiro acesso e cria a
 *   linha — não vale a pena pagar essa chamada extra em toda requisição.
 */
export async function getOrCreateEmpresa(params: { clerkOrgId: string; slug: string }) {
  const db = getDb();
  const existente = await getEmpresaByClerkOrgId(params.clerkOrgId);

  if (existente) {
    if (existente.slug !== params.slug) {
      const [atualizada] = await db
        .update(empresas)
        .set({ slug: params.slug })
        .where(eq(empresas.id, existente.id))
        .returning();
      return atualizada;
    }
    return existente;
  }

  const clerk = await clerkClient();
  const org = await clerk.organizations.getOrganization({ organizationId: params.clerkOrgId });

  const [empresa] = await db
    .insert(empresas)
    .values({ clerkOrgId: params.clerkOrgId, slug: params.slug, nome: org.name })
    .onConflictDoNothing({ target: empresas.clerkOrgId })
    .returning();

  return empresa ?? (await getEmpresaByClerkOrgId(params.clerkOrgId));
}
