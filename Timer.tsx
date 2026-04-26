'use client'
import React from 'react'

interface SidebarProps {
  active: string
  onNav: (page: string) => void
  xp: number
  level: number
}

const navItems = [
  { id: 'dashboard', icon: '⚡', label: 'Dashboard' },
  { id: 'syllabus', icon: '📚', label: 'Syllabus' },
  { id: 'tasks', icon: '✅', label: 'Tasks' },
  { id: 'tests', icon: '📊', label: 'Tests' },
  { id: 'revision', icon: '🔁', label: 'Revision' },
  { id: 'timer', icon: '⏱', label: 'Timer' },
  { id: 'coach', icon: '🤖', label: 'AI Coach' },
]

export default function Sidebar({ active, onNav, xp, level }: SidebarProps) {
  return (
    <div style={{
      width: 220,
      minHeight: '100vh',
      background: 'rgba(10,10,10,0.95)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 12px',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 32, paddingLeft: 8 }}>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>
          <span className="neon-text-red">NEET</span>
          <span style={{ color: '#fff' }}>Craft</span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
          Premium Prep System
        </div>
      </div>

      {/* XP Badge */}
      <div className="glass-red" style={{ padding: '12px 14px', marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>YOUR RANK</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#ff2d55' }}>Level {level}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{xp.toLocaleString()} XP</div>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,45,85,0.2)',
            border: '2px solid #ff2d55',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, color: '#ff2d55',
          }}>
            {level}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map(item => (
          <div
            key={item.id}
            className={`sidebar-link${active === item.id ? ' active' : ''}`}
            onClick={() => onNav(item.id)}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Bottom tag */}
      <div style={{ paddingLeft: 8, fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 16 }}>
        NEET 2026 — Drop Year
      </div>
    </div>
  )
}
