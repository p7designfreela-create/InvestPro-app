
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
  ArrowRight,
  Target
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

  // Filtra as projeções para o dia selecionado (apenas pagamentos)
  const dayProjections = projections.filter(p => p.day === selectedDay);
  
  // Conjunto único de dias que possuem PAGAMENTOS para marcar no calendário
  const dividendDays = Array.from(new Set(projections.map(p => p.day)));

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* KPIs Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title="PATRIMÔNIO ESTIMADO" value={`R$ ${estimatedPatrimony.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} subValue={`R$ ${profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} vs Custo`} cardStyle={cardStyle} icon={<Wallet size={24} />} theme={theme} color="emerald" />
        <KPICard title="CUSTO DE AQUISIÇÃO" value={`R$ ${totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} subValue="Total investido" cardStyle={cardStyle} icon={<DollarSign size={24} />} theme={theme} color="blue" />
        <KPICard title="RENTABILIDADE CARTEIRA" value={`${profitPercentage.toFixed(2)}%`} subValue="Lucro/Prejuízo Total" cardStyle={cardStyle} icon={<TrendingUp size={24} />} theme={theme} color="indigo" trend={profit >= 0 ? 'up' : 'down'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monitoramento em Tempo Real */}
        <div className={`${cardStyle} lg:col-span-8 rounded-[2.5rem] border overflow-hidden flex flex-col shadow-sm`}>
          <div className="p-8 border-b border-inherit flex justify-between items-center bg-slate-500/5">
            <div>
              <h3 className="font-black flex items-center gap-3 text-base uppercase tracking-wider">
                <Target size={20} className="text-blue-500" /> Monitoramento
              </h3>
              <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest mt-1">Dados Sincronizados via Google Market</p>
            </div>
            <span className="text-[10px] font-mono-tech font-bold opacity-50">{lastUpdate}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-500/10 uppercase text-[10px] font-black tracking-widest opacity-40">
                <tr>
                  <th className="px-8 py-5">Ativo</th>
                  <th className="px-6 py-5 text-right">Cotação</th>
                  <th className="px-6 py-5 text-center">Oscilação</th>
                  <th className="px-6 py-5 text-right">P. Médio</th>
                  <th className="px-6 py-5 text-center">Rentab.</th>
                  <th className="px-8 py-5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-inherit">
                {summary.map((asset) => {
                  const currentPrice = asset.currentPrice || asset.averagePrice;
                  const rent = ((currentPrice - asset.averagePrice) / asset.averagePrice) * 100;
                  return (
                    <tr key={asset.ticker} className="hover:bg-slate-500/5 transition-all group">
                      <td className="px-8 py-5">
                        <span className="font-black text-sm group-hover:text-indigo-600 transition-colors">{asset.ticker}</span>
                        <p className="opacity-40 text-[10px] font-bold">{asset.totalQuantity} un. • {asset.assetType}</p>
                      </td>
                      <td className="px-6 py-5 text-right font-mono-tech font-bold text-sm">R$ {currentPrice.toFixed(2)}</td>
                      <td className={`px-6 py-5 text-center font-bold ${asset.variation && asset.variation >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {asset.variation ? `${asset.variation > 0 ? '↑' : '↓'} ${Math.abs(asset.variation).toFixed(2)}%` : '--'}
                      </td>
                      <td className="px-6 py-5 text-right opacity-30 font-mono-tech font-bold">R$ {asset.averagePrice.toFixed(2)}</td>
                      <td className={`px-6 py-5 text-center font-black ${rent >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{rent > 0 ? '+' : ''}{rent.toFixed(2)}%</td>
                      <td className="px-8 py-5 text-right font-black text-sm">R$ {(currentPrice * asset.totalQuantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calendário Exclusivo de Pagamentos */}
        <div className={`${cardStyle} lg:col-span-4 p-8 rounded-[2.5rem] border shadow-sm`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black flex items-center gap-3">
                <CalendarIcon size={22} className="text-indigo-600" /> 
                Pagamentos
              </h3>
              <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em] mt-1">
                {new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date())}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black opacity-30 mb-6 uppercase tracking-widest">
            <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
          </div>

          <div className="grid grid-cols-7 gap-3">
            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
              const hasPayment = dividendDays.includes(day);
              const isToday = day === new Date().getDate();
              const isSelected = selectedDay === day;
              
              return (
                <button 
                  key={day} 
                  onClick={() => setSelectedDay(day)}
                  className={`relative h-12 w-full rounded-2xl text-xs font-black transition-all
                    ${isSelected ? 'bg-indigo-600 text-white shadow-2xl scale-110 z-10' : hasPayment ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'hover:bg-slate-500/5 opacity-50'}
                    ${isToday && !isSelected ? 'ring-2 ring-indigo-400/30' : ''}
                  `}
                >
                  {day}
                  {hasPayment && !isSelected && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-[3px] border-white dark:border-slate-900" />
                  )}
                </button>
              )
            })}
          </div>

          <div className="mt-10 pt-8 border-t border-inherit space-y-4">
            {!selectedDay ? (
              <div className="flex flex-col items-center justify-center py-10 opacity-20 text-center space-y-3">
                <Info size={36} className="text-indigo-400" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] max-w-[150px]">Toque nas datas verdes para ver rendimentos</p>
              </div>
            ) : dayProjections.length === 0 ? (
              <div className="py-8 text-center bg-slate-500/5 rounded-3xl border border-dashed border-inherit">
                 <p className="text-xs font-bold opacity-30 italic">Sem pagamentos confirmados no dia {selectedDay}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-inherit pb-4 mb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider opacity-40">Depósitos em {selectedDay}</h4>
                  <span className="text-[11px] font-black text-emerald-600">
                    Total: R$ {dayProjections.reduce((sum, p) => sum + (summary.find(s => s.ticker === p.ticker)?.totalQuantity || 0) * p.amount, 0).toFixed(2)}
                  </span>
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
                      className={`p-5 rounded-3xl border transition-all cursor-pointer overflow-hidden
                        ${isExpanded ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl' : 'bg-slate-500/5 border-inherit hover:border-emerald-500/30'}
                      `}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[11px] font-black shadow-sm ${isExpanded ? 'bg-white/20' : 'bg-white dark:bg-slate-800 text-indigo-600'}`}>
                            {p.ticker.substring(0,2)}
                          </div>
                          <div>
                            <span className="font-black text-sm block leading-none mb-1">{p.ticker}</span>
                            <span className={`text-[10px] font-bold uppercase ${isExpanded ? 'text-white/60' : 'opacity-40'}`}>{p.type}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-black ${isExpanded ? 'text-white' : 'text-emerald-500'}`}>+ R$ {total.toFixed(2)}</p>
                          <ChevronRight size={14} className={`inline opacity-40 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-5 pt-5 border-t border-white/10 grid grid-cols-2 gap-4 animate-in zoom-in-95 duration-300">
                          <div>
                            <p className="text-[9px] uppercase font-black opacity-60 mb-1">Cotas em Carteira</p>
                            <p className="text-xs font-bold">{qty} un.</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] uppercase font-black opacity-60 mb-1">Rendimento Bruto</p>
                            <p className="text-xs font-bold">R$ {p.amount.toFixed(4)}</p>
                          </div>
                          <div className="col-span-2 pt-3 flex justify-between items-center bg-white/10 p-4 rounded-2xl border border-white/5">
                             <span className="text-[10px] font-black uppercase tracking-widest">Valor Líquido</span>
                             <span className="text-lg font-black font-mono-tech">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
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
  <div className={`p-8 rounded-[2.5rem] border ${theme === 'light' ? 'bg-white shadow-sm' : 'bg-[#0F172A] shadow-2xl'} relative overflow-hidden group hover:-translate-y-2 transition-all duration-500`}>
    <div className={`absolute right-[-10px] bottom-[-10px] opacity-[0.03] text-${color}-500 scale-[3] group-hover:scale-[3.5] transition-transform duration-700`}>{icon}</div>
    <div className="flex items-center gap-3 mb-4 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">
      <div className={`p-2.5 rounded-2xl bg-${color}-500/10 text-${color}-500 group-hover:bg-${color}-500 group-hover:text-white transition-all`}>{icon}</div>
      {title}
    </div>
    <div className="text-4xl font-black mb-1 font-mono-tech tracking-tighter">{value}</div>
    <div className={`text-[11px] font-black px-3 py-1 rounded-full inline-block ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : trend === 'down' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 opacity-60'}`}>
      {subValue}
    </div>
  </div>
);

export default Dashboard;
