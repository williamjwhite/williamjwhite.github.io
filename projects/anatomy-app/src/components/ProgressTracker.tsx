import { useState, useEffect } from 'react'
import type { AnatomyTerm, BodySystem } from '../data/anatomyData'
import { SYSTEM_COLORS, SYSTEM_EMOJIS } from '../data/anatomyData'

interface Props { terms: AnatomyTerm[] }

interface StudyStats {
  termsViewed: Set<string>
  gamesPlayed: Record<string, number>
  totalScore: number
  streak: number
  lastStudied: string
  systemProgress: Record<string, number>
}

const ACHIEVEMENTS = [
  { id: 'first_term', emoji: '🌱', title: 'First Steps', desc: 'View your first anatomy term', condition: (s: StudyStats) => s.termsViewed.size >= 1 },
  { id: 'ten_terms', emoji: '📚', title: 'Studious', desc: 'View 10 different terms', condition: (s: StudyStats) => s.termsViewed.size >= 10 },
  { id: 'all_terms', emoji: '🏆', title: 'Encyclopedia', desc: 'View all available terms', condition: (s: StudyStats, total: number) => s.termsViewed.size >= total },
  { id: 'etymology_master', emoji: '🏛️', title: 'Etymology Master', desc: 'Play Etymology Quiz 3 times', condition: (s: StudyStats) => (s.gamesPlayed['etymology'] || 0) >= 3 },
  { id: 'spelling_bee', emoji: '🐝', title: 'Spelling Bee', desc: 'Play Spelling Bee 2 times', condition: (s: StudyStats) => (s.gamesPlayed['spelling'] || 0) >= 2 },
  { id: 'chain_explorer', emoji: '⛓️', title: 'Chain Explorer', desc: 'Play Word Chain once', condition: (s: StudyStats) => (s.gamesPlayed['chain'] || 0) >= 1 },
  { id: 'all_systems', emoji: '🌐', title: 'Full Body', desc: 'Explore all 10 body systems', condition: (s: StudyStats) => Object.keys(s.systemProgress).length >= 10 },
  { id: 'professor', emoji: '👨‍🏫', title: 'Office Hours', desc: 'Ask the AI professor a question', condition: (s: StudyStats) => (s.gamesPlayed['professor'] || 0) >= 1 },
]

const DEMO_STATS: StudyStats = {
  termsViewed: new Set(['cardiac', 'neuron', 'alveoli', 'homeostasis', 'erythrocyte']),
  gamesPlayed: { etymology: 2, flashcards: 3, spelling: 1 },
  totalScore: 127,
  streak: 3,
  lastStudied: new Date().toLocaleDateString(),
  systemProgress: { cardiovascular: 75, nervous: 60, respiratory: 40 },
}

