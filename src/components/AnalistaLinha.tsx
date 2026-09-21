'use client';

import { ChevronRight } from 'lucide-react';
import { Analista } from '../types/Analista';
import { getInitials } from '../utils/initials';

type Props = {
  analista: Analista;
  isOnline: boolean;
  onClick: () => void;
};

export function AnalistaLinha({ analista, isOnline, onClick }: Props) {
  const isPresencial = analista.regime === 'Presencial';

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#ECEAE3] p-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative shrink-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-tint text-[13px] font-extrabold text-[#57534E]">
            {getInitials(analista.nome)}
          </div>
          <span
            className={`absolute bottom-0 right-0 h-[11px] w-[11px] rounded-full border-2 border-white ${
              isOnline ? 'bg-online' : 'bg-offline'
            }`}
          />
        </div>

        <div className="min-w-0">
          <div className="truncate text-sm font-bold text-ink">{analista.nome}</div>
          <div className="truncate text-xs text-muted-2">
            {analista.categoria} · {analista.area}
          </div>
          <span
            className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
              isPresencial ? 'bg-ativo-bg text-ativo-fg' : 'bg-sobreaviso-bg text-sobreaviso-fg'
            }`}
          >
            {analista.regime}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onClick}
        className="flex shrink-0 items-center gap-1 rounded-full bg-ink px-3.5 py-2 text-xs font-bold text-white"
      >
        Ver detalhes
        <ChevronRight size={13} />
      </button>
    </div>
  );
}
