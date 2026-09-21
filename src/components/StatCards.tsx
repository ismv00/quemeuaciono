import { Clock, MessageCircle, ShieldCheck } from 'lucide-react';

const items = [
  {
    icon: Clock,
    title: 'Acesso rápido',
    description: 'Encontre o analista em segundos.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp direto',
    description: 'Contato imediato com um clique.',
  },
  {
    icon: ShieldCheck,
    title: 'Suporte garantido',
    description: 'Cobertura completa nos finais de semana.',
  },
];

export function StatCards() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {items.map(({ icon: Icon, title, description }) => (
        <div
          key={title}
          className="flex items-center gap-3.5 rounded-2xl border border-line bg-white p-4"
        >
          <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-tint">
            <Icon size={18} className="text-[#57534E]" />
          </div>

          <div>
            <div className="text-[13px] font-bold text-ink">{title}</div>
            <div className="text-xs text-muted-2">{description}</div>
          </div>
        </div>
      ))}
    </section>
  );
}
