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
        flex w-full items-start gap-3
        rounded-xl border border-gray-200
        bg-white p-4 text-left transition
        hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md
        focus:outline-none
      "
    >
      {/* Ícone */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50">
        <User size={20} className="text-brand-600" />
      </div>

      {/* Conteúdo */}
      <div className="min-w-0 flex-1">
        {/* Nome + status */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 break-words">{analista.nome}</span>

          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${
              isOnline ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
        </div>

        {/* Área */}
        <span className="block text-sm text-gray-500 break-words">{analista.area}</span>

        {/* Regime */}
        <span
          className={`mt-1 inline-flex w-fit rounded-full px-2 py-0.5 text-xs ${
            analista.regime === 'Presencial'
              ? 'bg-green-50 text-green-700'
              : 'bg-orange-50 text-orange-700'
          }`}
        >
          {analista.regime}
        </span>
      </div>
    </button>
  );
}
