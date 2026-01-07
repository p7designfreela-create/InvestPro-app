
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, AssetSummary, DividendProjection } from "../types";

const getAI = () => {
  const key = process.env.API_KEY;
  if (!key || key.trim() === "") {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey: key });
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
  try {
    const ai = getAI();
    const prompt = `Consulte o Google Search e retorne o preço atual e a variação percentual de hoje para estes ativos: ${tickers.join(", ")}. Retorne APENAS um array JSON válido.`;
    
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
    console.error("Erro Market Data:", error);
    throw error;
  }
};

export const getMarketNews = async (tickers: string[]): Promise<NewsItem[]> => {
  if (tickers.length === 0) return [];
  try {
    const ai = getAI();
    const prompt = `Notícias financeiras REAIS das últimas 48h para: ${tickers.join(", ")}. JSON array com: date (YYYY-MM-DD), ticker, title, summary, source.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Erro News:", error);
    return [];
  }
};

export const getDividendCalendar = async (tickers: string[]): Promise<DividendProjection[]> => {
  if (tickers.length === 0) return [];
  try {
    const ai = getAI();
    const prompt = `Datas de PAGAMENTO confirmadas ou previstas para este mês para: ${tickers.join(", ")}. Retorne JSON array.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Erro Dividends:", error);
    return [];
  }
};

export const getTaxAdvice = async (summary: AssetSummary[]): Promise<string> => {
  if (summary.length === 0) return "Adicione ativos.";
  try {
    const ai = getAI();
    const assetsStr = summary.map(a => `${a.ticker}: ${a.totalQuantity} un, PM R$ ${a.averagePrice.toFixed(2)}`).join(', ');
    const prompt = `Aja como contador. Gere a discriminação para a ficha de Bens e Direitos do IRPF para: [${assetsStr}].`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Relatório indisponível.";
  } catch (error) {
    return "Erro ao gerar relatório. Verifique sua API_KEY.";
  }
};
