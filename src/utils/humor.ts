import type { TradeInCar, AdditionalCosts } from '../types';

export interface HumorVerdictResult {
  badge: 'excelente' | 'razoavel' | 'alerta' | 'perigo' | 'agiota';
  title: string;
  roast: string;
  advice: string;
}

export function generateHumorVerdict(params: {
  lossScore: number;
  monthlyRate: number;
  annualRate: number;
  totalInterestPaid: number;
  interestPercentageOfCar: number;
  termMonths: number;
  carPrice: number;
  tradeInCar: TradeInCar;
  tradeInLossVsFipe: number;
  additionalCosts: AdditionalCosts;
}): HumorVerdictResult {
  const {
    lossScore,
    monthlyRate,
    totalInterestPaid,
    interestPercentageOfCar,
    termMonths,
    tradeInCar,
    tradeInLossVsFipe,
    additionalCosts
  } = params;

  // 1. Level Agiota (Score > 80 ou juros > 75% do carro ou taxa > 2.7%)
  if (lossScore >= 80 || interestPercentageOfCar >= 75 || monthlyRate >= 2.7) {
    return {
      badge: 'agiota',
      title: '🚨 CILADA NÍVEL MAREA TURBO SEM ÓLEO',
      roast: `Lucão, com R$ ${Math.round(totalInterestPaid).toLocaleString('pt-BR')} só de juros, você tá pagando dois carros: um pra você e outro pro gerente da agência viajar pra Cancún! O agiota da esquina cobraria menos e ainda mandava um panetone no Natal.`,
      advice: 'Pise no freio de mão IMEDIATAMENTE! Não assine isso nem sob hipnose. Aumente a entrada, reduza o prazo ou procure outro banco antes que seu CPF chore.'
    };
  }

  // 2. Level Perigo (Score 65 - 79)
  if (lossScore >= 65 || interestPercentageOfCar >= 50 || monthlyRate >= 2.1) {
    return {
      badge: 'perigo',
      title: '⚠️ BOLSA BANQUEIRO CONFIRMADA',
      roast: `Cuidado, Lucão! Você vai pagar mais de ${Math.round(interestPercentageOfCar)}% do valor do carro apenas em juros pro banco. Com essa grana dava pra comprar uma moto zero km de brinde ou bancar gasolina e churrasco por 3 anos.`,
      advice: 'Essa taxa mensal está salgada. Peça para simular em outro banco ou tente dar pelo menos mais R$ 5.000 de entrada para cair a faixa de juros.'
    };
  }

  // 3. Level Alerta (Score 45 - 64)
  if (lossScore >= 45 || termMonths >= 48) {
    let specificComment = '';
    if (termMonths >= 48) {
      specificComment = ` ${termMonths} meses é prazo estilo Matusalém: o carro vai desvalorizar, vai precisar de pneu novo, correia dentada e você ainda terá 20 parcelas pra pagar.`;
    } else if (additionalCosts.includeInFinancing && (additionalCosts.tac > 0 || additionalCosts.insurance > 0)) {
      specificComment = ` Eles embutiram TAC e seguros de R$ ${(additionalCosts.tac + additionalCosts.insurance).toLocaleString('pt-BR')} direto no financiamento. Isso gera juros sobre juros!`;
    }

    return {
      badge: 'alerta',
      title: '👀 DÁ PRA ENGOLIR, MAS DÓI O BOLSO',
      roast: `Não é o pior negócio do mundo, mas tá longe de ser um troféu.${specificComment} O vendedor vai bater a meta do mês com você, com certeza.`,
      advice: 'Tente negociar a isenção da TAC/Cadastro e nunca aceite o "seguro prestamista" embutido na parcela (isso é venda casada disfarçada).'
    };
  }

  // 4. Level Razoável (Score 25 - 44)
  if (lossScore >= 25) {
    let tradeInComment = '';
    if (tradeInCar.enabled && tradeInLossVsFipe > 5000) {
      tradeInComment = ` Só fica esperto que a loja desvalorizou seu usado em R$ ${Math.round(tradeInLossVsFipe).toLocaleString('pt-BR')} abaixo da FIPE. Vender no particular pagaria todas as taxas!`;
    }

    return {
      badge: 'razoavel',
      title: '⚖️ PROPOSTA DENTRO DA MÉDIA (SEM MÁGICA)',
      roast: `Negócio padrão de mercado brasileiro, Lucão. Nem milagre, nem roubo a mão armada.${tradeInComment} Vai dar pra andar de carro novo sem ter que viver à base de miojo com salsicha.`,
      advice: 'Se conseguir chorar mais 0,1% ou 0,2% na taxa de juros ou um IPVA grátis na negociação, já vira um negócio bem decente.'
    };
  }

  // 5. Level Excelente (Score < 25)
  return {
    badge: 'excelente',
    title: '🏆 SELO LUCÃO DE INTELIGÊNCIA FINANCEIRA',
    roast: `CARACA, LUCÃO! Ou o estagiário da concessionária errou a conta da taxa, ou você usou hipnose no vendedor. Juros baixíssimos (${monthlyRate.toFixed(2)}% a.m.), entrada saudável e custo final sob controle absoluto.`,
    advice: 'Assina logo antes que o gerente perceba e cancele essa proposta! Esse é o tipo de negócio que até o seu tio chato da Faria Lima aprovaria.'
  };
}

