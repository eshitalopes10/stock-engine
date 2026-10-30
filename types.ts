export type Freshness = 'LIVE' | 'DELAYED' | 'HISTORICAL' | 'CACHED' | 'SAMPLE' | 'UNAVAILABLE'
export interface CompanyProfile { symbol: string; name: string; sector: string; industryType: string }
export interface Quote {
  symbol: string; price: number; change: number; changePct: number; volume: number
  marketCapCr: number; pe: number | null; freshness: Freshness; provider: string; asOf: string
}
export interface CompanySummary { profile: CompanyProfile; quote: Quote | null; spark: number[] }
export interface Candle { date: string; open: number; high: number; low: number; close: number; volume: number }
