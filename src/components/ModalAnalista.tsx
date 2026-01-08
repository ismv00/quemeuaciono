'use client';

import { X, Phone } from 'lucide-react';
import { Analista } from '../types/Analista';
import { useEffect, useState } from 'react';

type Props = {
  analista: Analista;
  isOnline: boolean;
  onClose: () => void;
};

export function ModalAnalista({ analista, isOnline, onClose }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  function handleClose() {
    setIsVisible(false);
    setTimeout(onClose, 200);
  }

  const whatsappLink = analista.whatsapp
    ? `https://wa.me/55${analista.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Olá ${analista.nome}, preciso de apoio no plantão.`
      )}`
    : '#';

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/40 backdrop-blur-sm
        transition-opacity duration-200
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <div
        className={`
          w-full max-w-md rounded-2xl bg-white p-6 shadow-xl
          transition-all duration-200 ease-out
          ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
        `}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{analista.nome}</h2>

          <button
            onClick={handleClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <span className="font-medium text-gray-800">Área:</span> {analista.area}
          </p>

          <p>
            <span className="font-medium text-gray-800">Regime:</span> {analista.regime}
          </p>

          <p className="flex items-center gap-2">
            <span className="font-medium text-gray-800">Status:</span>
            <span
              className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
            />
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>

        {/* Ações */}
        <div className="mt-6">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!isOnline}
            className={`
              flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold
              transition
              ${
                isOnline
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'cursor-not-allowed bg-gray-200 text-gray-400'
              }
            `}
            onClick={(e) => {
              if (!isOnline) e.preventDefault();
            }}
          >
            <Phone size={18} />
            Acionar WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
