import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getInitials } from '../utils/initials';

type Props = {
  analista: {
    id: string;
    nome: string;
    categoria: string;
    area: string;
    ativo: boolean;
  };
  href: string;
};

export function AnalistaResumo({ analista, href }: Props) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-[#ECEAE3] bg-white p-3.5 transition hover:border-line hover:shadow-sm"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tint text-[13px] font-extrabold text-[#57534E]">
        {getInitials(analista.nome)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold text-ink">{analista.nome}</div>
        <div className="truncate text-xs text-muted-2">
          {analista.categoria} · {analista.area}
        </div>
        <span
          className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
            analista.ativo ? 'bg-ativo-bg text-ativo-fg' : 'bg-sobreaviso-bg text-sobreaviso-fg'
          }`}
        >
          {analista.ativo ? 'Ativo' : 'Arquivado'}
        </span>
      </div>

      <ChevronRight size={16} className="shrink-0 text-muted-3" />
    </Link>
  );
}
