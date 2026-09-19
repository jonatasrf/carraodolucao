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
      title: '🚨 YOU DIED: MOTOR LS FUNDIDO & HITKILL DE AGISTA',
      roast: `Lucão, com R$ ${Math.round(totalInterestPaid).toLocaleString('pt-BR')} SÓ DE JUROS, você tomou um hitkill fulminante nível Dark Souls! Você trabalha na engenharia da LS Tractor, calcula tolerância mecânica de trator pesado, e vai aceitar uma proposta com folga dessas? Esse juros dava pra comprar uma Gibson Les Paul Custom com um amplificador Marshall valvulado e ainda sobrava pra montar um PC Gamer com RTX 5090!`,
      advice: 'Dá respawn na bonfire e foge correndo dessa concessionária! Nem o trator 4x4 mais forte da LS consegue puxar essa carcaça de dívida. Pise no freio de mão imediatamente!'
    };
  }

  // 2. Level Perigo (Score 65 - 79)
  if (lossScore >= 65 || interestPercentageOfCar >= 50 || monthlyRate >= 2.1) {
    return {
      badge: 'perigo',
      title: '⚠️ TOMADA DE FORÇA (TDP) TRAVADA & CORDA MIZINHA ESTOURADA',
      roast: `Cuidado, Lucão! Mais de ${Math.round(interestPercentageOfCar)}% do valor do carro vai direto pro bolso do banqueiro. É o equivalente a estourar a corda mizinha no meio do solo mais rápido de guitarra ou tomar um flashbang no CS na cara dura! O vendedor jogou uma cortina de fumaça na proposta e você tá caindo na emboscada.`,
      advice: 'Essa taxa tá salgada igual água de bateria de trator. Peça para simular em outro banco ou tente aumentar a entrada para baixar esse juros abusivo.'
    };
  }

  // 3. Level Alerta (Score 45 - 64)
  if (lossScore >= 45 || termMonths >= 48) {
    let specificComment = '';
    if (termMonths >= 48) {
      specificComment = ` ${termMonths} meses de financiamento é prazo tão longo que quando você terminar de pagar a última parcela, já lançaram o GTA 7 e o The Elder Scrolls 6!`;
    } else if (additionalCosts.includeInFinancing && (additionalCosts.tac > 0 || additionalCosts.insurance > 0)) {
      specificComment = ` Eles embutiram TAC e seguros de R$ ${(additionalCosts.tac + additionalCosts.insurance).toLocaleString('pt-BR')} nas parcelas. Isso é igual comprar DLC inútil da EA em jogo de videogame!`;
    }

    return {
      badge: 'alerta',
      title: '👀 RUÍDO NO DIFERENCIAL & SOLO FORA DO COMPASSO',
      roast: `Dá pra rodar, mas tem ruído na caixa de câmbio.${specificComment} O vendedor tá achando que engenheiro da LS Tractor não sabe fazer conta de padaria.`,
      advice: 'Use seu olhar clínico de engenharia: mande retirar a TAC/Cadastro e nunca engula o seguro prestamista embutido no financiamento (venda casada disfarçada).'
    };
  }

  // 4. Level Razoável (Score 25 - 44)
  if (lossScore >= 25) {
    let tradeInComment = '';
    if (tradeInCar.enabled && tradeInLossVsFipe > 5000) {
      tradeInComment = ` Só fica esperto que a loja desvalorizou seu usado em R$ ${Math.round(tradeInLossVsFipe).toLocaleString('pt-BR')} abaixo da FIPE. Trataram seu carro como se tivesse puxado arado em terra vermelha!`;
    }

    return {
      badge: 'razoavel',
      title: '⚖️ LINHA DE PRODUÇÃO LS: APROVADO NO CONTROLE DE QUALIDADE',
      roast: `Proposta dentro da tolerância de projeto, Lucão. Não é nenhum solo lendário do Pink Floyd nem um lootbox lendário no RPG, mas o motor roda redondo sem fundir o cabeçote.${tradeInComment}`,
      advice: 'Tenta chorar um IPVA grátis ou a primeira revisão na concessionária. Um choro bem dado na negociação é igual afinar a 6ª corda em Drop D: muda o jogo!'
    };
  }

  // 5. Level Excelente (Score < 25)
  return {
    badge: 'excelente',
    title: '🏆 CLUTCH 1v5: SELO ENGENHARIA LS TRACTOR & GUITAR HERO',
    roast: `CARACA, LUCÃO! Você meteu o amplificador no talo no volume 11 e fez um clutch absurdo de 1v5! Taxa de juros de pai pra filho (${monthlyRate.toFixed(2)}% a.m.), entrada digna e custo final sob controle total. Nem o departamento de projetos da LS acharia uma falha nesse cálculo!`,
    advice: 'Fecha logo esse contrato antes que o estagiário da concessionária perceba que errou o dígito da taxa de juros e cancele a proposta!'
  };
}

