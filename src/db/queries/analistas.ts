import { and, eq, ne } from 'drizzle-orm';
import { getDb } from '../index';
import { analistas } from '../schema';

export type NovoAnalista = {
  nome: string;
  categoria: string;
  area: string;
  whatsapp: string;
  email: string;
};

export async function getAnalistasDaEmpresa(empresaId: string) {
  const db = getDb();
  return db
    .select()
    .from(analistas)
    .where(and(eq(analistas.empresaId, empresaId), eq(analistas.ativo, true)))
    .orderBy(analistas.nome);
}

/**
 * Categorias distintas em uso pela empresa (ignora string vazia). Usada pra
 * checar o limite de categorias do plano. `excluirAnalistaId` tira o próprio
 * analista da contagem ao editar — senão renomear a única categoria "X" pra
 * "Y" com o limite cheio bloquearia incorretamente.
 */
export async function getCategoriasDaEmpresa(empresaId: string, excluirAnalistaId?: string) {
  const db = getDb();
  const condicoes = [eq(analistas.empresaId, empresaId), eq(analistas.ativo, true)];
  if (excluirAnalistaId) {
    condicoes.push(ne(analistas.id, excluirAnalistaId));
  }

  const linhas = await db
    .selectDistinct({ categoria: analistas.categoria })
    .from(analistas)
    .where(and(...condicoes));

  return linhas.map((l) => l.categoria).filter((c) => c.trim().length > 0);
}

export async function getAnalistaById(id: string, empresaId: string) {
  const db = getDb();
  const [analista] = await db
    .select()
    .from(analistas)
    .where(and(eq(analistas.id, id), eq(analistas.empresaId, empresaId)))
    .limit(1);

  return analista ?? null;
}

export async function criarAnalista(empresaId: string, dados: NovoAnalista) {
  const db = getDb();
  const [analista] = await db
    .insert(analistas)
    .values({ empresaId, ...dados })
    .returning();

  return analista;
}

export async function atualizarAnalista(id: string, empresaId: string, dados: NovoAnalista) {
  const db = getDb();
  const [analista] = await db
    .update(analistas)
    .set(dados)
    .where(and(eq(analistas.id, id), eq(analistas.empresaId, empresaId)))
    .returning();

  return analista ?? null;
}

export async function arquivarAnalista(id: string, empresaId: string) {
  const db = getDb();
  const [analista] = await db
    .update(analistas)
    .set({ ativo: false })
    .where(and(eq(analistas.id, id), eq(analistas.empresaId, empresaId)))
    .returning();

  return analista ?? null;
}
