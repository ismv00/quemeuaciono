type Props = {
  areas: string[];
  areaSelecionada: string | null;
  onSelectArea: (area: string | null) => void;
};

export function FiltroArea({ areas, areaSelecionada, onSelectArea }: Props) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <button
        onClick={() => onSelectArea(null)}
        className={`rounded-full border px-3 py-1  font-medium text-sm transition ${
          areaSelecionada === null
            ? 'border-brand-600 bg-brand-50 text-brand-700'
            : 'border-gray-200 bg-white  text-gray-700 hover:bg-gray-100'
        }`}
      >
        Todas
      </button>

      {areas.map((area) => (
        <button
          key={area}
          onClick={() => onSelectArea(area)}
          className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
            areaSelecionada === area
              ? 'border-brand-600 bg-brand-50 text-brand-700'
              : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {area}
        </button>
      ))}
    </div>
  );
}
