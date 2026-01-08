'use client';
import { User } from 'lucide-react';
import { Analista } from '../types/Analista';

type Props = {
  analista: Analista;
  isOnline: boolean;
  onClick: () => void;
};

export function CardAnalista({ analista, isOnline, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="
        flex w-full items-center justify-between rounded-xl border border-gray-200
        bg-white p-4 text-left transition
        hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md
        focus:outline-none
      "
    >
      {/* Lado esquerdo */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50">
          <User size={20} className="text-brand-600" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-semibold text-gray-900">{analista.nome}</span>

            {/* Status online/offline */}
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                isOnline ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
          </div>

          <span className="block truncate text-sm text-gray-500">{analista.area}</span>
        </div>
      </div>

      {/* Badge regime */}
      <span
        className={`inline-flex max-w-[110px] shrink-0 truncate rounded-full px-2 py-0.5 text-xs font-medium ${
          analista.regime === 'Presencial'
            ? 'bg-green-50 text-green-700'
            : 'bg-orange-50 text-orange-700'
        }`}
      >
        {analista.regime}
      </span>
    </button>
  );
}
