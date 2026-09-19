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
      title: '🚨 5 ESTRELAS NO GTA: YOU DIED & TRABALHO NOS CORREIOS DO DEATH STRANDING',
      roast: `LUCÃO, ISSO É ASSALTO COM 5 ESTRELAS DE POLÍCIA NO GTA! Com R$ ${Math.round(totalInterestPaid).toLocaleString('pt-BR')} SÓ DE JUROS, você tomou uma lâmina oculta nas costas do Assassin's Creed! Com essa dívida você vai ter que pedir emprego nos Correios igual no Death Stranding, onde o cara só anda levando caixa e encomenda nas costas o dia inteiro pra conseguir pagar o boleto! Nem a potência hidráulica de um trator da LS Tractor puxa esse carnê!`,
      advice: 'Dá respawn na bonfire e foge! O vendedor te deu uma facada furtiva do Assassin\'s Creed. Não assine isso nem sob hipnose!'
    };
  }

  // 2. Level Perigo (Score 65 - 79)
  if (lossScore >= 65 || interestPercentageOfCar >= 50 || monthlyRate >= 2.1) {
    return {
      badge: 'perigo',
      title: '⚠️ TIRO DE PURPURINA DO FORTNITE & CARTEIRO DO DEATH STRANDING',
      roast: `Cuidado, Lucão! Essa proposta da concessionária é igualzinha arma de Fortnite: cheia de gracinha, soltando tiro de purpurina e confete na sua cara, mas na verdade mais de ${Math.round(interestPercentageOfCar)}% do valor do carro é juros puro pro banqueiro! Se assinar isso, você vai virar CLT dos Correios no Death Stranding, passando os próximos anos andando a pé com 200kg de pacote nas costas pra pagar o banco.`,
      advice: 'O vendedor tá achando que engenheiro da LS Tractor cai em tiro de purpurina. Exija cortar essa taxa ou aumente a entrada pra escapar desse grind eterno!'
    };
  }

  // 3. Level Alerta (Score 45 - 64)
  if (lossScore >= 45 || termMonths >= 48) {
    let specificComment = '';
    if (termMonths >= 48) {
      specificComment = ` ${termMonths} meses de financiamento é prazo tão longo que quando você terminar de pagar a última parcela, já lançaram o GTA 7 e o Death Stranding 3!`;
    } else if (additionalCosts.includeInFinancing && (additionalCosts.tac > 0 || additionalCosts.insurance > 0)) {
      specificComment = ` Eles embutiram TAC e seguros de R$ ${(additionalCosts.tac + additionalCosts.insurance).toLocaleString('pt-BR')} nas parcelas. Isso é igual comprar skin inútil com tiro de purpurina no Fortnite!`;
    }

    return {
      badge: 'alerta',
      title: '👀 LÂMINA OCULTA DO ASSASSIN\'S CREED & PURPURINA DO FORTNITE',
      roast: `Dá pra rodar, mas tem golpe camuflado no contrato.${specificComment} O vendedor veio com aquela conversa mole cheia de tiro de purpurina do Fortnite, mas escondeu taxas no modo stealth do Assassin's Creed como se engenheiro da LS não soubesse ler planilha.`,
      advice: 'Use sua visão de águia de engenheiro: mande cortar fora o seguro prestamista e a TAC antes de dar esse salto de fé no escuro.'
    };
  }

  // 4. Level Razoável (Score 25 - 44)
  if (lossScore >= 25) {
    let tradeInComment = '';
    if (tradeInCar.enabled && tradeInLossVsFipe > 5000) {
      tradeInComment = ` Só fica esperto que a loja desvalorizou seu usado em R$ ${Math.round(tradeInLossVsFipe).toLocaleString('pt-BR')} abaixo da FIPE. Trataram seu carro como se tivesse puxado arado em terra vermelha na fábrica da LS!`;
    }

    return {
      badge: 'razoavel',
      title: '⚖️ MISSÃO DO GTA CONCLUÍDA & SEM CARGA DO DEATH STRANDING',
      roast: `Proposta dentro da tolerância mecânica, Lucão! Sem perseguição policial de Los Santos no GTA e sem você precisar virar entregador dos Correios no Death Stranding carregando peso a pé. O trator da LS roda suave e o carro sai afinado!${tradeInComment}`,
      advice: 'Tenta chorar um IPVA de brinde ou revisão grátis. Um choro bem dado na concessionária é igual acertar o timing do solo de guitarra: muda o jogo!'
    };
  }

  // 5. Level Excelente (Score < 25)
  return {
    badge: 'excelente',
    title: '🏆 CLUTCH 1v5 NO GTA & SALTO DE FÉ DO ASSASSIN\'S CREED',
    roast: `AÍ SIM, LUCÃO! Você deu um tiro certeiro sem purpurina de Fortnite e cravou um salto de fé perfeito do Assassin's Creed direto no melhor negócio! Taxa de juros de pai pra filho (${monthlyRate.toFixed(2)}% a.m.), zero peso de Death Stranding nas costas e engenharia da LS Tractor 100% aprovada no controle de qualidade!`,
    advice: 'Fecha logo antes que o gerente do banco perceba que tomou um golpe de mestre do GTA e cancele essa proposta dos deuses!'
  };
}

