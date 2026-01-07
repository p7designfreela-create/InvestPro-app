
import React, { useState } from 'react';
import { MOCK_ASSETS } from '../constants';
import { Theme } from '../App';
import { RefreshCw, Search, TrendingUp, TrendingDown, LayoutGrid, List } from 'lucide-react';

interface MarketProps {
  theme: Theme;
}

const Market: React.FC<MarketProps> = ({ theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const cardStyle = {
    light: 'bg-white border-slate-100 text-slate-800 shadow-sm',
    dark: 'bg-slate-900 border-slate-800 text-slate-100 shadow-xl',
    neon: 'bg-black border-cyan-500/30 text-cyan-400 glass-effect neon-border'
  }[theme];

  const filteredAssets = MOCK_ASSETS.filter(a => 
    a.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.segment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className={`${cardStyle} p-8 rounded-3xl border`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight mb-1">Terminal de Cotações</h2>
            <p className="text-sm opacity-60">Dados integrados em tempo real via Google Market Stream.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${theme === 'neon' ? 'text-cyan-500' : 'text-slate-400'}`} size={18} />
              <input 
                type="text" 
                placeholder="Ticker, setor ou nome..."
                className={`pl-10 pr-4 py-3 border transition-all rounded-2xl text-sm w-full md:w-72
                  ${theme === 'neon' 
                    ? 'bg-slate-950 border-cyan-500/20 text-cyan-300 focus:border-cyan-400' 
                    : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus:border-indigo-500'}`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button className={`p-3 rounded-2xl border transition-all active:rotate-180
              ${theme === 'neon' ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}>
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className={`${cardStyle} rounded-3xl border overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={`uppercase text-[10px] font-black tracking-widest ${theme === 'neon' ? 'text-cyan-500/50' : 'bg-slate-50/50 text-slate-400'}`}>
              <tr>
                <th className="px-8 py-6">Instrumento</th>
                <th className="px-6 py-6">Segmento</th>
                <th className="px-6 py-6 text-right">Último Preço</th>
                <th className="px-6 py-6 text-center">Var. Diária (%)</th>
                <th className="px-6 py-6 text-center">Var. Moeda (R$)</th>
                <th className="px-8 py-6 text-right">Vol (24h)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {filteredAssets.map(asset => (
                <tr key={asset.ticker} className={`transition-all ${theme === 'neon' ? 'hover:bg-cyan-500/5' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-xs font-black transition-all group-hover:scale-110
                        ${theme === 'neon' ? 'bg-slate-900 border-cyan-500/30 text-cyan-400 neon-glow' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'}`}>
                        {asset.ticker.substring(0,2)}
                      </div>
                      <div>
                        <p className="font-black text-base">{asset.ticker}</p>
                        <span className={`block text-[10px] font-bold uppercase opacity-40`}>B3:SÃO PAULO</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 opacity-60 font-medium">{asset.segment}</td>
                  <td className="px-6 py-5 text-right font-mono-tech font-black text-lg">R$ {asset.price.toFixed(2)}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-black
                      ${asset.change >= 0 
                        ? (theme === 'neon' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30') 
                        : (theme === 'neon' ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/30')}`}>
                      {asset.change >= 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                      {asset.change > 0 ? '+' : ''}{asset.change}%
                    </span>
                  </td>
                  <td className={`px-6 py-5 text-center font-bold font-mono-tech ${asset.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    R$ {(asset.price * (asset.change / 100)).toFixed(2)}
                  </td>
                  <td className="px-8 py-5 text-right opacity-40 font-mono-tech tracking-tight">R$ {(Math.random() * 10).toFixed(1)}M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Market;
