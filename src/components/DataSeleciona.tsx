import { Calendar } from 'lucide-react';

type Props = {
  label: string;
};

export function InfoDataSeleciona({ label }: Props) {
  return (
    <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-tint px-3.5 py-1.5 text-xs font-bold capitalize text-[#57534E]">
      <Calendar size={12} />
      {label}
    </div>
  );
}