export const FUNNY_PRESETS = [
  {
    title: 'Renegade de Shopping (Golpe 5 Estrelas no GTA)',
    carPrice: 115000,
    cashDownPayment: 15000,
    termMonths: 48,
    monthlyRate: 2.39,
    dealership: 'Concessionária Jeep Só Hoje',
    notes: 'Vendedor jurou que a parcela cabe no bolso com tiro de purpurina do Fortnite. Na prática, você vai ter que trabalhar nos Correios igual no Death Stranding levando 300kg de caixa a pé pra conseguir pagar.',
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
    title: 'Corolla do Assassino Furtivo (Salto de Fé da LS Tractor)',
    carPrice: 128000,
    cashDownPayment: 60000,
    termMonths: 24,
    monthlyRate: 0.99,
    dealership: 'Toyota Nipônica',
    notes: 'Lucas usou a visão de águia do Assassin\'s Creed, desarmou as lâminas ocultas das taxas e pegou taxa subsidiada sem precisar fazer hora extra nos Correios do Death Stranding.',
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
    title: 'Civic G10 Tiro de Purpurina (Customizado na Los Santos do GTA)',
    carPrice: 135000,
    cashDownPayment: 10000,
    termMonths: 60,
    monthlyRate: 2.75,
    dealership: 'Multimarcas do Kleber',
    notes: 'Carro rebaixado com escape esportivo. Financiamento tão pesado que até o Sam Bridges do Death Stranding pediria demissão dos Correios antes de carregar essa dívida.',
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
    title: 'A Armadilha do Fortnite: Cuidado com o Tiro de Purpurina!',
    description: 'A propaganda da concessionária é linda: café expresso, ar-condicionado, showroom iluminado e parcela que parece tiro de purpurina colorido do Fortnite. Mas quando você olha o contrato, o tiro no seu saldo bancário é de bazuca do GTA! Calcule sempre o Custo Total.'
  },
  {
    icon: 'Percent',
    title: 'O Efeito Death Stranding: Você Não Quer Trabalhar nos Correios!',
    description: 'Financiar carro em 60x com juros abusivos é igual jogar Death Stranding: você vira aquele personagem que só anda a pé levando pacote nas costas pros Correios o dia inteiro, só que o pacote é a dívida do banco que nunca diminui.'
  },
  {
    icon: 'Car',
    title: 'A Lâmina Oculta do Assassin\'s Creed no Rodapé do Contrato',
    description: 'Seguro prestamista e tarifas opcionais são a lâmina oculta do vendedor: enquanto ele elogia seu gosto automotivo ou pergunta do seu trator na LS, ele te esfaqueia pelas costas com R$ 3.000 em taxas disfarçadas. Exija retirar tudo!'
  },
  {
    icon: 'Calendar',
    title: 'Missão 5 Estrelas no GTA: Cuidado com a Avaliação do Usado',
    description: 'Se a concessionária quer pagar R$ 15.000 abaixo da FIPE no seu carro atual, é assalto com perseguição policial de Los Santos no GTA em plena luz do dia! Venda particular e não entregue seu seminovo de graça.'
  },
  {
    icon: 'FileText',
    title: 'Engenharia LS Tractor: Tolerância Zero para TAC e Despachante',
    description: 'Na engenharia da LS Tractor, projeto com folga errada é reprovado na hora. Faça o mesmo no banco: não engula taxa de cadastro de R$ 1.800 como se estivessem reprogramando a injeção eletrônica do trator.'
  }
];
