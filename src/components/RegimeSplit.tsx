type Props = {
  presencial: number;
  sobreaviso: number;
};

export function RegimeSplit({ presencial, sobreaviso }: Props) {
  const total = presencial + sobreaviso;
  const pctPresencial = total ? (presencial / total) * 100 : 0;
  const pctSobreaviso = total ? (sobreaviso / total) * 100 : 0;

  return (
    <div className="rounded-[20px] border border-line bg-white p-6 shadow-[0_1px_2px_rgba(20,20,20,0.04)] md:p-[30px]">
      <h2 className="mb-5 text-[15px] font-extrabold text-ink">Escalações por regime</h2>

      {total === 0 ? (
        <p className="text-[13px] text-muted-2">Sem dados suficientes.</p>
      ) : (
        <>
          <div className="flex h-5 w-full gap-[2px] overflow-hidden rounded-full">
            <div
              className="rounded-l-full bg-ativo-fg"
              style={{ width: `${pctPresencial}%` }}
            />
            <div
              className="rounded-r-full bg-sobreaviso-fg"
              style={{ width: `${pctSobreaviso}%` }}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
            <span className="flex items-center gap-1.5 font-semibold text-ink">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-ativo-fg" />
              Presencial — {presencial} ({Math.round(pctPresencial)}%)
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-ink">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-sobreaviso-fg" />
              Sobreaviso — {sobreaviso} ({Math.round(pctSobreaviso)}%)
            </span>
          </div>
        </>
      )}
    </div>
  );
}
