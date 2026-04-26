'use client'
import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TestScore } from '../hooks/useAppData'

interface Props {
  testScores: TestScore[]
  onAdd: (s: Omit<TestScore, 'id'>) => void
}

const today = () => new Date().toISOString().split('T')[0]

export default function Stats({ testScores, onAdd }: Props) {
  const [form, setForm] = useState({ date: today(), physics: '', chemistry: '', biology: '', notes: '' })
  const [showForm, setShowForm] = useState(false)

  const submit = () => {
    const p = Number(form.physics), c = Number(form.chemistry), b = Number(form.biology)
    if (!p && !c && !b) return
    onAdd({ date: form.date, physics: p, chemistry: c, biology: b, total: p + c + b, notes: form.notes })
    setForm({ date: today(), physics: '', chemistry: '', biology: '', notes: '' })
    setShowForm(false)
  }

  const chartData = testScores.slice(-10).map(s => ({
    date: s.date.slice(5),
    Physics: s.physics,
    Chemistry: s.chemistry,
    Biology: s.biology,
    Total: s.total,
  }))

  const weakSubjects = testScores.length >= 2
    ? (() => {
        const last3 = testScores.slice(-3)
        const avg = (key: 'physics' | 'chemistry' | 'biology') =>
          last3.reduce((a, s) => a + s[key], 0) / last3.length
        return [
          { name: 'Physics', avg: avg('physics'), max: 180 },
          { name: 'Chemistry', avg: avg('chemistry'), max: 180 },
          { name: 'Biology', avg: avg('biology'), max: 360 },
        ].filter(s => s.avg / s.max < 0.5)
      })()
    : []

  return (
    <div className="fade-in">
      {weakSubjects.length > 0 && (
        <div className="glass-red" style={{ padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 18 }}>🎯</span>
          <div>
            <div style={{ fontWeight: 600, color: '#ff2d55', fontSize: 14 }}>Weak Areas Detected</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
              Focus more on: {weakSubjects.map(s => s.name).join(', ')}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
          {testScores.length} tests recorded
        </div>
        <button className="btn-red" style={{ padding: '9px 18px', fontSize: 13 }}
          onClick={() => setShowForm(!showForm)}>
          + Log Test Score
        </button>
      </div>

      {showForm && (
        <div className="glass" style={{ padding: '20px 24px', marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 10 }}>
            <input type="number" placeholder="Physics (0-180)" value={form.physics}
              onChange={e => setForm(p => ({ ...p, physics: e.target.value }))} />
            <input type="number" placeholder="Chemistry (0-180)" value={form.chemistry}
              onChange={e => setForm(p => ({ ...p, chemistry: e.target.value }))} />
            <input type="number" placeholder="Biology (0-360)" value={form.biology}
              onChange={e => setForm(p => ({ ...p, biology: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <input type="date" value={form.date}
              onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            <input placeholder="Notes (optional)" value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          </div>
          <button className="btn-blue" style={{ padding: '10px 20px', fontSize: 13 }} onClick={submit}>
            Save Score
          </button>
        </div>
      )}

      {testScores.length > 0 ? (
        <>
          <div className="glass" style={{ padding: '20px 24px', marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>SCORE TREND</div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" dataKey="Physics" stroke="#0a84ff" strokeWidth={2} dot={{ fill: '#0a84ff' }} />
                <Line type="monotone" dataKey="Chemistry" stroke="#ff9f0a" strokeWidth={2} dot={{ fill: '#ff9f0a' }} />
                <Line type="monotone" dataKey="Biology" stroke="#30d158" strokeWidth={2} dot={{ fill: '#30d158' }} />
                <Line type="monotone" dataKey="Total" stroke="#ff2d55" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass" style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>ALL SCORES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {testScores.slice().reverse().map(s => (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', width: 70 }}>{s.date}</span>
                  <div style={{ display: 'flex', gap: 16, flex: 1 }}>
                    <span style={{ fontSize: 13, color: '#0a84ff' }}>P: {s.physics}</span>
                    <span style={{ fontSize: 13, color: '#ff9f0a' }}>C: {s.chemistry}</span>
                    <span style={{ fontSize: 13, color: '#30d158' }}>B: {s.biology}</span>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 700, color: s.total >= 500 ? '#30d158' : s.total >= 360 ? '#ff9f0a' : '#ff2d55' }}>
                    {s.total}/720
                  </span>
                  {s.notes && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{s.notes}</span>}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="glass" style={{ padding: 60, textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
          <div>No test scores yet. Log your first test!</div>
        </div>
      )}
    </div>
  )
}
