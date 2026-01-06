import { Analista } from '../types/Analista';

type Props = {
  analista: Analista;
};

export function CardAnalista({ analista }: Props) {
  const isPresencial = analista.regime === 'Presencial';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{analista.nome}</h3>
          <p className="text-sm text-gray-500">{analista.area}</p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            isPresencial ? 'bg-brand-100 text-brand-700' : 'bg-warning/10 text-warning'
          }`}
        >
          {analista.regime}
        </span>
      </div>

      {/* Horário */}
      <div className="mt-4 text-sm text-gray-700">
        <span className="font-medium">Horário:</span> {analista.inicio} – {analista.fim}
      </div>

      {/* Ações */}
      <div className="mt-4 flex gap-3">
        <a
          href={`https://wa.me/${analista.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-lg bg-success px-3 py-2 text-center text-sm font-medium text-white hover:opacity-90"
        >
          WhatsApp
        </a>

        <a
          href={`mailto:${analista.email}`}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          E-mail
        </a>
      </div>
    </div>
  );
}
