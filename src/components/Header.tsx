import React from 'react';
import { Car, Flame, Sparkles, FolderDown, RefreshCw } from 'lucide-react';

interface HeaderProps {
  scenariosCount: number;
  onOpenPresets: () => void;
  onOpenShare: () => void;
  onNewScenario: () => void;
  bestDealTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  scenariosCount,
  onOpenPresets,
  onOpenShare,
  onNewScenario,
  bestDealTitle,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 shadow-lg shadow-rose-950/50">
              <Car className="text-white w-5 h-5" />
              <Flame className="absolute -top-1 -right-1 text-amber-300 w-3.5 h-3.5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white m-0 flex items-center gap-1.5">
                  Carrão do Lucão
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Simulador Anti-Loss
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Simulador de Compra, Financiamento & Caçador de Bom Negócio
              </p>
            </div>
          </div>

          {/* Quick stats on mobile */}
          <div className="sm:hidden flex items-center gap-1.5">
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 font-medium">
              {scenariosCount} {scenariosCount === 1 ? 'cenário' : 'cenários'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end overflow-x-auto pb-1 sm:pb-0">
          {bestDealTitle && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/50 border border-emerald-800/50 text-xs text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Líder: <strong>{bestDealTitle}</strong></span>
            </div>
          )}

          <button
            onClick={onOpenPresets}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 active:scale-95 transition-all shrink-0 cursor-pointer"
            title="Carregar propostas prontas de exemplo"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Exemplos</span>
          </button>

          <button
            onClick={onOpenShare}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 active:scale-95 transition-all shrink-0 cursor-pointer"
            title="Exportar ou Importar Cenários"
          >
            <FolderDown className="w-3.5 h-3.5 text-blue-400" />
            <span>Backup</span>
          </button>

          <button
            onClick={onNewScenario}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold text-xs shadow-md shadow-amber-950/30 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Novo Cálculo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
