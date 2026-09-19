import type { Scenario } from '../types';

export function formatCurrency(value: number): string {
  if (isNaN(value) || !isFinite(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number, decimals: number = 2): string {
  if (isNaN(value) || !isFinite(value)) return '0,00%';
  return `${value.toFixed(decimals).replace('.', ',')}%`;
}

export function cleanNumberInput(value: string): number {
  if (!value) return 0;
  // Remove non-numeric characters except dots and commas
  const cleaned = value.replace(/[^\d.,]/g, '');
  if (cleaned.includes(',')) {
    // Brazilian format 12.345,67 -> 12345.67
    const normalized = cleaned.replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  }
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function generateWhatsAppSummary(scenario: Scenario): string {
  const r = scenario.results;
  const badgeEmoji = 
    r.verdictBadge === 'excelente' ? '🏆' :
    r.verdictBadge === 'razoavel' ? '⚖️' :
    r.verdictBadge === 'alerta' ? '👀' :
    r.verdictBadge === 'perigo' ? '⚠️' : '🚨';

  const text = `
🚗💨 *ANÁLISE DO CARRO DO LUCAS* 💨🚗
*Proposta:* ${scenario.title} ${scenario.dealership ? `(${scenario.dealership})` : ''}

💰 *Preço do Carro:* ${formatCurrency(scenario.carPrice)}
💵 *Entrada Total:* ${formatCurrency(r.totalDownPayment)}
${scenario.tradeInCar.enabled ? `   ↳ Carro Usado: ${formatCurrency(scenario.tradeInCar.offeredValue)} (${scenario.tradeInCar.carName || 'Usado'})\n` : ''}${scenario.cashDownPayment > 0 ? `   ↳ Dinheiro/PIX: ${formatCurrency(scenario.cashDownPayment)}\n` : ''}
🏦 *Valor Financiado:* ${formatCurrency(r.totalFinanced)}
📆 *Parcelas:* ${scenario.termMonths}x de *${formatCurrency(r.monthlyInstallment)}*
📈 *Taxa Real Apurada (CET):* ${formatPercent(r.effectiveMonthlyRate)} a.m. (${formatPercent(r.effectiveAnnualRate)} a.a.)

💸 *TOTAL PAGO EM JUROS:* ${formatCurrency(r.totalInterestPaid)} (${formatPercent(r.interestPercentageOfCar)} do valor do carro!)
🏁 *CUSTO TOTAL DO CARRO:* ${formatCurrency(r.totalFinalCost)}

${badgeEmoji} *Veredicto:* ${r.verdictTitle}
🗣️ _"${r.verdictRoast}"_

💡 *Dica:* ${r.verdictAdvice}

Gerado pelo app *Carrão do Lucão* 🚀
`.trim();

  return text;
}
