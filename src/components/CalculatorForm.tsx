import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Coins, 
  Percent, 
  Calendar, 
  HelpCircle, 
  Save, 
  Share2, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Flame,
  ArrowRight
} from 'lucide-react';
import type { 
  CalculationMode, 
  Scenario, 
  TradeInCar, 
  AdditionalCosts 
} from '../types';
import { computeScenarioResults } from '../utils/finance';
import { formatCurrency, formatPercent, generateWhatsAppSummary } from '../utils/formatters';
import { VerdictBadge } from './VerdictBadge';

interface CalculatorFormProps {
  onSaveScenario: (scenario: Scenario) => void;
  initialScenario?: Scenario | null;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  onSaveScenario,
  initialScenario,
}) => {
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('SOLVE_INSTALLMENT');
  const [title, setTitle] = useState('Novo Carro do Lucão');
  const [dealership, setDealership] = useState('');
  
  // Numerical values
  const [carPrice, setCarPrice] = useState<number>(100000);
  const [cashDownPayment, setCashDownPayment] = useState<number>(30000);
  const [termMonths, setTermMonths] = useState<number>(48);
  const [monthlyRate, setMonthlyRate] = useState<number>(1.79);
  const [installment, setInstallment] = useState<number>(2180);

  // Trade-in car
  const [tradeInCar, setTradeInCar] = useState<TradeInCar>({
    enabled: false,
    carName: '',
    fipeValue: 35000,
    offeredValue: 28000,
    debt: 0,
  });

  // Additional costs
  const [showExtras, setShowExtras] = useState(false);
  const [additionalCosts, setAdditionalCosts] = useState<AdditionalCosts>({
    tac: 1200,
    iof: 2200,
    registration: 950,
    insurance: 0,
    includeInFinancing: true,
  });

  const [copied, setCopied] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  // If editing an existing scenario
  useEffect(() => {
    if (initialScenario) {
      setTitle(initialScenario.title);
      setDealership(initialScenario.dealership || '');
      setCarPrice(initialScenario.carPrice);
      setCashDownPayment(initialScenario.cashDownPayment);
      setTermMonths(initialScenario.termMonths);
      setMonthlyRate(initialScenario.monthlyRate);
      setInstallment(initialScenario.installment);
      setTradeInCar(initialScenario.tradeInCar);
      setAdditionalCosts(initialScenario.additionalCosts);
      setCalculationMode(initialScenario.calculationMode);
    }
  }, [initialScenario]);

  // Run calculation dynamically
  const calculation = computeScenarioResults({
    carPrice,
    cashDownPayment,
    tradeInCar,
    additionalCosts,
    termMonths,
    monthlyRate,
    installment,
    calculationMode,
  });

  const { results } = calculation;

  // Handle saving scenario
  const handleSave = () => {
    const newScenario: Scenario = {
      id: initialScenario ? initialScenario.id : `scenario-${Date.now()}`,
      title: title.trim() || 'Carro do Lucão',
      dealership: dealership.trim() || undefined,
      carPrice: calculation.updatedCarPrice,
      cashDownPayment,
      tradeInCar,
      additionalCosts,
      termMonths: calculation.updatedTermMonths,
      monthlyRate: calculation.updatedMonthlyRate,
      installment: calculation.updatedInstallment,
      calculationMode,
      results,
      createdAt: new Date().toISOString(),
    };

    onSaveScenario(newScenario);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  // Copy WhatsApp Summary
  const handleCopyWhatsApp = () => {
    const dummyScenario: Scenario = {
      id: 'current',
      title: title.trim() || 'Proposta em Análise',
      dealership: dealership.trim() || undefined,
      carPrice: calculation.updatedCarPrice,
      cashDownPayment,
      tradeInCar,
      additionalCosts,
      termMonths: calculation.updatedTermMonths,
      monthlyRate: calculation.updatedMonthlyRate,
      installment: calculation.updatedInstallment,
      calculationMode,
      results,
      createdAt: new Date().toISOString(),
    };

    const text = generateWhatsAppSummary(dummyScenario);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const commonTerms = [12, 24, 36, 48, 60, 72];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24 sm:pb-8">
      {/* Mode Selector Tabs */}
      <div className="bg-slate-900/90 p-2 sm:p-2.5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between px-2 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            O que você quer calcular agora, Lucão?
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={() => setCalculationMode('SOLVE_INSTALLMENT')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              calculationMode === 'SOLVE_INSTALLMENT'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="text-sm">💵 Parcela</span>
            <span className="text-[10px] font-normal opacity-90">Tenho preço & taxa</span>
          </button>

          <button
            type="button"
            onClick={() => setCalculationMode('SOLVE_RATE')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              calculationMode === 'SOLVE_RATE'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="text-sm">🕵️‍♂️ Taxa Real</span>
            <span className="text-[10px] font-normal opacity-90">Descobrir o juros real</span>
          </button>

          <button
            type="button"
            onClick={() => setCalculationMode('SOLVE_PRICE')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              calculationMode === 'SOLVE_PRICE'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="text-sm">🚗 Preço Máximo</span>
            <span className="text-[10px] font-normal opacity-90">Cabe no bolso por mês</span>
          </button>

          <button
            type="button"
            onClick={() => setCalculationMode('SOLVE_TERM')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              calculationMode === 'SOLVE_TERM'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="text-sm">⏱️ Prazo</span>
            <span className="text-[10px] font-normal opacity-90">Quantos meses quito</span>
          </button>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Top column: Inputs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/80 p-4 sm:p-5 rounded-2xl border border-slate-800/90 shadow-xl space-y-4">
            {/* Title & Dealership */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nome / Modelo do Carro
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Jeep Renegade Longitude"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Concessionária / Loja (Opcional)
                </label>
                <input
                  type="text"
                  value={dealership}
                  onChange={(e) => setDealership(e.target.value)}
                  placeholder="Ex: Fiat Amazonas / Particular"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>
            </div>

            {/* Car Price */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-amber-400" />
                  Valor do Carro Novo (R$)
                </label>
                {calculationMode === 'SOLVE_PRICE' && (
                  <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Calculado Automaticamente
                  </span>
                )}
              </div>
              <input
                type="number"
                inputMode="decimal"
                disabled={calculationMode === 'SOLVE_PRICE'}
                value={calculationMode === 'SOLVE_PRICE' ? calculation.updatedCarPrice : carPrice || ''}
                onChange={(e) => setCarPrice(parseFloat(e.target.value) || 0)}
                placeholder="100000"
                className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-lg font-bold text-white focus:outline-none ${
                  calculationMode === 'SOLVE_PRICE'
                    ? 'border-amber-500/50 bg-amber-950/20 text-amber-300 cursor-not-allowed'
                    : 'border-slate-700/80 focus:border-amber-500'
                }`}
              />
            </div>

            {/* Down Payment Section */}
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-emerald-400" />
                  Composição da Entrada
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  Total: {formatCurrency(results.totalDownPayment)}
                </span>
              </div>

              {/* Cash Down Payment */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Entrada em Dinheiro / PIX (R$)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={cashDownPayment || ''}
                  onChange={(e) => setCashDownPayment(parseFloat(e.target.value) || 0)}
                  placeholder="30000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-semibold"
                />
              </div>

              {/* Trade-In Toggle */}
              <div className="pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={tradeInCar.enabled}
                    onChange={(e) => setTradeInCar({ ...tradeInCar, enabled: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-200">
                    Dar carro usado na troca?
                  </span>
                </label>

                {tradeInCar.enabled && (
                  <div className="mt-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">
                        Modelo do Carro Usado
                      </label>
                      <input
                        type="text"
                        value={tradeInCar.carName}
                        onChange={(e) => setTradeInCar({ ...tradeInCar, carName: e.target.value })}
                        placeholder="Ex: Celta 2012 / HB20 2018"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-0.5">
                          Tabela FIPE do Usado (R$)
                        </label>
                        <input
                          type="number"
                          inputMode="decimal"
                          value={tradeInCar.fipeValue || ''}
                          onChange={(e) => setTradeInCar({ ...tradeInCar, fipeValue: parseFloat(e.target.value) || 0 })}
                          placeholder="35000"
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-0.5">
                          Proposta da Loja (R$)
                        </label>
                        <input
                          type="number"
                          inputMode="decimal"
                          value={tradeInCar.offeredValue || ''}
                          onChange={(e) => setTradeInCar({ ...tradeInCar, offeredValue: parseFloat(e.target.value) || 0 })}
                          placeholder="28000"
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">
                        Débitos / Dívida Restante no Usado (R$)
                      </label>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={tradeInCar.debt || ''}
                        onChange={(e) => setTradeInCar({ ...tradeInCar, debt: parseFloat(e.target.value) || 0 })}
                        placeholder="0 (se já quitado)"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {results.tradeInLossVsFipe > 0 && (
                      <div className="p-2 rounded-lg bg-orange-950/40 border border-orange-800/40 text-[11px] text-orange-300">
                        🚨 Loja pagando <strong>{formatCurrency(results.tradeInLossVsFipe)}</strong> abaixo da FIPE (-{((results.tradeInLossVsFipe / (tradeInCar.fipeValue || 1)) * 100).toFixed(1)}%).
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Term & Rates Section */}
            <div className="space-y-3">
              {/* Term Selection */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    Prazo do Financiamento (Meses)
                  </label>
                  {calculationMode === 'SOLVE_TERM' && (
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Calculado Automaticamente
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {commonTerms.map((months) => (
                    <button
                      key={months}
                      type="button"
                      disabled={calculationMode === 'SOLVE_TERM'}
                      onClick={() => setTermMonths(months)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        termMonths === months
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {months}x
                    </button>
                  ))}
                  <input
                    type="number"
                    inputMode="numeric"
                    disabled={calculationMode === 'SOLVE_TERM'}
                    value={calculationMode === 'SOLVE_TERM' ? calculation.updatedTermMonths : termMonths || ''}
                    onChange={(e) => setTermMonths(parseInt(e.target.value) || 1)}
                    className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white text-center font-bold"
                    placeholder="Outro"
                  />
                </div>
              </div>

              {/* Monthly Rate vs Installment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Interest Rate */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                      <Percent className="w-3.5 h-3.5 text-amber-400" />
                      Taxa de Juros (% a.m.)
                    </label>
                    {calculationMode === 'SOLVE_RATE' && (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                        Calculando Real
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    inputMode="decimal"
                    disabled={calculationMode === 'SOLVE_RATE'}
                    value={calculationMode === 'SOLVE_RATE' ? calculation.updatedMonthlyRate : monthlyRate || ''}
                    onChange={(e) => setMonthlyRate(parseFloat(e.target.value) || 0)}
                    placeholder="1.79"
                    className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none ${
                      calculationMode === 'SOLVE_RATE'
                        ? 'border-amber-500/50 bg-amber-950/20 text-amber-300 cursor-not-allowed'
                        : 'border-slate-700/80 focus:border-amber-500'
                    }`}
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Equivale a {formatPercent(results.effectiveAnnualRate)} ao ano
                  </span>
                </div>

                {/* Monthly Installment */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      Valor da Parcela (R$)
                    </label>
                    {calculationMode === 'SOLVE_INSTALLMENT' && (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                        Calculando PMT
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    step="1"
                    inputMode="decimal"
                    disabled={calculationMode === 'SOLVE_INSTALLMENT'}
                    value={calculationMode === 'SOLVE_INSTALLMENT' ? calculation.updatedInstallment : installment || ''}
                    onChange={(e) => setInstallment(parseFloat(e.target.value) || 0)}
                    placeholder="2180"
                    className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none ${
                      calculationMode === 'SOLVE_INSTALLMENT'
                        ? 'border-amber-500/50 bg-amber-950/20 text-amber-300 cursor-not-allowed'
                        : 'border-slate-700/80 focus:border-amber-500'
                    }`}
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Total: {formatCurrency(results.totalPaidInstallments)}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Fees Accordion */}
            <div className="pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setShowExtras(!showExtras)}
                className="w-full flex items-center justify-between py-2 text-xs font-bold text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  Taxas da Loja & Custos Extras (TAC, IOF, Despachante)
                </span>
                {showExtras ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showExtras && (
                <div className="mt-2 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">
                        TAC / Cadastro (R$)
                      </label>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={additionalCosts.tac || ''}
                        onChange={(e) => setAdditionalCosts({ ...additionalCosts, tac: parseFloat(e.target.value) || 0 })}
                        placeholder="1200"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">
                        IOF Financiamento (R$)
                      </label>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={additionalCosts.iof || ''}
                        onChange={(e) => setAdditionalCosts({ ...additionalCosts, iof: parseFloat(e.target.value) || 0 })}
                        placeholder="2200"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">
                        Emplacamento / Despachante (R$)
                      </label>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={additionalCosts.registration || ''}
                        onChange={(e) => setAdditionalCosts({ ...additionalCosts, registration: parseFloat(e.target.value) || 0 })}
                        placeholder="950"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">
                        Seguro Prestamista embutido (R$)
                      </label>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={additionalCosts.insurance || ''}
                        onChange={(e) => setAdditionalCosts({ ...additionalCosts, insurance: parseFloat(e.target.value) || 0 })}
                        placeholder="0"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={additionalCosts.includeInFinancing}
                      onChange={(e) => setAdditionalCosts({ ...additionalCosts, includeInFinancing: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                    <span className="text-xs text-slate-300">
                      Financiar essas taxas na parcela (gera juros adicionais)
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Real-time Live Result Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-5 rounded-2xl border border-slate-800 shadow-2xl space-y-4 sticky top-20">
            {/* Header / Verdict */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Resultado ao Vivo
              </span>
              <VerdictBadge badge={results.verdictBadge} size="sm" />
            </div>

            {/* Big Installment Highlight */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
              <span className="text-xs font-medium text-slate-400 block mb-1">
                Parcela Mensal Estimada
              </span>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
                {formatCurrency(results.monthlyInstallment)}
              </div>
              <span className="text-xs font-semibold text-slate-400 mt-1 block">
                {calculation.updatedTermMonths}x meses • Taxa real {formatPercent(results.effectiveMonthlyRate)} a.m.
              </span>
            </div>

            {/* Breakdown Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Valor Financiado</span>
                <span className="font-bold text-white text-sm">
                  {formatCurrency(results.totalFinanced)}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Entrada Total</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {formatCurrency(results.totalDownPayment)}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Total só de Juros</span>
                <span className="font-bold text-rose-400 text-sm">
                  {formatCurrency(results.totalInterestPaid)}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  +{formatPercent(results.interestPercentageOfCar)} do carro
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Custo Final Total</span>
                <span className="font-bold text-amber-300 text-sm">
                  {formatCurrency(results.totalFinalCost)}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Tudo desembolsado
                </span>
              </div>
            </div>

            {/* Humor Roast Box */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <Flame size={14} className="text-rose-500" />
                <span>Diagnóstico do Lucão:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{results.verdictRoast}"
              </p>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                💡 <strong className="text-slate-200">Conselho:</strong> {results.verdictAdvice}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black text-sm shadow-lg shadow-amber-950/40 active:scale-98 transition-all cursor-pointer"
              >
                {savedFeedback ? (
                  <>
                    <Check size={18} className="text-slate-950" />
                    <span>Cenário Salvo com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Salvar este Cenário</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCopyWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 active:scale-98 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-emerald-400" />
                    <span>Copiado para o WhatsApp!</span>
                  </>
                ) : (
                  <>
                    <Share2 size={16} className="text-emerald-400" />
                    <span>Copiar Resumo para WhatsApp</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
