'use client'
import React from 'react'

interface Props {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
  sublabel?: string
}

export default function CircularProgress({
  value, max, size = 120, strokeWidth = 10,
  color = '#ff2d55', label, sublabel
}: Props) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.min(1, value / (max || 1))
  const offset = circ * (1 - pct)

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease', filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        textAlign: 'center',
      }}>
        {label && <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{label}</div>}
        {sublabel && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{sublabel}</div>}
      </div>
    </div>
  )
}
