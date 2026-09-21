import { UserX } from 'lucide-react';

type Props = {
  mensagem?: string;
};

export function EmptyStateAnalistas({
  mensagem = 'Selecione uma data no calendário para ver os analistas escalados.',
}: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3.5 py-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-tint">
        <UserX size={28} className="text-muted-3" />
      </div>

      <div>
        <h3 className="mb-1 text-base font-extrabold text-ink">Nenhum analista escalado</h3>
        <p className="max-w-[260px] text-[13px] text-muted-2">{mensagem}</p>
      </div>
    </div>
  );
}
