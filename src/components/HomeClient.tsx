'use client';

import { useState } from 'react';
import { Users } from 'lucide-react';
import { Plantao } from '@/src/types/Plantao';
import { CalendarioPlantoes } from '@/src/components/CalendarioPlantoes';
import { ListaAnalistas } from '@/src/components/ListaAnalistas';
import { EmptyStateAnalistas } from '@/src/components/EmptyStateAnalistas';
import { ModalAnalista } from './ModalAnalista';
import { isAnalistaOnline } from '../utils/isAnalistaOnline';
import { Analista } from '../types/Analista';
import { InfoDataSeleciona } from './DataSeleciona';
import { FiltroArea } from './FiltroArea';

type Props = {
  plantoes: Plantao[];
};

export function HomeClient({ plantoes }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(plantoes[0]?.data ?? null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [analistaSelecionado, setAnalistaSelecionado] = useState<Analista | null>(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);

  const plantaoSelecionado = plantoes.find((p) => p.data === selectedDate);

  // Buscar as areas que temos cadastradas
  const areasDisponiveis = Array.from(
    new Set(plantaoSelecionado?.analistas.map((a) => a.categoria))
  );

  // Filtrar os analistas
  const analistasFiltrados = categoriaSelecionada
    ? plantaoSelecionado?.analistas.filter((a) => a.categoria === categoriaSelecionada)
    : plantaoSelecionado?.analistas;

  function formatarData(data?: string) {
    if (!data || !data.includes('-')) return '';

    const parts = data.split('-');
    if (parts.length !== 3) return '';

    const [year, month, day] = parts.map(Number);
    const date = new Date(year, month - 1, day);

    if (isNaN(date.getTime())) return '';

    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    });
  }

  const handleSelectArea = (categoria: string | null) => {
    setCategoriaSelecionada(categoria);

    // Força scroll suave pro topo
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <CalendarioPlantoes
        plantoes={plantoes}
        selectedDate={selectedDate}
        onSelectDate={(date) => {
          setIsTransitioning(true);
          setAnalistaSelecionado(null);
          setTimeout(() => {
            setSelectedDate(date);
            setIsTransitioning(false);
          }, 150);
        }}
      />

      <div
        className={`lg:col-span-2 transition-all duration-300 ease-in-out ${
          isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
        }`}
      >
        {plantaoSelecionado ? (
          <>
            <InfoDataSeleciona label={formatarData(plantaoSelecionado.data)} />
            <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-gray-900">
              <Users size={18} className="text-brand-600" />
              Analistas de Plantão
            </h2>

            <FiltroArea
              areas={areasDisponiveis}
              areaSelecionada={categoriaSelecionada}
              onSelectArea={handleSelectArea}
            />

            <span className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600">
              Clique no analista para ver os detalhes
            </span>

            <ListaAnalistas
              // analistas={plantaoSelecionado.analistas}
              analistas={analistasFiltrados ?? []}
              dataPlantao={plantaoSelecionado.data}
              onSelectAnalista={setAnalistaSelecionado}
            />

            {analistaSelecionado && (
              <ModalAnalista
                analista={analistaSelecionado}
                isOnline={isAnalistaOnline(analistaSelecionado, plantaoSelecionado.data)}
                onClose={() => setAnalistaSelecionado(null)}
              />
            )}
          </>
        ) : (
          <EmptyStateAnalistas />
        )}
      </div>
    </div>
  );
}
