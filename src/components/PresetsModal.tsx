import React from 'react';
import { X, Sparkles, Plus, Car } from 'lucide-react';
import { FUNNY_PRESETS } from '../utils/humor';
import type { Scenario } from '../types';
import { computeScenarioResults } from '../utils/finance';
import { formatCurrency } from '../utils/formatters';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadPreset: (scenario: Scenario) => void;
  onLoadAllPresets: () => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onLoadPreset,
  onLoadAllPresets,
}) => {
  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof FUNNY_PRESETS[0]) => {
    const calculation = computeScenarioResults({
      carPrice: preset.carPrice,
      cashDownPayment: preset.cashDownPayment,
      tradeInCar: preset.tradeInCar,
      additionalCosts: preset.additionalCosts,
      termMonths: preset.termMonths,
      monthlyRate: preset.monthlyRate,
      installment: 0,
      calculationMode: 'SOLVE_INSTALLMENT',
    });

    const scenario: Scenario = {
      id: `preset-${Date.now()}-${Math.random()}`,
      title: preset.title,
      dealership: preset.dealership,
      carPrice: preset.carPrice,
      cashDownPayment: preset.cashDownPayment,
      tradeInCar: preset.tradeInCar,
      additionalCosts: preset.additionalCosts,
      termMonths: preset.termMonths,
      monthlyRate: preset.monthlyRate,
      installment: calculation.updatedInstallment,
      calculationMode: 'SOLVE_INSTALLMENT',
      notes: preset.notes,
      results: calculation.results,
      createdAt: new Date().toISOString(),
    };

    onLoadPreset(scenario);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-black text-white">
              Cenários Engraçados Prontos do Lucas
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Clique em uma das propostas abaixo para carregá-la no simulador e ver como funciona, ou adicione todas de uma vez para testar o comparador:
        </p>

        {/* Presets List */}
        <div className="space-y-3">
          {FUNNY_PRESETS.map((p, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectPreset(p)}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/50 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-white text-sm">{p.title}</span>
                </div>
                <span className="text-xs font-bold text-emerald-400">
                  {formatCurrency(p.carPrice)}
                </span>
              </div>

              <div className="text-xs text-slate-400 flex flex-wrap gap-2">
                <span>{p.termMonths}x meses</span>
                <span>•</span>
                <span>Taxa {p.monthlyRate}% a.m.</span>
                <span>•</span>
                <span>Entrada {formatCurrency(p.cashDownPayment + (p.tradeInCar.enabled ? p.tradeInCar.offeredValue : 0))}</span>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                "{p.notes}"
              </p>
            </div>
          ))}
        </div>

        {/* Load all presets button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onLoadAllPresets();
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus size={16} />
            <span>Carregar Todos os 3 Cenários no Comparador</span>
          </button>
        </div>
      </div>
    </div>
  );
};