export const FUNNY_PRESETS = [
  {
    title: 'Renegade de Shopping (Tentativa de Golpe no Engenheiro da LS)',
    carPrice: 115000,
    cashDownPayment: 15000,
    termMonths: 48,
    monthlyRate: 2.39,
    dealership: 'Concessionária Jeep Só Hoje',
    notes: 'Vendedor jurou que a parcela cabe no bolso. Juros de agiota do GTA e TAC embutida que pagaria o chicote elétrico de um trator LS.',
    tradeInCar: {
      enabled: true,
      carName: 'Celta 2012 Guerreiro da Fábrica',
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
    title: 'Corolla de Engenheiro Chefe da LS Tractor',
    carPrice: 128000,
    cashDownPayment: 60000,
    termMonths: 24,
    monthlyRate: 0.99,
    dealership: 'Toyota Nipônica',
    notes: 'Entrada forte, taxa subsidiada de fábrica, zero ruído de transmissão e projeto mecânico japonês inquebrável.',
    tradeInCar: {
      enabled: true,
      carName: 'HB20 2018 Conservado no Estacionamento da LS',
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
    title: 'Civic G10 Edição Guitar Hero (Financiado até o Elden Ring 3)',
    carPrice: 135000,
    cashDownPayment: 10000,
    termMonths: 60,
    monthlyRate: 2.75,
    dealership: 'Multimarcas do Kleber',
    notes: 'Carro rebaixado com escape esportivo. O juros total daria pra comprar 2 guitarras Fender americanas, 1 pedaleira Helix e um tratorzinho de cortar grama.',
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
    title: 'Cuidado com a Venda Casada (A DLC Abusiva da Concessionária)',
    description: 'Bancos e concessionárias adoram embutir "Seguro Prestamista" de R$ 1.500 a R$ 3.000 direto no contrato, igual aquelas DLCs forçadas de jogos pay-to-win. Isso é ILEGAL pelo Código de Defesa do Consumidor. Exija que tirem fora na hora!'
  },
  {
    icon: 'Percent',
    title: 'A Taxa Nominal vs CET: Engenheiro Olha a Tolerância Real!',
    description: 'O vendedor diz: "Nossa taxa é só 1,49% ao mês". Mas quando você calcula o CET incluindo IOF, TAC e tarifas, a taxa real pula pra mais de 2,2% a.m.! É igual afinar a guitarra de ouvido achando que tá afinada e passar vergonha no solo com a banda.'
  },
  {
    icon: 'Car',
    title: 'O Golpe da Avaliação do Usado (Depreciação de Trator na Lama)',
    description: 'Se a loja oferece R$ 10.000 a R$ 15.000 abaixo da Tabela FIPE no seu carro, eles tão pagando como se ele tivesse puxado arado em dia de temporal. Vale muito mais a pena anunciar particular por 95% da FIPE e colocar a grana limpa no bolso.'
  },
  {
    icon: 'Calendar',
    title: 'A Ilusão dos 60 Meses (Prazo Estilo Matusalém do RPG)',
    description: 'Financiar em 60x diminui uma merreca na parcela mensal, mas dobra o total de juros pagos para o banco! Você vai zerar 3 vezes a campanha de The Witcher e Dark Souls e ainda terá 30 parcelas de carnê pra pagar.'
  },
  {
    icon: 'FileText',
    title: 'TAC e Despachante da Loja (Tarifas Sem Sentido)',
    description: 'Concessionária adora cobrar R$ 1.800 de despachante como se estivessem reprojetando a transmissão de um trator da LS. Exija a lista detalhada de tarifas e não pague taxas de cadastro abusivas.'
  }
];
