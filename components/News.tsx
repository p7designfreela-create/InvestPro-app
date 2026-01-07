
import React, { useState, useEffect } from 'react';
import { getMarketNews, NewsItem } from '../services/gemini';
import { Newspaper, Loader2, FolderOpen, ExternalLink, Clock } from 'lucide-react';

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

  const sortedNews = [...news].sort((a, b) => {
    const dateA = new Date(a.date || '').getTime();
    const dateB = new Date(b.date || '').getTime();
    return dateB - dateA;
  });

  return (
    <div className="max-w-full space-y-8 animate-in slide-in-from-right duration-700">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Newspaper className="text-indigo-600" size={28} />
            Terminal de Notícias
          </h2>
          <p className="text-sm opacity-50 font-medium">Fatos relevantes e atualizações dos seus ativos.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
            <Clock size={12} /> Live Market Data
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg hover:scale-105 transition-all"
          >
            <Loader2 className={loading ? 'animate-spin' : ''} size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center gap-6 text-slate-400">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
          <p className="text-xs font-black uppercase tracking-[0.2em]">Varrendo portais de notícias...</p>
        </div>
      ) : news.length === 0 ? (
        <div className="py-32 text-center opacity-30">
          <FolderOpen size={64} className="mx-auto text-indigo-200" />
          <p className="text-sm font-bold uppercase tracking-widest mt-4">Nenhum fato relevante hoje</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedNews.map((item, i) => (
            <div key={i} className="group flex flex-col p-7 bg-white dark:bg-[#0F172A] border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-indigo-500/40 transition-all hover:-translate-y-2 h-[320px]">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-tighter">
                  {item.ticker}
                </span>
                <span className="text-[10px] opacity-40 font-bold font-mono-tech">{item.date}</span>
              </div>
              <h3 className="font-extrabold text-[15px] leading-snug mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {item.title}
              </h3>
              <p className="text-xs opacity-50 leading-relaxed line-clamp-4 flex-1 mb-4 font-medium">
                {item.summary}
              </p>
              <div className="pt-5 border-t border-slate-500/5 dark:border-slate-500/10 flex justify-between items-center">
                 <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">{item.source}</span>
                 <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                   LER MAIS <ExternalLink size={12} />
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
