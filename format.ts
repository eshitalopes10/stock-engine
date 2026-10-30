const inr = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const price = (v: number) => `₹${inr.format(v)}`
export const signed = (v: number) => `${v > 0 ? '+' : ''}${inr.format(v)}`
export const pct = (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(2)}%`
export const crore = (v: number) => (v >= 100000 ? `₹${(v / 100000).toFixed(2)} lakh Cr` : `₹${new Intl.NumberFormat('en-IN').format(Math.round(v))} Cr`)
export const volume = (v: number) => (v >= 1e7 ? `${(v / 1e7).toFixed(2)} Cr` : v >= 1e5 ? `${(v / 1e5).toFixed(2)} L` : String(v))
