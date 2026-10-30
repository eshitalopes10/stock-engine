import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCompany, getPrices } from '../api'
import type { Candle, CompanySummary } from '../types'
import FreshnessBadge from '../components/FreshnessBadge'
import PriceChart from '../components/PriceChart'
import { crore, pct, price, signed, volume } from '../format'

const RANGES = [{ l: '1M', d: 22 }, { l: '3M', d: 66 }, { l: '6M', d: 130 }, { l: '1Y', d: 260 }]

const NEXT_STEPS = [
  { title: 'Business model', body: 'How the company makes money and what protects it from competitors.' },
  { title: 'Financial research', body: 'Growth, margins, debt and cash flow, checked against filings.' },
  { title: 'Investment thesis', body: 'The case for, the case against, and what would change your mind.' },
]

export default function Company() {
  const { symbol = '' } = useParams()
  const [company, setCompany] = useState<CompanySummary | null>(null)
  const [candles, setCandles] = useState<Candle[]>([])
  const [days, setDays] = useState(66)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getCompany(symbol).then((c) => { setCompany(c); setError(null) }).catch((e: Error) => setError(e.message))
  }, [symbol])
  useEffect(() => { getPrices(symbol, days).then(setCandles).catch(() => setCandles([])) }, [symbol, days])

  if (error) return (
    <div role="alert" className="rise rounded-xl border border-loss/30 bg-loss/5 p-4 text-sm">
      <p className="font-semibold text-loss">{error}</p>
      <Link to="/" className="mt-2 inline-block text-signal underline">Back to search</Link>
    </div>
  )
  if (!company) return <p className="text-muted">Loading {symbol}…</p>

  const { profile, quote } = company
  const up = (quote?.change ?? 0) >= 0
  const first = candles[0]?.close, last = candles[candles.length - 1]?.close
  const rangeUp = first !== undefined && last !== undefined ? last >= first : up
  const hi = candles.length ? Math.max(...candles.map((c) => c.high)) : null
  const lo = candles.length ? Math.min(...candles.map((c) => c.low)) : null

  return (
    <div className="rise">
      <Link to="/" className="text-sm text-muted hover:text-ink">Back to search</Link>
      <header className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{profile.name}</h1>
          <p className="mt-1 text-muted">NSE: {profile.symbol} · {profile.sector}</p>
        </div>
        {quote && (
          <div className="text-right">
            <div className="font-display text-4xl font-bold">{price(quote.price)}</div>
            <div className={`font-medium ${up ? 'text-gain' : 'text-loss'}`}>{signed(quote.change)} ({pct(quote.changePct)}) today</div>
          </div>
        )}
      </header>

      {quote && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-line bg-surface px-4 py-3 text-sm">
          <FreshnessBadge value={quote.freshness} />
          <span className="text-muted">
            From {quote.provider}, retrieved {new Date(quote.asOf).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}.
            {quote.freshness === 'SAMPLE' && ' These prices are generated for the demo and must not be used for decisions.'}
          </span>
        </div>
      )}

      <section className="mt-6 rounded-xl border border-line bg-surface p-4 sm:p-6" aria-label="Price history">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Price history</h2>
          <div role="group" aria-label="Time range" className="flex gap-1 rounded-lg bg-paper p-1">
            {RANGES.map((r) => (
              <button key={r.l} onClick={() => setDays(r.d)} aria-pressed={days === r.d}
                className={`rounded-md px-3 py-1 text-sm font-medium ${days === r.d ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}>{r.l}</button>
            ))}
          </div>
        </div>
        {candles.length > 0 ? <PriceChart data={candles} up={rangeUp} /> : <p className="py-16 text-center text-muted">No price history available for this range.</p>}
      </section>

      {quote && (
        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
          {[
            ['Market cap', crore(quote.marketCapCr)],
            ['P/E ratio', quote.pe ? quote.pe.toFixed(1) : 'Not available'],
            ['Volume today', volume(quote.volume)],
            ['Range high', hi ? price(hi) : '—'],
            ['Range low', lo ? price(lo) : '—'],
          ].map(([k, v]) => (
            <div key={k} className="bg-surface p-4">
              <dt className="text-xs text-muted">{k}</dt>
              <dd className="mt-1 font-display text-lg font-bold">{v}</dd>
            </div>
          ))}
        </dl>
      )}

      <section className="mt-8" aria-label="Research">
        <h2 className="font-display text-lg font-bold">Research on {profile.symbol}</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          {NEXT_STEPS.map((s) => (
            <div key={s.title} className="rounded-xl border border-dashed border-line bg-surface/60 p-5">
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.body}</p>
              <p className="mt-4 text-sm text-muted">Not generated yet. Available once the AI research layer is connected.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
