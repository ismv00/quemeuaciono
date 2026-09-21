'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Plantao } from '../types/Plantao';
import { getTodayISO } from '../utils/date';

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
  const todayISO = getTodayISO();

  return (
    <div className="flex flex-col gap-4 rounded-[20px] border border-line bg-white p-6 shadow-[0_1px_2px_rgba(20,20,20,0.04)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[15px] font-extrabold text-ink">
          <Calendar size={16} />
          <span className="capitalize">{formatMonth(currentDate)}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Mês anterior"
            onClick={() =>
              setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
            }
            className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] border border-line text-[#57534E] hover:bg-bg"
          >
            <ChevronLeft size={14} />
          </button>

          <button
            type="button"
            aria-label="Próximo mês"
            onClick={() =>
              setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
            }
            className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] border border-line text-[#57534E] hover:bg-bg"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'].map((d) => (
          <span key={d} className="pb-1 text-[10px] font-extrabold uppercase tracking-wide text-muted-3">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: start }).map((_, i) => (
          <span key={`empty-${i}`} />
        ))}

        {Array.from({ length: total }).map((_, i) => {
          const day = i + 1;

          const year = currentDate.getFullYear();
          const month = String(currentDate.getMonth() + 1).padStart(2, '0');
          const dayStr = String(day).padStart(2, '0');

          const dateStr = `${year}-${month}-${dayStr}`;

          const hasPlantao = plantaoDates.includes(dateStr);
          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === todayISO;

          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDate(dateStr)}
              aria-current={isToday ? 'date' : undefined}
              aria-label={`Dia ${day}${hasPlantao ? ', com plantão' : ''}`}
              className={[
                'relative flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold transition-colors',
                isSelected
                  ? 'bg-ink text-white'
                  : isToday
                    ? 'border border-ink text-ink font-extrabold hover:bg-bg'
                    : 'text-[#2A2A33] hover:bg-bg',
              ].join(' ')}
            >
              {day}
              {hasPlantao && (
                <span
                  className={`absolute bottom-1.5 h-[5px] w-[5px] rounded-full ${
                    isSelected ? 'bg-white' : 'bg-accent'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 border-t border-[#EFEDE7] pt-1.5 text-[11px] font-semibold text-muted-2">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Dia com plantão
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded border border-ink" />
          Hoje
        </div>
      </div>
    </div>
  );
}
