'use client'
import React, { useState } from 'react'
import { ChapterStatus } from '../hooks/useAppData'

interface Props {
  chapterStatus: ChapterStatus
  onSetStatus: (id: string, status: ChapterStatus[string]) => void
}

const SYLLABUS = {
  Physics: {
    'Class 11': [
      'Physical World','Units and Measurements','Motion in a Straight Line',
      'Motion in a Plane','Laws of Motion','Work, Energy and Power',
      'System of Particles and Rotational Motion','Gravitation',
      'Mechanical Properties of Solids','Mechanical Properties of Fluids',
      'Thermal Properties of Matter','Thermodynamics','Kinetic Theory',
      'Oscillations','Waves',
    ],
    'Class 12': [
      'Electric Charges and Fields','Electrostatic Potential and Capacitance',
      'Current Electricity','Moving Charges and Magnetism','Magnetism and Matter',
      'Electromagnetic Induction','Alternating Current','Electromagnetic Waves',
      'Ray Optics and Optical Instruments','Wave Optics',
      'Dual Nature of Radiation and Matter','Atoms','Nuclei',
      'Semiconductor Electronics',
    ],
  },
  Chemistry: {
    'Physical Chem (11)': [
      'Some Basic Concepts of Chemistry','Structure of Atom','States of Matter',
      'Thermodynamics','Equilibrium','Redox Reactions',
    ],
    'Physical Chem (12)': [
      'Solid State','Solutions','Electrochemistry','Chemical Kinetics','Surface Chemistry',
    ],
    'Organic Chem (11)': [
      'Organic Chemistry – Basic Principles and Techniques','Hydrocarbons',
    ],
    'Organic Chem (12)': [
      'Haloalkanes and Haloarenes','Alcohols, Phenols and Ethers',
      'Aldehydes, Ketones and Carboxylic Acids','Amines','Biomolecules',
      'Polymers','Chemistry in Everyday Life',
    ],
    'Inorganic Chem (11)': [
      'Classification of Elements and Periodicity',
      'Chemical Bonding and Molecular Structure','Hydrogen',
      's-Block Elements','p-Block Elements (Group 13 & 14)',
    ],
    'Inorganic Chem (12)': [
      'p-Block Elements (Group 15–18)','d- and f-Block Elements',
      'Coordination Compounds','Environmental Chemistry',
    ],
  },
  Biology: {
    'Botany (11)': [
      'The Living World','Biological Classification','Plant Kingdom',
      'Morphology of Flowering Plants','Anatomy of Flowering Plants',
      'Cell: The Unit of Life','Biomolecules','Cell Cycle and Cell Division',
      'Transport in Plants','Mineral Nutrition',
      'Photosynthesis in Higher Plants','Respiration in Plants',
      'Plant Growth and Development',
    ],
    'Zoology (11)': [
      'Structural Organisation in Animals','Animal Kingdom',
      'Digestion and Absorption','Breathing and Exchange of Gases',
      'Body Fluids and Circulation','Excretory Products and Elimination',
      'Locomotion and Movement','Neural Control and Coordination',
      'Chemical Coordination and Integration',
    ],
    'Reproduction (12)': [
      'Reproduction in Organisms','Sexual Reproduction in Flowering Plants',
      'Human Reproduction','Reproductive Health',
    ],
    'Genetics & Evolution (12)': [
      'Principles of Inheritance and Variation',
      'Molecular Basis of Inheritance','Evolution',
    ],
    'Human Welfare (12)': ['Human Health and Disease','Microbes in Human Welfare'],
    'Biotechnology (12)': [
      'Biotechnology: Principles and Processes',
      'Biotechnology and Its Applications',
    ],
    'Ecology (12)': [
      'Organisms and Populations','Ecosystem',
      'Biodiversity and Conservation','Environmental Issues',
    ],
  },
}

