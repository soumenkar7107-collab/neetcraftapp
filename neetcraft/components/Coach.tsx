'use client'
import React, { useMemo } from 'react'
import { AppData } from '../hooks/useAppData'

interface Props {
  data: AppData
  dailyGoals: { questions: number; minutes: number }
}

export default function Coach({ data, dailyGoals }: Props) {
  const tips = useMemo(() => {
    const list: { icon: string; title: string; desc: string; color: string }[] = []

    const qPct = data.dailyQuestions / dailyGoals.questions
    const mPct = data.dailyStudyMinutes / dailyGoals.minutes

    if (qPct < 0.5) list.push({
      icon: '⚡',
      title: 'Boost your question count',
      desc: `You've solved ${data.dailyQuestions}/${dailyGoals.questions} questions today. Aim for at least 45 before evening.`,
      color: '#ff2d55',
    })

    if (mPct < 0.5) list.push({
      icon: '⏱',
      title: 'Study time is low',
      desc: `Only ${data.dailyStudyMinutes} mins logged. Use the Pomodoro timer to hit 90 minutes.`,
      color: '#ff9f0a',
    })

    const pendingTasks = data.tasks.filter(t => !t.completed)
    if (pendingTasks.length > 3) list.push({
      icon: '✅',
      title: 'Clear your task backlog',
      desc: `${pendingTasks.length} tasks pending. Tackle the highest XP tasks first.`,
      color: '#0a84ff',
    })

    const completedChapters = Object.values(data.chapterStatus).filter(s => s === 'completed').length
    const totalChapters = 97
    const pct = completedChapters / totalChapters
    if (pct < 0.3) list.push({
      icon: '📚',
      title: 'Accelerate syllabus coverage',
      desc: `${completedChapters}/${totalChapters} chapters done (${Math.round(pct * 100)}%). Focus on completing one chapter per day.`,
      color: '#30d158',
    })

    if (data.testScores.length < 3) list.push({
      icon: '📊',
      title: 'Start mock testing',
      desc: 'Log at least 1 mock test per week to track your progress and detect weak areas.',
      color: '#00d4ff',
    })

    const dueRevisions = data.revisions.filter(r =>
      r.nextRevisions.some(d => d <= new Date().toISOString().split('T')[0])
    )
    if (dueRevisions.length > 0) list.push({
      icon: '🔁',
      title: `${dueRevisions.length} revision(s) pending`,
      desc: 'Spaced repetition is key to retention. Open the Revision tab to review.',
      color: '#ff9f0a',
    })

    if (list.length === 0) list.push({
      icon: '🔥',
      title: "You're on track!",
      desc: 'Keep the momentum. Consistency across 365 days is what separates toppers from others.',
      color: '#30d158',
    })

    return list
  }, [data, dailyGoals])

  const level = data.level
  const rank = level < 5 ? 'Aspirant' : level < 10 ? 'Scholar' : level < 20 ? 'Warrior' : level < 35 ? 'Elite' : 'Legend'
  const rankColor = level < 5 ? '#888' : level < 10 ? '#0a84ff' : level < 20 ? '#ff9f0a' : level < 35 ? '#ff2d55' : '#00d4ff'

  return (
    <div className="fade-in">
      {/* Rank Card */}
      <div className="glass" style={{ padding: '24px', marginBottom: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🤖</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>YOUR RANK</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: rankColor, marginBottom: 8 }}>{rank}</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Level {level} — {data.xp.toLocaleString()} XP</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>
          {level < 5 && 'Just getting started. Build the habit.'}
          {level >= 5 && level < 10 && 'Good progress! Stay consistent.'}
          {level >= 10 && level < 20 && 'Strong work. Push harder on weak areas.'}
          {level >= 20 && level < 35 && 'Elite performer. NEET topper material.'}
          {level >= 35 && 'Legendary! You are among the very best.'}
        </div>
      </div>

      {/* Daily Feedback */}
      <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
        TODAY'S COACHING ({tips.length} insights)
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {tips.map((tip, i) => (
          <div key={i} className="glass" style={{
            padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'flex-start',
            borderLeft: `3px solid ${tip.color}`,
          }}>
            <span style={{ fontSize: 22, marginTop: 2 }}>{tip.icon}</span>
            <div>
              <div style={{ fontWeight: 600, color: tip.color, fontSize: 14, marginBottom: 4 }}>{tip.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{tip.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Study Schedule Suggestion */}
      <div className="glass-blue" style={{ padding: '20px 24px', marginTop: 20 }}>
        <div style={{ fontSize: 13, color: '#0a84ff', fontWeight: 600, marginBottom: 12 }}>📅 SUGGESTED DAILY SCHEDULE</div>
        {[
          ['6:00 AM', 'Wake up + 10 min review of yesterday'],
          ['6:15 AM', 'Physics / Chemistry — 2 Pomodoros (50 min)'],
          ['7:15 AM', 'Biology — 2 Pomodoros (50 min)'],
          ['8:15 AM', 'Breakfast + break'],
          ['9:00 AM', 'MCQ practice — 30 questions (30 min)'],
          ['9:30 AM', 'Weak chapter deep study'],
          ['12:00 PM', 'Lunch break'],
          ['2:00 PM', 'Mock test or PYQ practice'],
          ['4:00 PM', 'Revision of completed chapters'],
          ['6:00 PM', 'Evening walk + mental reset'],
          ['7:00 PM', 'Formula revision + short notes'],
          ['9:00 PM', 'Wind down — no new topics'],
        ].map(([time, task]) => (
          <div key={time} style={{ display: 'flex', gap: 16, padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: 12, color: '#0a84ff', width: 60, flexShrink: 0 }}>{time}</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{task}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
