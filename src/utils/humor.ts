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

  // 1. Faixa Agiota (Score > 80 ou juros > 75% do carro ou taxa > 2.7%)
  if (lossScore >= 80 || interestPercentageOfCar >= 75 || monthlyRate >= 2.7) {
    return {
      badge: 'agiota',
      title: '🚨 CILADA NÍVEL MAREA TURBO: DOIS CARROS PRO BANCO E MEIO PRA VOCÊ',
      roast: `Lucas, com R$ ${Math.round(totalInterestPaid).toLocaleString('pt-BR')} só de juros, você não está comprando um carro: está bancando a frota inteira da concessionária e a faculdade dos herdeiros do banqueiro! Com essa taxa de ${monthlyRate.toFixed(2)}% ao mês, até agiota de esquina cobraria mais barato e ainda mandava um panetone no fim de ano.`,
      advice: 'Agradeça pelo cafezinho cortesia, levante da mesa e vá embora sem olhar pra trás. Assinar um contrato desse é assinar atestado de doação voluntária de patrimônio!'
    };
  }

  // 2. Faixa Perigo (Score 65 - 79)
  if (lossScore >= 65 || interestPercentageOfCar >= 50 || monthlyRate >= 2.1) {
    return {
      badge: 'perigo',
      title: '⚠️ CILADA GOURMET: O CAFEZINHO DA CONCESSIONÁRIA VAI CUSTAR CARO',
      roast: `Cuidado, Lucas! O ar-condicionado da loja estava fresquinho e o vendedor pareceu super simpático, mas mais de ${Math.round(interestPercentageOfCar)}% do valor do carro vai evaporar só em juros pro banqueiro! Se fechar nessas condições, você vai trabalhar metade do mês só pra sustentar o carnê da financeira.`,
      advice: 'Não se deixe deslumbrar pelo cheirinho de carro novo e conversa mansa. Exija baixar essa taxa para o patamar de mercado ou aumente a entrada pra fugir desse boleto interminável!'
    };
  }

  // 3. Faixa Alerta (Score 45 - 64)
  if (lossScore >= 45 || termMonths >= 48) {
    let specificComment = '';
    if (termMonths >= 48) {
      specificComment = ` ${termMonths} meses de financiamento é prazo tão longo que quando você pagar o último boleto, o carro já virou modelo clássico de colecionador e nem paga mais IPVA!`;
    } else if (additionalCosts.includeInFinancing && (additionalCosts.tac > 0 || additionalCosts.insurance > 0)) {
      specificComment = ` Eles embutiram TAC e seguros de R$ ${(additionalCosts.tac + additionalCosts.insurance).toLocaleString('pt-BR')} nas parcelas. Pagar juros compostos sobre tarifa de cadastro e seguro desnecessário é pura caridade bancária!`;
    }

    return {
      badge: 'alerta',
      title: '👀 LETRAS MIÚDAS: DÁ PRA ENGOLIR, MAS TEM TAXA CAMUFLADA',
      roast: `Dá pra andar, mas tem surpresa desagradável no rodapé do contrato.${specificComment} A proposta parece amigável na conversa, mas esconderam penduricalhos na conta achando que você não ia conferir os números.`,
      advice: 'Mande cortar fora o seguro prestamista e a taxa de cadastro embutida antes de dar qualquer aperto de mão. Cada penduricalho a menos alivia sua parcela todo mês.'
    };
  }

  // 4. Faixa Razoável (Score 25 - 44)
  if (lossScore >= 25) {
    let tradeInComment = '';
    if (tradeInCar.enabled && tradeInLossVsFipe > 5000) {
      tradeInComment = ` Só fica esperto que a loja desvalorizou seu usado em R$ ${Math.round(tradeInLossVsFipe).toLocaleString('pt-BR')} abaixo da FIPE. Trataram seu seminovo como se tivesse vindo de leilão!`;
    }

    return {
      badge: 'razoavel',
      title: '⚖️ PROPOSTA DENTRO DA MÉDIA: NEGÓCIO COERENTE',
      roast: `Proposta honesta, Lucas! Sem taxas abusivas escondidas debaixo do tapete e sem você precisar vender um rim pra conseguir rodar no fim de semana. O carro sai com custo dentro do padrão de mercado.${tradeInComment}`,
      advice: 'Ainda dá pra chorar um IPVA pago, película ou a primeira revisão grátis na concessionária. Na hora de fechar, quem não chora não ganha nem tapete de borracha!'
    };
  }

  // 5. Faixa Excelente (Score < 25) - TEXTO COM BENEFÍCIO MÁXIMO (MANTÉM LUCÃO!)
  return {
    badge: 'excelente',
    title: '🏆 SELO LUCÃO DE INTELIGÊNCIA FINANCEIRA',
    roast: `AÍ SIM, LUCÃO! Condição de pai pra filho com taxa de ${monthlyRate.toFixed(2)}% a.m., juros sob controle total e custo final que não vai tirar seu sono nem comprometer o churrasco do fim de semana. Negócio cirúrgico!`,
    advice: 'Assina logo antes que o gerente do banco perceba que quase não tirou margem nessa operação e resolva mudar de ideia!'
  };
}