export function ProgressTracker({ terms }: Props) {
  const [stats] = useState<StudyStats>(DEMO_STATS)
  const [tab, setTab] = useState<'overview' | 'achievements' | 'systems'>('overview')

  const totalTerms = terms.length
  const pctViewed = Math.round((stats.termsViewed.size / totalTerms) * 100)

  const unlockedAchievements = ACHIEVEMENTS.filter(a => a.condition(stats, totalTerms))
  const lockedAchievements = ACHIEVEMENTS.filter(a => !a.condition(stats, totalTerms))

  const xp = stats.totalScore + stats.termsViewed.size * 5 + Object.values(stats.gamesPlayed).reduce((a, b) => a + b, 0) * 10
  const level = Math.floor(xp / 100) + 1
  const xpInLevel = xp % 100

  const systemStats = Object.entries(SYSTEM_COLORS).map(([sys]) => {
    const sysTerms = terms.filter(t => t.system === sys)
    const viewed = sysTerms.filter(t => stats.termsViewed.has(t.id)).length
    return { system: sys as BodySystem, total: sysTerms.length, viewed }
  })

  return (
    <div className="progress-tracker">
      <div className="pt-hero">
        <div className="pt-level-badge">
          <div className="pt-level-num">Lv.{level}</div>
          <div className="pt-level-label">Anatomist</div>
        </div>
        <div className="pt-xp-section">
          <div className="pt-xp-label">{xp} XP · {xpInLevel}/100 to next level</div>
          <div className="pt-xp-bar">
            <div className="pt-xp-fill" style={{ width: `${xpInLevel}%` }} />
          </div>
        </div>
        <div className="pt-streak">
          <span className="pt-streak-fire">🔥</span>
          <span>{stats.streak} day streak</span>
        </div>
      </div>

      <div className="pt-quick-stats">
        <div className="pt-qs">
          <div className="pt-qs-val">{stats.termsViewed.size}</div>
          <div className="pt-qs-label">Terms Studied</div>
        </div>
        <div className="pt-qs">
          <div className="pt-qs-val">{pctViewed}%</div>
          <div className="pt-qs-label">Coverage</div>
        </div>
        <div className="pt-qs">
          <div className="pt-qs-val">{Object.values(stats.gamesPlayed).reduce((a, b) => a + b, 0)}</div>
          <div className="pt-qs-label">Games Played</div>
        </div>
        <div className="pt-qs">
          <div className="pt-qs-val">{unlockedAchievements.length}</div>
          <div className="pt-qs-label">Achievements</div>
        </div>
      </div>

      <div className="detail-tabs" style={{ padding: '0 24px', borderBottom: '1px solid var(--border)' }}>
        {(['overview', 'achievements', 'systems'] as const).map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ '--term-color': '#7c6af7' } as React.CSSProperties}>
            {t === 'overview' ? '📊' : t === 'achievements' ? '🏆' : '🗺️'} {t}
          </button>
        ))}
      </div>

      <div className="pt-content">
        {tab === 'overview' && (
          <div className="pt-overview">
            <div className="pt-section">
              <h3>Study Progress</h3>
              <div className="pt-progress-bar-big">
                <div className="pt-progress-fill-big" style={{ width: `${pctViewed}%` }} />
                <span className="pt-progress-label">{stats.termsViewed.size} / {totalTerms} terms</span>
              </div>
            </div>
            <div className="pt-section">
              <h3>Games Played</h3>
              <div className="pt-games-list">
                {[
                  { id: 'etymology', label: 'Etymology Quiz', emoji: '🏛️' },
                  { id: 'flashcards', label: 'Flashcards', emoji: '🃏' },
                  { id: 'spelling', label: 'Spelling Bee', emoji: '🐝' },
                  { id: 'root-builder', label: 'Root Builder', emoji: '🧩' },
                  { id: 'diagnosis', label: 'Diagnosis Challenge', emoji: '🔬' },
                  { id: 'chain', label: 'Word Chain', emoji: '⛓️' },
                  { id: 'professor', label: 'Ask the Professor', emoji: '👨‍🏫' },
                ].map(game => (
                  <div key={game.id} className="pt-game-row">
                    <span>{game.emoji} {game.label}</span>
                    <div className="pt-game-count">
                      <div className="pt-game-bar">
                        <div style={{ width: `${Math.min((stats.gamesPlayed[game.id] || 0) * 20, 100)}%`, height: '100%', background: 'var(--accent)', borderRadius: '100px' }} />
                      </div>
                      <span>{stats.gamesPlayed[game.id] || 0}×</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'achievements' && (
          <div className="pt-achievements">
            {unlockedAchievements.length > 0 && (
              <div className="pt-section">
                <h3>Unlocked ({unlockedAchievements.length})</h3>
                <div className="achievements-grid">
                  {unlockedAchievements.map(a => (
                    <div key={a.id} className="achievement-card unlocked">
                      <div className="ach-emoji">{a.emoji}</div>
                      <div className="ach-title">{a.title}</div>
                      <div className="ach-desc">{a.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="pt-section">
              <h3>Locked ({lockedAchievements.length})</h3>
              <div className="achievements-grid">
                {lockedAchievements.map(a => (
                  <div key={a.id} className="achievement-card locked">
                    <div className="ach-emoji locked-emoji">🔒</div>
                    <div className="ach-title">{a.title}</div>
                    <div className="ach-desc">{a.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'systems' && (
          <div className="pt-systems">
            {systemStats.map(({ system, total, viewed }) => (
              <div key={system} className="pt-system-row">
                <div className="pt-sys-info">
                  <span>{SYSTEM_EMOJIS[system]}</span>
                  <span className="pt-sys-name" style={{ color: SYSTEM_COLORS[system], textTransform: 'capitalize' }}>{system}</span>
                </div>
                <div className="pt-sys-bar-wrap">
                  <div className="pt-sys-bar">
                    <div
                      className="pt-sys-fill"
                      style={{ width: `${total > 0 ? (viewed / total) * 100 : 0}%`, background: SYSTEM_COLORS[system] }}
                    />
                  </div>
                  <span className="pt-sys-count">{viewed}/{total}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
