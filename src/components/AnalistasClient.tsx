'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import type { analistas as analistasTable } from '../db/schema';
import { normalizeText } from '../utils/normalizeText';
import { AnalistaResumo } from './AnalistaResumo';
import { EmptyStateAnalistas } from './EmptyStateAnalistas';
import { PageHeader } from './PageHeader';

type AnalistaRow = typeof analistasTable.$inferSelect;

type Props = {
  analistas: AnalistaRow[];
  empresaSlug: string;
};

export function AnalistasClient({ analistas, empresaSlug }: Props) {
  const [busca, setBusca] = useState('');

  const termo = normalizeText(busca);
  const analistasFiltrados = termo
    ? analistas.filter(
        (a) =>
          normalizeText(a.nome).includes(termo) ||
          normalizeText(a.categoria).includes(termo) ||
          normalizeText(a.area).includes(termo)
      )
    : analistas;

  const categorias = Array.from(
    new Set(analistasFiltrados.map((a) => a.categoria || 'Sem categoria'))
  ).sort((a, b) => a.localeCompare(b, 'pt-BR'));

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-8 md:px-10 md:py-9">
      <PageHeader
        eyebrow="EQUIPE"
        title="Analistas"
        lede={`${analistas.length} analista${analistas.length === 1 ? '' : 's'} cadastrado${
          analistas.length === 1 ? '' : 's'
        } na escala de plantão.`}
        search={busca}
        onSearchChange={setBusca}
        actions={
          <Link
            href={`/${empresaSlug}/analistas/novo`}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-[13px] font-bold text-white"
          >
            <Plus size={15} />
            Novo analista
          </Link>
        }
      />

      <div className="rounded-[20px] border border-line bg-white p-6 shadow-[0_1px_2px_rgba(20,20,20,0.04)] md:p-[30px]">
        {analistasFiltrados.length === 0 ? (
          <EmptyStateAnalistas
            mensagem={
              termo
                ? 'Nenhum analista encontrado para a busca.'
                : 'Cadastre o primeiro analista pra começar a montar a escala.'
            }
          />
        ) : (
          <div className="flex flex-col gap-8">
            {categorias.map((categoria) => (
              <div key={categoria}>
                <h2 className="mb-3 text-sm font-extrabold text-ink">{categoria}</h2>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {analistasFiltrados
                    .filter((a) => (a.categoria || 'Sem categoria') === categoria)
                    .map((analista) => (
                      <AnalistaResumo
                        key={analista.id}
                        analista={analista}
                        href={`/${empresaSlug}/analistas/${analista.id}`}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
