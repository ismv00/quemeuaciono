'use client';

import { Users } from 'lucide-react';
import { useState } from 'react';
import { plantoes } from '@/src/data/plantoes';
import { ListaAnalistas } from '@/src/components/ListaAnalistas';
import { Header } from '@/src/components/Header';
import { InfoBlocks } from '@/src/components/InfoBlocks';
import { CalendarioPlantoes } from '@/src/components/CalendarioPlantoes';
import { EmptyStateAnalistas } from '@/src/components/EmptyStateAnalistas';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<string | null>(plantoes[0]?.data ?? null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const plantaoSelecionado = plantoes.find((p) => p.data === selectedDate);
  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-10">
      <Header />
      <InfoBlocks />

      <div className="grid gap-8 lg:grid-cols-3">
        <CalendarioPlantoes
          selectedDate={selectedDate}
          onSelectDate={(date) => {
            setIsTransitioning(true);

            setTimeout(() => {
              setSelectedDate(date);
              setIsTransitioning(false);
            }, 150);
          }}
        />

        <div
          className={`lg:col-span-2 transition-all duration-300 ease-in-out ${
            isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          } `}
        >
          {plantaoSelecionado ? (
            <>
              <h2 className="mb-4  flex items-center gap-2 text-lg font-bold text-gray-900">
                <Users size={18} className="text-brand-600" />
                Analistas de Plantão
              </h2>
              <ListaAnalistas analistas={plantaoSelecionado.analistas} />
            </>
          ) : (
            <EmptyStateAnalistas />
          )}
        </div>
      </div>
    </main>
  );
}
