
import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import { AssetSummary, DividendProjection } from '../types';
import { Theme } from '../App';

interface GraphsProps {
  summary: AssetSummary[];
  projections: DividendProjection[];
  theme: Theme;
}

const Graphs: React.FC<GraphsProps> = ({ summary, projections, theme }) => {
  const isDark = theme !== 'light';
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

  // 1. Proventos Recebidos (por Ativo)
  const dividendData = summary.map(a => {
    const divs = projections.filter(p => p.ticker === a.ticker).reduce((acc, curr) => acc + (curr.amount * a.totalQuantity), 0);
    return { ticker: a.ticker, total: divs || 0 };
  }).filter(d => d.total > 0).sort((a, b) => b.total - a.total);

  // 2. Exposição por Segmento
  const segmentData = summary.reduce((acc: any[], curr) => {
    const segment = curr.assetType;
    const existing = acc.find(item => item.name === segment);
    if (existing) existing.value += curr.totalInvested;
    else acc.push({ name: segment, value: curr.totalInvested });
    return acc;
  }, []);

  // 3. Top 5 Maiores Posições
  const topPositions = [...summary].sort((a, b) => b.totalInvested - a.totalInvested).slice(0, 5);

  const cardStyle = theme === 'light' ? 'bg-white border-slate-100' : 'bg-[#0F172A] border-slate-800';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom duration-700">
      
      {/* Proventos por Ativo */}
      <div className={`${cardStyle} p-8 rounded-3xl border shadow-sm col-span-1 lg:col-span-2`}>
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-black flex items-center gap-2"><div className="w-1 h-6 bg-indigo-600 rounded-full" /> Proventos Previstos por Ativo</h3>
          <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Baseado em anúncios recentes</span>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dividendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
              <XAxis dataKey="ticker" axisLine={false} tickLine={false} fontSize={12} stroke={isDark ? '#94a3b8' : '#64748b'} />
              <YAxis axisLine={false} tickLine={false} fontSize={12} stroke={isDark ? '#94a3b8' : '#64748b'} tickFormatter={(v) => `R$${v}`} />
              <Tooltip cursor={{ fill: isDark ? '#1e293b' : '#f8fafc' }} />
              <Bar dataKey="total" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alocação por Classe/Segmento */}
      <div className={`${cardStyle} p-8 rounded-3xl border shadow-sm`}>
        <h3 className="text-lg font-black mb-8 flex items-center gap-2"><div className="w-1 h-6 bg-emerald-600 rounded-full" /> Exposição por Classe</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={segmentData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                {segmentData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Maiores Posições */}
      <div className={`${cardStyle} p-8 rounded-3xl border shadow-sm`}>
        <h3 className="text-lg font-black mb-8 flex items-center gap-2"><div className="w-1 h-6 bg-amber-500 rounded-full" /> Ranking de Posições</h3>
        <div className="space-y-6">
          {topPositions.map((asset, i) => (
            <div key={asset.ticker} className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>{asset.ticker}</span>
                <span className="opacity-40">R$ {asset.totalInvested.toLocaleString('pt-BR')}</span>
              </div>
              <div className="h-2 w-full bg-slate-500/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                  style={{ width: `${(asset.totalInvested / topPositions[0].totalInvested) * 100}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Graphs;
