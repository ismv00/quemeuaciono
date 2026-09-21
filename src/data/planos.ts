export type Plano = {
  slug: string;
  nome: string;
  preco: number;
  limiteAnalistas: string;
  descricao: string;
  destaque?: boolean;
  recursos: string[];
};

export const DIAS_TESTE_GRATIS = 15;

export const planos: Plano[] = [
  {
    slug: 'basico',
    nome: 'Básico',
    preco: 9.9,
    limiteAnalistas: 'até 5 analistas',
    descricao: 'Pra equipes pequenas começarem a sair da planilha.',
    recursos: [
      'Calendário de plantão público',
      'Cadastro de analistas e escalas',
      'Visualização dos dados dos analistas',
      'Relatórios de escalação',
    ],
  },
  {
    slug: 'profissional',
    nome: 'Profissional',
    preco: 29.9,
    limiteAnalistas: 'até 15 analistas',
    descricao: 'Pra times que já têm uma escala mais robusta.',
    destaque: true,
    recursos: [
      'Tudo do plano Básico',
      'Até 15 analistas cadastrados',
      'Acionamento direto via WhatsApp',
      'Até 3 categorias',
    ],
  },
  {
    slug: 'ilimitado',
    nome: 'Ilimitado',
    preco: 59.9,
    limiteAnalistas: 'sem limite de analistas',
    descricao: 'Pra empresas com plantão em múltiplas áreas.',
    recursos: [
      'Tudo do plano Profissional',
      'Analistas, categorias e áreas ilimitados',
      'Acionamento via WhatsApp e e-mail',
    ],
  },
];

export function getPlanoPorSlug(slug: string) {
  return planos.find((p) => p.slug === slug) ?? null;
}

export function formatarPreco(preco: number) {
  return preco.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
