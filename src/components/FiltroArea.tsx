import { Filter } from 'lucide-react';

type Props = {
  areas: string[];
  areaSelecionada: string | null;
  onSelectArea: (area: string | null) => void;
};

export function FiltroArea({ areas, areaSelecionada, onSelectArea }: Props) {
  return (
    <div className="mb-4">
      {/* Header do filtro */}
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-500">
        <Filter size={14} />
        Filtrar por área
      </div>

      {/* Opções */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onSelectArea(null)}
          className={`
            rounded-full border px-3 py-1 text-sm font-medium
            transition-all duration-200
            ${
              areaSelecionada === null
                ? 'scale-105 border-brand-600 bg-brand-50 text-brand-700 opacity-100'
                : 'border-gray-200 bg-white text-gray-700 opacity-80 hover:scale-105 hover:bg-gray-100 hover:opacity-100'
            }
          `}
        >
          Todas
        </button>

        {areas.map((area) => (
          <button
            key={area}
            onClick={() => onSelectArea(area)}
            className={`
              rounded-full border px-3 py-1 text-sm font-medium
              transition-all duration-200
              ${
                areaSelecionada === area
                  ? 'scale-105 border-brand-600 bg-brand-50 text-brand-700 opacity-100'
                  : 'border-gray-200 bg-white text-gray-700 opacity-80 hover:scale-105 hover:bg-gray-100 hover:opacity-100'
              }
            `}
          >
            {area}
          </button>
        ))}
      </div>
    </div>
  );
}
