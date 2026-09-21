'use client';

type Props = {
  action: (formData: FormData) => void;
  nome: string;
};

export function ArquivarAnalistaButton({ action, nome }: Props) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        const confirmado = confirm(
          `Arquivar ${nome}? Ele sai da lista de analistas ativos, mas o histórico de plantões dele continua nos relatórios.`
        );
        if (!confirmado) e.preventDefault();
      }}
    >
      <button type="submit" className="text-[13px] font-bold text-sobreaviso-fg">
        Arquivar analista
      </button>
    </form>
  );
}
