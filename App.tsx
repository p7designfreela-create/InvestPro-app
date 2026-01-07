
import React, { useState, useMemo, useEffect, Suspense, lazy } from 'react';
import { 
  FileSpreadsheet, 
  FileText,
  RefreshCw,
  TrendingUp,
  Newspaper,
  Sun,
  Moon,
  Zap,
  X,
  PieChart,
  Loader2
} from 'lucide-react';
import { Transaction, AssetSummary, TransactionType, DividendProjection } from './types';
import Dashboard from './components/Dashboard';
import { getDividendCalendar, getLiveMarketData, LiveMarketData } from './services/gemini';

// Lazy loading components to optimize bundle size and solve Vercel/Vite chunk warnings
const Transactions = lazy(() => import('./components/Transactions'));
const Market = lazy(() => import('./components/Market'));
const TaxReport = lazy(() => import('./components/TaxReport'));
const News = lazy(() => import('./components/News'));
const Graphs = lazy(() => import('./components/Graphs'));

export type Theme = 'light' | 'dark' | 'neon';
type Tab = 'market' | 'graphs' | 'news' | 'transactions' | 'tax';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('market');
  const [theme, setTheme] = useState<Theme>('light');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [projections, setProjections] = useState<DividendProjection[]>([]);
  const [marketPrices, setMarketPrices] = useState<Record<string, LiveMarketData>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('--:--');

  useEffect(() => {
    const saved = localStorage.getItem('investpro-theme') as Theme;
    if (saved) setTheme(saved);
    const savedTx = localStorage.getItem('investpro-tx');
    if (savedTx) setTransactions(JSON.parse(savedTx));
  }, []);

  useEffect(() => {
    localStorage.setItem('investpro-theme', theme);
    localStorage.setItem('investpro-tx', JSON.stringify(transactions));
  }, [theme, transactions]);

  const handleRefreshAll = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    const tickers: string[] = Array.from(new Set(transactions.map(t => t.ticker)));
    try {
      const [livePrices, divData] = await Promise.all([
        getLiveMarketData(tickers),
        getDividendCalendar(tickers)
      ]);
      const priceMap: Record<string, LiveMarketData> = {};
      livePrices.forEach(p => priceMap[p.ticker] = p);
      setMarketPrices(priceMap);
      setProjections(divData);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const themeClasses = {
    light: {
      bg: 'bg-[#F8FAFC]',
      card: 'bg-white border-slate-100',
      text: 'text-slate-900',
      textMuted: 'text-slate-500',
      header: 'bg-white border-b border-slate-100',
      navBg: 'bg-slate-100/80',
      navActive: 'bg-white text-indigo-700 shadow-sm border border-slate-200/50',
      navIdle: 'text-slate-500 hover:text-slate-800'
    },
    dark: {
      bg: 'bg-[#020617]',
      card: 'bg-[#0F172A] border-slate-800',
      text: 'text-slate-50',
      textMuted: 'text-slate-400',
      header: 'bg-[#0F172A] border-b border-slate-800',
      navBg: 'bg-slate-800/50',
      navActive: 'bg-indigo-600 text-white shadow-lg border border-indigo-500',
      navIdle: 'text-slate-400 hover:text-slate-200'
    },
    neon: {
      bg: 'bg-black',
      card: 'bg-black border-cyan-500/30 glass-effect',
      text: 'text-cyan-400',
      textMuted: 'text-cyan-900',
      header: 'bg-black border-b border-cyan-500/20',
      navBg: 'bg-cyan-500/5',
      navActive: 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]',
      navIdle: 'text-cyan-800 hover:text-cyan-400'
    }
  }[theme];

  const summary = useMemo(() => {
    const map = new Map<string, AssetSummary>();
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    sorted.forEach(tx => {
      const existing = map.get(tx.ticker);
      if (!existing) {
        if (tx.type === TransactionType.BUY) {
          map.set(tx.ticker, {
            ticker: tx.ticker,
            assetType: tx.assetType,
            totalQuantity: tx.quantity,
            averagePrice: (tx.price * tx.quantity + tx.fees) / tx.quantity,
            totalInvested: tx.price * tx.quantity + tx.fees
          });
        }
      } else {
        if (tx.type === TransactionType.BUY) {
          const newQty = existing.totalQuantity + tx.quantity;
          const newTotal = existing.totalInvested + (tx.price * tx.quantity + tx.fees);
          map.set(tx.ticker, {
            ...existing,
            totalQuantity: newQty,
            totalInvested: newTotal,
            averagePrice: newTotal / newQty
          });
        } else {
          const newQty = existing.totalQuantity - tx.quantity;
          const newTotal = existing.totalInvested - (existing.averagePrice * tx.quantity);
          map.set(tx.ticker, {
            ...existing,
            totalQuantity: Math.max(0, newQty),
            totalInvested: Math.max(0, newTotal)
          });
        }
      }
    });
    return Array.from(map.values())
      .filter(a => a.totalQuantity > 0)
      .map(a => ({
        ...a,
        currentPrice: marketPrices[a.ticker]?.price || a.averagePrice,
        variation: marketPrices[a.ticker]?.changePercent || 0
      }));
  }, [transactions, marketPrices]);

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-300 ${themeClasses.bg} ${themeClasses.text}`}>
      <header className={`px-4 lg:px-12 py-4 flex items-center justify-between sticky top-0 z-50 ${themeClasses.header} glass-effect`}>
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/20">
             <TrendingUp className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight">
              <span className={theme === 'light' ? 'text-slate-900' : 'text-white'}>Invest</span><span className="text-indigo-500">Pro</span>
            </h1>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${themeClasses.textMuted}`}>Terminal Premium</p>
          </div>
        </div>

        <nav className={`hidden lg:flex items-center p-1 rounded-2xl ${themeClasses.navBg}`}>
          <TabButton active={activeTab === 'market'} onClick={() => setActiveTab('market')} icon={<FileSpreadsheet size={16}/>} label="Dashboard" themeClasses={themeClasses} />
          <TabButton active={activeTab === 'graphs'} onClick={() => setActiveTab('graphs')} icon={<PieChart size={16}/>} label="Análise" themeClasses={themeClasses} />
          <TabButton active={activeTab === 'news'} onClick={() => setActiveTab('news')} icon={<Newspaper size={16}/>} label="Terminal" themeClasses={themeClasses} />
          <TabButton active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} icon={<X size={16} className="rotate-45" />} label="Lançar" themeClasses={themeClasses} />
          <TabButton active={activeTab === 'tax'} onClick={() => setActiveTab('tax')} icon={<FileText size={16}/>} label="IRPF" themeClasses={themeClasses} />
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border
            ${theme === 'light' ? 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100' : 'bg-slate-800 text-slate-100 border-slate-700'}`}>
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{isRefreshing ? 'Sincronizando' : 'Atualizar'}</span>
          </button>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
             <button onClick={() => setTheme('light')} className={`p-1.5 rounded-lg transition-all ${theme === 'light' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><Sun size={16}/></button>
             <button onClick={() => setTheme('dark')} className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'bg-slate-700 text-blue-400' : 'text-slate-400'}`}><Moon size={16}/></button>
             <button onClick={() => setTheme('neon')} className={`p-1.5 rounded-lg transition-all ${theme === 'neon' ? 'bg-cyan-500 text-black' : 'text-slate-400'}`}><Zap size={16}/></button>
          </div>
        </div>
      </header>

      <main className={`flex-1 p-4 lg:p-12 max-w-[1600px] mx-auto w-full`}>
        <Suspense fallback={
          <div className="h-96 flex flex-col items-center justify-center gap-4 opacity-30">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
            <p className="text-[10px] font-black uppercase tracking-widest">Carregando Módulo...</p>
          </div>
        }>
          {activeTab === 'market' && <Dashboard summary={summary} theme={theme} projections={projections} lastUpdate={lastUpdate} />}
          {activeTab === 'transactions' && <Transactions transactions={transactions} onAdd={(tx) => setTransactions(p => [...p, tx])} onDelete={(id) => setTransactions(p => p.filter(t => t.id !== id))} theme={theme} />}
          {activeTab === 'graphs' && <Graphs summary={summary} projections={projections} theme={theme} />}
          {activeTab === 'news' && <News tickers={summary.map(s => s.ticker)} />}
          {activeTab === 'tax' && <TaxReport summary={summary} />}
        </Suspense>
      </main>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; themeClasses: any }> = ({ active, onClick, icon, label, themeClasses }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
    ${active ? themeClasses.navActive : themeClasses.navIdle}`}
  >
    {icon}
    {label}
  </button>
);

export default App;
