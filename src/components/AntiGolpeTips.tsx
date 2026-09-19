import React, { useState } from 'react';
import { 
  Brain, 
  Target, 
  ShieldAlert, 
  Percent, 
  Car, 
  Calendar, 
  FileText, 
  Lightbulb, 
  ThumbsUp,
  Copy,
  Check,
  Zap
} from 'lucide-react';
import { ANTI_GOLPE_TIPS } from '../utils/humor';

type SubTab = 'psicologia' | 'perguntas' | 'financeiro';

interface PsychologyTrick {
  title: string;
  sellerQuote: string;
  hiddenTrap: string;
  counterMove: string;
  badge: string;
}

interface LethalQuestion {
  id: number;
  question: string;
  purpose: string;
  expectedReaction: string;
  category: string;
}

export const AntiGolpeTips: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('psicologia');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const iconMap: Record<string, React.ElementType> = {
    ShieldAlert,
    Percent,
    Car,
    Calendar,
    FileText,
  };

  const psychologyTricks: PsychologyTrick[] = [
    {
      title: 'A Falsa Escassez (O "Comprador Fantasma")',
      sellerQuote: '"Tem um cliente vindo de outra cidade ver esse carro às 15h... se não der o sinal agora, vai perder!"',
      hiddenTrap: 'Ativa o medo irracional de perder a oportunidade (FOMO). Na maioria esmagadora das vezes, não há ninguém vindo e o carro já está no pátio há semanas.',
      counterMove: 'Responda com calma absoluta: "Perfeito, vende pra ele então! Eu tenho outros dois parecidos agendados na loja vizinha. Se ele não fechar, me liga na segunda-feira com R$ 3.000 a menos."',
      badge: 'Gatilho de Urgência'
    },
    {
      title: 'A Ancoragem na Parcela ("Cabe no Seu Bolso?")',
      sellerQuote: '"Não esquenta a cabeça com o valor total, Lucas. Olha aqui: fica só R$ 1.990 por mês, cabe direitinho no seu orçamento!"',
      hiddenTrap: 'Desvia sua atenção do custo total de R$ 160.000 para uma parcela pequena. É assim que eles enfiam 48 ou 60 meses com juros de agiota sem você perceber que está pagando 2 carros.',
      counterMove: 'Nunca negocie pelo valor da parcela. Responda: "Não quero saber da parcela agora. Quero saber o Custo Total Financiado e a soma de tudo que vou pagar no final. Abre a tela do CET pra mim."',
      badge: 'Ilusão de Ótica'
    },
    {
      title: 'O Teatro do "Vou Conversar com Meu Gerente"',
      sellerQuote: '"Vou entrar lá na salinha e brigar com o gerente pra conseguir essa taxa especial pra você... torce por mim!"',
      hiddenTrap: 'O vendedor vai tomar café ou conversar sobre futebol na salinha. Ele volta fingindo exaustão ("o gerente quase me demitiu, mas consegui R$ 400 de desconto") para fazer você sentir que tem uma dívida moral de fechar.',
      counterMove: 'Não demonstre gratidão por desconto mixuruca. Diga: "Agradeço o esforço, mas pelo meu cálculo no app o número que fecha o negócio é X. Se o gerente não aprovar, sem problemas, a gente não faz negócio hoje."',
      badge: 'Pressão Moral'
    },
    {
      title: 'A Venda por Cansaço (Desgaste Temporal)',
      sellerQuote: '"Só mais 20 minutinhos enquanto o sistema do banco analisa a ficha... toma mais um cafezinho."',
      hiddenTrap: 'Eles seguram você na concessionária por 2 a 3 horas de propósito. Quando seu cérebro já está cansado e faminto, eles trazem o contrato cheio de taxas embutidas (TAC, seguros), torcendo para você assinar sem ler só pra ir embora.',
      counterMove: 'Imponha um limite de tempo no início: "Tenho exatamente 45 minutos antes do meu próximo compromisso. Se a proposta com todos os números não estiver pronta, você me manda por WhatsApp e eu analiso em casa."',
      badge: 'Desgaste Físico'
    },
    {
      title: 'O Desconto Falso que Sai da Sua Troca',
      sellerQuote: '"Consegui um desconto imperdível de R$ 4.000 no carro novo pra fechar hoje!"',
      hiddenTrap: 'Eles te dão R$ 4.000 de desconto no novo, mas na hora de avaliar o seu seminovo usado, pagam R$ 12.000 abaixo da tabela FIPE. No saldo final, você tomou um prejuízo de R$ 8.000.',
      counterMove: 'Separe as negociações em duas etapas: primeiro feche o menor preço possível no carro novo como se fosse pagar no PIX à vista. Só depois que o preço estiver travado no papel, pergunte quanto pagam no seu usado.',
      badge: 'Conta de Mentiroso'
    },
    {
      title: 'O Test Drive Emocional (A Posse Imaginária)',
      sellerQuote: '"Dá uma voltinha nele, Lucas! Acelera, sente o cheirinho de novo... combina demais com o seu estilo!"',
      hiddenTrap: 'Fazer você assumir a "posse psicológica" do carro. Uma vez que você se imagina dirigindo ele no dia a dia, seu cérebro para de avaliar os juros criticamente e aceita condições financeiras ruins.',
      counterMove: 'Durante o test drive, foque em achar defeitos (ruídos de suspensão, desgaste dos pneus, marcas de retoque) e mantenha cara de paisagem neutra: "É bonitinho, mas o câmbio parece um pouco lento. Vou pensar bem."',
      badge: 'Armadilha Emocional'
    }
  ];

  const lethalQuestions: LethalQuestion[] = [
    {
      id: 1,
      question: '"Qual é o CET (Custo Efetivo Total) anual desta operação na tela do banco, incluindo IOF e todas as tarifas?"',
      purpose: 'Desmascara a diferença entre a taxa de juros que o vendedor falou na boca (nominal) e a taxa real que você realmente vai pagar.',
      expectedReaction: 'Se o vendedor gaguejar, desconversar ou disser que "o sistema não mostra isso agora", ele está escondendo taxas pesadas no contrato.',
      category: 'Juros Reais'
    },
    {
      id: 2,
      question: '"Se eu retirar o seguro prestamista e a assistência 24h embutidos no financiamento, quanto cai o valor da minha parcela?"',
      purpose: 'Obriga a loja a retirar a venda casada (ilegal pelo Artigo 39 do Código de Defesa do Consumidor). Isso costuma baixar de R$ 50 a R$ 120 por parcela!',
      expectedReaction: 'Ele dirá que "o banco exige para aprovar o crédito". Responda: "Pelo CDC, venda casada é crime. Se o banco exigir, peça para colocar isso por escrito que eu levo no Procon agora."',
      category: 'Venda Casada'
    },
    {
      id: 3,
      question: '"Qual é a comissão de retorno (retorno de financiamento) que a concessionária está ganhando nessa taxa de juros?"',
      purpose: 'Pouca gente sabe, mas os bancos pagam comissões aos lojistas quanto MAIOR for a taxa de juros empurrada no cliente. Quando você pergunta isso, o vendedor percebe na hora que você é tubarão.',
      expectedReaction: 'O vendedor vai tomar um susto e perceber que não dá pra te enrolar. Geralmente eles baixam a taxa imediatamente para a margem mínima do banco.',
      category: 'Xeque-Mate'
    },
    {
      id: 4,
      question: '"Se eu fizer a vistoria cautelar em uma empresa independente que EU escolher, vocês abatem o valor ou devolvem meu sinal se houver retoque estrutural?"',
      purpose: 'Garante que o carro não tem histórico de batida grave, enchente ou leilão que o laudo da própria loja costuma "suavizar".',
      expectedReaction: 'Lojas sérias aceitam imediatamente. Lojas com carros maquiados vão tentar insistir que "o laudo da casa já tem garantia total".',
      category: 'Segurança do Bem'
    },
    {
      id: 5,
      question: '"Qual o desconto real se eu fizer o emplacamento e transferência por minha conta direto no Detran?"',
      purpose: 'Despachante de concessionária cobra de R$ 1.500 a R$ 2.200 por um serviço que você mesmo faz pelo aplicativo do Detran/Poupatempo por cerca de R$ 350 a R$ 450.',
      expectedReaction: 'Economia imediata de mais de R$ 1.000 em dinheiro vivo.',
      category: 'Custos Extras'
    },
    {
      id: 6,
      question: '"Eu tenho uma simulação aprovada no meu banco com CET menor. Você cobre a proposta agora ou prefere que eu pague a entrada no PIX e faça por lá?"',
      purpose: 'Coloca a loja contra a parede usando concorrência bancária real. O lojista fará de tudo para não perder a comissão da operação.',
      expectedReaction: 'Eles recalculam a proposta na hora com taxas de juros reduzidas.',
      category: 'Alavancagem'
    }
  ];

  const handleCopyQuestion = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24 sm:pb-12">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-black text-lg">
          <Lightbulb size={24} />
          <span>Manual de Negociação & Psicologia do Lucas</span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          Vendedor de concessionária passa por dezenas de treinamentos para fazer qualquer proposta parecer vantajosa na lábia. Aqui estão as táticas para você dominar a mesa de negociação e não deixar seu dinheiro na mão de ninguém.
        </p>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-lg overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveSubTab('psicologia')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all shrink-0 sm:shrink cursor-pointer ${
            activeSubTab === 'psicologia'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Brain size={16} className="shrink-0" />
          <span className="hidden sm:inline">Psicologia do Vendedor</span>
          <span className="sm:hidden">Psicologia</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('perguntas')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all shrink-0 sm:shrink cursor-pointer ${
            activeSubTab === 'perguntas'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Target size={16} className="shrink-0" />
          <span className="hidden sm:inline">Perguntas Letais</span>
          <span className="sm:hidden">Perguntas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('financeiro')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all shrink-0 sm:shrink cursor-pointer ${
            activeSubTab === 'financeiro'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ShieldAlert size={16} className="shrink-0" />
          <span className="hidden sm:inline">Tarifas & Golpes</span>
          <span className="sm:hidden">Tarifas</span>
        </button>
      </div>

      {/* SUB-TAB 1: PSICOLOGIA DO VENDEDOR */}
      {activeSubTab === 'psicologia' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-amber-400" />
              Os 6 Truques Psicológicos Mais Usados em Lojas e Concessionárias
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {psychologyTricks.map((trick, index) => (
              <div
                key={index}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all shadow-xl space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-white text-sm">
                      {trick.title}
                    </h3>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                      {trick.badge}
                    </span>
                  </div>

                  {/* Seller Quote Box */}
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-amber-300/90 italic">
                    {trick.sellerQuote}
                  </div>

                  {/* Hidden Trap */}
                  <div className="text-xs text-slate-400 leading-relaxed">
                    <strong className="text-slate-200">A Cilada:</strong> {trick.hiddenTrap}
                  </div>
                </div>

                {/* Counter Move */}
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider text-emerald-400">
                    <Zap size={12} /> Como o Lucas Desarma:
                  </div>
                  <p className="leading-relaxed">
                    {trick.counterMove}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Golden Negotiation Rules */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 mt-4">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Zap className="text-amber-400 w-4 h-4" />
              As 3 Regras de Ouro da Linguagem Corporal na Loja:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400 block text-xs">1. O Poder do Silêncio</span>
                <p>Quando o vendedor fizer uma proposta, fique em silêncio por 5 segundos olhando a folha. O silêncio gera desconforto e o vendedor geralmente melhora a oferta sozinho!</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400 block text-xs">2. O Chute no Balde Calculado</span>
                <p>Se a negociação travar, guarde o celular no bolso, levante da cadeira e diga que vai almoçar. 80% das melhores taxas surgem quando a mão do cliente toca a maçaneta da porta.</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400 block text-xs">3. Sem Emoção Aparente</span>
                <p>Nunca diga "eu amei esse carro" ou "é o carro dos meus sonhos". Demonstre que você vê o veículo apenas como um meio de transporte e que qualquer outro concorrente serve.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PERGUNTAS LETAIS PRO VENDEDOR */}
      {activeSubTab === 'perguntas' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-rose-500" />
              Scripts Prontos: Copie ou Leia na Frente do Vendedor
            </span>
          </div>

          <div className="space-y-3">
            {lethalQuestions.map((q) => (
              <div
                key={q.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/40 transition-all shadow-xl space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 font-black text-xs flex items-center justify-center border border-rose-500/30 shrink-0">
                      {q.id}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 truncate">
                      Foco: {q.category}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyQuestion(q.id, q.question)}
                    className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 active:scale-95 transition-all w-fit cursor-pointer shrink-0"
                  >
                    {copiedId === q.id ? (
                      <>
                        <Check size={14} className="text-emerald-400" />
                        <span className="text-emerald-400">Pergunta Copiada!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copiar Pergunta</span>
                      </>
                    )}
                  </button>
                </div>

                {/* The Big Question Text */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 font-bold text-white text-sm sm:text-base leading-relaxed text-amber-200">
                  {q.question}
                </div>

                {/* Breakdown details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      🎯 O Objetivo da Pergunta:
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {q.purpose}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      👀 O que Esperar da Reação:
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {q.expectedReaction}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: TARIFAS & GOLPES TRADICIONAIS */}
      {activeSubTab === 'financeiro' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Golpes Clássicos de Contrato para Cortar Antes de Assinar
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ANTI_GOLPE_TIPS.map((tip, index) => {
              const IconComponent = iconMap[tip.icon] || ShieldAlert;
              return (
                <div
                  key={index}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-colors shadow-lg space-y-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                      <IconComponent size={20} />
                    </div>
                    <h3 className="font-bold text-white text-sm">
                      {tip.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Checklist */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 mt-4">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <ThumbsUp className="text-emerald-400 w-4 h-4" />
              Checklist Rápido antes de Assinar Qualquer Contrato:
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Pedir o <strong>Custo Efetivo Total (CET)</strong> discriminado por escrito (taxa mensal e anual).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Verificar se embutiram tarifas opcionais como seguro prestamista ou assistência 24h.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Conferir se o juros acumulado não ultrapassa limites razoáveis do mercado.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Colocar a proposta aqui no <strong>Carrão do Lucão</strong> para ver o veredicto antes de dar qualquer aperto de mão!</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
