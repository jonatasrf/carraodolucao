import React from 'react';
import { Calculator, Swords, Layers, Trophy, Lightbulb } from 'lucide-react';
import type { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  scenariosCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onChangeTab,
  scenariosCount,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'calculator', label: 'Simulador', icon: Calculator },
    { id: 'duelo', label: 'Duelo X1', icon: Swords },
    { id: 'compare', label: 'Comparador', icon: Layers, badge: scenariosCount },
    { id: 'ranking', label: 'Ranking', icon: Trophy },
    { id: 'tips', label: 'Anti-Golpe', icon: Lightbulb },
  ];

  return (
    <>
      {/* Desktop / Tablet Top Navigation */}
      <nav className="hidden sm:block max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Fixed Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/90 px-3 py-2 pb-safe">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                  isActive ? 'text-amber-400 font-bold' : 'text-slate-400 font-medium'
                }`}
              >
                <div className="relative">
                  <Icon size={20} className={isActive ? 'scale-110 text-amber-400 transition-transform' : ''} />
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 text-[10px] flex items-center justify-center px-1 font-bold rounded-full bg-amber-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
