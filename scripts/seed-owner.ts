/**
 * Script único: migra os dados da planilha (CSV) hoje usada pela empresa
 * dona do projeto para o banco, como primeira empresa do SaaS. Não faz
 * parte do app em runtime — roda manualmente uma vez.
 *
 * Uso: npm run db:seed-owner -- <slug-da-organizacao-no-clerk>
 */
import { createClerkClient } from '@clerk/backend';
import { and, eq } from 'drizzle-orm';
import { getDb } from '../src/db';
import { analistas as analistasTable, plantaoAnalistas, plantoes as plantoesTable } from '../src/db/schema';
import { getOrCreateEmpresa } from '../src/db/queries/empresas';
import { fetchPlantoes } from '../src/services/fetchPlantoes';
import { getAnalistasUnicos } from '../src/utils/getAnalistasUnicos';

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Uso: npm run db:seed-owner -- <slug-da-organizacao-no-clerk>');
    process.exit(1);
  }

  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
  const org = await clerk.organizations.getOrganization({ slug });

  const empresa = await getOrCreateEmpresa({
    clerkOrgId: org.id,
    slug: org.slug!,
  });
  console.log(`Empresa: ${empresa.nome} (${empresa.id})`);

  const plantoesCsv = await fetchPlantoes();
  const analistasUnicos = getAnalistasUnicos(plantoesCsv);
  console.log(`${analistasUnicos.length} analistas únicos, ${plantoesCsv.length} plantões no CSV`);

  const db = getDb();

  const idPorNome = new Map<string, string>();
  for (const a of analistasUnicos) {
    const [row] = await db
      .insert(analistasTable)
      .values({
        empresaId: empresa.id,
        nome: a.nome,
        categoria: a.categoria,
        area: a.area,
        whatsapp: a.whatsapp,
        email: a.email,
      })
      .onConflictDoUpdate({
        target: [analistasTable.empresaId, analistasTable.nome],
        set: { categoria: a.categoria, area: a.area, whatsapp: a.whatsapp, email: a.email },
      })
      .returning();
    idPorNome.set(a.nome.toLowerCase(), row.id);
  }

  let totalEscalacoes = 0;
  for (const plantao of plantoesCsv) {
    const [plantaoRow] = await db
      .insert(plantoesTable)
      .values({ empresaId: empresa.id, data: plantao.data })
      .onConflictDoUpdate({
        target: [plantoesTable.empresaId, plantoesTable.data],
        set: { data: plantao.data },
      })
      .returning();

    for (const a of plantao.analistas) {
      if (!a.nome) continue;
      const analistaId = idPorNome.get(a.nome.toLowerCase());
      if (!analistaId) continue;

      // Uma mesma pessoa pode ter mais de um turno no mesmo dia (ex: manhã
      // presencial + tarde sobreaviso) — por isso o horário também entra
      // na checagem de duplicata, não só analista+plantão.
      const [existente] = await db
        .select({ id: plantaoAnalistas.id })
        .from(plantaoAnalistas)
        .where(
          and(
            eq(plantaoAnalistas.plantaoId, plantaoRow.id),
            eq(plantaoAnalistas.analistaId, analistaId),
            eq(plantaoAnalistas.inicio, a.inicio),
            eq(plantaoAnalistas.fim, a.fim)
          )
        )
        .limit(1);

      if (existente) continue;

      await db.insert(plantaoAnalistas).values({
        plantaoId: plantaoRow.id,
        analistaId,
        regime: a.regime,
        inicio: a.inicio,
        fim: a.fim,
      });
      totalEscalacoes++;
    }
  }

  console.log(`Pronto: ${totalEscalacoes} escalações migradas para "${empresa.nome}".`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
