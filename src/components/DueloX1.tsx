import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Swords, 
  Trophy, 
  Check, 
  Share2, 
  Sparkles, 
  PlusCircle, 
  Coins, 
  TrendingDown, 
  Percent, 
  Flame 
} from 'lucide-react';
import type { Scenario } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { VerdictBadge } from './VerdictBadge';

interface DueloX1Props {
  scenarios: Scenario[];
  onNewScenario: () => void;
  onLoadPresets: () => void;
}

interface RoundResult {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  valueA: string;
  valueB: string;
  winner: 'A' | 'B' | 'DRAW';
  diffText: string;
}

export const DueloX1: React.FC<DueloX1Props> = ({
  scenarios,
  onNewScenario,
  onLoadPresets,
}) => {
  const [selectedIdA, setSelectedIdA] = useState<string>(scenarios[0]?.id || '');
  const [selectedIdB, setSelectedIdB] = useState<string>(scenarios[1]?.id || scenarios[0]?.id || '');
  const [copied, setCopied] = useState(false);

  // Sync selections if scenarios change
  useEffect(() => {
    if (scenarios.length > 0 && !scenarios.some((s) => s.id === selectedIdA)) {
      setSelectedIdA(scenarios[0].id);
    }
    if (scenarios.length > 1 && !scenarios.some((s) => s.id === selectedIdB)) {
      setSelectedIdB(scenarios[1].id);
    }
  }, [scenarios, selectedIdA, selectedIdB]);

  if (scenarios.length < 2) {
    return (
      <div className="max-w-xl mx-auto text-center py-12 px-4 space-y-4 bg-slate-900/70 rounded-3xl border border-slate-800 my-8">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
          <Swords size={32} />
        </div>
        <h3 className="text-xl font-black text-white">
          O Duelo X1 precisa de pelo menos 2 carros!
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Cadastre mais um cenário no simulador ou carregue os exemplos prontos para colocar duas propostas em um confronto direto round a round.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onNewScenario}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle size={16} />
            <span>Criar Novo Cenário</span>
          </button>
          <button
            type="button"
            onClick={onLoadPresets}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles size={16} className="text-amber-400" />
            <span>Carregar Exemplos Rápidos</span>
          </button>
        </div>
      </div>
    );
  }

  const carA = scenarios.find((s) => s.id === selectedIdA) || scenarios[0];
  const carB = scenarios.find((s) => s.id === selectedIdB) || scenarios[1];

  // Round by round calculations
  const rounds: RoundResult[] = [
    {
      title: 'Round 1: Parcela Mensal',
      subtitle: 'Quem pesa menos no bolso todo mês?',
      icon: Coins,
      valueA: formatCurrency(carA.results.monthlyInstallment),
      valueB: formatCurrency(carB.results.monthlyInstallment),
      winner: 
        carA.results.monthlyInstallment < carB.results.monthlyInstallment ? 'A' :
        carB.results.monthlyInstallment < carA.results.monthlyInstallment ? 'B' : 'DRAW',
      diffText: Math.abs(carA.results.monthlyInstallment - carB.results.monthlyInstallment) > 0
        ? `Economia de ${formatCurrency(Math.abs(carA.results.monthlyInstallment - carB.results.monthlyInstallment))}/mês`
        : 'Parcelas idênticas',
    },
    {
      title: 'Round 2: Total em Juros',
      subtitle: 'Quem doa menos dinheiro para o banqueiro?',
      icon: TrendingDown,
      valueA: formatCurrency(carA.results.totalInterestPaid),
      valueB: formatCurrency(carB.results.totalInterestPaid),
      winner: 
        carA.results.totalInterestPaid < carB.results.totalInterestPaid ? 'A' :
        carB.results.totalInterestPaid < carA.results.totalInterestPaid ? 'B' : 'DRAW',
      diffText: Math.abs(carA.results.totalInterestPaid - carB.results.totalInterestPaid) > 0
        ? `Economia de ${formatCurrency(Math.abs(carA.results.totalInterestPaid - carB.results.totalInterestPaid))} só de juros`
        : 'Mesmo juros',
    },
    {
      title: 'Round 3: Custo Total Final',
      subtitle: 'Qual custa menos de ponta a ponta (Tudo desembolsado)?',
      icon: Trophy,
      valueA: formatCurrency(carA.results.totalFinalCost),
      valueB: formatCurrency(carB.results.totalFinalCost),
      winner: 
        carA.results.totalFinalCost < carB.results.totalFinalCost ? 'A' :
        carB.results.totalFinalCost < carA.results.totalFinalCost ? 'B' : 'DRAW',
      diffText: Math.abs(carA.results.totalFinalCost - carB.results.totalFinalCost) > 0
        ? `Diferença total de ${formatCurrency(Math.abs(carA.results.totalFinalCost - carB.results.totalFinalCost))}`
        : 'Empate no custo total',
    },
    {
      title: 'Round 4: Taxa Real (CET)',
      subtitle: 'Qual financiamento tem a taxa mais honesta?',
      icon: Percent,
      valueA: `${formatPercent(carA.results.effectiveMonthlyRate)} a.m.`,
      valueB: `${formatPercent(carB.results.effectiveMonthlyRate)} a.m.`,
      winner: 
        carA.results.effectiveMonthlyRate < carB.results.effectiveMonthlyRate ? 'A' :
        carB.results.effectiveMonthlyRate < carA.results.effectiveMonthlyRate ? 'B' : 'DRAW',
      diffText: Math.abs(carA.results.effectiveMonthlyRate - carB.results.effectiveMonthlyRate) > 0.01
        ? `${Math.abs(carA.results.effectiveMonthlyRate - carB.results.effectiveMonthlyRate).toFixed(2)}% de diferença ao mês`
        : 'Taxas equivalentes',
    },
    {
      title: 'Round 5: Índice Anti-Loss',
      subtitle: 'Quem passa mais longe de ser uma cilada?',
      icon: Flame,
      valueA: `${100 - carA.results.lossScore} pts de lucidez`,
      valueB: `${100 - carB.results.lossScore} pts de lucidez`,
      winner: 
        carA.results.lossScore < carB.results.lossScore ? 'A' :
        carB.results.lossScore < carA.results.lossScore ? 'B' : 'DRAW',
      diffText: carA.results.lossScore === carB.results.lossScore 
        ? 'Nível de risco equivalente'
        : 'Menor risco de arrependimento',
    },
  ];

  const scoreA = rounds.filter((r) => r.winner === 'A').length;
  const scoreB = rounds.filter((r) => r.winner === 'B').length;

  const winnerCar = scoreA > scoreB ? carA : scoreB > scoreA ? carB : null;
  const loserCar = scoreA > scoreB ? carB : scoreB > scoreA ? carA : null;
  const winnerScore = Math.max(scoreA, scoreB);
  const loserScore = Math.min(scoreA, scoreB);

  const totalSavings = loserCar && winnerCar 
    ? Math.max(0, loserCar.results.totalFinalCost - winnerCar.results.totalFinalCost)
    : 0;

  // Confetti on duel winner
  useEffect(() => {
    if (winnerCar) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6'],
      });
    }
  }, [carA.id, carB.id]);

  const handleShareDuelWhatsApp = () => {
    if (!winnerCar || !loserCar) return;

    const message = `
⚔️ *DUELO X1 DE CARROS DO LUCÃO* ⚔️
🥊 *${carA.title}*  _VS_  *${carB.title}*

🏆 *VENCEDOR POR NOCAUTE:* *${winnerCar.title}*
Placar: *${winnerScore} x ${loserScore}* Rounds Vencidos!

💰 *Custo Total:* ${formatCurrency(winnerCar.results.totalFinalCost)} (vs ${formatCurrency(loserCar.results.totalFinalCost)})
💵 *Parcela:* ${winnerCar.termMonths}x de ${formatCurrency(winnerCar.results.monthlyInstallment)}
💸 *Juros Pagos:* ${formatCurrency(winnerCar.results.totalInterestPaid)}

🎉 *ECONOMIA NO BOLSO DO LUCÃO:* *${formatCurrency(totalSavings)}* de diferença total!

🗣️ _"${winnerCar.results.verdictRoast}"_

Gerado pelo app *Carrão do Lucão* 🚀
`.trim();

    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24 sm:pb-12">
      {/* Title & Description */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-black uppercase tracking-wider">
          <Swords size={14} />
          <span>Modo Duelo X1 • Confronto Direto</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Qual carro vence no ringue financeiro?
        </h2>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Escolha duas propostas para uma batalha round a round e descubra qual destrói a outra no custo total e nas parcelas.
        </p>
      </div>

      {/* Fighter Selection Pods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fighter A */}
        <div className={`p-4 rounded-2xl bg-slate-900/90 border shadow-xl space-y-3 relative overflow-hidden transition-all ${
          winnerCar?.id === carA.id
            ? 'border-emerald-500 shadow-emerald-950/40 ring-1 ring-emerald-500/40'
            : loserCar?.id === carA.id
            ? 'border-slate-800 opacity-80'
            : 'border-blue-500/40'
        }`}>
          <div className={`absolute top-0 left-0 right-0 h-1 transition-colors ${
            winnerCar?.id === carA.id ? 'bg-emerald-500' : 'bg-blue-500'
          }`} />
          <div className="flex items-center justify-between">
            <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
              winnerCar?.id === carA.id ? 'text-emerald-400' : 'text-blue-400'
            }`}>
              🥊 Desafiante A (Player 1)
              {winnerCar?.id === carA.id && (
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold ml-1">
                  Vencedor ({scoreA} rounds)
                </span>
              )}
            </span>
            <VerdictBadge badge={carA.results.verdictBadge} size="sm" showLabel={false} />
          </div>

          <select
            value={selectedIdA}
            onChange={(e) => setSelectedIdA(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {scenarios.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.title} ({formatCurrency(sc.results.totalFinalCost)})
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Parcela</span>
              <span className="font-bold text-white text-xs">{formatCurrency(carA.results.monthlyInstallment)}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Custo Total</span>
              <span className="font-bold text-amber-300 text-xs">{formatCurrency(carA.results.totalFinalCost)}</span>
            </div>
          </div>
        </div>

        {/* Fighter B */}
        <div className={`p-4 rounded-2xl bg-slate-900/90 border shadow-xl space-y-3 relative overflow-hidden transition-all ${
          winnerCar?.id === carB.id
            ? 'border-emerald-500 shadow-emerald-950/40 ring-1 ring-emerald-500/40'
            : loserCar?.id === carB.id
            ? 'border-slate-800 opacity-80'
            : 'border-rose-500/40'
        }`}>
          <div className={`absolute top-0 left-0 right-0 h-1 transition-colors ${
            winnerCar?.id === carB.id ? 'bg-emerald-500' : 'bg-rose-500'
          }`} />
          <div className="flex items-center justify-between">
            <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
              winnerCar?.id === carB.id ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              🥊 Desafiante B (Player 2)
              {winnerCar?.id === carB.id && (
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold ml-1">
                  Vencedor ({scoreB} rounds)
                </span>
              )}
            </span>
            <VerdictBadge badge={carB.results.verdictBadge} size="sm" showLabel={false} />
          </div>

          <select
            value={selectedIdB}
            onChange={(e) => setSelectedIdB(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-rose-500 cursor-pointer"
          >
            {scenarios.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.title} ({formatCurrency(sc.results.totalFinalCost)})
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Parcela</span>
              <span className="font-bold text-white text-xs">{formatCurrency(carB.results.monthlyInstallment)}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Custo Total</span>
              <span className="font-bold text-amber-300 text-xs">{formatCurrency(carB.results.totalFinalCost)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Winner Hero Banner */}
      {winnerCar && loserCar && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/70 border border-emerald-500/40 shadow-2xl space-y-3 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-400 uppercase tracking-wider bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                <Trophy size={14} />
                <span>Nocaute Técnico Financeiro</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Vencedor: {winnerCar.title} ({winnerScore} x {loserScore})
              </h3>
              <p className="text-xs text-slate-300">
                Optando por este carro, você economiza exatamente <strong className="text-emerald-400">{formatCurrency(totalSavings)}</strong> em relação ao {loserCar.title}!
              </p>
            </div>

            <button
              type="button"
              onClick={handleShareDuelWhatsApp}
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-md shadow-emerald-950/30 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={16} />
                  <span>Resultado Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 size={16} />
                  <span>Compartilhar Duelo</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Round by Round Battle List */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          Resultado Round a Round
        </h4>

        <div className="space-y-2">
          {rounds.map((round, idx) => {
            const Icon = round.icon;
            const isWinnerA = round.winner === 'A';
            const isWinnerB = round.winner === 'B';

            return (
              <div
                key={idx}
                className="p-3 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Icon size={16} className="text-amber-400 shrink-0" />
                    <span>{round.title}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium hidden sm:block">
                    {round.diffText}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Option A Box */}
                  <div
                    className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                      isWinnerA
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold shadow-sm shadow-emerald-950/30 ring-1 ring-emerald-500/30'
                        : isWinnerB
                        ? 'bg-slate-950/60 border-slate-800/80 text-slate-500 opacity-60'
                        : 'bg-slate-950 border-slate-800/80 text-slate-400'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] block opacity-75 truncate max-w-[120px] sm:max-w-[180px]">
                        {carA.title}
                      </span>
                      <span className={`text-sm font-bold ${isWinnerA ? 'text-white' : 'text-slate-300'}`}>
                        {round.valueA}
                      </span>
                    </div>
                    {isWinnerA && (
                      <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-black shrink-0 shadow-sm shadow-emerald-950/50">
                        Venceu
                      </span>
                    )}
                  </div>

                  {/* Option B Box */}
                  <div
                    className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                      isWinnerB
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold shadow-sm shadow-emerald-950/30 ring-1 ring-emerald-500/30'
                        : isWinnerA
                        ? 'bg-slate-950/60 border-slate-800/80 text-slate-500 opacity-60'
                        : 'bg-slate-950 border-slate-800/80 text-slate-400'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] block opacity-75 truncate max-w-[120px] sm:max-w-[180px]">
                        {carB.title}
                      </span>
                      <span className={`text-sm font-bold ${isWinnerB ? 'text-white' : 'text-slate-300'}`}>
                        {round.valueB}
                      </span>
                    </div>
                    {isWinnerB && (
                      <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-black shrink-0 shadow-sm shadow-emerald-950/50">
                        Venceu
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
