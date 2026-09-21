function baseUrl() {
  return process.env.ASAAS_ENV === 'production'
    ? 'https://api.asaas.com/v3'
    : 'https://api-sandbox.asaas.com/v3';
}

async function asaasFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const apiKey = process.env.ASAAS_API_KEY;
  if (!apiKey) throw new Error('ASAAS_API_KEY não configurada.');

  const resposta = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      access_token: apiKey,
      ...init?.headers,
    },
  });

  const corpo = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    const mensagem =
      corpo?.errors?.map((e: { description: string }) => e.description).join(' ') ??
      `Erro ${resposta.status} na API do Asaas.`;
    throw new Error(mensagem);
  }

  return corpo as T;
}

type ClienteAsaas = { id: string };

export async function criarClienteAsaas(params: {
  nome: string;
  cpfCnpj: string;
  email?: string;
  telefone?: string;
}) {
  const cliente = await asaasFetch<ClienteAsaas>('/customers', {
    method: 'POST',
    body: JSON.stringify({
      name: params.nome,
      cpfCnpj: params.cpfCnpj,
      email: params.email || undefined,
      mobilePhone: params.telefone || undefined,
    }),
  });

  return cliente.id;
}

type AssinaturaAsaas = { id: string };

export async function criarAssinaturaAsaas(params: {
  customerId: string;
  value: number;
  nextDueDate: string;
  description: string;
  externalReference: string;
}) {
  const assinatura = await asaasFetch<AssinaturaAsaas>('/subscriptions', {
    method: 'POST',
    body: JSON.stringify({
      customer: params.customerId,
      billingType: 'UNDEFINED',
      cycle: 'MONTHLY',
      value: params.value,
      nextDueDate: params.nextDueDate,
      description: params.description,
      externalReference: params.externalReference,
    }),
  });

  return assinatura.id;
}

type CobrancaAsaas = { invoiceUrl: string };
type ListaCobrancasAsaas = { data: CobrancaAsaas[] };

export async function buscarPrimeiraCobranca(subscriptionId: string) {
  const lista = await asaasFetch<ListaCobrancasAsaas>(
    `/payments?subscription=${subscriptionId}&limit=1`
  );

  return lista.data[0]?.invoiceUrl ?? null;
}

export async function atualizarValorAssinaturaAsaas(subscriptionId: string, value: number) {
  await asaasFetch(`/subscriptions/${subscriptionId}`, {
    method: 'PUT',
    body: JSON.stringify({ value }),
  });
}
