import { Search } from 'lucide-react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchInput({ value, onChange, placeholder = 'Buscar analista' }: Props) {
  return (
    <label className="flex w-[220px] items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5">
      <Search size={15} className="shrink-0 text-muted-2" />
      <span className="sr-only">{placeholder}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-none bg-transparent text-[13px] outline-none placeholder:text-muted-2"
      />
    </label>
  );
}
