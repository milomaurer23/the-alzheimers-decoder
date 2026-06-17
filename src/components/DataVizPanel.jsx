import { useMemo } from 'react'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { urgencyHeatColor } from '../utils.js'

const BEHAVIORS = ['Memory Lapse', 'Agitation', 'Wandering', 'Confusion', 'Sleep Disruption', 'Personal Care Decline']

const BEHAVIOR_COLORS = {
  'Memory Lapse': '#0D0D0D',
  'Agitation': '#9B1B1B',
  'Wandering': '#4A4A47',
  'Confusion': '#787870',
  'Sleep Disruption': '#A3A39C',
  'Personal Care Decline': '#C8C8C0',
}

const TICK_STYLE = { fontFamily: 'Inter', fontSize: 10, fill: '#A3A39C', letterSpacing: '0.05em' }

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-ash-200 p-3 text-xs font-sans">
      <p className="text-ash-400 uppercase tracking-wider mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.fill || p.stroke }} />
          <span className="text-ash-500">{p.dataKey}:</span>
          <span className="text-obsidian font-medium">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

function UrgencyHeatmap({ entries }) {
  const heatData = useMemo(() => {
    // 90-day window ending June 17 2026
    const end = new Date('2026-06-17')
    const start = new Date('2026-03-19')

    // Find the Monday on or before start
    const startDay = new Date(start)
    const dow = startDay.getDay()
    startDay.setDate(startDay.getDate() - (dow === 0 ? 6 : dow - 1))

    const days = []
    const cur = new Date(startDay)
    const entryMap = {}

    entries.forEach((e) => {
      const d = e.timestamp.split('T')[0]
      if (!entryMap[d] || entryMap[d] < e.urgency_rating) entryMap[d] = e.urgency_rating
    })

    while (cur <= end) {
      days.push({
        date: cur.toISOString().split('T')[0],
        urgency: entryMap[cur.toISOString().split('T')[0]] || 0,
      })
      cur.setDate(cur.getDate() + 1)
    }

    // Pad to full weeks
    while (days.length % 7 !== 0) days.push({ date: '', urgency: -1 })

    const weeks = []
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))
    return weeks
  }, [entries])

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return (
    <div>
      {/* Day labels */}
      <div className="flex gap-1 mb-1 ml-0">
        {dayLabels.map((d, i) => (
          <div key={i} className="w-5 h-4 flex items-center justify-center font-sans text-[9px] text-ash-400">{d}</div>
        ))}
      </div>

      <div className="space-y-1">
        {heatData.map((week, wi) => (
          <div key={wi} className="flex gap-1">
            {week.map((day, di) => (
              <div
                key={di}
                className="w-5 h-5"
                style={{
                  backgroundColor: day.urgency === -1 ? 'transparent' : urgencyHeatColor(day.urgency),
                }}
                title={day.date ? `${day.date}: ${day.urgency > 0 ? `Urgency ${day.urgency}` : 'No events'}` : ''}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-3 flex-wrap">
        <p className="font-sans text-[9px] text-ash-400 uppercase tracking-wider mr-1">Urgency:</p>
        {[
          { label: 'None', color: '#E8E8E5' },
          { label: '1–3', color: '#E8C4B8' },
          { label: '4–6', color: '#D4896A' },
          { label: '7+', color: '#9B1B1B' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-3 h-3" style={{ backgroundColor: color }} />
            <span className="font-sans text-[9px] text-ash-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DataVizPanel({ entries }) {
  const monthlyData = useMemo(() => {
    const cutoff = new Date('2026-03-01')
    const months = {}

    entries
      .filter((e) => new Date(e.timestamp) >= cutoff)
      .forEach((e) => {
        const d = new Date(e.timestamp)
        const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
        if (!months[key]) {
          months[key] = { month: key }
          BEHAVIORS.forEach((b) => { months[key][b] = 0 })
        }
        if (months[key][e.ai_interpreted_behavior] !== undefined) {
          months[key][e.ai_interpreted_behavior]++
        }
      })

    return Object.values(months)
  }, [entries])

  const urgencyTimeline = useMemo(() =>
    entries.map((e) => ({
      date: new Date(e.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      urgency: e.urgency_rating,
      behavior: e.ai_interpreted_behavior,
    })),
  [entries])

  return (
    <div className="space-y-0 border border-ash-200">
      {/* Section 1: Behavior Frequency */}
      <div className="border-b border-ash-200 p-8">
        <div className="mb-6">
          <p className="font-sans text-xs tracking-ultrawide text-ash-400 uppercase mb-1">Data Visualization — 01</p>
          <h2 className="font-serif text-2xl font-light text-obsidian">
            Behavior Frequency
          </h2>
          <p className="font-sans text-xs text-ash-400 mt-1">
            Categorized event counts by month — March through June 2026
          </p>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyData} barSize={8} barGap={2} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="2 4" stroke="#E8E8E5" vertical={false} />
            <XAxis
              dataKey="month"
              tick={TICK_STYLE}
              axisLine={{ stroke: '#E8E8E5' }}
              tickLine={false}
            />
            <YAxis
              tick={TICK_STYLE}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={20}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.05em', paddingTop: 16 }}
            />
            {BEHAVIORS.map((b) => (
              <Bar key={b} dataKey={b} fill={BEHAVIOR_COLORS[b]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Section 2: Urgency Over Time */}
      <div className="border-b border-ash-200 p-8">
        <div className="mb-6">
          <p className="font-sans text-xs tracking-ultrawide text-ash-400 uppercase mb-1">Data Visualization — 02</p>
          <h2 className="font-serif text-2xl font-light text-obsidian">
            Urgency Trajectory
          </h2>
          <p className="font-sans text-xs text-ash-400 mt-1">
            Per-event urgency rating — the escalation arc
          </p>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={urgencyTimeline}>
            <CartesianGrid strokeDasharray="2 4" stroke="#E8E8E5" vertical={false} />
            <XAxis
              dataKey="date"
              tick={TICK_STYLE}
              axisLine={{ stroke: '#E8E8E5' }}
              tickLine={false}
              interval={3}
            />
            <YAxis
              domain={[0, 10]}
              tick={TICK_STYLE}
              axisLine={false}
              tickLine={false}
              width={20}
              ticks={[0, 2, 4, 6, 8, 10]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="urgency"
              stroke="#9B1B1B"
              strokeWidth={1.5}
              dot={{ fill: '#9B1B1B', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#9B1B1B' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Section 3: Urgency Heatmap */}
      <div className="p-8">
        <div className="mb-6">
          <p className="font-sans text-xs tracking-ultrawide text-ash-400 uppercase mb-1">Data Visualization — 03</p>
          <h2 className="font-serif text-2xl font-light text-obsidian">
            Urgency Heat Map
          </h2>
          <p className="font-sans text-xs text-ash-400 mt-1">
            Day-level urgency density — March 19 through June 17, 2026
          </p>
        </div>

        <UrgencyHeatmap entries={entries} />
      </div>
    </div>
  )
}
