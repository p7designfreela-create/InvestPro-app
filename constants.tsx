
import { AssetType } from './types';

export const BROKERS = [
  'XP Investimentos',
  'BTG Pactual',
  'Inter',
  'NuInvest',
  'Rico',
  'Clear',
  'Ágora',
  'Banco do Brasil',
  'Itaú Corretora'
];

export const ASSET_COLORS: Record<string, string> = {
  [AssetType.ACAO]: '#3b82f6', // Blue
  [AssetType.FII]: '#10b981',  // Green
  [AssetType.ETF]: '#f59e0b',  // Amber
  [AssetType.BDR]: '#8b5cf6',  // Purple
  [AssetType.CRYPT]: '#ef4444', // Red
  [AssetType.RF]: '#64748b'    // Slate
};

export interface MarketAsset {
  ticker: string;
  name: string;
  segment: string;
  type: AssetType;
}

export const ALL_MARKET_ASSETS: MarketAsset[] = [
  // Ações (Ordinárias, Preferenciais e Units)
  { ticker: 'PETR4', name: 'Petrobras PN', segment: 'Petróleo/Energia', type: AssetType.ACAO },
  { ticker: 'PETR3', name: 'Petrobras ON', segment: 'Petróleo/Energia', type: AssetType.ACAO },
  { ticker: 'VALE3', name: 'Vale ON', segment: 'Mineração', type: AssetType.ACAO },
  { ticker: 'ITUB4', name: 'Itaú Unibanco PN', segment: 'Bancos', type: AssetType.ACAO },
  { ticker: 'ITUB3', name: 'Itaú Unibanco ON', segment: 'Bancos', type: AssetType.ACAO },
  { ticker: 'BBDC4', name: 'Bradesco PN', segment: 'Bancos', type: AssetType.ACAO },
  { ticker: 'BBDC3', name: 'Bradesco ON', segment: 'Bancos', type: AssetType.ACAO },
  { ticker: 'BBAS3', name: 'Banco do Brasil ON', segment: 'Bancos', type: AssetType.ACAO },
  { ticker: 'ITSA4', name: 'Itaúsa PN', segment: 'Holding/Bancos', type: AssetType.ACAO },
  { ticker: 'ITSA3', name: 'Itaúsa ON', segment: 'Holding/Bancos', type: AssetType.ACAO },
  { ticker: 'B3SA3', name: 'B3 ON', segment: 'Mercado de Capitais', type: AssetType.ACAO },
  { ticker: 'ELET3', name: 'Eletrobras ON', segment: 'Energia Elétrica', type: AssetType.ACAO },
  { ticker: 'ELET6', name: 'Eletrobras PNB', segment: 'Energia Elétrica', type: AssetType.ACAO },
  { ticker: 'ABEV3', name: 'Ambev ON', segment: 'Bebidas', type: AssetType.ACAO },
  { ticker: 'MGLU3', name: 'Magazine Luiza ON', segment: 'Varejo', type: AssetType.ACAO },
  { ticker: 'WEGE3', name: 'Weg ON', segment: 'Bens de Capital', type: AssetType.ACAO },
  { ticker: 'RENT3', name: 'Localiza ON', segment: 'Aluguel de Carros', type: AssetType.ACAO },
  { ticker: 'SANB11', name: 'Santander Unit', segment: 'Bancos', type: AssetType.ACAO },
  { ticker: 'BBSE3', name: 'BB Seguridade ON', segment: 'Seguros', type: AssetType.ACAO },
  { ticker: 'JBSS3', name: 'JBS ON', segment: 'Alimentos', type: AssetType.ACAO },
  { ticker: 'SUZB3', name: 'Suzano ON', segment: 'Papel e Celulose', type: AssetType.ACAO },
  { ticker: 'GGBR4', name: 'Gerdau PN', segment: 'Siderurgia', type: AssetType.ACAO },
  { ticker: 'HAPV3', name: 'Hapvida ON', segment: 'Saúde', type: AssetType.ACAO },
  { ticker: 'BHIA3', name: 'Casas Bahia ON', segment: 'Varejo', type: AssetType.ACAO },
  { ticker: 'COGN3', name: 'Cogna ON', segment: 'Educação', type: AssetType.ACAO },
  { ticker: 'IRBR3', name: 'IRB Brasil RE ON', segment: 'Seguros', type: AssetType.ACAO },

  // FIIs (Fundos de Investimento Imobiliário)
  { ticker: 'HGLG11', name: 'CGHG Logística', segment: 'Logística', type: AssetType.FII },
  { ticker: 'KNRI11', name: 'Kinea Renda', segment: 'Híbrido', type: AssetType.FII },
  { ticker: 'MXRF11', name: 'Maxi Renda', segment: 'Papel', type: AssetType.FII },
  { ticker: 'XPML11', name: 'XP Malls', segment: 'Shoppings', type: AssetType.FII },
  { ticker: 'VISC11', name: 'Vinci Shopping', segment: 'Shoppings', type: AssetType.FII },
  { ticker: 'BTLG11', name: 'BTG Logística', segment: 'Logística', type: AssetType.FII },
  { ticker: 'GARE11', name: 'Guardian Real Estate', segment: 'Híbrido/Logística', type: AssetType.FII },
  { ticker: 'RZAG11', name: 'Riza Agro', segment: 'Fiagro', type: AssetType.FII },
  { ticker: 'CPTS11', name: 'Capitânia Securities', segment: 'Papel', type: AssetType.FII },
  { ticker: 'KNSC11', name: 'Kinea Securities', segment: 'Papel', type: AssetType.FII },
  { ticker: 'HGBS11', name: 'Hedge Brasil Shopping', segment: 'Shoppings', type: AssetType.FII },
  { ticker: 'HGRU11', name: 'CSHG Renda Urbana', segment: 'Híbrido/Varejo', type: AssetType.FII },
  { ticker: 'KNCR11', name: 'Kinea Rendimentos', segment: 'Papel', type: AssetType.FII },
  { ticker: 'VGHF11', name: 'Valora Hedge Fund', segment: 'Híbrido', type: AssetType.FII },
  { ticker: 'XPLG11', name: 'XP Logística', segment: 'Logística', type: AssetType.FII },
  { ticker: 'RECT11', name: 'UBS (BR) Office', segment: 'Lajes Corporativas', type: AssetType.FII },
  { ticker: 'BRCO11', name: 'Bresco Logística', segment: 'Logística', type: AssetType.FII },

  // ETFs
  { ticker: 'BOVA11', name: 'iShares Ibovespa', segment: 'Ações Brasil', type: AssetType.ETF },
  { ticker: 'IVVB11', name: 'iShares S&P 500', segment: 'Ações EUA', type: AssetType.ETF },
  { ticker: 'SMAL11', name: 'iShares Small Cap', segment: 'Small Caps', type: AssetType.ETF },
  { ticker: 'HASH11', name: 'Hashdex Crypto Index', segment: 'Criptoativos', type: AssetType.ETF },

  // BDRs
  { ticker: 'AAPL34', name: 'Apple Inc', segment: 'Tecnologia', type: AssetType.BDR },
  { ticker: 'GOGL34', name: 'Alphabet Google', segment: 'Tecnologia', type: AssetType.BDR },
  { ticker: 'AMZO34', name: 'Amazon BDR', segment: 'Varejo Tech', type: AssetType.BDR },
  { ticker: 'TSLA34', name: 'Tesla Inc', segment: 'Automotivo', type: AssetType.BDR },
  { ticker: 'NVDC34', name: 'NVIDIA Corp', segment: 'Semicondutores', type: AssetType.BDR }
];

export const MOCK_ASSETS = [
  { ticker: 'PETR4', segment: 'Petróleo', price: 38.45, change: 1.2 },
  { ticker: 'VALE3', segment: 'Mineração', price: 65.12, change: -0.8 },
  { ticker: 'HGLG11', segment: 'Logística (FII)', price: 162.30, change: 0.15 },
  { ticker: 'ITUB4', segment: 'Bancos', price: 32.10, change: 0.45 },
  { ticker: 'KNRI11', segment: 'Híbrido (FII)', price: 158.90, change: -0.05 },
];
