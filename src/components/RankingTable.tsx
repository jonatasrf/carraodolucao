import React, { useState } from 'react';
import { ArrowUpDown, Trophy } from 'lucide-react';
import type { Scenario } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { VerdictBadge } from './VerdictBadge';

interface RankingTableProps {
  scenarios: Scenario[];
  onSelectScenario: (scenario: Scenario) => void;
}

type SortKey = 'totalFinalCost' | 'monthlyInstallment' | 'totalInterestPaid' | 'effectiveMonthlyRate' | 'lossScore';

export const RankingTable: React.FC<RankingTableProps> = ({
  scenarios,
  onSelectScenario,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('totalFinalCost');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedScenarios = [...scenarios].sort((a, b) => {
    let valA = 0;
    let valB = 0;

    if (sortKey === 'totalFinalCost') {
      valA = a.results.totalFinalCost;
      valB = b.results.totalFinalCost;
    } else if (sortKey === 'monthlyInstallment') {
      valA = a.results.monthlyInstallment;
      valB = b.results.monthlyInstallment;
    } else if (sortKey === 'totalInterestPaid') {
      valA = a.results.totalInterestPaid;
      valB = b.results.totalInterestPaid;
    } else if (sortKey === 'effectiveMonthlyRate') {
      valA = a.results.effectiveMonthlyRate;
      valB = b.results.effectiveMonthlyRate;
    } else if (sortKey === 'lossScore') {
      valA = a.results.lossScore;
      valB = b.results.lossScore;
    }

    return sortAsc ? valA - valB : valB - valA;
  });

  if (scenarios.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-12 px-4 space-y-3 bg-slate-900/60 rounded-2xl border border-slate-800">
        <Trophy size={28} className="text-amber-400 mx-auto" />
        <h3 className="text-base font-bold text-white">Nenhum cenário para o ranking</h3>
        <p className="text-xs text-slate-400">
          Crie cenários na aba Simulador para ordená-los e ver quem lidera a corrida!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto pb-24 sm:pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Trophy className="text-amber-400 w-5 h-5" />
            Ranking Geral de Propostas
          </h2>
          <p className="text-xs text-slate-400">
            Ordene pelas métricas financeiras para desmascarar as ofertas.
          </p>
        </div>

        {/* Quick Sorting Pills on mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-semibold text-[11px] shrink-0">Ordenar por:</span>
          <button
            onClick={() => handleSort('totalFinalCost')}
            className={`px-2.5 py-1 rounded-lg font-bold shrink-0 cursor-pointer ${
              sortKey === 'totalFinalCost' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Custo Total {sortKey === 'totalFinalCost' && (sortAsc ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('monthlyInstallment')}
            className={`px-2.5 py-1 rounded-lg font-bold shrink-0 cursor-pointer ${
              sortKey === 'monthlyInstallment' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Parcela {sortKey === 'monthlyInstallment' && (sortAsc ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('totalInterestPaid')}
            className={`px-2.5 py-1 rounded-lg font-bold shrink-0 cursor-pointer ${
              sortKey === 'totalInterestPaid' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Juros {sortKey === 'totalInterestPaid' && (sortAsc ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('effectiveMonthlyRate')}
            className={`px-2.5 py-1 rounded-lg font-bold shrink-0 cursor-pointer ${
              sortKey === 'effectiveMonthlyRate' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Taxa Real {sortKey === 'effectiveMonthlyRate' && (sortAsc ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3.5 text-center w-12">#</th>
                <th className="py-3 px-3.5">Carro / Proposta</th>
                <th 
                  onClick={() => handleSort('totalFinalCost')}
                  className="py-3 px-3.5 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Custo Total</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('monthlyInstallment')}
                  className="py-3 px-3.5 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Parcela Mensal</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('totalInterestPaid')}
                  className="py-3 px-3.5 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Total em Juros</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('effectiveMonthlyRate')}
                  className="py-3 px-3.5 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Taxa CET</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="py-3 px-3.5 text-center">Veredicto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sortedScenarios.map((sc, index) => {
                const isWinner = index === 0;
                return (
                  <tr 
                    key={sc.id}
                    onClick={() => onSelectScenario(sc)}
                    className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3.5 text-center font-bold">
                      {isWinner ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black border border-amber-500/40">
                          1º
                        </span>
                      ) : (
                        <span className="text-slate-500">{index + 1}º</span>
                      )}
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-white text-sm">
                        {sc.title}
                      </div>
                      {sc.dealership && (
                        <div className="text-[11px] text-slate-400">
                          {sc.dealership}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3.5 font-bold text-amber-300">
                      {formatCurrency(sc.results.totalFinalCost)}
                    </td>
                    <td className="py-3 px-3.5 font-semibold text-white">
                      {formatCurrency(sc.results.monthlyInstallment)}
                      <span className="text-[10px] text-slate-400 block font-normal">
                        {sc.termMonths}x
                      </span>
                    </td>
                    <td className="py-3 px-3.5 font-semibold text-rose-400">
                      {formatCurrency(sc.results.totalInterestPaid)}
                      <span className="text-[10px] text-slate-400 block font-normal">
                        +{formatPercent(sc.results.interestPercentageOfCar)}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-slate-200">
                      {formatPercent(sc.results.effectiveMonthlyRate)} a.m.
                      <span className="text-[10px] text-slate-400 block">
                        {formatPercent(sc.results.effectiveAnnualRate)} a.a.
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <VerdictBadge badge={sc.results.verdictBadge} size="sm" showLabel={false} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