export const FUNNY_PRESETS = [
  {
    title: 'Renegade de Shopping (Cilada Clássica)',
    carPrice: 115000,
    cashDownPayment: 15000,
    termMonths: 48,
    monthlyRate: 2.39,
    dealership: 'Concessionária Jeep Só Hoje',
    notes: 'Vendedor jurou que a parcela cabe no bolso. Embutiu TAC e seguro prestamista sem avisar.',
    tradeInCar: {
      enabled: true,
      carName: 'Celta 2012 Guerreiro',
      fipeValue: 24000,
      offeredValue: 17000,
      debt: 0
    },
    additionalCosts: {
      tac: 1490,
      iof: 2850,
      registration: 1200,
      insurance: 1800,
      includeInFinancing: true
    }
  },
  {
    title: 'Corolla de Vovô à Vista com Choro',
    carPrice: 128000,
    cashDownPayment: 60000,
    termMonths: 24,
    monthlyRate: 0.99,
    dealership: 'Toyota Nipônica',
    notes: 'Campanha de juros subsidiados de fábrica com 50% de entrada. Negócio redondo!',
    tradeInCar: {
      enabled: true,
      carName: 'HB20 2018 Conservado',
      fipeValue: 52000,
      offeredValue: 47000,
      debt: 0
    },
    additionalCosts: {
      tac: 0,
      iof: 1100,
      registration: 900,
      insurance: 0,
      includeInFinancing: false
    }
  },
  {
    title: 'Civic G10 Parcelado até 2032',
    carPrice: 135000,
    cashDownPayment: 10000,
    termMonths: 60,
    monthlyRate: 2.75,
    dealership: 'Multimarcas do Kleber',
    notes: 'Carro rebaixado com escape esportivo. Quase 2 carros pagos no final das contas.',
    tradeInCar: {
      enabled: false,
      carName: '',
      fipeValue: 0,
      offeredValue: 0,
      debt: 0
    },
    additionalCosts: {
      tac: 1800,
      iof: 3500,
      registration: 1500,
      insurance: 2200,
      includeInFinancing: true
    }
  }
];

export const ANTI_GOLPE_TIPS = [
  {
    icon: 'ShieldAlert',
    title: 'Cuidado com a Venda Casada (Seguro Prestamista)',
    description: 'Bancos e concessionárias adoram embutir "Seguro de Proteção Financeira / Prestamista" de R$ 1.500 a R$ 3.000 direto no financiamento. Isso é ILEGAL pelo Código de Defesa do Consumidor. Exija que retirem antes de assinar!'
  },
  {
    icon: 'Percent',
    title: 'A Taxa Nominal vs Taxa Real (CET)',
    description: 'O vendedor diz: "Nossa taxa é só 1,49% ao mês". Mas quando você calcula o CET incluindo IOF, TAC e tarifas de cadastro, a taxa real pula para 2,15% a.m.! Use o modo "Descobrir Taxa Real" deste app digitando a parcela e desmascare a farsa.'
  },
  {
    icon: 'Car',
    title: 'O Golpe da Avaliação do Usado',
    description: 'Se a loja oferece R$ 15.000 a menos que a Tabela FIPE no seu carro atual, eles estão tirando o desconto do carro novo da sua costela! Às vezes vale a pena anunciar 1 semana na Webmotors/OLX por 95% da FIPE e embolsar a diferença à vista.'
  },
  {
    icon: 'Calendar',
    title: 'A Ilusão do Prazo Longo (60x)',
    description: 'Parcelar em 60x diminui um pouquinho o valor da parcela mensal, mas dobra o total de juros pagos! Simule sempre em 36x ou 48x para ver quanto dinheiro suado você poupa.'
  },
  {
    icon: 'FileText',
    title: 'Taxa de Abertura de Crédito (TAC) e Despachante',
    description: 'Exija o espelho completo das tarifas antes de assinar. Despachante da loja cobra R$ 1.800 por um serviço que você mesmo faz no Detran por R$ 350.'
  }
];
