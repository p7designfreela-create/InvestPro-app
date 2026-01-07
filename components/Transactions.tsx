
import React, { useState, useRef, useEffect } from 'react';
import { Transaction, AssetType, TransactionType } from '../types';
import { BROKERS, ALL_MARKET_ASSETS, MarketAsset } from '../constants';
import { Theme } from '../App';
import { PlusCircle, Trash2, Calendar, Target, Hash, Percent, Briefcase, Search } from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
  onAdd: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  theme: Theme;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, onAdd, onDelete, theme }) => {
  const [formData, setFormData] = useState({
    ticker: '',
    type: TransactionType.BUY,
    assetType: AssetType.ACAO,
    quantity: '',
    price: '',
    fees: '',
    broker: BROKERS[0],
    date: new Date().toISOString().split('T')[0]
  });

  const [suggestions, setSuggestions] = useState<MarketAsset[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cardStyle = {
    light: 'bg-white border-slate-100 text-slate-900 shadow-sm',
    dark: 'bg-[#0F172A] border-slate-800 text-slate-50 shadow-xl',
    neon: 'bg-black border-cyan-500/30 text-cyan-400 glass-effect neon-border'
  }[theme];

  const inputStyle = `w-full px-4 py-3 border transition-all focus:outline-none rounded-xl text-sm font-medium
    ${theme === 'light' 
      ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10' 
      : theme === 'dark'
        ? 'bg-slate-900 border-slate-700 text-slate-100 focus:border-indigo-400'
        : 'bg-slate-950 border-cyan-500/20 text-cyan-300 focus:border-cyan-400 focus:neon-glow'}`;

  const handleTickerChange = (value: string) => {
    const upperValue = value.toUpperCase();
    const exactMatch = ALL_MARKET_ASSETS.find(a => a.ticker === upperValue);
    
    setFormData(prev => ({ 
      ...prev, 
      ticker: upperValue,
      assetType: exactMatch ? exactMatch.type : prev.assetType
    }));

    if (upperValue.length > 0) {
      const filtered = ALL_MARKET_ASSETS.filter(asset => 
        asset.ticker.includes(upperValue) || 
        asset.name.toUpperCase().includes(upperValue) ||
        asset.segment.toUpperCase().includes(upperValue)
      ).slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectAsset = (asset: MarketAsset) => {
    setFormData(prev => ({ ...prev, ticker: asset.ticker, assetType: asset.type }));
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ticker || !formData.quantity || !formData.price) return;
    onAdd({
      id: crypto.randomUUID(),
      ticker: formData.ticker.toUpperCase(),
      type: formData.type,
      assetType: formData.assetType,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      fees: Number(formData.fees || 0),
      broker: formData.broker,
      date: formData.date
    });
    setFormData({ ...formData, ticker: '', quantity: '', price: '', fees: '' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className={`${cardStyle} p-8 rounded-3xl border h-fit relative`}>
        <div className="flex items-center gap-3 mb-8">
          <div className={`p-2 rounded-lg ${theme === 'neon' ? 'bg-cyan-500 text-black' : 'bg-indigo-600 text-white'}`}>
            <PlusCircle size={20} />
          </div>
          <h3 className="text-lg font-black tracking-tight">Novo Lançamento</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5 relative">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 flex items-center gap-2">Ticker do Ativo</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ex: PETR4"
                autoComplete="off"
                className={inputStyle}
                value={formData.ticker}
                onChange={e => handleTickerChange(e.target.value)}
                onFocus={() => formData.ticker && setShowSuggestions(true)}
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div 
                ref={suggestionRef}
                className={`absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2
                ${theme === 'light' ? 'bg-white border-slate-200' : theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-black border-cyan-500/40 glass-effect'}`}
              >
                {suggestions.map((asset) => (
                  <button
                    key={asset.ticker}
                    type="button"
                    onClick={() => selectAsset(asset)}
                    className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors border-b last:border-0 border-inherit/10
                    ${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700'}`}
                  >
                    <div>
                      <span className="font-black text-sm">{asset.ticker}</span>
                      <span className="block text-[10px] opacity-60 truncate max-w-[150px]">{asset.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-inherit`}>
                      {asset.segment}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Tipo</label>
              <select className={inputStyle} value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as TransactionType })}>
                <option value={TransactionType.BUY}>Compra</option>
                <option value={TransactionType.SELL}>Venda</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-50 flex items-center gap-2"><Calendar size={12}/> Data</label>
              <input type="date" className={inputStyle} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Categoria</label>
            <select className={inputStyle} value={formData.assetType} onChange={e => setFormData({ ...formData, assetType: e.target.value as AssetType })}>
              {Object.values(AssetType).map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-50 flex items-center gap-2"><Hash size={12}/> Qtd.</label>
              <input type="number" className={inputStyle} value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Preço Un.</label>
              <input type="number" step="0.01" className={inputStyle} value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-50 flex items-center gap-2"><Percent size={12}/> Taxas</label>
              <input type="number" step="0.01" className={inputStyle} value={formData.fees} onChange={e => setFormData({ ...formData, fees: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-50 flex items-center gap-2"><Briefcase size={12}/> Corretora</label>
              <select className={inputStyle} value={formData.broker} onChange={e => setFormData({ ...formData, broker: e.target.value })}>
                {BROKERS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <button 
            type="submit"
            className={`w-full py-4 mt-4 font-black rounded-2xl transition-all active:scale-95 shadow-lg flex items-center justify-center gap-3
              ${theme === 'neon' ? 'bg-cyan-500 text-black hover:bg-cyan-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20'}`}
          >
            CONFIRMAR TRANSAÇÃO
          </button>
        </form>
      </div>

      <div className={`${cardStyle} lg:col-span-2 rounded-3xl border overflow-hidden h-fit flex flex-col`}>
        <div className="p-6 border-b border-inherit flex justify-between items-center">
          <h3 className="font-black tracking-tight">Registro de Atividade</h3>
          <span className={`text-[10px] font-mono-tech px-2 py-1 rounded border border-inherit opacity-60`}>TOTAL: {transactions.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={`uppercase text-[10px] tracking-widest font-bold opacity-50 bg-slate-500/5`}>
              <tr>
                <th className="px-6 py-5">Data</th>
                <th className="px-6 py-5">Ativo</th>
                <th className="px-6 py-5 text-center">Operação</th>
                <th className="px-6 py-5 text-center">Qtd</th>
                <th className="px-6 py-5 text-center">Preço</th>
                <th className="px-6 py-5 text-right">Opções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center opacity-40 italic">Nenhuma transação registrada.</td>
                </tr>
              ) : (
                transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(tx => (
                  <tr key={tx.id} className={`transition-colors ${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-800/50'}`}>
                    <td className="px-6 py-4 font-mono-tech opacity-60">{new Date(tx.date).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4 font-black text-base">{tx.ticker}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border
                        ${tx.type === TransactionType.BUY 
                          ? 'bg-blue-500/10 border-blue-500/30 text-blue-500' 
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-500'}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold">{tx.quantity}</td>
                    <td className="px-6 py-4 text-center font-mono-tech">R$ {tx.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => onDelete(tx.id)} className="p-2 transition-all hover:scale-110 opacity-30 hover:opacity-100 hover:text-rose-500">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
