'use client'
import React from 'react'
import { RevisionEntry } from '../hooks/useAppData'

interface Props {
  revisions: RevisionEntry[]
}

const today = () => new Date().toISOString().split('T')[0]

function prettyId(id: string) {
  const parts = id.split('__')
  return parts.slice(1).join(' — ')
}

export default function Revision({ revisions }: Props) {
  const t = today()
  const due = revisions.filter(r => r.nextRevisions.some(d => d <= t))
  const upcoming = revisions.filter(r => r.nextRevisions.some(d => d > t) && !r.nextRevisions.some(d => d <= t))

  const nextDate = (r: RevisionEntry) => r.nextRevisions.find(d => d > t) || '—'
  const overdueCount = (r: RevisionEntry) => r.nextRevisions.filter(d => d < t).length

  return (
    <div className="fade-in">
      {/* Due today */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>
          DUE TODAY / OVERDUE ({due.length})
        </div>
        {due.length === 0 ? (
          <div className="glass" style={{ padding: 30, textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
            No revisions due today 🎉
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {due.map(r => (
              <div key={r.chapterId} className="glass-red" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{prettyId(r.chapterId)}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                    Completed: {r.completedAt}
                    {overdueCount(r) > 0 && <span style={{ color: '#ff2d55', marginLeft: 8 }}>⚠ {overdueCount(r)} overdue</span>}
                  </div>
                </div>
                <span style={{ fontSize: 20 }}>🔁</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>
          UPCOMING ({upcoming.length})
        </div>
        {upcoming.length === 0 ? (
          <div className="glass" style={{ padding: 30, textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
            Complete chapters to schedule revisions
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {upcoming.slice(0, 15).map(r => (
              <div key={r.chapterId} className="glass" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14 }}>{prettyId(r.chapterId)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: '#0a84ff' }}>Next: {nextDate(r)}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                    D1 → D3 → D7 → D14
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
