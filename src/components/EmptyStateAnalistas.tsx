import { UserX } from 'lucide-react';

export function EmptyStateAnalistas() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 p-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <UserX size={22} />
      </div>

      <h3 className="text-sm font-semibold text-gray-800">Nenhum analista escalado.</h3>

      <p className="mt-1 text-xs text-gray-500">Não há analistas de plantão para esta data.</p>
    </div>
  );
}
