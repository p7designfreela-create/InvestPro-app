
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
  const prompt = `Aja como um terminal Bloomberg. Busque o preço atual e variação percentual hoje para: ${tickers.join(", ")}. Retorne APENAS um JSON array.`;
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
  const prompt = `Busque notícias reais das últimas 48h para os ativos: ${tickers.join(", ")}. Retorne um JSON array com os campos: date (YYYY-MM-DD), ticker, title, summary, source.`;
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
  // Prompt focado exclusivamente na DATA DE PAGAMENTO para evitar duplicidade com datas de anúncio
  const prompt = `Verifique no Google a DATA DE PAGAMENTO de dividendos ou JCP prevista ou confirmada para este mês corrente para os seguintes ativos: ${tickers.join(", ")}. 
  Ignore datas de anúncio (Data-Com). Retorne apenas um registro de PAGAMENTO por ticker. Se não houver pagamento este mês, ignore o ticker.
  Retorne um JSON array.`;
  
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
              day: { type: Type.INTEGER, description: "O dia do mês em que o dinheiro cai na conta" },
              amount: { type: Type.NUMBER, description: "Valor bruto por cada cota" },
              type: { type: Type.STRING, description: "Dividendos ou JCP" },
              status: { type: Type.STRING, description: "previsto ou confirmado" }
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
  if (summary.length === 0) return "Nenhum ativo na carteira para processar.";
  
  const assetsStr = summary.map(a => 
    `- ${a.ticker} (${a.assetType}): Qtd ${a.totalQuantity}, Preço Médio R$ ${a.averagePrice.toFixed(2)}, Custo Total R$ ${a.totalInvested.toFixed(2)}`
  ).join('\n');

  const prompt = `Aja como um contador brasileiro especialista em IRPF. 
Com os ativos abaixo, escreva a discriminação para a ficha de "Bens e Direitos" da Declaração de Ajuste Anual.
Siga o padrão: "[Ticker] - [Quantidade] cotas de [Tipo] adquiridas pelo custo médio de R$ [Preço Médio]. Valor Total em 31/12: R$ [Total]".
Dê também uma breve dica sobre qual código usar (ex: 31 para Ações, 73 para FIIs).

Ativos da Carteira:
${assetsStr}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Desculpe, não consegui consolidar as informações do relatório.";
  } catch (error) {
    console.error("Gemini API Error (Tax Advice):", error);
    return "Ocorreu um erro ao gerar o relatório inteligente de imposto de renda.";
  }
};
