type Props = {
  label: string;
  value: string;
};

export function StatTile({ label, value }: Props) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="text-[11px] font-bold uppercase tracking-wide text-muted-3">{label}</div>
      <div className="mt-1.5 text-2xl font-extrabold text-ink">{value}</div>
    </div>
  );
}
