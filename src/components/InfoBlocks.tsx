import { Clock, MessageCircle, ShieldCheck } from 'lucide-react';

const items = [
  {
    icon: Clock,
    title: 'Acesso Rápido',
    description: 'Encontre o analista em segundos.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Direto',
    description: 'Contato imediato com um clique.',
  },
  {
    icon: ShieldCheck,
    title: 'Suporte Garantido',
    description: 'Cobertura Completa nos finais de semana.',
  },
];

export function InfoBlocks() {
  return (
    <section className="grid gap-6 md:grid-cols-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text text-brand-600">
            <item.icon size={20} />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
            <p className="text-xs text-gray-600">{item.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
