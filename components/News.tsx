
import React, { useState, useEffect } from 'react';
import { getMarketNews, NewsItem } from '../services/gemini';
import { Bell, Newspaper, Loader2, Calendar, FolderOpen, ExternalLink } from 'lucide-react';

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
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in slide-in-from-right duration-700">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Notícias de Mercado</h2>
          <p className="text-sm opacity-40">Fatos relevantes e atualizações dos seus ativos.</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Loader2 className={loading ? 'animate-spin' : ''} size={20} />
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4 text-slate-400">
          <Loader2 className="animate-spin" size={32} />
          <p className="text-sm font-bold uppercase tracking-widest">Sincronizando Terminal...</p>
        </div>
      ) : news.length === 0 ? (
        <div className="py-20 text-center space-y-4 opacity-30">
          <FolderOpen size={48} className="mx-auto" />
          <p className="text-sm font-bold uppercase tracking-widest">Nenhuma notícia relevante encontrada</p>
        </div>
      ) : (
        <div className="space-y-12">
          {sortedDates.map((date) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="px-4 py-1.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/10">
                  {date}
                </div>
                <div className="flex-1 h-px bg-slate-500/10" />
              </div>

              {/* Grid configurado para 4 colunas em telas grandes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {groupedNews[date].map((item, i) => (
                  <div key={i} className="group flex flex-col p-6 bg-white dark:bg-[#0F172A] border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 text-[10px] font-black">{item.ticker}</span>
                      <span className="text-[10px] opacity-30 font-bold">{item.source}</span>
                    </div>
                    <h3 className="font-bold text-sm leading-tight mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs opacity-60 leading-relaxed line-clamp-4 flex-1">
                      {item.summary}
                    </p>
                    <div className="mt-6 pt-4 border-t border-slate-500/5 flex justify-end">
                       <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                         Detalhes <ExternalLink size={12} />
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
