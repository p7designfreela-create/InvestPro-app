
import React, { useState } from 'react';
import { AssetSummary } from '../types';
import { getTaxAdvice } from '../services/gemini';
import { Copy, FileText, CheckCircle2, Loader2, Info } from 'lucide-react';

interface TaxReportProps {
  summary: AssetSummary[];
}

const TaxReport: React.FC<TaxReportProps> = ({ summary }) => {
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    const result = await getTaxAdvice(summary);
    setReport(result);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Relatório IRPF 2024</h2>
        <p className="opacity-80 text-sm mb-6 max-w-lg">
          Geramos automaticamente o texto para você copiar e colar na seção de "Bens e Direitos" e "Rendimentos Isentos" do programa da Receita Federal.
        </p>
        <button 
          onClick={generateReport}
          disabled={loading || summary.length === 0}
          className="px-6 py-3 bg-white text-blue-700 font-bold rounded-xl shadow-lg hover:bg-blue-50 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
          {loading ? 'Processando dados...' : 'Gerar Relatório Inteligente'}
        </button>
      </div>

      {report ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Texto Formatado (Copia e Cola)</span>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 text-xs font-bold px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all"
            >
              {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
              {copied ? 'Copiado!' : 'Copiar Tudo'}
            </button>
          </div>
          <div className="p-8">
            <pre className="text-sm font-mono text-slate-700 whitespace-pre-wrap leading-relaxed">
              {report}
            </pre>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-300">
            <FileText size={32} />
          </div>
          <h3 className="font-bold text-slate-400">Pronto para declarar?</h3>
          <p className="text-sm text-slate-400 mt-2">Clique no botão acima para consolidar seus ativos.</p>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 text-amber-800 text-sm">
        <Info className="flex-shrink-0 mt-0.5" size={18} />
        <p>
          <strong>Lembre-se:</strong> Os dados gerados são baseados nos lançamentos feitos no app. Sempre confira os valores finais com os informes de rendimentos oficiais das suas corretoras.
        </p>
      </div>
    </div>
  );
};

export default TaxReport;
