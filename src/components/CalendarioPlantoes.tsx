'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { plantoes } from '../data/plantoes';

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

export function CalendarioPlantoes() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { start, total } = getMonthDays(currentDate);

  const plantaoDates = plantoes.map((p) => p.data);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
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
      <p>{formatMonth(currentDate)}</p>
    </div>
  );
}
