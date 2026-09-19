export type CalculationMode = 
  | 'SOLVE_INSTALLMENT' // Lucas tem o preço, entrada, prazo e taxa -> descobre a parcela
  | 'SOLVE_RATE'        // Lucas tem o preço, entrada, prazo e parcela -> descobre a taxa real
  | 'SOLVE_PRICE'       // Lucas sabe quanto pode pagar por mês e quer saber o teto do carro
  | 'SOLVE_TERM';       // Lucas quer saber em quantos meses quita com dada parcela

export interface TradeInCar {
  enabled: boolean;
  carName: string;
  fipeValue: number;
  offeredValue: number;
  debt: number; // Dívida restante no carro atual (se ainda financiado)
}

export interface AdditionalCosts {
  tac: number;           // Taxa de abertura de crédito / cadastro
  iof: number;           // Imposto sobre operações financeiras
  registration: number;  // Emplacamento / despachante
  insurance: number;     // Seguro prestamista (venda casada comum)
  includeInFinancing: boolean; // Se somou esses custos ao financiamento
}

export interface CalculationResult {
  netTradeIn: number;              // Valor líquido da troca (oferecido - dívida)
  totalDownPayment: number;        // Entrada total (dinheiro + líquido da troca)
  totalFinanced: number;           // Saldo devedor financiado
  monthlyInstallment: number;      // Valor da parcela mensal (PMT)
  totalPaidInstallments: number;   // Total desembolsado nas parcelas
  totalInterestPaid: number;       // Juros totais pagos
  totalFinalCost: number;          // Custo total final do carro
  interestPercentageOfCar: number; // Juros totais / Preço do carro (%)
  effectiveMonthlyRate: number;    // Taxa mensal real apurada (% a.m.)
  effectiveAnnualRate: number;     // Taxa anual equivalente (% a.a.)
  tradeInLossVsFipe: number;       // Desvalorização do carro na troca vs FIPE
  lossScore: number;               // 0 a 100 (quanto maior, pior o negócio)
  verdictBadge: 'excelente' | 'razoavel' | 'alerta' | 'perigo' | 'agiota';
  verdictTitle: string;
  verdictRoast: string;
  verdictAdvice: string;
}

export interface Scenario {
  id: string;
  title: string;
  dealership?: string;
  carPrice: number;
  cashDownPayment: number;
  tradeInCar: TradeInCar;
  additionalCosts: AdditionalCosts;
  termMonths: number;
  monthlyRate: number;
  installment: number;
  calculationMode: CalculationMode;
  notes?: string;
  results: CalculationResult;
  createdAt: string;
}

export type ActiveTab = 'calculator' | 'compare' | 'ranking' | 'tips';
