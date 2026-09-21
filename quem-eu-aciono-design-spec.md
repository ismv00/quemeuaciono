# Quem eu aciono? — Spec de redesign

Referência visual funcional: `quem-eu-aciono-reference.html` (abra no navegador — calendário e navegação já funcionam com dados mockados).

## Tokens

| Uso | Cor |
|---|---|
| Acento / CTA (WhatsApp) | `#FF5A36` |
| Texto principal | `#16161D` |
| Texto secundário | `#6B6B76` |
| Texto terciário / labels | `#8A8977` / `#ACAAA1` |
| Fundo da página | `#F5F4F0` |
| Fundo da sidebar | `#14141C` |
| Item ativo na sidebar | `#23232E` |
| Cartões | `#FFFFFF` com borda `#E7E4DC` |
| Tint neutro (ícones, avatar) | `#F1F0EA` |
| Status online | `#22C55E` |
| Status offline | `#B0AEA6` |
| Regime "Ativo" (chip) | fundo `#ECFDF3` / texto `#027A48` |
| Regime "Sobreaviso" (chip) | fundo `#FFF4E5` / texto `#B45309` |

- Fonte: **Manrope** (400/600/700/800), fallback `system-ui, sans-serif`.
- Raio de borda: cartões 16–20px, botões/chips pill (999px), célula do dia 12px.
- Grid de conteúdo: sidebar fixa 264px + coluna do calendário 400px + painel flexível.

## Estrutura de telas

1. **Sidebar** — logo, navegação (Calendário / Analistas / Relatórios / Configurações), badge "Suporte 24/7", perfil do usuário.
2. **Cabeçalho** — título, descrição, busca, avatar.
3. **Cards de destaque** — Acesso rápido / WhatsApp direto / Suporte garantido (decorativos).
4. **Calendário** — mês/ano, navegação (‹ ›), grade de dias. Dia selecionado fica preenchido em `#16161D`; dia atual recebe contorno; dias com analista escalado ganham um ponto laranja.
5. **Painel lateral** (master–detail, sem modal):
   - **Vazio**: quando a data não tem ninguém escalado.
   - **Lista**: cartões dos analistas do dia (avatar com iniciais, status, categoria/área, chip de regime, botão "Ver detalhes").
   - **Detalhe**: perfil completo do analista + botão "Voltar" + botão "Acionar via WhatsApp".

## Regra de negócio (mantida do sistema original)

> O botão **"Acionar via WhatsApp"** só fica habilitado quando a data selecionada no calendário é o dia real do plantão daquele analista.

- Habilitado: `data_selecionada === analista.dia_de_plantao` → botão laranja + texto "Plantão de hoje — você já pode acionar."
- Desabilitado: qualquer outra data → botão cinza (`#EDECE7` / texto `#A8A6A0`, `cursor: not-allowed`) + texto "Disponível apenas no dia do plantão deste analista."

## Dados esperados por analista

```
{
  nome, email, categoria, area, regime ("Ativo" | "Sobreaviso"),
  horario_plantao, status ("online" | "offline"), data_do_plantao
}
```

## Observação para a implementação

O arquivo de referência usa dados mockados em JS puro (sem framework) só para demonstrar o comportamento — troque por chamadas reais à API/backend existente, mantendo a mesma regra de habilitação do botão.
