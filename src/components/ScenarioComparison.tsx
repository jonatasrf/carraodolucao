import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Coins, 
  TrendingDown, 
  Sparkles,
  PlusCircle
} from 'lucide-react';
import type { Scenario } from '../types';
import { formatCurrency } from '../utils/formatters';
import { ScenarioCard } from './ScenarioCard';

interface ScenarioComparisonProps {
  scenarios: Scenario[];
  onEdit: (scenario: Scenario) => void;
  onDelete: (id: string) => void;
  onDuplicate: (scenario: Scenario) => void;
  onNewScenario: () => void;
  onLoadPresets: () => void;
}

export const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({
  scenarios,
  onEdit,
  onDelete,
  onDuplicate,
  onNewScenario,
  onLoadPresets,
}) => {
  // Find winners
  const bestDeal = scenarios.length > 0 
    ? [...scenarios].sort((a, b) => a.results.totalFinalCost - b.results.totalFinalCost)[0]
    : null;

  const worstDeal = scenarios.length > 1
    ? [...scenarios].sort((a, b) => b.results.totalFinalCost - a.results.totalFinalCost)[0]
    : null;

  const lowestInstallment = scenarios.length > 0
    ? [...scenarios].sort((a, b) => a.results.monthlyInstallment - b.results.monthlyInstallment)[0]
    : null;

  const lowestInterest = scenarios.length > 0
    ? [...scenarios].sort((a, b) => a.results.totalInterestPaid - b.results.totalInterestPaid)[0]
    : null;

  // Trigger celebratory confetti if best deal has excellent or reasonable badge
  useEffect(() => {
    if (bestDeal && (bestDeal.results.verdictBadge === 'excelente' || bestDeal.results.lossScore < 35)) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#10b981', '#3b82f6'],
      });
    }
  }, [bestDeal?.id]);

  const savings = worstDeal && bestDeal
    ? worstDeal.results.totalFinalCost - bestDeal.results.totalFinalCost
    : 0;

  if (scenarios.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 px-4 space-y-4 bg-slate-900/60 rounded-3xl border border-slate-800 my-8">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
          <Trophy size={32} />
        </div>
        <h3 className="text-xl font-black text-white">
          Nenhum cenário salvo ainda, Lucão!
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Adicione propostas de carros no simulador ou carregue os exemplos prontos para ver a mágica do comparador acontecer.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onNewScenario}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle size={18} />
            <span>Criar Novo Cenário</span>
          </button>
          <button
            type="button"
            onClick={onLoadPresets}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles size={18} className="text-amber-400" />
            <span>Carregar Exemplos Hilários</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 sm:pb-12">
      {/* Comparison Insights Pods */}
      {scenarios.length > 1 && bestDeal && worstDeal && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-amber-950/50 border border-emerald-800/40 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-emerald-400 font-black text-base">
              <Trophy size={20} />
              <span>Diagnóstico Comparativo do Lucão</span>
            </div>
            {savings > 0 && (
              <span className="text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full">
                💰 Diferença de até {formatCurrency(savings)}!
              </span>
            )}
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            Se você escolher o <strong>{bestDeal.title}</strong> em vez da cilada do <strong>{worstDeal.title}</strong>, você economiza exatamente <strong className="text-emerald-400">{formatCurrency(savings)}</strong> no total desembolsado! Daria pra pagar o IPVA e viajar no fim do ano tranquilamente.
          </p>
        </div>
      )}

      {/* Pods of Leaders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Best Deal */}
        {bestDeal && (
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-700/40 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
              <span className="flex items-center gap-1">
                <Trophy size={14} /> Melhor Custo Total
              </span>
              <span>1º Lugar</span>
            </div>
            <div className="text-base font-black text-white truncate">
              {bestDeal.title}
            </div>
            <div className="text-xs text-slate-300">
              Custo Total: <strong className="text-emerald-400">{formatCurrency(bestDeal.results.totalFinalCost)}</strong>
            </div>
          </div>
        )}

        {/* Lowest Monthly Installment */}
        {lowestInstallment && (
          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-700/40 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between text-xs text-blue-400 font-bold">
              <span className="flex items-center gap-1">
                <Coins size={14} /> Menor Parcela Mensal
              </span>
              <span>Bolso Leve</span>
            </div>
            <div className="text-base font-black text-white truncate">
              {lowestInstallment.title}
            </div>
            <div className="text-xs text-slate-300">
              Parcela: <strong className="text-blue-400">{formatCurrency(lowestInstallment.results.monthlyInstallment)}</strong>
            </div>
          </div>
        )}

        {/* Lowest Interest Paid */}
        {lowestInterest && (
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-700/40 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between text-xs text-purple-400 font-bold">
              <span className="flex items-center gap-1">
                <TrendingDown size={14} /> Menor Juros pro Banco
              </span>
              <span>Anti-Banqueiro</span>
            </div>
            <div className="text-base font-black text-white truncate">
              {lowestInterest.title}
            </div>
            <div className="text-xs text-slate-300">
              Juros: <strong className="text-purple-400">{formatCurrency(lowestInterest.results.totalInterestPaid)}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Grid of Saved Scenario Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white tracking-tight">
            Todos os Cenários ({scenarios.length})
          </h3>
          <button
            type="button"
            onClick={onNewScenario}
            className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
          >
            <PlusCircle size={14} />
            <span>Adicionar outro</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((sc) => (
            <ScenarioCard
              key={sc.id}
              scenario={sc}
              isBestDeal={sc.id === bestDeal?.id && scenarios.length > 1}
              isWorstDeal={sc.id === worstDeal?.id && scenarios.length > 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
