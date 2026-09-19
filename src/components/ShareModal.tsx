import React, { useRef, useState } from 'react';
import { X, Download, Upload, Trash2, AlertCircle } from 'lucide-react';
import type { Scenario } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenarios: Scenario[];
  onImportScenarios: (imported: Scenario[]) => void;
  onClearAllScenarios: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  scenarios,
  onImportScenarios,
  onClearAllScenarios,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scenarios, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `carrao-do-lucao-cenarios-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          onImportScenarios(json);
          setImportStatus('Cenários importados com sucesso!');
          setTimeout(() => {
            setImportStatus(null);
            onClose();
          }, 1500);
        } else {
          setImportStatus('Arquivo JSON inválido. Deve ser uma lista de cenários.');
        }
      } catch {
        setImportStatus('Erro ao ler arquivo. Verifique o formato.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-base sm:text-lg font-black text-white">
            Backup & Compartilhamento
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Você tem <strong>{scenarios.length}</strong> cenários salvos no navegador. Faça backup para não perder ou importe propostas salvas de outro celular.
        </p>

        {importStatus && (
          <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/40 text-xs text-amber-300 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{importStatus}</span>
          </div>
        )}

        <div className="space-y-2.5 pt-1">
          {/* Export button */}
          <button
            type="button"
            disabled={scenarios.length === 0}
            onClick={handleExportJSON}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-100 font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
          >
            <Download size={16} className="text-amber-400" />
            <span>Exportar Cenários (.JSON)</span>
          </button>

          {/* Import file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
          >
            <Upload size={16} className="text-blue-400" />
            <span>Importar Arquivo (.JSON)</span>
          </button>

          {/* Clear all */}
          {scenarios.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Tem certeza que deseja apagar todos os cenários salvos do Lucas?')) {
                  onClearAllScenarios();
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 font-semibold text-xs border border-red-800/40 transition-colors cursor-pointer mt-4"
            >
              <Trash2 size={15} />
              <span>Limpar Todos os Cenários</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
