import { and, count, desc, eq } from 'drizzle-orm';
import { getDb } from '../index';
import { analistas, plantaoAnalistas, plantoes } from '../schema';
import { Plantao } from '../../types/Plantao';
import { Regime } from '../../types/Analista';

function semSegundos(hora: string) {
  return hora.slice(0, 5);
}

export async function getPlantoesForEmpresa(empresaId: string): Promise<Plantao[]> {
  const db = getDb();

  const linhas = await db
    .select({
      data: plantoes.data,
      nome: analistas.nome,
      categoria: analistas.categoria,
      area: analistas.area,
      whatsapp: analistas.whatsapp,
      email: analistas.email,
      regime: plantaoAnalistas.regime,
      inicio: plantaoAnalistas.inicio,
      fim: plantaoAnalistas.fim,
    })
    .from(plantoes)
    .innerJoin(plantaoAnalistas, eq(plantaoAnalistas.plantaoId, plantoes.id))
    .innerJoin(analistas, eq(analistas.id, plantaoAnalistas.analistaId))
    .where(eq(plantoes.empresaId, empresaId));

  const mapa = new Map<string, Plantao>();

  for (const linha of linhas) {
    if (!mapa.has(linha.data)) {
      mapa.set(linha.data, { data: linha.data, analistas: [] });
    }

    mapa.get(linha.data)!.analistas.push({
      nome: linha.nome,
      categoria: linha.categoria,
      area: linha.area,
      regime: linha.regime,
      inicio: semSegundos(linha.inicio),
      fim: semSegundos(linha.fim),
      whatsapp: linha.whatsapp,
      email: linha.email,
    });
  }

  return Array.from(mapa.values());
}

export async function getOrCreatePlantao(empresaId: string, data: string) {
  const db = getDb();
  const existente = await getPlantaoPorData(empresaId, data);
  if (existente) return existente;

  const [plantao] = await db
    .insert(plantoes)
    .values({ empresaId, data })
    .onConflictDoNothing({ target: [plantoes.empresaId, plantoes.data] })
    .returning();

  return plantao ?? (await getPlantaoPorData(empresaId, data));
}

async function getPlantaoPorData(empresaId: string, data: string) {
  const db = getDb();
  const [plantao] = await db
    .select()
    .from(plantoes)
    .where(and(eq(plantoes.empresaId, empresaId), eq(plantoes.data, data)))
    .limit(1);

  return plantao ?? null;
}

export type EscalaComAnalista = {
  id: string;
  analistaId: string;
  nome: string;
  regime: Regime;
  inicio: string;
  fim: string;
};

export async function getPlantaoComEscalas(empresaId: string, data: string) {
  const plantao = await getPlantaoPorData(empresaId, data);
  if (!plantao) return { plantao: null, escalas: [] as EscalaComAnalista[] };

  const db = getDb();
  const linhas = await db
    .select({
      id: plantaoAnalistas.id,
      analistaId: plantaoAnalistas.analistaId,
      nome: analistas.nome,
      regime: plantaoAnalistas.regime,
      inicio: plantaoAnalistas.inicio,
      fim: plantaoAnalistas.fim,
    })
    .from(plantaoAnalistas)
    .innerJoin(analistas, eq(analistas.id, plantaoAnalistas.analistaId))
    .where(eq(plantaoAnalistas.plantaoId, plantao.id))
    .orderBy(analistas.nome);

  return {
    plantao,
    escalas: linhas.map((l) => ({ ...l, inicio: semSegundos(l.inicio), fim: semSegundos(l.fim) })),
  };
}

/** Confere de qual empresa uma escala é, sem confiar em nada vindo do cliente. */
export async function getEscalaComEmpresa(escalaId: string) {
  const db = getDb();
  const [linha] = await db
    .select({
      id: plantaoAnalistas.id,
      plantaoId: plantaoAnalistas.plantaoId,
      empresaId: plantoes.empresaId,
      data: plantoes.data,
    })
    .from(plantaoAnalistas)
    .innerJoin(plantoes, eq(plantoes.id, plantaoAnalistas.plantaoId))
    .where(eq(plantaoAnalistas.id, escalaId))
    .limit(1);

  return linha ?? null;
}

export async function adicionarEscala(dados: {
  plantaoId: string;
  analistaId: string;
  regime: Regime;
  inicio: string;
  fim: string;
}) {
  const db = getDb();
  const [escala] = await db.insert(plantaoAnalistas).values(dados).returning();
  return escala;
}

export async function atualizarEscala(
  escalaId: string,
  dados: { regime: Regime; inicio: string; fim: string }
) {
  const db = getDb();
  const [escala] = await db
    .update(plantaoAnalistas)
    .set(dados)
    .where(eq(plantaoAnalistas.id, escalaId))
    .returning();

  return escala ?? null;
}

export async function removerEscala(escalaId: string) {
  const db = getDb();
  await db.delete(plantaoAnalistas).where(eq(plantaoAnalistas.id, escalaId));
}

export async function listarPlantoesResumo(empresaId: string) {
  const db = getDb();
  return db
    .select({
      id: plantoes.id,
      data: plantoes.data,
      totalEscalas: count(plantaoAnalistas.id),
    })
    .from(plantoes)
    .leftJoin(plantaoAnalistas, eq(plantaoAnalistas.plantaoId, plantoes.id))
    .where(eq(plantoes.empresaId, empresaId))
    .groupBy(plantoes.id, plantoes.data)
    .orderBy(desc(plantoes.data));
}
