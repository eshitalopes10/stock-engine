import { NavLink, Outlet } from 'react-router-dom'

const STAGES = [
  { n: 1, name: 'Discover', hint: 'Find and filter companies', to: '/' },
  { n: 2, name: 'Understand', hint: 'Business model and moat' },
  { n: 3, name: 'Research', hint: 'Financials and fundamentals' },
  { n: 4, name: 'Challenge', hint: 'Build and test a thesis' },
  { n: 5, name: 'Update', hint: 'New quarterly results' },
]

export default function Layout() {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="border-b border-line bg-surface lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="px-6 py-5">
          <NavLink to="/" className="font-display text-xl font-bold tracking-tight">Stock Analyzer</NavLink>
          <p className="mt-1 text-sm text-muted">Research Indian companies, step by step.</p>
        </div>
        <nav aria-label="Research stages" className="hidden px-3 pb-6 lg:block">
          <ol className="relative ml-3 space-y-1 border-l border-line">
            {STAGES.map((s) => {
              const body = (
                <>
                  <span className="absolute -left-[9px] mt-1 flex h-4 w-4 items-center justify-center rounded-full border border-line bg-surface text-[10px] font-semibold text-muted">{s.n}</span>
                  <span className="block pl-6">
                    <span className="block text-sm font-semibold">{s.name}</span>
                    <span className="block text-xs text-muted">{s.hint}</span>
                  </span>
                </>
              )
              return (
                <li key={s.n} className="relative">
                  {s.to ? (
                    <NavLink to={s.to} end className={({ isActive }) => `block rounded-r-lg py-2 ${isActive ? 'bg-signal/5 text-signal' : 'hover:bg-ink/5'}`}>{body}</NavLink>
                  ) : (
                    <div className="block cursor-not-allowed py-2 opacity-50" aria-disabled="true" title="Coming in a later phase">{body}</div>
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
      </aside>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8"><Outlet /></main>
    </div>
  )
}
