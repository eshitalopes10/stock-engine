import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Candle } from '../types'
import { price } from '../format'

export default function PriceChart({ data, up }: { data: Candle[]; up: boolean }) {
  const color = up ? '#0E8A6A' : '#CF3F3F'
  return (
    <div className="h-72 w-full sm:h-96" role="img" aria-label="Closing price chart">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#D6DCE6" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={48} tick={{ fill: '#5B6577', fontSize: 12 }}
            tickFormatter={(d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} />
          <YAxis domain={['auto', 'auto']} orientation="right" tickLine={false} axisLine={false} width={56}
            tick={{ fill: '#5B6577', fontSize: 12 }} tickFormatter={(v: number) => v.toLocaleString('en-IN', { maximumFractionDigits: 0 })} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid #D6DCE6', boxShadow: 'none', fontSize: 13 }}
            formatter={(v: number) => [price(v), 'Close']}
            labelFormatter={(d: string) => new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} />
          <Area type="monotone" dataKey="close" stroke={color} strokeWidth={2} fill="url(#fill)" activeDot={{ r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
