'use client'
import { useState, useEffect, useCallback } from 'react'

export interface Task {
  id: string
  title: string
  subject: string
  deadline: string
  completed: boolean
  xpReward: number
  createdAt: string
}

export interface TestScore {
  id: string
  date: string
  physics: number
  chemistry: number
  biology: number
  total: number
  notes: string
}

export interface ChapterStatus {
  [key: string]: 'not_started' | 'in_progress' | 'completed'
}

export interface RevisionEntry {
  chapterId: string
  completedAt: string
  nextRevisions: string[]
}

export interface AppData {
  xp: number
  level: number
  tasks: Task[]
  chapterStatus: ChapterStatus
  testScores: TestScore[]
  revisions: RevisionEntry[]
  dailyStudyMinutes: number
  dailyQuestions: number
  lastReset: string
  studyLog: { date: string; minutes: number; questions: number }[]
}

const DAILY_GOALS = { questions: 90, minutes: 90 }

function calcLevel(xp: number) {
  return Math.floor(Math.pow(xp / 100, 0.6)) + 1
}

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

const defaultData: AppData = {
  xp: 0,
  level: 1,
  tasks: [],
  chapterStatus: {},
  testScores: [],
  revisions: [],
  dailyStudyMinutes: 0,
  dailyQuestions: 0,
  lastReset: todayStr(),
  studyLog: [],
}

export function useAppData() {
  const [data, setData] = useState<AppData>(defaultData)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('neetcraft_data')
      if (raw) {
        const parsed: AppData = JSON.parse(raw)
        // Reset daily counters if new day
        if (parsed.lastReset !== todayStr()) {
          if (parsed.dailyStudyMinutes > 0 || parsed.dailyQuestions > 0) {
            parsed.studyLog = [...(parsed.studyLog || []), {
              date: parsed.lastReset,
              minutes: parsed.dailyStudyMinutes,
              questions: parsed.dailyQuestions,
            }].slice(-30)
          }
          parsed.dailyStudyMinutes = 0
          parsed.dailyQuestions = 0
          parsed.lastReset = todayStr()
          // XP penalty for unfinished tasks
          const overdue = (parsed.tasks || []).filter(t => !t.completed && t.deadline < todayStr())
          if (overdue.length > 0) {
            parsed.xp = Math.max(0, parsed.xp - overdue.length * 10)
          }
        }
        setData(parsed)
      }
    } catch {}
    setLoaded(true)
  }, [])

  const save = useCallback((updated: AppData) => {
    updated.level = calcLevel(updated.xp)
    setData(updated)
    localStorage.setItem('neetcraft_data', JSON.stringify(updated))
  }, [])

  const addXP = useCallback((amount: number) => {
    setData(prev => {
      const updated = { ...prev, xp: Math.max(0, prev.xp + amount) }
      updated.level = calcLevel(updated.xp)
      localStorage.setItem('neetcraft_data', JSON.stringify(updated))
      return updated
    })
  }, [])

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    setData(prev => {
      const updated = {
        ...prev,
        tasks: [...prev.tasks, { ...task, id: Date.now().toString(), createdAt: todayStr() }]
      }
      localStorage.setItem('neetcraft_data', JSON.stringify(updated))
      return updated
    })
  }, [])

  const completeTask = useCallback((id: string) => {
    setData(prev => {
      const task = prev.tasks.find(t => t.id === id)
      if (!task || task.completed) return prev
      const updated = {
        ...prev,
        tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: true } : t),
        xp: prev.xp + task.xpReward,
      }
      updated.level = calcLevel(updated.xp)
      localStorage.setItem('neetcraft_data', JSON.stringify(updated))
      return updated
    })
  }, [])

  const deleteTask = useCallback((id: string) => {
    setData(prev => {
      const updated = { ...prev, tasks: prev.tasks.filter(t => t.id !== id) }
      localStorage.setItem('neetcraft_data', JSON.stringify(updated))
      return updated
    })
  }, [])

  const setChapterStatus = useCallback((chapterId: string, status: ChapterStatus[string]) => {
    setData(prev => {
      const updated = { ...prev, chapterStatus: { ...prev.chapterStatus, [chapterId]: status } }
      if (status === 'completed' && prev.chapterStatus[chapterId] !== 'completed') {
        updated.xp = prev.xp + 50
        updated.level = calcLevel(updated.xp)
        // Add revision schedule
        const today = todayStr()
        const rev: RevisionEntry = {
          chapterId,
          completedAt: today,
          nextRevisions: [addDays(today,1), addDays(today,3), addDays(today,7), addDays(today,14)],
        }
        updated.revisions = [...prev.revisions.filter(r => r.chapterId !== chapterId), rev]
      }
      localStorage.setItem('neetcraft_data', JSON.stringify(updated))
      return updated
    })
  }, [])

  const addTestScore = useCallback((score: Omit<TestScore, 'id'>) => {
    setData(prev => {
      const updated = {
        ...prev,
        testScores: [...prev.testScores, { ...score, id: Date.now().toString() }],
        xp: prev.xp + 30,
      }
      updated.level = calcLevel(updated.xp)
      localStorage.setItem('neetcraft_data', JSON.stringify(updated))
      return updated
    })
  }, [])

  const addStudyTime = useCallback((minutes: number) => {
    setData(prev => {
      const updated = {
        ...prev,
        dailyStudyMinutes: prev.dailyStudyMinutes + minutes,
        xp: prev.xp + Math.floor(minutes / 10) * 5,
      }
      updated.level = calcLevel(updated.xp)
      localStorage.setItem('neetcraft_data', JSON.stringify(updated))
      return updated
    })
  }, [])

  const addQuestions = useCallback((count: number) => {
    setData(prev => {
      const updated = { ...prev, dailyQuestions: prev.dailyQuestions + count, xp: prev.xp + count * 2 }
      updated.level = calcLevel(updated.xp)
      localStorage.setItem('neetcraft_data', JSON.stringify(updated))
      return updated
    })
  }, [])

  const xpForNextLevel = (level: number) => Math.pow(level, 1/0.6) * 100
  const currentLevelXP = xpForNextLevel(data.level - 1)
  const nextLevelXP = xpForNextLevel(data.level)
  const levelProgress = Math.min(100, ((data.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100)

  return {
    data, loaded, addXP, addTask, completeTask, deleteTask,
    setChapterStatus, addTestScore, addStudyTime, addQuestions,
    dailyGoals: DAILY_GOALS, levelProgress,
    xpToNextLevel: Math.ceil(nextLevelXP - data.xp),
  }
}
