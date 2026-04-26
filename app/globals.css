'use client'
import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Dashboard from '../components/Dashboard'
import Tasks from '../components/Tasks'
import Syllabus from '../components/Syllabus'
import Stats from '../components/Stats'
import Timer from '../components/Timer'
import Revision from '../components/Revision'
import Coach from '../components/Coach'
import { useAppData } from '../hooks/useAppData'

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  syllabus: 'Syllabus Tracker',
  tasks: 'Daily Tasks',
  tests: 'Test Analytics',
  revision: 'Revision Planner',
  timer: 'Focus Timer',
  coach: 'AI Coach',
}

export default function Home() {
  const [page, setPage] = useState('dashboard')
  const {
    data, loaded, addTask, completeTask, deleteTask,
    setChapterStatus, addTestScore, addStudyTime, addQuestions,
    dailyGoals, levelProgress, xpToNextLevel,
  } = useAppData()

  if (!loaded) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#000', flexDirection: 'column', gap: 16,
      }}>
        <div style={{ fontSize: 32, fontWeight: 800 }}>
          <span style={{ color: '#ff2d55' }}>NEET</span>
          <span style={{ color: '#fff' }}>Craft</span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Loading your data...</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#040404' }}>
      {/* Sidebar */}
      <Sidebar active={page} onNav={setPage} xp={data.xp} level={data.level} />

      {/* Main */}
      <main style={{ marginLeft: 220, flex: 1, padding: '32px 32px 60px', maxWidth: 'calc(100vw - 220px)' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: '#fff' }}>
            {PAGE_TITLES[page]}
          </h1>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Pages */}
        {page === 'dashboard' && (
          <Dashboard data={data} levelProgress={levelProgress} xpToNextLevel={xpToNextLevel} dailyGoals={dailyGoals} />
        )}
        {page === 'tasks' && (
          <Tasks tasks={data.tasks} onAdd={addTask} onComplete={completeTask} onDelete={deleteTask} />
        )}
        {page === 'syllabus' && (
          <Syllabus chapterStatus={data.chapterStatus} onSetStatus={setChapterStatus} />
        )}
        {page === 'tests' && (
          <Stats testScores={data.testScores} onAdd={addTestScore} />
        )}
        {page === 'timer' && (
          <Timer onStudyTime={addStudyTime} onQuestions={addQuestions} />
        )}
        {page === 'revision' && (
          <Revision revisions={data.revisions} />
        )}
        {page === 'coach' && (
          <Coach data={data} dailyGoals={dailyGoals} />
        )}
      </main>
    </div>
  )
}
