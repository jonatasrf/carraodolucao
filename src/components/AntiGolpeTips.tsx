import React from 'react';
import { 
  ShieldAlert, 
  Percent, 
  Car, 
  Calendar, 
  FileText, 
  Lightbulb, 
  ThumbsUp 
} from 'lucide-react';
import { ANTI_GOLPE_TIPS } from '../utils/humor';

export const AntiGolpeTips: React.FC = () => {
  const iconMap: Record<string, React.ElementType> = {
    ShieldAlert,
    Percent,
    Car,
    Calendar,
    FileText,
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24 sm:pb-12">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-800/40 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-black text-lg">
          <Lightbulb size={24} />
          <span>Manual de Sobrevivência do Lucão na Concessionária</span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          Vendedor de carro é treinado para fazer qualquer conta parecer vantajosa na lábia. Aqui estão as 5 regras de ouro para você não deixar seu dinheiro suado na mão de banqueiro e lojista malandro.
        </p>
      </div>

      {/* Tips Cards */}
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

      {/* Bonus checklist */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
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
            <span>Verificar na proposta se adicionaram tarifas opcionais como seguro de perda e roubo, assistência 24h ou seguro prestamista.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Conferir se a taxa de abertura de crédito (TAC) ou taxa de cadastro não ultrapassa valores razoáveis do mercado.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Colocar a proposta aqui no <strong>Carrão do Lucão</strong> para ver se o simulador dá sinal verde ou alerta de agiota!</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