export const FUNNY_PRESETS = [
  {
    title: 'Renegade de Shopping (Cilada do Cafezinho Gourmet)',
    carPrice: 115000,
    cashDownPayment: 15000,
    termMonths: 48,
    monthlyRate: 2.39,
    dealership: 'Concessionária Jeep Só Hoje',
    notes: 'Vendedor jurou que a parcela cabe no bolso com um sorriso no rosto. Na prática, são 4 anos pagando dois carros pra levar um e ainda desvalorizaram o Celta guerreiro na troca.',
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
    title: 'Corolla de Tiozão Sensato (Negócio de Pai pra Filho)',
    carPrice: 128000,
    cashDownPayment: 60000,
    termMonths: 24,
    monthlyRate: 0.99,
    dealership: 'Toyota Nipônica',
    notes: 'Lucas negociou firme: cortou a taxa de cadastro, recusou seguro prestamista embutido, pegou taxa subsidiada de montadora a 0,99% a.m. e garantiu a paz de espírito da família.',
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
    title: 'Civic G10 Rebaixado (Bolsa Banqueiro em 60x)',
    carPrice: 135000,
    cashDownPayment: 10000,
    termMonths: 60,
    monthlyRate: 2.75,
    dealership: 'Multimarcas do Kleber',
    notes: 'Carro com visual impecável e escape esportivo, mas com taxa pesada em 60 meses que praticamente financia as férias de verão da diretoria do banco.',
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
    title: 'A Ilusão do Showroom: Cuidado com o Cafezinho Gourmet!',
    description: 'A concessionária é linda: café expresso em xícara de louça, ar-condicionado no talo e vendedor atencioso. Mas não se iluda com o tratamento VIP. O que dita o negócio é o Custo Efetivo Total (CET), não o sabor do biscoitinho cortesia.'
  },
  {
    icon: 'Percent',
    title: 'A Armadilha dos 60 Meses: O Boleto que Nunca Termina',
    description: 'Esticar o financiamento em 60 ou 72 meses faz a parcela parecer menor na hora, mas dobra o valor pago em juros. Você passa anos pagando por um carro que desvaloriza mais rápido do que a dívida diminui.'
  },
  {
    icon: 'Car',
    title: 'A Venda Casada no Rodapé: Seguro Prestamista e Pacotes',
    description: 'Seguro prestamista, título de capitalização e assistência 24h costumam ser embutidos de fininho no contrato. Pelo Código de Defesa do Consumidor (art. 39), venda casada é proibida. Mande retirar tudo.'
  },
  {
    icon: 'Calendar',
    title: 'O Desconto de Fachada: A Desvalorização do Seu Usado',
    description: 'Se a loja der R$ 5.000 de desconto no carro novo mas pagar R$ 15.000 abaixo da FIPE no seu usado, você saiu no prejuízo de R$ 10.000! Não entregue seu seminovo de graça: calcule o saldo líquido da operação.'
  },
  {
    icon: 'FileText',
    title: 'Olho Clínico do Lucas: Tolerância Zero para TAC e Despachante',
    description: 'Tarifa de cadastro (TAC) de R$ 1.800 e despachante com preço triplicado são tarifas fáceis de cortar. Financiar esses custos gera juros sobre juros. Se a loja não isentar, faça a transferência por conta própria no Detran.'
  }
];
