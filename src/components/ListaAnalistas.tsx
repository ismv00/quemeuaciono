import { Analista } from '../types/Analista';
import { CardAnalista } from './CardAnalista';
import { isAnalistaOnline } from '../utils/isAnalistaOnline';

type Props = {
  analistas: Analista[];
  onSelectAnalista: (analista: Analista) => void;
};

export function ListaAnalistas({ analistas, onSelectAnalista }: Props) {
  if (!analistas.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
        Nenhum analista escalado para este período
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {analistas.map((analista, index) => (
        <CardAnalista
          key={index}
          analista={analista}
          isOnline={isAnalistaOnline(analista)}
          onClick={() => onSelectAnalista(analista)}
        />
      ))}
    </div>
  );
}
