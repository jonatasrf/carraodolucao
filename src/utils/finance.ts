import type { 
  CalculationMode, 
  TradeInCar, 
  AdditionalCosts, 
  CalculationResult 
} from '../types';
import { generateHumorVerdict } from './humor';

/**
 * Calculates monthly installment (PMT) using Tabela Price formula
 * @param principal Financed amount (PV)
 * @param monthlyRate Monthly interest rate in % (e.g. 1.85 for 1.85%)
 * @param termMonths Number of monthly installments (n)
 */
export function calculateInstallment(
  principal: number, 
  monthlyRate: number, 
  termMonths: number
): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  if (monthlyRate <= 0.0001) return principal / termMonths;

  const r = monthlyRate / 100;
  const factor = Math.pow(1 + r, termMonths);
  const pmt = principal * (r * factor) / (factor - 1);
  return Number.isFinite(pmt) ? pmt : 0;
}

/**
 * Calculates the maximum financed amount (PV) given the installment, rate and term
 */
export function calculatePrincipalFromInstallment(
  installment: number, 
  monthlyRate: number, 
  termMonths: number
): number {
  if (installment <= 0 || termMonths <= 0) return 0;
  if (monthlyRate <= 0.0001) return installment * termMonths;

  const r = monthlyRate / 100;
  const factor = Math.pow(1 + r, termMonths);
  const pv = installment * (factor - 1) / (r * factor);
  return Number.isFinite(pv) ? pv : 0;
}

/**
 * Calculates the exact monthly interest rate (IRR / Taxa Interna) given PV, PMT and n.
 * Uses Newton-Raphson with an ultra-reliable bisection fallback.
 * Returns rate as percentage (e.g., 1.75 for 1.75% a.m.)
 */
export function calculateMonthlyRate(
  principal: number, 
  installment: number, 
  termMonths: number
): number {
  if (principal <= 0 || installment <= 0 || termMonths <= 0) return 0;
  
  // Total paid is less than or equal to financed amount -> 0% rate (free loan / subsidy)
  if (installment * termMonths <= principal) return 0;

  // Function: f(r) = PMT * (1 - (1+r)^(-n)) / r - PV = 0
  // Simplified: f(r) = PMT * (1 - (1+r)^(-n)) - PV * r = 0
  let r = (installment * termMonths - principal) / (principal * termMonths); // Initial guess
  if (r <= 0) r = 0.01;

  const maxIter = 50;
  const tolerance = 1e-7;

  // Newton-Raphson attempt
  for (let i = 0; i < maxIter; i++) {
    const powTerm = Math.pow(1 + r, -termMonths);
    const f = installment * (1 - powTerm) - principal * r;
    const df = installment * termMonths * Math.pow(1 + r, -termMonths - 1) - principal;

    if (Math.abs(df) < 1e-12) break;

    const nextR = r - f / df;
    if (Math.abs(nextR - r) < tolerance) {
      if (nextR > 0 && nextR < 1) {
        return nextR * 100;
      }
      break;
    }

    if (nextR <= 0 || nextR > 1 || !Number.isFinite(nextR)) {
      // Diverged, switch to bisection
      break;
    }
    r = nextR;
  }

  // Robust Bisection Method fallback
  let low = 0.00001;
  let high = 1.0; // Up to 100% per month

  for (let i = 0; i < 60; i++) {
    const mid = (low + high) / 2;
    const fMid = installment * (1 - Math.pow(1 + mid, -termMonths)) - principal * mid;

    if (Math.abs(fMid) < tolerance) {
      return mid * 100;
    }

    if (fMid > 0) {
      // mid is too low
      low = mid;
    } else {
      // mid is too high
      high = mid;
    }
  }

  return ((low + high) / 2) * 100;
}

/**
 * Calculates term in months given principal, rate and installment
 */
export function calculateTermFromInstallment(
  principal: number,
  monthlyRate: number,
  installment: number
): number {
  if (principal <= 0 || installment <= 0) return 0;
  if (monthlyRate <= 0.0001) {
    return Math.ceil(principal / installment);
  }

  const r = monthlyRate / 100;
  if (installment <= principal * r) {
    // Perpetual debt: installment doesn't even cover the interest
    return 999;
  }

  const n = -Math.log(1 - (principal * r) / installment) / Math.log(1 + r);
  return Number.isFinite(n) ? Math.max(1, Math.round(n)) : 0;
}

/**
 * Calculates annual equivalent rate from monthly rate: (1 + i)^12 - 1
 */
export function calculateAnnualRate(monthlyRatePercent: number): number {
  if (monthlyRatePercent <= 0) return 0;
  const r = monthlyRatePercent / 100;
  return (Math.pow(1 + r, 12) - 1) * 100;
}

/**
 * Master calculation runner for a complete Scenario
 */
