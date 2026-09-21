type Item = {
  label: string;
  sublabel?: string;
  total: number;
};

type Props = {
  titulo: string;
  itens: Item[];
};

export function BarList({ titulo, itens }: Props) {
  const max = Math.max(1, ...itens.map((i) => i.total));

  return (
    <div className="rounded-[20px] border border-line bg-white p-6 shadow-[0_1px_2px_rgba(20,20,20,0.04)] md:p-[30px]">
      <h2 className="mb-5 text-[15px] font-extrabold text-ink">{titulo}</h2>

      {itens.length === 0 ? (
        <p className="text-[13px] text-muted-2">Sem dados suficientes.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {itens.map((item) => {
            const pct = Math.max(3, (item.total / max) * 100);

            return (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-36 shrink-0 truncate text-[13px] font-semibold text-ink" title={item.label}>
                  {item.label}
                  {item.sublabel && (
                    <span className="block truncate text-[11px] font-normal text-muted-2">
                      {item.sublabel}
                    </span>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div
                    className="h-5 shrink-0 rounded-r-full bg-accent"
                    style={{ width: `${pct}%` }}
                  />
                  <span className="shrink-0 text-[13px] font-bold tabular-nums text-ink">
                    {item.total}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
