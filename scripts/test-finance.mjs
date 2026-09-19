// Automated unit tests for finance mathematics
import assert from 'node:assert';

function calculateInstallment(principal, monthlyRate, termMonths) {
  if (principal <= 0 || termMonths <= 0) return 0;
  if (monthlyRate <= 0.0001) return principal / termMonths;
  const r = monthlyRate / 100;
  const factor = Math.pow(1 + r, termMonths);
  const pmt = principal * (r * factor) / (factor - 1);
  return Number.isFinite(pmt) ? pmt : 0;
}

function calculatePrincipalFromInstallment(installment, monthlyRate, termMonths) {
  if (installment <= 0 || termMonths <= 0) return 0;
  if (monthlyRate <= 0.0001) return installment * termMonths;
  const r = monthlyRate / 100;
  const factor = Math.pow(1 + r, termMonths);
  const pv = installment * (factor - 1) / (r * factor);
  return Number.isFinite(pv) ? pv : 0;
}

function calculateMonthlyRate(principal, installment, termMonths) {
  if (principal <= 0 || installment <= 0 || termMonths <= 0) return 0;
  if (installment * termMonths <= principal) return 0;

  let r = (installment * termMonths - principal) / (principal * termMonths);
  if (r <= 0) r = 0.01;

  const maxIter = 50;
  const tolerance = 1e-7;

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
    if (nextR <= 0 || nextR > 1 || !Number.isFinite(nextR)) break;
    r = nextR;
  }

  let low = 0.00001;
  let high = 1.0;
  for (let i = 0; i < 60; i++) {
    const mid = (low + high) / 2;
    const fMid = installment * (1 - Math.pow(1 + mid, -termMonths)) - principal * mid;
    if (Math.abs(fMid) < tolerance) return mid * 100;
    if (fMid > 0) low = mid;
    else high = mid;
  }
  return ((low + high) / 2) * 100;
}

console.log('--- TEST 1: Standard Tabela Price Calculation ---');
// Car $100k, $40k down -> $60k financed, 48x at 1.50% a.m.
const pv = 60000;
const rate = 1.5;
const n = 48;
const pmt = calculateInstallment(pv, rate, n);
console.log(`PV: R$ ${pv}, Rate: ${rate}%, n: ${n} => PMT: R$ ${pmt.toFixed(2)}`);
// Standard Tabela Price verification: factor = (1.015)^48 = 2.043478
// PMT = 60000 * (0.015 * 2.043478) / (1.043478) = 1762.53
assert(Math.abs(pmt - 1762.53) < 0.1, `Expected ~1762.53, got ${pmt}`);
console.log('✓ Test 1 passed!');

console.log('\n--- TEST 2: Reverse solving rate with Newton-Raphson ---');
// Given PMT = 1762.53, PV = 60000, n = 48 -> calculate rate
const recoveredRate = calculateMonthlyRate(pv, pmt, n);
console.log(`Given PV: R$ ${pv}, PMT: R$ ${pmt.toFixed(2)}, n: ${n} => Recovered Rate: ${recoveredRate.toFixed(4)}%`);
assert(Math.abs(recoveredRate - 1.50) < 0.001, `Expected 1.50%, got ${recoveredRate}`);
console.log('✓ Test 2 passed!');

console.log('\n--- TEST 3: Reverse solving PV from PMT ---');
const recoveredPV = calculatePrincipalFromInstallment(pmt, rate, n);
console.log(`Given PMT: R$ ${pmt.toFixed(2)}, Rate: ${rate}%, n: ${n} => Recovered PV: R$ ${recoveredPV.toFixed(2)}`);
assert(Math.abs(recoveredPV - 60000) < 0.1, `Expected 60000, got ${recoveredPV}`);
console.log('✓ Test 3 passed!');

console.log('\n--- TEST 4: Zero interest rate (juros zero) ---');
const pmtZero = calculateInstallment(60000, 0, 48);
assert.strictEqual(pmtZero, 60000 / 48);
const rateZero = calculateMonthlyRate(60000, 1250, 48);
assert.strictEqual(rateZero, 0);
console.log('✓ Test 4 passed!');

console.log('\n--- TEST 5: High rate / Agiota rate (3.5% a.m.) ---');
const pmtAgiota = calculateInstallment(50000, 3.5, 36);
const recoveredAgiotaRate = calculateMonthlyRate(50000, pmtAgiota, 36);
console.log(`Agiota Rate 3.5% test: recovered ${recoveredAgiotaRate.toFixed(4)}%`);
assert(Math.abs(recoveredAgiotaRate - 3.50) < 0.001);
console.log('✓ Test 5 passed!');

console.log('\n🎉 ALL MATHEMATICAL TESTS PASSED SUCCESSFULLY!');
