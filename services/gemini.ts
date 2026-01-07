
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, AssetSummary, DividendProjection } from "../types";

// Acesso direto conforme diretrizes: o bundler deve substituir isso
const getAI = () => {
  const key = process.env.API_KEY;
  if (!key) console.warn("Aviso: API_KEY não encontrada no process.env");
  return new GoogleGenAI({ apiKey: key || '' });
};

export interface LiveMarketData {
  ticker: string;
  price: number;
  changePercent: number;
}

export interface NewsItem {
  date: string;
  ticker: string;
  title: string;
  summary: string;
  source: string;
}

export const getLiveMarketData = async (tickers: string[]): Promise<LiveMarketData[]> => {
  if (tickers.length === 0) return [];
  const ai = getAI();
  const prompt = `Consulte o Google Search e retorne o preço atual e a variação percentual de hoje para estes ativos da B3 ou Mercado Global: ${tickers.join(", ")}. 
  Retorne APENAS um array JSON. Caso não encontre um preço exato, use o último fechamento disponível.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              ticker: { type: Type.STRING },
              price: { type: Type.NUMBER },
              changePercent: { type: Type.NUMBER }
            },
            required: ["ticker", "price", "changePercent"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Erro Crítico Gemini (Market Data):", error);
    return [];
  }
};

export const getMarketNews = async (tickers: string[]): Promise<NewsItem[]> => {
  if (tickers.length === 0) return [];
  const ai = getAI();
  const prompt = `Pesquise notícias financeiras REAIS e fatos relevantes das últimas 48h para: ${tickers.join(", ")}. 
  Retorne um array JSON com campos: date (YYYY-MM-DD), ticker, title, summary, source.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING },
              ticker: { type: Type.STRING },
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              source: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Erro Crítico Gemini (News):", error);
    return [];
  }
};

export const getDividendCalendar = async (tickers: string[]): Promise<DividendProjection[]> => {
  if (tickers.length === 0) return [];
  const ai = getAI();
  const prompt = `Identifique datas de PAGAMENTO de proventos (dividendos/JCP) previstas ou confirmadas para este mês atual para: ${tickers.join(", ")}. 
  Retorne apenas ativos que tenham pagamentos neste mês. Array JSON.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              ticker: { type: Type.STRING },
              day: { type: Type.INTEGER },
              amount: { type: Type.NUMBER },
              type: { type: Type.STRING },
              status: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Erro Crítico Gemini (Dividends):", error);
    return [];
  }
};

export const getTaxAdvice = async (summary: AssetSummary[]): Promise<string> => {
  if (summary.length === 0) return "Adicione ativos na carteira para gerar o relatório.";
  const ai = getAI();
  const assetsStr = summary.map(a => `${a.ticker}: ${a.totalQuantity} un, PM R$ ${a.averagePrice.toFixed(2)}`).join(', ');
  const prompt = `Aja como contador brasileiro especialista em IRPF. Gere o texto EXATO para a ficha de "Bens e Direitos" para estes ativos: [${assetsStr}]. Inclua CNPJ se souber, código da categoria e discriminação padrão Receita Federal.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Relatório temporariamente indisponível.";
  } catch (error) {
    console.error("Erro Crítico Gemini (Tax):", error);
    return "Erro ao processar relatório fiscal.";
  }
};
