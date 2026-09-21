'use client';

import { ArrowLeft, Phone } from 'lucide-react';
import { Analista } from '../types/Analista';
import { getInitials } from '../utils/initials';

type Props = {
  analista: Analista;
  isOnline: boolean;
  podeAcionar: boolean;
  onVoltar: () => void;
};

export function DetalheAnalista({ analista, isOnline, podeAcionar, onVoltar }: Props) {
  const isPresencial = analista.regime === 'Presencial';

  const whatsappLink = analista.whatsapp
    ? `https://wa.me/55${analista.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Olá ${analista.nome}, preciso de apoio no plantão.`
      )}`
    : '#';

  return (
    <div className="flex flex-1 flex-col">
      <button
        type="button"
        onClick={onVoltar}
        className="mb-5 flex w-fit items-center gap-1.5 text-[13px] font-bold text-muted"
      >
        <ArrowLeft size={14} />
        Voltar para a lista
      </button>

      <div className="mb-5 flex items-center gap-4">
        <div className="relative shrink-0">
          <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-accent/15 text-[22px] font-extrabold text-accent">
            {getInitials(analista.nome)}
          </div>
          <span
            className={`absolute bottom-0.5 right-0.5 h-[14px] w-[14px] rounded-full border-[3px] border-white ${
              isOnline ? 'bg-online' : 'bg-offline'
            }`}
          />
        </div>
        <div>
          <div className="text-xl font-extrabold text-ink">{analista.nome}</div>
          <div className="mt-0.5 text-[13px] text-muted-2">{analista.email}</div>
        </div>
      </div>

      <div className="mb-5 h-px bg-[#EFEDE7]" />

      <div className="mb-6 grid grid-cols-2 gap-[18px]">
        <div>
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-3">
            Categoria
          </div>
          <div className="text-sm font-bold text-ink">{analista.categoria}</div>
        </div>
        <div>
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-3">
            Área
          </div>
          <div className="text-sm font-bold text-ink">{analista.area}</div>
        </div>
        <div>
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-3">
            Horário do plantão
          </div>
          <div className="text-sm font-bold text-ink">
            {analista.inicio} às {analista.fim}
          </div>
        </div>
        <div>
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-3">
            Regime
          </div>
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
              isPresencial ? 'bg-ativo-bg text-ativo-fg' : 'bg-sobreaviso-bg text-sobreaviso-fg'
            }`}
          >
            {analista.regime}
          </span>
        </div>
        <div>
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-3">
            Status
          </div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-ink">
            <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-online' : 'bg-offline'}`} />
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <a
          href={podeAcionar ? whatsappLink : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!podeAcionar}
          onClick={(e) => {
            if (!podeAcionar) e.preventDefault();
          }}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-[15px] text-sm font-extrabold transition ${
            podeAcionar
              ? 'cursor-pointer bg-accent text-white hover:brightness-95'
              : 'cursor-not-allowed bg-[#EDECE7] text-[#A8A6A0]'
          }`}
        >
          <Phone size={17} />
          Acionar via WhatsApp
        </a>

        <p
          className={`mt-2.5 text-center text-xs ${
            podeAcionar ? 'font-bold text-ativo-fg' : 'text-muted-2'
          }`}
        >
          {podeAcionar
            ? 'Plantão de hoje — você já pode acionar.'
            : 'Disponível apenas no dia do plantão deste analista.'}
        </p>
      </div>
    </div>
  );
}
