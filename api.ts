import type { Candle, CompanySummary } from './types'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`/api/v1${path}`)
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message ?? `Request failed (${res.status})`)
  }
  return res.json()
}

export const searchCompanies = (q: string) => get<CompanySummary[]>(`/companies?q=${encodeURIComponent(q)}`)
export const getCompany = (symbol: string) => get<CompanySummary>(`/companies/${symbol}`)
export const getPrices = (symbol: string, days: number) => get<Candle[]>(`/companies/${symbol}/prices?days=${days}`)
