'use client'
import React from 'react'
import CircularProgress from './CircularProgress'
import { AppData } from '../hooks/useAppData'

interface Props {
  data: AppData
  levelProgress: number
  xpToNextLevel: number
  dailyGoals: { questions: number; minutes: number }
}

export default function Dashboard({ data, levelProgress, xpToNextLevel, dailyGoals }: Props) {
  const qPct = Math.min(100, (data.dailyQuestions / dailyGoals.questions) * 100)
  const mPct = Math.min(100, (data.dailyStudyMinutes / dailyGoals.minutes) * 100)
  const underperforming = qPct < 50 || mPct < 50

  const completedChapters = Object.values(data.chapterStatus).filter(s => s === 'completed').length
  const inProgressChapters = Object.values(data.chapterStatus).filter(s => s === 'in_progress').length
  const pendingTasks = data.tasks.filter(t => !t.completed).length
  const overdueTasks = data.tasks.filter(t => !t.completed && t.deadline < new Date().toISOString().split('T')[0]).length

  return (
    <div className="fade-in">
      {/* Warning */}
      {underperforming && (
        <div style={{
          background: 'rgba(255,45,85,0.12)', border: '1px solid rgba(255,45,85,0.3)',
          borderRadius: 12, padding: '14px 18px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 600, color: '#ff2d55', fontSize: 14 }}>You are underperforming today</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
              Complete at least 45 questions and 45 minutes to stay on track.
            </div>
          </div>
        </div>
      )}

      {/* XP / Level Bar */}
      <div className="glass" style={{ padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>LEVEL {data.level}</span>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginTop: 2 }}>
              {data.xp.toLocaleString()} <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>XP total</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            {xpToNextLevel} XP to Level {data.level + 1}
          </div>
        </div>
        <div className="progress-bar-bg" style={{ height: 8 }}>
          <div className="progress-bar-fill" style={{
            width: `${levelProgress}%`,
            background: 'linear-gradient(90deg,#ff2d55,#ff6b6b)',
            boxShadow: '0 0 10px rgba(255,45,85,0.5)',
          }} />
        </div>
      </div>

      {/* Daily Progress */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div className="glass" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
          <CircularProgress
            value={data.dailyQuestions} max={dailyGoals.questions} size={90}
            color="#0a84ff"
            label={`${data.dailyQuestions}`}
            sublabel={`/${dailyGoals.questions}`}
          />
          <div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>QUESTIONS</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0a84ff', marginTop: 4 }}>
              {data.dailyQuestions} <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>/ {dailyGoals.questions}</span>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{Math.round(qPct)}% of daily goal</div>
          </div>
        </div>

        <div className="glass" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
          <CircularProgress
            value={data.dailyStudyMinutes} max={dailyGoals.minutes} size={90}
            color="#00d4ff"
            label={`${data.dailyStudyMinutes}`}
            sublabel="min"
          />
          <div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>STUDY TIME</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#00d4ff', marginTop: 4 }}>
              {data.dailyStudyMinutes} <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>/ {dailyGoals.minutes} min</span>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{Math.round(mPct)}% of daily goal</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Chapters Done', value: completedChapters, color: '#00d4ff' },
          { label: 'In Progress', value: inProgressChapters, color: '#ff9f0a' },
          { label: 'Pending Tasks', value: pendingTasks, color: '#0a84ff' },
          { label: 'Overdue', value: overdueTasks, color: '#ff2d55' },
        ].map(s => (
          <div key={s.label} className="glass" style={{ padding: '16px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Tests */}
      {data.testScores.length > 0 && (
        <div className="glass" style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: 'rgba(255,255,255,0.6)' }}>RECENT TESTS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.testScores.slice(-3).reverse().map(s => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{s.date}</span>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[['Phy', s.physics, '#0a84ff'], ['Chem', s.chemistry, '#ff9f0a'], ['Bio', s.biology, '#30d158']].map(([l, v, c]) => (
                    <span key={l as string} style={{ fontSize: 12, color: c as string }}>
                      {l}: <strong>{v as number}</strong>
                    </span>
                  ))}
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{s.total}/720</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
