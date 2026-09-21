import { Analista } from '../types/Analista';
import { AnalistaLinha } from './AnalistaLinha';
import { EmptyStateAnalistas } from './EmptyStateAnalistas';
import { InfoDataSeleciona } from './DataSeleciona';
import { isAnalistaOnline } from '../utils/isAnalistaOnline';

type Props = {
  analistas: Analista[];
  dataPlantao: string;
  dataLabel: string;
  buscaAtiva: boolean;
  onSelectAnalista: (analista: Analista) => void;
};

export function ListaAnalistas({
  analistas,
  dataPlantao,
  dataLabel,
  buscaAtiva,
  onSelectAnalista,
}: Props) {
  return (
    <div className="flex flex-1 flex-col">
      <InfoDataSeleciona label={dataLabel} />
      <h2 className="mb-1.5 text-[19px] font-extrabold text-ink">Analistas de plantão</h2>
      <p className="mb-[18px] text-[13px] text-muted-2">
        Clique em um analista para ver os detalhes e acionar o contato.
      </p>

      {analistas.length === 0 ? (
        <EmptyStateAnalistas
          mensagem={
            buscaAtiva
              ? 'Nenhum analista encontrado para a busca.'
              : 'Não há analistas de plantão para esta data.'
          }
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {analistas.map((analista, index) => (
            <AnalistaLinha
              key={index}
              analista={analista}
              isOnline={isAnalistaOnline(analista, dataPlantao)}
              onClick={() => onSelectAnalista(analista)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
