import {
  boolean,
  date,
  pgTable,
  text,
  time,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

export const planoSlugEnum = ['basico', 'profissional', 'ilimitado'] as const;

export const empresas = pgTable('empresas', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkOrgId: text('clerk_org_id').notNull().unique(),
  slug: text('slug').notNull().unique(),
  nome: text('nome').notNull(),
  // Default 'ilimitado': empresas já em produção não podem ser limitadas por
  // uma migração aditiva. Cadastros novos herdam o plano escolhido no
  // checkout (ver getOrCreateEmpresa) em vez desse default.
  plano: text('plano', { enum: planoSlugEnum }).notNull().default('ilimitado'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const analistas = pgTable(
  'analistas',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    empresaId: uuid('empresa_id')
      .notNull()
      .references(() => empresas.id, { onDelete: 'cascade' }),
    nome: text('nome').notNull(),
    categoria: text('categoria').notNull().default(''),
    area: text('area').notNull().default(''),
    whatsapp: text('whatsapp').notNull().default(''),
    email: text('email').notNull().default(''),
    ativo: boolean('ativo').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('analistas_empresa_nome_idx').on(table.empresaId, table.nome)]
);

export const plantoes = pgTable(
  'plantoes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    empresaId: uuid('empresa_id')
      .notNull()
      .references(() => empresas.id, { onDelete: 'cascade' }),
    data: date('data').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('plantoes_empresa_data_idx').on(table.empresaId, table.data)]
);

export const regimeEnum = ['Presencial', 'Sobreaviso'] as const;

export const plantaoAnalistas = pgTable('plantao_analistas', {
  id: uuid('id').primaryKey().defaultRandom(),
  plantaoId: uuid('plantao_id')
    .notNull()
    .references(() => plantoes.id, { onDelete: 'cascade' }),
  analistaId: uuid('analista_id')
    .notNull()
    .references(() => analistas.id, { onDelete: 'cascade' }),
  regime: text('regime', { enum: regimeEnum }).notNull().default('Sobreaviso'),
  inicio: time('inicio').notNull(),
  fim: time('fim').notNull(),
});
