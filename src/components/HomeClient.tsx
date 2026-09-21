'use client';

import { useState } from 'react';
import { Plantao } from '@/src/types/Plantao';
import { CalendarioPlantoes } from '@/src/components/CalendarioPlantoes';
import { ListaAnalistas } from '@/src/components/ListaAnalistas';
import { EmptyStateAnalistas } from '@/src/components/EmptyStateAnalistas';
import { DetalheAnalista } from './DetalheAnalista';
import { isAnalistaOnline } from '../utils/isAnalistaOnline';
import { Analista } from '../types/Analista';
import { formatarDataLonga, getTodayISO } from '../utils/date';
import { normalizeText } from '../utils/normalizeText';
import { PageHeader } from './PageHeader';
import { StatCards } from './StatCards';

type Props = {
  plantoes: Plantao[];
  empresaNome: string;
  isAdmin: boolean;
  whatsappHabilitado: boolean;
  emailHabilitado: boolean;
};

export function HomeClient({
  plantoes,
  empresaNome,
  isAdmin,
  whatsappHabilitado,
  emailHabilitado,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(() => {
    const today = getTodayISO();

    const hasTodayPlantao = plantoes.some((p) => p.data === today);

    return hasTodayPlantao ? today : null;
  });
  const [analistaSelecionado, setAnalistaSelecionado] = useState<Analista | null>(null);
  const [busca, setBusca] = useState('');

  const plantaoSelecionado = plantoes.find((p) => p.data === selectedDate);

  const buscaAtiva = busca.trim().length > 0;
  const analistasFiltrados = buscaAtiva
    ? (plantaoSelecionado?.analistas ?? []).filter((a) => {
        const termo = normalizeText(busca);
        return (
          normalizeText(a.nome).includes(termo) ||
          normalizeText(a.categoria).includes(termo) ||
          normalizeText(a.area).includes(termo)
        );
      })
    : (plantaoSelecionado?.analistas ?? []);

  const podeAcionar = selectedDate === getTodayISO();

  function handleSelectDate(date: string) {
    setSelectedDate(date);
    setAnalistaSelecionado(null);
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-8 md:px-10 md:py-9">
      <PageHeader
        eyebrow={isAdmin ? 'SUPORTE TÉCNICO' : empresaNome}
        title="Quem eu aciono?"
        lede="Encontre rapidamente o analista de plantão para o suporte técnico que você precisa nos finais de semana."
        search={busca}
        onSearchChange={setBusca}
        showUserButton={isAdmin}
      />

      <StatCards />

      <div className="grid flex-1 gap-5 lg:grid-cols-[400px_1fr]">
        <CalendarioPlantoes
          plantoes={plantoes}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
        />

        <div className="flex flex-col rounded-[20px] border border-line bg-white p-6 shadow-[0_1px_2px_rgba(20,20,20,0.04)] md:p-[30px]">
          {!plantaoSelecionado ? (
            <EmptyStateAnalistas
              mensagem={
                selectedDate
                  ? 'Não há analistas de plantão para esta data.'
                  : 'Selecione uma data no calendário para ver os analistas escalados.'
              }
            />
          ) : analistaSelecionado ? (
            <DetalheAnalista
              analista={analistaSelecionado}
              isOnline={isAnalistaOnline(analistaSelecionado, plantaoSelecionado.data)}
              podeAcionar={podeAcionar}
              whatsappHabilitado={whatsappHabilitado}
              emailHabilitado={emailHabilitado}
              onVoltar={() => setAnalistaSelecionado(null)}
            />
          ) : (
            <ListaAnalistas
              analistas={analistasFiltrados}
              dataPlantao={plantaoSelecionado.data}
              dataLabel={formatarDataLonga(plantaoSelecionado.data)}
              buscaAtiva={buscaAtiva}
              onSelectAnalista={setAnalistaSelecionado}
            />
          )}
        </div>
      </div>
    </div>
  );
}
