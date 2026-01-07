'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Plantao } from '../types/Plantao';

type Props = {
  plantoes: Plantao[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
};

function formatMonth(date: Date) {
  return date.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
}

function getMonthDays(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  return {
    start: firstDay.getDay(),
    total: lastDay.getDate(),
  };
}

export function CalendarioPlantoes({ plantoes, selectedDate, onSelectDate }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { start, total } = getMonthDays(currentDate);
  const plantaoDates = plantoes.map((p) => p.data);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
          <Calendar size={18} />
          Calendário de Plantões
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
            }
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={() =>
              setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
            }
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/**MES */}
      <p className="mb-4 text-center text-sm capitalize text-gray-600">
        {formatMonth(currentDate)}
      </p>

      {/**DIAS DA SEMANA */}
      <div className="mb-2 grid grid-cols-7 text-center text-xs text-gray-500">
        {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      {/**DIAS */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} />
        ))}

        {Array.from({ length: total }).map((_, i) => {
          const day = i + 1;
          const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
            .toISOString()
            .split('T')[0];

          const hasPlantao = plantaoDates.includes(dateStr);
          const isSelected = selectedDate === dateStr;

          return (
            <button
              key={day}
              onClick={() => onSelectDate(dateStr)}
              className={[
                'rounded-md py-1 text-sm transition',
                hasPlantao
                  ? 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                  : 'text-gray-600 hover:bg-gray-100',
                isSelected && 'ring-2 ring-brand-500',
              ].join(' ')}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