const STATUS_CONFIG = {
  not_started: { label: 'Not Started', color: 'rgba(255,255,255,0.15)', text: 'rgba(255,255,255,0.4)' },
  in_progress: { label: 'In Progress', color: 'rgba(255,159,10,0.25)', text: '#ff9f0a' },
  completed: { label: 'Done', color: 'rgba(48,209,88,0.2)', text: '#30d158' },
}

const SUBJECT_COLORS: Record<string, string> = {
  Physics: '#0a84ff',
  Chemistry: '#ff9f0a',
  Biology: '#30d158',
}

export default function Syllabus({ chapterStatus, onSetStatus }: Props) {
  const [activeSubject, setActiveSubject] = useState<keyof typeof SYLLABUS>('Physics')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const subjectData = SYLLABUS[activeSubject]

  const getStats = (subject: string) => {
    const allChapters = Object.values(SYLLABUS[subject as keyof typeof SYLLABUS]).flat()
    const done = allChapters.filter(c => chapterStatus[`${subject}__${c}`] === 'completed').length
    return { done, total: allChapters.length }
  }

  const toggleSection = (key: string) => setExpanded(p => ({ ...p, [key]: !p[key] }))

  return (
    <div className="fade-in">
      {/* Subject Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {(Object.keys(SYLLABUS) as Array<keyof typeof SYLLABUS>).map(sub => {
          const { done, total } = getStats(sub)
          return (
            <button key={sub} onClick={() => setActiveSubject(sub)}
              style={{
                flex: 1, padding: '14px 10px', borderRadius: 12, cursor: 'pointer', border: 'none',
                background: activeSubject === sub ? `rgba(${sub === 'Physics' ? '10,132,255' : sub === 'Chemistry' ? '255,159,10' : '48,209,88'},0.15)` : 'rgba(255,255,255,0.05)',
                borderBottom: `3px solid ${activeSubject === sub ? SUBJECT_COLORS[sub] : 'transparent'}`,
                color: activeSubject === sub ? SUBJECT_COLORS[sub] : 'rgba(255,255,255,0.4)',
                transition: 'all 0.2s',
              }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{sub}</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>{done}/{total} done</div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginTop: 8 }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  width: `${(done / total) * 100}%`,
                  background: SUBJECT_COLORS[sub],
                }} />
              </div>
            </button>
          )
        })}
      </div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Object.entries(subjectData).map(([section, chapters]) => {
          const key = `${activeSubject}__${section}`
          const sectionDone = chapters.filter(c => chapterStatus[`${activeSubject}__${c}`] === 'completed').length
          const isOpen = expanded[key] !== false

          return (
            <div key={section} className="glass">
              <div
                onClick={() => toggleSection(key)}
                style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: SUBJECT_COLORS[activeSubject], fontSize: 14 }}>
                  {isOpen ? '▾' : '▸'}
                </span>
                <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{section}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{sectionDone}/{chapters.length}</span>
              </div>

              {isOpen && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '8px 18px 14px' }}>
                  {chapters.map(ch => {
                    const id = `${activeSubject}__${ch}`
                    const status = (chapterStatus[id] || 'not_started') as keyof typeof STATUS_CONFIG
                    const cfg = STATUS_CONFIG[status]
                    return (
                      <div key={ch} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
                      }}>
                        <div style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{ch}</div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {(['not_started', 'in_progress', 'completed'] as const).map(s => (
                            <button key={s} onClick={() => onSetStatus(id, s)}
                              style={{
                                padding: '4px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                                background: status === s ? STATUS_CONFIG[s].color : 'rgba(255,255,255,0.04)',
                                border: `1px solid ${status === s ? STATUS_CONFIG[s].text + '44' : 'rgba(255,255,255,0.08)'}`,
                                color: status === s ? STATUS_CONFIG[s].text : 'rgba(255,255,255,0.3)',
                                fontWeight: status === s ? 600 : 400,
                                transition: 'all 0.15s',
                              }}>
                              {s === 'not_started' ? '—' : s === 'in_progress' ? '▶' : '✓'}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
