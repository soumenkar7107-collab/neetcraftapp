'use client'
import React, { useState, useEffect, useRef } from 'react'

interface Props {
  onStudyTime: (minutes: number) => void
  onQuestions: (count: number) => void
}

const MODES = [
  { label: 'Focus', duration: 25 * 60, color: '#ff2d55' },
  { label: 'Short Break', duration: 5 * 60, color: '#30d158' },
  { label: 'Long Break', duration: 15 * 60, color: '#0a84ff' },
]

export default function Timer({ onStudyTime, onQuestions }: Props) {
  const [modeIdx, setModeIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(MODES[0].duration)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [qCount, setQCount] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startedRef = useRef<number | null>(null)

  const mode = MODES[modeIdx]

  useEffect(() => {
    setTimeLeft(mode.duration)
    setRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [modeIdx])

  useEffect(() => {
    if (running) {
      startedRef.current = Date.now()
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            setRunning(false)
            if (modeIdx === 0) {
              // Focus session done
              onStudyTime(25)
              setSessions(s => s + 1)
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  const reset = () => {
    setRunning(false)
    setTimeLeft(mode.duration)
  }

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const ss = String(timeLeft % 60).padStart(2, '0')
  const pct = ((mode.duration - timeLeft) / mode.duration) * 100

  const r = 90, circ = 2 * Math.PI * r

  const logQuestions = () => {
    const n = Number(qCount)
    if (n > 0) { onQuestions(n); setQCount('') }
  }

  return (
    <div className="fade-in" style={{ maxWidth: 500, margin: '0 auto' }}>
      {/* Mode Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
        {MODES.map((m, i) => (
          <button key={m.label} onClick={() => setModeIdx(i)}
            style={{
              flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer',
              border: `1px solid ${modeIdx === i ? m.color + '44' : 'rgba(255,255,255,0.08)'}`,
              background: modeIdx === i ? `${m.color}18` : 'rgba(255,255,255,0.04)',
              color: modeIdx === i ? m.color : 'rgba(255,255,255,0.4)',
              fontWeight: modeIdx === i ? 600 : 400, fontSize: 13,
            }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
        <div style={{ position: 'relative', width: 220, height: 220 }}>
          <svg width={220} height={220} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={110} cy={110} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={12} />
            <circle cx={110} cy={110} r={r} fill="none" stroke={mode.color} strokeWidth={12}
              strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear', filter: `drop-shadow(0 0 8px ${mode.color})` }}
            />
          </svg>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)', textAlign: 'center',
          }}>
            <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: 2, color: mode.color,
              textShadow: `0 0 20px ${mode.color}66` }}>
              {mm}:{ss}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{mode.label}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 24 }}>
        <button className="btn-ghost" style={{ padding: '12px 24px', fontSize: 15 }} onClick={reset}>Reset</button>
        <button
          style={{
            padding: '12px 40px', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer',
            background: running ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg,${mode.color},${mode.color}99)`,
            border: `1px solid ${mode.color}44`,
            color: '#fff', transition: 'all 0.2s',
            boxShadow: running ? 'none' : `0 4px 24px ${mode.color}44`,
          }}
          onClick={() => setRunning(!running)}>
          {running ? '⏸ Pause' : '▶ Start'}
        </button>
      </div>

      {/* Sessions */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>SESSIONS TODAY</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {Array.from({ length: Math.max(sessions, 4) }).map((_, i) => (
            <div key={i} style={{
              width: 28, height: 28, borderRadius: '50%',
              background: i < sessions ? 'rgba(255,45,85,0.3)' : 'rgba(255,255,255,0.05)',
              border: `2px solid ${i < sessions ? '#ff2d55' : 'rgba(255,255,255,0.1)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, color: i < sessions ? '#ff2d55' : 'transparent',
            }}>✓</div>
          ))}
        </div>
        <div style={{ marginTop: 8, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
          {sessions * 25} minutes studied
        </div>
      </div>

      {/* Log Questions */}
      <div className="glass" style={{ padding: '16px 20px' }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>LOG QUESTIONS SOLVED</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input type="number" placeholder="Number of questions" value={qCount}
            onChange={e => setQCount(e.target.value)}
            style={{ flex: 1 }}
            onKeyDown={e => e.key === 'Enter' && logQuestions()}
          />
          <button className="btn-blue" style={{ padding: '10px 16px', fontSize: 13, whiteSpace: 'nowrap' }}
            onClick={logQuestions}>
            + Log
          </button>
        </div>
      </div>
    </div>
  )
}
