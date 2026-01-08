import { Calendar } from 'lucide-react';

type Props = {
  label: string;
};

export function InfoDataSeleciona({ label }: Props) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700">
      <Calendar size={16} />
      {label}
    </div>
  );
}
