import { NextResponse } from 'next/server';
import { atualizarStatusAssinaturaPorSubscriptionId } from '@/src/db/queries/empresas';

const eventosPagamento: Record<string, 'ativa' | 'atrasada'> = {
  PAYMENT_CONFIRMED: 'ativa',
  PAYMENT_RECEIVED: 'ativa',
  PAYMENT_OVERDUE: 'atrasada',
};

const eventosAssinatura: Record<string, 'cancelada'> = {
  SUBSCRIPTION_DELETED: 'cancelada',
  SUBSCRIPTION_INACTIVATED: 'cancelada',
};

type WebhookPayload = {
  event: string;
  payment?: { subscription?: string };
  subscription?: { id?: string };
};

export async function POST(request: Request) {
  const tokenRecebido = request.headers.get('asaas-access-token');
  if (!tokenRecebido || tokenRecebido !== process.env.ASAAS_WEBHOOK_TOKEN) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as WebhookPayload | null;
  if (!payload?.event) {
    return NextResponse.json({ ignorado: true }, { status: 200 });
  }

  // Responde rápido e sem processamento pesado — o Asaas penaliza a fila em
  // caso de demora ou erro consecutivo. Falhar em atualizar o status aqui
  // não deve travar a confirmação do recebimento.
  try {
    const statusPagamento = eventosPagamento[payload.event];
    if (statusPagamento && payload.payment?.subscription) {
      await atualizarStatusAssinaturaPorSubscriptionId(payload.payment.subscription, statusPagamento);
    }

    const statusAssinatura = eventosAssinatura[payload.event];
    if (statusAssinatura && payload.subscription?.id) {
      await atualizarStatusAssinaturaPorSubscriptionId(payload.subscription.id, statusAssinatura);
    }
  } catch (erro) {
    console.error('Erro processando webhook do Asaas:', erro);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
