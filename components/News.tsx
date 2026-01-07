
import React, { useState, useEffect } from 'react';
import { getMarketNews, NewsItem } from '../services/gemini';
import { Bell, Newspaper, Loader2, Calendar, FolderOpen, ExternalLink, Clock } from 'lucide-react';

interface NewsProps {
  tickers: string[];
}

const News: React.FC<NewsProps> = ({ tickers }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      if (tickers.length === 0) return;
      setLoading(true);
      const result = await getMarketNews(tickers);
      setNews(result);
      setLoading(false);
    };
    fetchNews();
  }, [tickers.join(',')]);

  // Agrupamento por data e ordenação decrescente (mais recentes primeiro)
  const groupedNews = news.reduce((acc: Record<string, NewsItem[]>, item) => {
    const date = item.date || 'Recente';
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  // Ordena as chaves (datas) para que as mais recentes apareçam no topo
  const sortedDates = Object.keys(groupedNews).sort((a, b) => b.localeCompare(a));

  return (
    <div className="max-w-[1500px] mx-auto space-y-8 animate-in slide-in-from-right duration-700">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Newspaper className="text-indigo-600" size={28} />
            Terminal de Notícias
          </h2>
          <p className="text-sm opacity-50 font-medium">Fatos relevantes e atualizações cronológicas dos seus ativos.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
            <Clock size={12} /> Atualizado em Tempo Real
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Loader2 className={loading ? 'animate-spin' : ''} size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center gap-6 text-slate-400">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
            <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse text-indigo-600" size={24} />
          </div>
          <p className="text-xs font-black uppercase tracking-[0.2em] animate-pulse">Consultando fontes de mercado...</p>
        </div>
      ) : news.length === 0 ? (
        <div className="py-32 text-center space-y-4 opacity-30">
          <FolderOpen size={64} className="mx-auto text-indigo-200" />
          <p className="text-sm font-bold uppercase tracking-widest">Nenhuma notícia relevante nos registros</p>
          <p className="text-xs max-w-xs mx-auto">Adicione mais ativos ou tente atualizar o terminal em alguns instantes.</p>
        </div>
      ) : (
        <div className="space-y-16">
          {sortedDates.map((date) => (
            <div key={date} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="px-5 py-2 rounded-2xl bg-indigo-600 text-white text-[11px] font-black uppercase tracking-[0.1em] shadow-xl shadow-indigo-600/20">
                  {date === new Date().toISOString().split('T')[0] ? 'HOJE' : date}
                </div>
                <div className="flex-1 h-px bg-slate-500/10 dark:bg-slate-500/20" />
              </div>

              {/* Grid obrigatório de 4 colunas em desktops */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {groupedNews[date].map((item, i) => (
                  <div key={i} className="group flex flex-col p-7 bg-white dark:bg-[#0F172A] border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-indigo-500/30 transition-all hover:-translate-y-2 h-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />
                    
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <span className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black tracking-wider uppercase border border-indigo-500/5">
                        {item.ticker}
                      </span>
                      <span className="text-[10px] opacity-40 font-bold uppercase tracking-tighter">{item.source}</span>
                    </div>

                    <h3 className="font-extrabold text-[15px] leading-tight mb-4 group-hover:text-indigo-600 transition-colors line-clamp-2 relative z-10">
                      {item.title}
                    </h3>
                    
                    <p className="text-xs opacity-50 leading-relaxed line-clamp-5 flex-1 relative z-10 mb-6 font-medium">
                      {item.summary}
                    </p>

                    <div className="pt-5 border-t border-slate-500/5 dark:border-slate-500/10 flex justify-end relative z-10">
                       <button className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                         Ver Detalhes <ExternalLink size={12} />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
