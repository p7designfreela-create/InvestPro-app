
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, AssetSummary, DividendProjection } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
  const prompt = `Busque via Google Search o preço atual e variação percentual hoje (preço em tempo real) para os ativos: ${tickers.join(", ")}. Retorne APENAS um JSON array.`;
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
    return [];
  }
};

export const getMarketNews = async (tickers: string[]): Promise<NewsItem[]> => {
  if (tickers.length === 0) return [];
  const prompt = `Busque notícias financeiras REAIS das últimas 48h para: ${tickers.join(", ")}. Ordene por data decrescente. Retorne um JSON array com campos: date (YYYY-MM-DD), ticker, title, summary, source.`;
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
    return [];
  }
};

export const getDividendCalendar = async (tickers: string[]): Promise<DividendProjection[]> => {
  if (tickers.length === 0) return [];
  const prompt = `Aja como um analista de RI. Verifique a DATA DE PAGAMENTO (não a data-com) de proventos para este mês atual para: ${tickers.join(", ")}. 
  IMPORTANTE: Retorne APENAS um registro por ativo se houver pagamento confirmado ou previsto para este mês. 
  Retorne um JSON array. Se não houver pagamento este mês, ignore o ativo.`;
  
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
    return [];
  }
};

export const getTaxAdvice = async (summary: AssetSummary[]): Promise<string> => {
  if (summary.length === 0) return "Adicione ativos na carteira.";
  const assetsStr = summary.map(a => `${a.ticker}: ${a.totalQuantity} un, PM R$ ${a.averagePrice.toFixed(2)}`).join(', ');
  const prompt = `Aja como contador brasileiro. Para os ativos [${assetsStr}], escreva a discriminação para a ficha de Bens e Direitos do IRPF. Use o código correto de cada ativo (Ações 31, FIIs 73, etc).`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    return "Erro ao gerar relatório.";
  }
};
