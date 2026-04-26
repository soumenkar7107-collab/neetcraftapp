'use client'
import React, { useState } from 'react'
import { Task } from '../hooks/useAppData'

interface Props {
  tasks: Task[]
  onAdd: (t: Omit<Task, 'id' | 'createdAt'>) => void
  onComplete: (id: string) => void
  onDelete: (id: string) => void
}

const today = () => new Date().toISOString().split('T')[0]

export default function Tasks({ tasks, onAdd, onComplete, onDelete }: Props) {
  const [form, setForm] = useState({ title: '', subject: 'Physics', deadline: today(), xpReward: 20 })
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all')

  const filtered = tasks.filter(t =>
    filter === 'all' ? true : filter === 'pending' ? !t.completed : t.completed
  )

  const isOverdue = (t: Task) => !t.completed && t.deadline < today()

  const submit = () => {
    if (!form.title.trim()) return
    onAdd({ ...form, completed: false })
    setForm({ title: '', subject: 'Physics', deadline: today(), xpReward: 20 })
  }

  return (
    <div className="fade-in">
      {/* Add Task */}
      <div className="glass" style={{ padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>ADD TASK</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <input placeholder="Task title..." value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && submit()}
          />
          <select value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}>
            {['Physics', 'Chemistry', 'Biology', 'Revision', 'Mock Test', 'Other'].map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <input type="date" value={form.deadline}
            onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} />
          <input type="number" placeholder="XP Reward" value={form.xpReward}
            onChange={e => setForm(p => ({ ...p, xpReward: Number(e.target.value) }))} />
        </div>
        <button className="btn-red" style={{ padding: '10px 20px', fontSize: 14 }} onClick={submit}>
          + Add Task
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['all', 'pending', 'done'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
              background: filter === f ? 'rgba(255,45,85,0.15)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${filter === f ? 'rgba(255,45,85,0.3)' : 'rgba(255,255,255,0.08)'}`,
              color: filter === f ? '#ff2d55' : 'rgba(255,255,255,0.5)',
            }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: 13, color: 'rgba(255,255,255,0.3)', alignSelf: 'center' }}>
          {tasks.filter(t => t.completed).length}/{tasks.length} done
        </div>
      </div>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>
            No tasks here
          </div>
        )}
        {filtered.map(task => (
          <div key={task.id} className="glass" style={{
            padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14,
            opacity: task.completed ? 0.5 : 1,
            borderColor: isOverdue(task) ? 'rgba(255,45,85,0.3)' : undefined,
          }}>
            <button onClick={() => !task.completed && onComplete(task.id)}
              style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${task.completed ? '#30d158' : 'rgba(255,255,255,0.2)'}`,
                background: task.completed ? 'rgba(48,209,88,0.2)' : 'transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#30d158', fontSize: 12,
              }}>
              {task.completed ? '✓' : ''}
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, textDecoration: task.completed ? 'line-through' : 'none', fontSize: 14 }}>
                {task.title}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{task.subject}</span>
                <span style={{ fontSize: 12, color: isOverdue(task) ? '#ff2d55' : 'rgba(255,255,255,0.3)' }}>
                  {isOverdue(task) ? '⚠ ' : ''}Due: {task.deadline}
                </span>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#ff9f0a', fontWeight: 600 }}>+{task.xpReward} XP</div>
            <button onClick={() => onDelete(task.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.2)', fontSize: 16, padding: '4px' }}>
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
