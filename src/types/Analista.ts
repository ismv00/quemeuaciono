export type Regime = 'Presencial' | 'Sobreaviso';

export type Analista = {
  nome: string;
  area: string;
  regime: Regime;
  inicio: string;
  fim: string;
  whatsapp: string;
  email: string;
};
