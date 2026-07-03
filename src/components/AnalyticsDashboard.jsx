import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Settings, ChevronRight, ChevronLeft } from 'lucide-react'

export default function AnalyticsDashboard({ context }) {
  const { getGreeting } = context || {}
  const [range, setRange] = useState('30d')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [compact, setCompact] = useState(false)

  // Example metrics — replace with real data-fetch later
  const data = useMemo(() => ({
    activeUsers: parseInt(localStorage.getItem('analytics_activeUsers') || '124'),
    sessions: parseInt(localStorage.getItem('analytics_sessions') || '539'),
    retention: parseFloat(localStorage.getItem('analytics_retention') || '0.72'),
    avgTime: parseInt(localStorage.getItem('analytics_avgTime') || '06')
  }), [])

  const kpis = [
    { id: 'active', title: 'Active users', value: data.activeUsers, delta: '+6%' },
    { id: 'sessions', title: 'Sessions', value: data.sessions, delta: '+2%' },
    { id: 'retention', title: 'Retention', value: Math.round(data.retention * 100) + '%', delta: '+1.3%' },
    { id: 'avg', title: 'Avg time (min)', value: data.avgTime, delta: '−4%' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground">{getGreeting ? `${getGreeting()} — analytics snapshot` : 'Analytics snapshot'}</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/5"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>

          <button
            onClick={() => setCompact(c => !c)}
            className="px-3 py-2 rounded-lg glass-card"
            title="Toggle compact mode"
          >
            {compact ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.id} className={`p-4 rounded-2xl glass-card border border-white/5 ${compact ? 'text-sm' : ''}`}>
            <div className="flex items-baseline justify-between">
              <div className="text-xs text-muted-foreground">{k.title}</div>
              <div className={`text-sm ${k.delta.startsWith('+') ? 'text-emerald-400' : 'text-destructive'}`}>{k.delta}</div>
            </div>
            <div className={`mt-3 font-bold ${compact ? 'text-lg' : 'text-2xl'}`}>{k.value}</div>
            <div className="mt-2 text-xs text-muted-foreground">Small sparkline (placeholder)</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <div className="p-4 rounded-2xl glass-card border border-white/5">
            <h3 className="font-semibold mb-3">Filters</h3>
            <label className="block mb-2 text-sm">Repo / Course
              <select className="mt-1 w-full rounded-md p-2 bg-white/5">
                <option>All</option>
                <option>My Courses</option>
              </select>
            </label>
            <label className="block mb-2 text-sm">Platform
              <select className="mt-1 w-full rounded-md p-2 bg-white/5">
                <option>Web</option>
                <option>Mobile</option>
              </select>
            </label>

            <button
              className="mt-3 w-full px-3 py-2 rounded-md bg-primary/10 text-primary"
              onClick={() => setShowAdvanced(s => !s)}
            >
              <span className="flex items-center justify-center gap-2"><Settings className="w-4 h-4" /> {showAdvanced ? 'Hide advanced' : 'Show advanced'}</span>
            </button>
          </div>
        </aside>

        <section className="lg:col-span-3 space-y-4">
          <div className="p-4 rounded-2xl glass-card border border-white/5">
            <h3 className="font-semibold mb-2">Overview</h3>
            <div className="h-40 rounded-md bg-gradient-to-r from-white/3 to-white/2 flex items-center justify-center text-sm text-muted-foreground">
              Chart placeholder — wire in real chart later (e.g., Recharts / Chart.js)
            </div>
          </div>

          {showAdvanced && (
            <div className="p-4 rounded-2xl glass-card border border-white/5">
              <h3 className="font-semibold mb-2">Advanced metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-white/3">Metric A</div>
                <div className="p-3 rounded-lg bg-white/3">Metric B</div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
