
export enum AssetType {
  ACAO = 'Ações (Brasil)',
  FII = 'Fundos Imobiliários',
  ETF = 'ETFs',
  BDR = 'BDRs',
  CRYPT = 'Criptoativos',
  RF = 'Renda Fixa'
}

export enum TransactionType {
  BUY = 'Compra',
  SELL = 'Venda'
}

export interface Transaction {
  id: string;
  date: string;
  ticker: string;
  type: TransactionType;
  assetType: AssetType;
  quantity: number;
  price: number;
  fees: number;
  broker: string;
}

export interface DividendProjection {
  ticker: string;
  day: number;
  amount: number;
  type: string;
  status: 'previsto' | 'confirmado';
}

export interface AssetSummary {
  ticker: string;
  assetType: AssetType;
  totalQuantity: number;
  averagePrice: number;
  totalInvested: number;
  currentPrice?: number;
  variation?: number;
}

export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  ticker?: string;
}
