
import React, { useState } from 'react';
import { AssetSummary, DividendProjection } from '../types';
import { Theme } from '../App';
import { 
  TrendingUp, 
  Wallet, 
  DollarSign, 
  Calendar as CalendarIcon, 
  Search,
  ChevronRight,
  Info,
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
  
  const estimatedPatrimony = summary.reduce((acc, curr) => 
    acc + (curr.totalQuantity * (curr.currentPrice || curr.averagePrice)), 0
  );
  const totalInvested = summary.reduce((acc, curr) => acc + curr.totalInvested, 0);
  const profit = estimatedPatrimony - totalInvested;
  const profitPercentage = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;

  const cardStyle = theme === 'light' ? 'bg-white border-slate-100 text-slate-900' : 'bg-[#0F172A] border-slate-800 text-slate-50';

  // Filtra as projeções para o dia selecionado
  const dayProjections = projections.filter(p => p.day === selectedDay);
  
  // Conjunto único de dias que possuem PAGAMENTOS para o calendário
  const dividendDays = Array.from(new Set(projections.map(p => p.day)));

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title="PATRIMÔNIO ESTIMADO" value={`R$ ${estimatedPatrimony.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} subValue={`R$ ${profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de Lucro`} cardStyle={cardStyle} icon={<Wallet size={24} />} theme={theme} color="emerald" />
        <KPICard title="CUSTO DE AQUISIÇÃO" value={`R$ ${totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} subValue="Capital Investido" cardStyle={cardStyle} icon={<DollarSign size={24} />} theme={theme} color="blue" />
        <KPICard title="RENTABILIDADE" value={`${profitPercentage.toFixed(2)}%`} subValue="Total da Carteira" cardStyle={cardStyle} icon={<TrendingUp size={24} />} theme={theme} color="indigo" trend={profit >= 0 ? 'up' : 'down'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className={`${cardStyle} lg:col-span-8 rounded-[2.5rem] border overflow-hidden flex flex-col shadow-sm`}>
          <div className="p-8 border-b border-inherit flex justify-between items-center bg-slate-500/5">
            <div>
              <h3 className="font-black flex items-center gap-3 text-base uppercase tracking-wider">
                <Target size={20} className="text-blue-500" /> Terminal de Ativos
              </h3>
              <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest mt-1">Preço Atualizado Google Stream</p>
            </div>
            <span className="text-[10px] font-mono-tech font-bold opacity-50">{lastUpdate}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-500/10 uppercase text-[10px] font-black tracking-widest opacity-40">
                <tr>
                  <th className="px-8 py-5">Ativo</th>
                  <th className="px-6 py-5 text-right">Cotação</th>
                  <th className="px-6 py-5 text-center">Var. Dia</th>
                  <th className="px-6 py-5 text-right">P. Médio</th>
                  <th className="px-8 py-5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-inherit">
                {summary.map((asset) => {
                  const currentPrice = asset.currentPrice || asset.averagePrice;
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
                      <td className="px-8 py-5 text-right font-black text-sm">R$ {(currentPrice * asset.totalQuantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`${cardStyle} lg:col-span-4 p-8 rounded-[2.5rem] border shadow-sm`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black flex items-center gap-3">
              <CalendarIcon size={22} className="text-indigo-600" /> 
              Pagamentos
            </h3>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black opacity-30 mb-6 uppercase tracking-widest">
            <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
              const hasPayment = dividendDays.includes(day);
              const isToday = day === new Date().getDate();
              const isSelected = selectedDay === day;
              
              return (
                <button 
                  key={day} 
                  onClick={() => setSelectedDay(day)}
                  className={`relative h-11 w-full rounded-2xl text-xs font-black transition-all
                    ${isSelected ? 'bg-indigo-600 text-white shadow-xl scale-110 z-10' : hasPayment ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'hover:bg-slate-500/5 opacity-50'}
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
              <div className="py-10 text-center opacity-20 space-y-3">
                <Info size={36} className="mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-widest">Selecione uma data para ver os proventos</p>
              </div>
            ) : dayProjections.length === 0 ? (
              <div className="py-8 text-center bg-slate-500/5 rounded-3xl">
                 <p className="text-xs font-bold opacity-30 italic">Nenhum pagamento no dia {selectedDay}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dayProjections.map((p, i) => {
                  const asset = summary.find(s => s.ticker === p.ticker);
                  const total = (asset?.totalQuantity || 0) * p.amount;
                  const isExpanded = activeProjection?.ticker === p.ticker;

                  return (
                    <div 
                      key={i} 
                      onClick={() => setActiveProjection(isExpanded ? null : p)}
                      className={`p-5 rounded-3xl border transition-all cursor-pointer ${isExpanded ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-500/5 border-inherit'}`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="font-black text-sm">{p.ticker}</span>
                          <span className={`text-[10px] font-bold ${isExpanded ? 'text-white/60' : 'opacity-40'}`}>{p.type}</span>
                        </div>
                        <p className={`text-sm font-black ${isExpanded ? 'text-white' : 'text-emerald-500'}`}>+ R$ {total.toFixed(2)}</p>
                      </div>
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-2 animate-in slide-in-from-top-1">
                          <div>
                            <p className="text-[9px] uppercase opacity-60">Posição</p>
                            <p className="text-xs font-bold">{asset?.totalQuantity} un.</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] uppercase opacity-60">Unitário</p>
                            <p className="text-xs font-bold">R$ {p.amount.toFixed(4)}</p>
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
  <div className={`p-8 rounded-[2.5rem] border ${theme === 'light' ? 'bg-white' : 'bg-[#0F172A]'} shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all`}>
    <div className={`absolute right-[-10px] bottom-[-10px] opacity-[0.03] text-${color}-500 scale-[3]`}>{icon}</div>
    <div className="flex items-center gap-3 mb-4 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
      <div className={`p-2.5 rounded-2xl bg-${color}-500/10 text-${color}-500 group-hover:bg-${color}-500 group-hover:text-white transition-all`}>{icon}</div>
      {title}
    </div>
    <div className="text-3xl font-black mb-1 font-mono-tech">{value}</div>
    <div className={`text-[11px] font-black ${trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'opacity-40'}`}>
      {subValue}
    </div>
  </div>
);

export default Dashboard;
