import React from 'react';
import { ShieldAlert, AlertTriangle, AlertCircle, Scale, Award } from 'lucide-react';
import type { CalculationResult } from '../types';

interface Props {
  badge: CalculationResult['verdictBadge'];
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const VerdictBadge: React.FC<Props> = ({ badge, size = 'md', showLabel = true }) => {
  const configs = {
    excelente: {
      label: 'Selo Lucão de Aprovação',
      sub: 'Negócio Excelente / Aprovado',
      color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      icon: Award,
    },
    razoavel: {
      label: 'Compra Racional',
      sub: 'Dentro da Média / Coerente',
      color: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      icon: Scale,
    },
    alerta: {
      label: 'Atenção às Taxas',
      sub: 'Custos Ocultos no Contrato',
      color: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      icon: AlertCircle,
    },
    perigo: {
      label: 'Boleto Interminável',
      sub: 'Juros Altos / Parcela Pesada',
      color: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
      icon: AlertTriangle,
    },
    agiota: {
      label: 'Cilada Financeira',
      sub: 'Juros Abusivos / Fuja!',
      color: 'bg-red-500/15 text-red-400 border-red-500/30 animate-pulse',
      icon: ShieldAlert,
    },
  };

  const config = configs[badge] || configs.razoavel;
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
    lg: 'text-base px-4 py-2 gap-2.5',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  return (
    <div 
      className={`inline-flex items-center font-semibold rounded-full border shadow-sm transition-all whitespace-nowrap shrink-0 ${config.color} ${sizeClasses[size]}`}
    >
      <IconComponent size={iconSizes[size]} className="shrink-0" />
      {showLabel && (
        <span className="tracking-wide whitespace-nowrap">
          {config.label}
        </span>
      )}
    </div>
  );
};
