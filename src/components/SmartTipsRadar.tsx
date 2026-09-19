import React from 'react';
import { 
  Percent, 
  Car, 
  Gift, 
  Repeat, 
  Sparkles
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { calculateInstallment } from '../utils/finance';
import type { TradeInCar } from '../types';

export type TipCategory = 'taxa' | 'preco' | 'brindes' | 'troca';

interface SmartTipsRadarProps {
  carPrice: number;
  monthlyRate: number;
  installment: number;
  totalFinanced: number;
  termMonths: number;
  tradeInCar: TradeInCar;
  tradeInLoss: number;
  activeCategory: TipCategory;
  onSelectCategory: (category: TipCategory) => void;
}

export const SmartTipsRadar: React.FC<SmartTipsRadarProps> = ({
  carPrice,
  monthlyRate,
  installment,
  totalFinanced,
  termMonths,
  tradeInCar,
  tradeInLoss,
  activeCategory,
  onSelectCategory,
}) => {
  // 1. Rate benchmark calculations (Central Bank average ~1.45% - 1.85% a.m.)
  const targetRate = 1.50; // Target negotiation rate
  const targetInstallment = calculateInstallment(totalFinanced, targetRate, termMonths);
  const potentialMonthlySavings = Math.max(0, installment - targetInstallment);
  const potentialTotalSavings = potentialMonthlySavings * termMonths;

  // Rate Tier diagnosis
  let rateTier: 'promo' | 'good' | 'fair' | 'high' | 'abusive' = 'fair';
  let rateBadge = 'Taxa Coerente com o Mercado';
  let rateBadgeColor = 'text-amber-400 bg-amber-500/15 border-amber-500/30';

  if (monthlyRate <= 0.6) {
    rateTier = 'promo';
    rateBadge = '🟢 Quase Zero / Montadora';
    rateBadgeColor = 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30';
  } else if (monthlyRate <= 1.45) {
    rateTier = 'good';
    rateBadge = '🟢 Muito Boa (Abaixo da Média)';
    rateBadgeColor = 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30';
  } else if (monthlyRate <= 1.85) {
    rateTier = 'fair';
    rateBadge = '🟡 Coerente com Mercado (~1,65% a.m.)';
    rateBadgeColor = 'text-amber-300 bg-amber-500/15 border-amber-500/30';
  } else if (monthlyRate <= 2.30) {
    rateTier = 'high';
    rateBadge = '🟠 Taxa Alta (Negocie!)';
    rateBadgeColor = 'text-orange-300 bg-orange-500/15 border-orange-500/30';
  } else {
    rateTier = 'abusive';
    rateBadge = '🔴 Taxa Abusiva (Perigo de Loss)';
    rateBadgeColor = 'text-rose-300 bg-rose-500/15 border-rose-500/30';
  }

  // 2. Car Price discount margins (Typical dealership room: 3% to 6%)
  const discount4Pct = carPrice * 0.04;
  const discount6Pct = carPrice * 0.06;
  const targetPriceWithDiscount = Math.max(0, carPrice - discount4Pct);

  return (
    <div className="rounded-2xl bg-slate-900/95 border border-amber-500/30 shadow-xl overflow-hidden">
      {/* Category Tabs Header - Sticky/Fixed Height */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 px-2 sm:px-3 py-1.5 overflow-x-auto gap-1 scrollbar-none">
        <div className="flex items-center gap-1.5 shrink-0 text-amber-400 font-bold text-xs pr-1">
          <Sparkles size={14} className="animate-pulse" />
          <span className="hidden sm:inline">Radar do Lucas:</span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onSelectCategory('taxa')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeCategory === 'taxa'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Percent size={13} />
            <span>Juros ({formatPercent(monthlyRate)})</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory('preco')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeCategory === 'preco'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Car size={13} />
            <span>Preço & FIPE</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory('brindes')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeCategory === 'brindes'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Gift size={13} />
            <span>Brindes</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory('troca')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeCategory === 'troca'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Repeat size={13} />
            <span>Troca {tradeInCar.enabled ? '(!)' : ''}</span>
          </button>
        </div>
      </div>

      {/* 
        FIXED CONTAINER HEIGHT: Constant 135px on mobile and 120px on desktop with overflow-y-auto.
        This strictly guarantees the screen NEVER jumps or causes layout shifts!
      */}
      <div className="h-[135px] sm:h-[120px] overflow-y-auto p-3 text-xs leading-relaxed text-slate-300">
        {/* TAB 1: TAXA DE JUROS & MERCADO */}
        {activeCategory === 'taxa' && (
          <div className="space-y-1.5 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <span className={`text-[11px] font-black px-2 py-0.5 rounded-full border ${rateBadgeColor}`}>
                {rateBadge}
              </span>
              <span className="text-[11px] text-slate-400">
                Média Bacen para veículos: <strong>1,45% a 1,85% a.m.</strong>
              </span>
            </div>

            {rateTier === 'abusive' || rateTier === 'high' ? (
              <div className="space-y-1 text-slate-200">
                <p>
                  🚨 <strong>Contraproposta de Negociação:</strong> Esta taxa está acima do mercado! Diga ao vendedor:
                  <span className="text-amber-300 font-semibold italic"> "Tenho cotação pré-aprovada a 1,50% a.m. Se igualarem, fechamos hoje."</span>
                </p>
                {potentialMonthlySavings > 10 && (
                  <p className="text-[11px] text-emerald-400 font-bold">
                    💡 Se baixarem para 1,50% a.m., sua parcela cai para {formatCurrency(targetInstallment)} (economia de {formatCurrency(potentialMonthlySavings)}/mês e {formatCurrency(potentialTotalSavings)} no total)!
                  </p>
                )}
              </div>
            ) : rateTier === 'fair' ? (
              <div className="space-y-1 text-slate-200">
                <p>
                  ⚖️ <strong>Taxa coerente:</strong> Está alinhada à média bancária atual. Porém, concessionárias sempre têm margem de comissão (retorno da loja).
                </p>
                <p className="text-[11px] text-amber-300 font-medium">
                  🎯 <strong>Dica de ouro:</strong> Peça para arredondar a taxa para <strong>1,45% a.m.</strong> ou solicite isenção da TAC (cadastro) para compensar.
                </p>
              </div>
            ) : (
              <div className="space-y-1 text-slate-200">
                <p>
                  🏆 <strong>Excelente taxa!</strong> Condição muito favorável para crédito automotivo.
                </p>
                <p className="text-[11px] text-emerald-300 font-medium">
                  🛡️ <strong>Atenção ao contrato:</strong> Verifique se a loja não embutiu seguro prestamista ou tarifas surpresa para compensar os juros baixos.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PREÇO & DESCONTO DE CONCESSIONÁRIA */}
        {activeCategory === 'preco' && (
          <div className="space-y-1.5 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <span className="text-[11px] font-black px-2 py-0.5 rounded-full border text-amber-300 bg-amber-500/15 border-amber-500/30">
                🏷️ Margem da Loja: 3% a 6%
              </span>
              <span className="text-[11px] text-slate-400">
                Valor informado: <strong>{formatCurrency(carPrice)}</strong>
              </span>
            </div>

            <p className="text-slate-200">
              Concessionárias de carro zero têm margem de <strong>3% a 6%</strong> para atingir metas do mês. Neste carro, a margem de desconto gira entre <strong className="text-emerald-400">{formatCurrency(discount4Pct)}</strong> e <strong className="text-emerald-400">{formatCurrency(discount6Pct)}</strong>!
            </p>

            <p className="text-[11px] text-amber-200">
              💬 <strong>Roteiro para falar:</strong> <em>"Se vocês deixarem por {formatCurrency(targetPriceWithDiscount)} à vista na nota (ou cobrirem a oferta do concorrente), assino a proposta agora."</em> Se for seminovo, <strong>sempre confira a Tabela FIPE</strong> antes de qualquer lance!
            </p>
          </div>
        )}

        {/* TAB 3: BRINDES DE FECHAMENTO */}
        {activeCategory === 'brindes' && (
          <div className="space-y-1.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black px-2 py-0.5 rounded-full border text-emerald-300 bg-emerald-500/15 border-emerald-500/30">
                🎁 Brindes Obrigatórios na Hora do Fechamento
              </span>
              <span className="text-[11px] text-slate-400">Economia: até R$ 2.500</span>
            </div>

            <p className="text-slate-200">
              <strong>Regra de ouro:</strong> Nunca peça os brindes no início! Guarde para o momento em que o vendedor disser <em>"Vamos fechar?"</em>. Exija no mínimo 2 destes itens:
            </p>

            <div className="flex flex-wrap gap-1.5 pt-0.5">
              <span className="text-[10px] bg-slate-950 border border-slate-700 px-2 py-0.5 rounded font-bold text-slate-300 whitespace-nowrap">
                🛡️ Insulfilm (~R$ 500)
              </span>
              <span className="text-[10px] bg-slate-950 border border-slate-700 px-2 py-0.5 rounded font-bold text-slate-300 whitespace-nowrap">
                🚗 Emplacamento (~R$ 1.000)
              </span>
              <span className="text-[10px] bg-slate-950 border border-slate-700 px-2 py-0.5 rounded font-bold text-slate-300 whitespace-nowrap">
                🧹 Tapetes de Borracha (~R$ 300)
              </span>
              <span className="text-[10px] bg-slate-950 border border-slate-700 px-2 py-0.5 rounded font-bold text-slate-300 whitespace-nowrap">
                🔧 Protetor de Cárter (~R$ 400)
              </span>
              <span className="text-[10px] bg-slate-950 border border-slate-700 px-2 py-0.5 rounded font-bold text-slate-300 whitespace-nowrap">
                ⛽ Tanque Cheio (~R$ 350)
              </span>
            </div>
          </div>
        )}

        {/* TAB 4: USADO NA TROCA */}
        {activeCategory === 'troca' && (
          <div className="space-y-1.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black px-2 py-0.5 rounded-full border text-amber-300 bg-amber-500/15 border-amber-500/30">
                🔄 Usado na Troca vs FIPE
              </span>
              {tradeInCar.enabled && (
                <span className="text-[11px] text-slate-400">
                  FIPE: {formatCurrency(tradeInCar.fipeValue)}
                </span>
              )}
            </div>

            {tradeInCar.enabled ? (
              tradeInLoss > 0 ? (
                <div className="space-y-1 text-slate-200">
                  <p>
                    🚨 A loja está pagando <strong>{formatCurrency(tradeInLoss)}</strong> abaixo da FIPE (-{((tradeInLoss / (tradeInCar.fipeValue || 1)) * 100).toFixed(0)}%).
                  </p>
                  <p className="text-[11px] text-amber-300">
                    O deságio padrão de concessionária é de <strong>15% a 20%</strong>. Se passar disso, compense exigindo desconto maior no carro novo ou venda particular na Webmotors/OLX!
                  </p>
                </div>
              ) : (
                <div className="space-y-1 text-slate-200">
                  <p className="text-emerald-400 font-bold">
                    ✓ Proposta no valor da FIPE! Muito raro em lojas físicas.
                  </p>
                  <p className="text-[11px] text-slate-300">
                    Apenas certifique-se de que não inflaram o preço do carro novo ou as taxas do financiamento para cobrir essa avaliação.
                  </p>
                </div>
              )
            ) : (
              <div className="space-y-1 text-slate-200">
                <p>
                  💡 <strong>Vai dar um carro na troca?</strong> Marque a caixinha abaixo para comparar a proposta da loja com a Tabela FIPE oficial.
                </p>
                <p className="text-[11px] text-slate-400">
                  Lojas costumam tirar 15% a 25% da FIPE do seu usado. Em venda particular para pessoa física, você quase sempre consegue entre 95% e 100% da FIPE.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
