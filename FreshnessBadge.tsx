import type { Freshness } from '../types'

const STYLE: Record<Freshness, { label: string; cls: string; hint: string }> = {
  LIVE: { label: 'Live', cls: 'bg-gain/10 text-gain border-gain/30', hint: 'Verified real-time' },
  DELAYED: { label: 'Delayed', cls: 'bg-signal/10 text-signal border-signal/30', hint: 'Exchange-delayed data' },
  HISTORICAL: { label: 'Historical', cls: 'bg-ink/5 text-muted border-line', hint: 'Past data, not current' },
  CACHED: { label: 'Cached', cls: 'bg-ink/5 text-muted border-line', hint: 'Stored copy, may be stale' },
  SAMPLE: { label: 'Sample data', cls: 'bg-amber/10 text-amber border-amber/40', hint: 'Generated for the demo, not real prices' },
  UNAVAILABLE: { label: 'Unavailable', cls: 'bg-loss/10 text-loss border-loss/30', hint: 'Provider has no data for this field' },
}

export default function FreshnessBadge({ value }: { value: Freshness }) {
  const s = STYLE[value]
  return (
    <span title={s.hint} className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${s.cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  )
}