export function computeScenarioResults(params: {
  carPrice: number;
  cashDownPayment: number;
  tradeInCar: TradeInCar;
  additionalCosts: AdditionalCosts;
  termMonths: number;
  monthlyRate: number;
  installment: number;
  calculationMode: CalculationMode;
}): {
  updatedCarPrice: number;
  updatedTermMonths: number;
  updatedMonthlyRate: number;
  updatedInstallment: number;
  results: CalculationResult;
} {
  let {
    carPrice,
    cashDownPayment,
    tradeInCar,
    additionalCosts,
    termMonths,
    monthlyRate,
    installment,
    calculationMode
  } = params;

  // 1. Trade-in net value
  const netTradeIn = tradeInCar.enabled 
    ? Math.max(0, (tradeInCar.offeredValue || 0) - (tradeInCar.debt || 0))
    : 0;

  const tradeInLossVsFipe = tradeInCar.enabled && tradeInCar.fipeValue > 0
    ? Math.max(0, tradeInCar.fipeValue - tradeInCar.offeredValue)
    : 0;

  // 2. Down payment
  const totalDownPayment = (cashDownPayment || 0) + netTradeIn;

  // 3. Additional costs
  const totalExtras = (additionalCosts.tac || 0) + 
                      (additionalCosts.iof || 0) + 
                      (additionalCosts.registration || 0) + 
                      (additionalCosts.insurance || 0);

  const financedExtras = additionalCosts.includeInFinancing ? totalExtras : 0;
  const upfrontExtras = additionalCosts.includeInFinancing ? 0 : totalExtras;

  // 4. Mode-based solving
  if (calculationMode === 'SOLVE_PRICE') {
    // Sabe parcela, taxa e prazo -> calcula valor financiado e depois o preço do carro
    const calculatedPrincipal = calculatePrincipalFromInstallment(installment, monthlyRate, termMonths);
    carPrice = Math.max(0, calculatedPrincipal + totalDownPayment - financedExtras);
  }

  // Financed amount (PV)
  let totalFinanced = Math.max(0, carPrice - totalDownPayment + financedExtras);

  if (calculationMode === 'SOLVE_INSTALLMENT') {
    installment = calculateInstallment(totalFinanced, monthlyRate, termMonths);
  } else if (calculationMode === 'SOLVE_RATE') {
    monthlyRate = calculateMonthlyRate(totalFinanced, installment, termMonths);
  } else if (calculationMode === 'SOLVE_TERM') {
    termMonths = calculateTermFromInstallment(totalFinanced, monthlyRate, installment);
  }

  // Re-verify consistency
  const effectiveMonthlyRate = monthlyRate;
  const effectiveAnnualRate = calculateAnnualRate(effectiveMonthlyRate);
  const totalPaidInstallments = installment * termMonths;
  const totalInterestPaid = Math.max(0, totalPaidInstallments - totalFinanced);
  const totalFinalCost = totalDownPayment + totalPaidInstallments + upfrontExtras;
  const interestPercentageOfCar = carPrice > 0 ? (totalInterestPaid / carPrice) * 100 : 0;

  // 5. Calculate Loss Score (0 to 100)
  // Metrics considered:
  // - Interest vs Car price: 0% -> 0, 50% -> 40, 100% -> 80
  // - Monthly interest rate: <1.2% -> 0, 1.8% -> 15, >2.5% -> 35
  // - Term length: <=24m -> 0, 48m -> 15, 60m+ -> 25
  // - Trade-in discount: >20% below FIPE adds up to 20 pts
  let lossScore = 0;

  // Component A: Interest weight (0 - 45)
  lossScore += Math.min(45, (interestPercentageOfCar / 100) * 45);

  // Component B: Interest rate weight (0 - 30)
  if (effectiveMonthlyRate > 1.2) {
    lossScore += Math.min(30, ((effectiveMonthlyRate - 1.2) / 2.0) * 30);
  }

  // Component C: Term length weight (0 - 15)
  if (termMonths > 36) {
    lossScore += Math.min(15, ((termMonths - 36) / 36) * 15);
  }

  // Component D: Trade-in loss weight (0 - 10)
  if (tradeInCar.enabled && tradeInCar.fipeValue > 0) {
    const fipeDiscountRatio = tradeInLossVsFipe / tradeInCar.fipeValue;
    if (fipeDiscountRatio > 0.1) {
      lossScore += Math.min(10, ((fipeDiscountRatio - 0.1) / 0.2) * 10);
    }
  }

  lossScore = Math.min(100, Math.max(0, Math.round(lossScore)));

  // Generate humor commentary
  const humorVerdict = generateHumorVerdict({
    lossScore,
    monthlyRate: effectiveMonthlyRate,
    annualRate: effectiveAnnualRate,
    totalInterestPaid,
    interestPercentageOfCar,
    termMonths,
    carPrice,
    tradeInCar,
    tradeInLossVsFipe,
    additionalCosts
  });

  const results: CalculationResult = {
    netTradeIn,
    totalDownPayment,
    totalFinanced,
    monthlyInstallment: installment,
    totalPaidInstallments,
    totalInterestPaid,
    totalFinalCost,
    interestPercentageOfCar,
    effectiveMonthlyRate,
    effectiveAnnualRate,
    tradeInLossVsFipe,
    lossScore,
    verdictBadge: humorVerdict.badge,
    verdictTitle: humorVerdict.title,
    verdictRoast: humorVerdict.roast,
    verdictAdvice: humorVerdict.advice
  };

  return {
    updatedCarPrice: Math.round(carPrice),
    updatedTermMonths: termMonths,
    updatedMonthlyRate: Number(monthlyRate.toFixed(2)),
    updatedInstallment: Number(installment.toFixed(2)),
    results
  };
}
