import React, { useState } from 'react';
import { 
  Trash2, 
  Copy, 
  Edit3, 
  Share2, 
  Check, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  AlertTriangle
} from 'lucide-react';
import type { Scenario } from '../types';
import { formatCurrency, formatPercent, generateWhatsAppSummary } from '../utils/formatters';
import { VerdictBadge } from './VerdictBadge';

interface ScenarioCardProps {
  scenario: Scenario;
  isBestDeal?: boolean;
  isWorstDeal?: boolean;
  onEdit: (scenario: Scenario) => void;
  onDelete: (id: string) => void;
  onDuplicate: (scenario: Scenario) => void;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  isBestDeal,
  isWorstDeal,
  onEdit,
  onDelete,
  onDuplicate,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const { results } = scenario;

  const handleCopyWhatsApp = () => {
    const text = generateWhatsAppSummary(scenario);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-2xl border transition-all relative overflow-hidden bg-slate-900/90 shadow-xl ${
        isBestDeal
          ? 'border-emerald-500/70 shadow-emerald-950/40 ring-1 ring-emerald-500/30'
          : isWorstDeal
          ? 'border-red-500/60 shadow-red-950/30'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Top Banner for Best / Worst highlights */}
      {isBestDeal && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-950 font-black text-xs py-1 px-3 flex items-center justify-center gap-1.5 shadow-sm">
          <Sparkles size={14} />
          <span>🏆 MELHOR NEGÓCIO ENCONTRADO</span>
        </div>
      )}
      {isWorstDeal && !isBestDeal && (
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white font-black text-xs py-1 px-3 flex items-center justify-center gap-1.5 shadow-sm">
          <AlertTriangle size={14} />
          <span>🚨 MAIOR CILADA / MAIS CARO</span>
        </div>
      )}

      <div className="p-4 sm:p-5 space-y-4">
        {/* Header: Title & Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight truncate" title={scenario.title}>
              {scenario.title}
            </h3>
            {scenario.dealership && (
              <span className="text-xs text-slate-400 font-medium truncate block">
                {scenario.dealership}
              </span>
            )}
          </div>
          <VerdictBadge badge={results.verdictBadge} size="sm" />
        </div>

        {/* Hero Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 block truncate">Parcela Mensal</span>
            <span className="text-base font-black text-amber-400 block truncate" title={formatCurrency(results.monthlyInstallment)}>
              {formatCurrency(results.monthlyInstallment)}
            </span>
            <span className="text-[10px] text-slate-400 block truncate">{scenario.termMonths}x meses</span>
          </div>

          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 block truncate">Preço do Carro</span>
            <span className="text-sm font-bold text-white block truncate" title={formatCurrency(scenario.carPrice)}>
              {formatCurrency(scenario.carPrice)}
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              Entrada: {formatCurrency(results.totalDownPayment)}
            </span>
          </div>

          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 block truncate">Juros Pagos</span>
            <span className="text-sm font-bold text-rose-400 block truncate" title={formatCurrency(results.totalInterestPaid)}>
              {formatCurrency(results.totalInterestPaid)}
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              +{formatPercent(results.interestPercentageOfCar)}
            </span>
          </div>

          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 block truncate">Custo Total Final</span>
            <span className="text-sm font-bold text-amber-300 block truncate" title={formatCurrency(results.totalFinalCost)}>
              {formatCurrency(results.totalFinalCost)}
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              CET: {formatPercent(results.effectiveMonthlyRate)} a.m.
            </span>
          </div>
        </div>

        {/* Lucas Roast */}
        <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/60 text-xs text-slate-300 italic">
          "{results.verdictRoast}"
        </div>

        {/* Expandable Details */}
        {expanded && (
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-800">
              <div>
                <span className="text-slate-400 block text-[11px]">Valor Financiado:</span>
                <span className="font-bold text-slate-200">{formatCurrency(results.totalFinanced)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Taxa Efetiva Anual:</span>
                <span className="font-bold text-slate-200">{formatPercent(results.effectiveAnnualRate)}</span>
              </div>
            </div>

            {scenario.tradeInCar.enabled && (
              <div className="text-[11px] space-y-0.5 text-slate-400 pb-2 border-b border-slate-800">
                <span className="font-bold text-slate-300">Troca do Usado: {scenario.tradeInCar.carName || 'Carro Usado'}</span>
                <div>FIPE: {formatCurrency(scenario.tradeInCar.fipeValue)} | Oferta Loja: {formatCurrency(scenario.tradeInCar.offeredValue)}</div>
                {results.tradeInLossVsFipe > 0 && (
                  <div className="text-amber-400 font-semibold">
                    Desvalorização de {formatCurrency(results.tradeInLossVsFipe)} vs FIPE
                  </div>
                )}
              </div>
            )}

            <div className="text-[11px] text-slate-400">
              💡 <strong className="text-slate-300">Conselho:</strong> {results.verdictAdvice}
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-1 gap-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 font-medium py-1 px-2 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            {expanded ? (
              <>
                <ChevronUp size={14} />
                <span>Menos detalhes</span>
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                <span>Ver detalhes</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopyWhatsApp}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
              title="Copiar resumo para o WhatsApp"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
            </button>

            <button
              type="button"
              onClick={() => onDuplicate(scenario)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
              title="Duplicar este cenário para variar parâmetros"
            >
              <Copy size={16} />
            </button>

            <button
              type="button"
              onClick={() => onEdit(scenario)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-blue-400 transition-colors cursor-pointer"
              title="Editar no simulador"
            >
              <Edit3 size={16} />
            </button>

            <button
              type="button"
              onClick={() => onDelete(scenario.id)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              title="Excluir cenário"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
