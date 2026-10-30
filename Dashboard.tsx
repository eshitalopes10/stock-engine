import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchCompanies } from '../api'
import type { CompanySummary } from '../types'
import FreshnessBadge from '../components/FreshnessBadge'
import Sparkline from '../components/Sparkline'
import { crore, pct, price } from '../format'

export default function Dashboard() {
  const [q, setQ] = useState('')
  const [rows, setRows] = useState<CompanySummary[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => {
      searchCompanies(q).then((r) => { setRows(r); setError(null) }).catch((e: Error) => setError(e.message))
    }, 200)
    return () => clearTimeout(t)
  }, [q])

  return (
    <div className="rise">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Which company are you looking at?</h1>
      <p className="mt-2 max-w-xl text-muted">Search by name or NSE symbol. Every number shows where it came from and how fresh it is.</p>

      <label className="mt-6 block">
        <span className="sr-only">Search companies</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try TCS, bank, or pharma"
          className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-base shadow-sm placeholder:text-muted/70 sm:max-w-md" />
      </label>

      {error && (
        <div role="alert" className="mt-6 rounded-xl border border-loss/30 bg-loss/5 p-4 text-sm">
          <p className="font-semibold text-loss">Can't reach the backend</p>
          <p className="mt-1 text-muted">{error}. Start it with <code className="rounded bg-ink/5 px-1">mvn spring-boot:run</code> in the backend folder.</p>
        </div>
      )}

      {!error && rows && rows.length === 0 && (
        <p className="mt-8 text-muted">No company matches “{q}”. Try a symbol like INFY or a sector like banking.</p>
      )}

      {rows && rows.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full min-w-[44rem] text-sm">
            <thead className="border-b border-line text-left text-xs text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 text-right font-medium">Price</th>
                <th className="px-4 py-3 text-right font-medium">Today</th>
                <th className="px-4 py-3 font-medium">30 days</th>
                <th className="px-4 py-3 text-right font-medium">Market cap</th>
                <th className="px-4 py-3 text-right font-medium">P/E</th>
                <th className="px-4 py-3 font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ profile, quote, spark }) => {
                const up = (quote?.change ?? 0) >= 0
                return (
                  <tr key={profile.symbol} tabIndex={0} role="link"
                    onClick={() => navigate(`/company/${profile.symbol}`)}
                    onKeyDown={(e) => e.key === 'Enter' && navigate(`/company/${profile.symbol}`)}
                    className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-signal/[0.04]">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{profile.name}</div>
                      <div className="text-xs text-muted">{profile.symbol} · {profile.sector}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{quote ? price(quote.price) : '—'}</td>
                    <td className={`px-4 py-3 text-right font-medium ${up ? 'text-gain' : 'text-loss'}`}>{quote ? pct(quote.changePct) : '—'}</td>
                    <td className="px-4 py-3"><Sparkline data={spark} up={spark.length > 1 && spark[spark.length - 1] >= spark[0]} /></td>
                    <td className="px-4 py-3 text-right">{quote ? crore(quote.marketCapCr) : '—'}</td>
                    <td className="px-4 py-3 text-right">{quote?.pe?.toFixed(1) ?? '—'}</td>
                    <td className="px-4 py-3">{quote && <FreshnessBadge value={quote.freshness} />}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
