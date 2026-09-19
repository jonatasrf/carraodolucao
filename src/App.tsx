import React, { useState, useEffect } from 'react';
import type { ActiveTab, Scenario } from './types';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { CalculatorForm } from './components/CalculatorForm';
import { ScenarioComparison } from './components/ScenarioComparison';
import { RankingTable } from './components/RankingTable';
import { AntiGolpeTips } from './components/AntiGolpeTips';
import { PresetsModal } from './components/PresetsModal';
import { ShareModal } from './components/ShareModal';
import { FUNNY_PRESETS } from './utils/humor';
import { computeScenarioResults } from './utils/finance';

const STORAGE_KEY = 'carrao_do_lucao_scenarios_v1';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('calculator');
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Initialize from LocalStorage or default presets
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setScenarios(parsed);
          return;
        }
      }
    } catch {
      // LocalStorage read failure fallback
    }

    // Default seed with funny presets if empty
    loadAllDefaultPresets();
  }, []);

  // Save to LocalStorage whenever scenarios change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [scenarios]);

  const loadAllDefaultPresets = () => {
    const loadedScenarios: Scenario[] = FUNNY_PRESETS.map((preset, index) => {
      const calc = computeScenarioResults({
        carPrice: preset.carPrice,
        cashDownPayment: preset.cashDownPayment,
        tradeInCar: preset.tradeInCar,
        additionalCosts: preset.additionalCosts,
        termMonths: preset.termMonths,
        monthlyRate: preset.monthlyRate,
        installment: 0,
        calculationMode: 'SOLVE_INSTALLMENT',
      });

      return {
        id: `preset-${index}-${Date.now()}`,
        title: preset.title,
        dealership: preset.dealership,
        carPrice: preset.carPrice,
        cashDownPayment: preset.cashDownPayment,
        tradeInCar: preset.tradeInCar,
        additionalCosts: preset.additionalCosts,
        termMonths: preset.termMonths,
        monthlyRate: preset.monthlyRate,
        installment: calc.updatedInstallment,
        calculationMode: 'SOLVE_INSTALLMENT',
        notes: preset.notes,
        results: calc.results,
        createdAt: new Date().toISOString(),
      };
    });

    setScenarios(loadedScenarios);
  };

  // Scenario operations
  const handleSaveScenario = (scenario: Scenario) => {
    setScenarios((prev) => {
      const existingIndex = prev.findIndex((s) => s.id === scenario.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = scenario;
        return updated;
      }
      return [scenario, ...prev];
    });

    setEditingScenario(null);
  };

  const handleEditScenario = (scenario: Scenario) => {
    setEditingScenario(scenario);
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  };

  const handleDuplicateScenario = (scenario: Scenario) => {
    const duplicated: Scenario = {
      ...scenario,
      id: `scenario-${Date.now()}`,
      title: `${scenario.title} (Cópia)`,
      createdAt: new Date().toISOString(),
    };
    setScenarios((prev) => [duplicated, ...prev]);
  };

  const handleNewScenario = () => {
    setEditingScenario(null);
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const bestDeal = scenarios.length > 0
    ? [...scenarios].sort((a, b) => a.results.totalFinalCost - b.results.totalFinalCost)[0]
    : undefined;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* App Header */}
      <Header
        scenariosCount={scenarios.length}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onNewScenario={handleNewScenario}
        bestDealTitle={bestDeal?.title}
      />

      {/* Navigation Tabs (Top on desktop, bottom on mobile) */}
      <Navbar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        scenariosCount={scenarios.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        {activeTab === 'calculator' && (
          <CalculatorForm
            onSaveScenario={handleSaveScenario}
            initialScenario={editingScenario}
          />
        )}

        {activeTab === 'compare' && (
          <ScenarioComparison
            scenarios={scenarios}
            onEdit={handleEditScenario}
            onDelete={handleDeleteScenario}
            onDuplicate={handleDuplicateScenario}
            onNewScenario={handleNewScenario}
            onLoadPresets={() => setIsPresetsOpen(true)}
          />
        )}

        {activeTab === 'ranking' && (
          <RankingTable
            scenarios={scenarios}
            onSelectScenario={(sc) => {
              handleEditScenario(sc);
            }}
          />
        )}

        {activeTab === 'tips' && <AntiGolpeTips />}
      </main>

      {/* Modals */}
      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onLoadPreset={(sc) => {
          setEditingScenario(sc);
          setActiveTab('calculator');
        }}
        onLoadAllPresets={loadAllDefaultPresets}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        scenarios={scenarios}
        onImportScenarios={(imported) => setScenarios(imported)}
        onClearAllScenarios={() => setScenarios([])}
      />
    </div>
  );
};

export default App;
