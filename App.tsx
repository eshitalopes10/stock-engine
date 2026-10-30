import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Company from './pages/Company'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/company/:symbol" element={<Company />} />
        <Route path="*" element={<p className="text-muted">That page doesn't exist. Go back to search.</p>} />
      </Route>
    </Routes>
  )
}
