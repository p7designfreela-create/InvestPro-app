
import React, { useState } from 'react';
import { AssetSummary, DividendProjection } from '../types';
import { Theme } from '../App';
import { 
  TrendingUp, 
  Wallet, 
  DollarSign, 
  Calendar as CalendarIcon, 
  Search,
  MoreHorizontal,
  ChevronRight,
  Info,
  ArrowRight
} from 'lucide-react';

interface DashboardProps {
  summary: AssetSummary[];
  theme: Theme;
  projections: DividendProjection[];
  lastUpdate: string;
}

const Dashboard: React.FC<DashboardProps> = ({ summary, theme, projections, lastUpdate }) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [activeProjection, setActiveProjection] = useState<DividendProjection | null>(null);
  
  const totalInvested = summary.reduce((acc, curr) => acc + curr.totalInvested, 0);
  const estimatedPatrimony = summary.reduce((acc, curr) => 
    acc + (curr.totalQuantity * (curr.currentPrice || curr.averagePrice)), 0
  );
  
  const profit = estimatedPatrimony - totalInvested;
  const profitPercentage = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;

  const cardStyle = theme === 'light' ? 'bg-white border-slate-100 text-slate-900' : 'bg-[#0F172A] border-slate-800 text-slate-50';
  const textMuted = theme === 'light' ? 'text-slate-400' : 'text-slate-500';

  // Filtra as projeções para o dia selecionado
  const dayProjections = projections.filter(p => p.day === selectedDay);
  
  // Conjunto único de dias que possuem proventos para marcar no calendário
  const dividendDays = Array.from(new Set(projections.map(p => p.day)));

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setActiveProjection(null); // Reseta o detalhe do ativo específico ao trocar de dia
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title="PATRIMÔNIO ESTIMADO" value={`R$ ${estimatedPatrimony.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} subValue={`R$ ${profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} vs Custo`} cardStyle={cardStyle} icon={<Wallet size={24} />} theme={theme} color="emerald" />
        <KPICard title="CUSTO DE AQUISIÇÃO" value={`R$ ${totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} subValue="Total investido" cardStyle={cardStyle} icon={<DollarSign size={24} />} theme={theme} color="blue" />
        <KPICard title="RENTABILIDADE CARTEIRA" value={`${profitPercentage.toFixed(2)}%`} subValue="Lucro/Prejuízo Total" cardStyle={cardStyle} icon={<TrendingUp size={24} />} theme={theme} color="indigo" trend={profit >= 0 ? 'up' : 'down'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monitoramento */}
        <div className={`${cardStyle} lg:col-span-8 rounded-3xl border overflow-hidden flex flex-col shadow-sm`}>
          <div className="p-6 border-b border-inherit flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider"><Search size={16} className="text-blue-500" /> Terminal de Ativos em Tempo Real</h3>
            <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Via Google Market Stream: {lastUpdate}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-500/5 uppercase text-[10px] font-bold tracking-widest opacity-50">
                <tr>
                  <th className="px-6 py-4">Ativo</th>
                  <th className="px-6 py-4 text-right">Cotação Atual</th>
                  <th className="px-6 py-4 text-center">Oscilação (24h)</th>
                  <th className="px-6 py-4 text-right">Preço Médio</th>
                  <th className="px-6 py-4 text-center">Rentab.</th>
                  <th className="px-6 py-4 text-right">Posição Atual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-inherit">
                {summary.map((asset) => {
                  const currentPrice = asset.currentPrice || asset.averagePrice;
                  const rent = ((currentPrice - asset.averagePrice) / asset.averagePrice) * 100;
                  return (
                    <tr key={asset.ticker} className="hover:bg-slate-500/5 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-black text-sm group-hover:text-indigo-500 transition-colors">{asset.ticker}</span>
                        <p className="opacity-40 text-[10px]">{asset.totalQuantity} un. • {asset.assetType}</p>
                      </td>
                      <td className="px-6 py-4 text-right font-mono-tech font-bold text-sm">R$ {currentPrice.toFixed(2)}</td>
                      <td className={`px-6 py-4 text-center font-bold ${asset.variation && asset.variation >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {asset.variation ? `${asset.variation > 0 ? '↑' : '↓'} ${Math.abs(asset.variation).toFixed(2)}%` : '--'}
                      </td>
                      <td className="px-6 py-4 text-right opacity-40 font-mono-tech">R$ {asset.averagePrice.toFixed(2)}</td>
                      <td className={`px-6 py-4 text-center font-bold ${rent >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{rent > 0 ? '+' : ''}{rent.toFixed(2)}%</td>
                      <td className="px-6 py-4 text-right font-black text-sm">R$ {(currentPrice * asset.totalQuantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calendário de Pagamentos */}
        <div className={`${cardStyle} lg:col-span-4 p-8 rounded-3xl border shadow-sm`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black flex items-center gap-2">
                <CalendarIcon size={20} className="text-indigo-500" /> 
                Pagamentos
              </h3>
              <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">{new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date())}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black opacity-30 mb-4 uppercase">
            <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
              const hasDiv = dividendDays.includes(day);
              const isToday = day === new Date().getDate();
              const isSelected = selectedDay === day;
              
              return (
                <button 
                  key={day} 
                  onClick={() => handleDayClick(day)}
                  className={`relative h-10 w-full rounded-xl text-xs font-bold transition-all
                    ${isSelected ? 'bg-indigo-600 text-white shadow-lg scale-110 z-10' : hasDiv ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'hover:bg-slate-500/5 opacity-50'}
                    ${isToday && !isSelected ? 'ring-2 ring-blue-400 ring-inset ring-opacity-50' : ''}
                  `}
                >
                  {day}
                  {hasDiv && !isSelected && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                  )}
                </button>
              )
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-inherit space-y-4">
            {!selectedDay ? (
              <div className="flex flex-col items-center justify-center py-8 opacity-20 text-center space-y-2">
                <Info size={32} />
                <p className="text-[10px] font-bold uppercase tracking-widest">Selecione uma data marcada para ver os depósitos</p>
              </div>
            ) : dayProjections.length === 0 ? (
              <p className="text-xs italic opacity-30 py-4 text-center">Nenhum pagamento registrado para o dia {selectedDay}.</p>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-xs font-black uppercase tracking-widest opacity-40">Dia {selectedDay}</h4>
                </div>
                
                {dayProjections.map((p, i) => {
                  const asset = summary.find(s => s.ticker === p.ticker);
                  const qty = asset ? asset.totalQuantity : 0;
                  const total = qty * p.amount;
                  const isExpanded = activeProjection?.ticker === p.ticker;

                  return (
                    <div 
                      key={i} 
                      onClick={() => setActiveProjection(isExpanded ? null : p)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer overflow-hidden
                        ${isExpanded ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-500/5 border-inherit hover:border-emerald-500/30'}
                      `}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${isExpanded ? 'bg-white/20' : 'bg-slate-500/10 text-slate-500'}`}>
                            {p.ticker.substring(0,2)}
                          </div>
                          <div>
                            <span className="font-black text-sm block leading-none mb-1">{p.ticker}</span>
                            <span className={`text-[9px] font-bold uppercase ${isExpanded ? 'text-white/60' : 'opacity-40'}`}>{p.type}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-[10px] font-black ${isExpanded ? 'text-white' : 'text-emerald-500'}`}>+ R$ {total.toFixed(2)}</p>
                          <ChevronRight size={14} className={`inline transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                          <div>
                            <p className="text-[9px] uppercase font-black opacity-60">Posição</p>
                            <p className="text-xs font-bold">{qty} cotas</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] uppercase font-black opacity-60">Rend. Unitário</p>
                            <p className="text-xs font-bold">R$ {p.amount.toFixed(4)}</p>
                          </div>
                          <div className="col-span-2 pt-2 flex justify-between items-center bg-white/10 p-2 rounded-xl">
                             <span className="text-[10px] font-black uppercase">Total a Receber</span>
                             <span className="text-sm font-black">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const KPICard: React.FC<any> = ({ title, value, subValue, icon, theme, color, trend }) => (
  <div className={`p-6 rounded-3xl border ${theme === 'light' ? 'bg-white' : 'bg-[#0F172A]'} shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all`}>
    <div className={`absolute right-[-10px] bottom-[-10px] opacity-[0.03] text-${color}-500 scale-[2.5]`}>{icon}</div>
    <div className="flex items-center gap-2 mb-3 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
      <div className={`p-1.5 rounded-lg bg-${color}-500/10 text-${color}-500 group-hover:bg-${color}-500 group-hover:text-white transition-colors`}>{icon}</div>
      {title}
    </div>
    <div className="text-3xl font-black mb-1 font-mono-tech">{value}</div>
    <div className={`text-xs font-bold ${trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'opacity-40'}`}>{subValue}</div>
  </div>
);

export default Dashboard;
