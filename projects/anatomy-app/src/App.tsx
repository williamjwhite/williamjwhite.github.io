import { useState } from 'react'
import { ANATOMY_TERMS, SYSTEM_COLORS, SYSTEM_EMOJIS, type BodySystem } from './data/anatomyData'
import { TermLibrary } from './components/TermLibrary'
import { EtymologyGame } from './games/EtymologyGame'
import { FlashcardGame } from './games/FlashcardGame'
import { ConceptWeb } from './components/ConceptWeb'
import { RootBuilder } from './games/RootBuilder'
import { DiagnosisChallenge } from './games/DiagnosisChallenge'
import { BodySystemExplorer } from './components/BodySystemExplorer'
import { SpellingBee } from './games/SpellingBee'
import { WordChain } from './games/WordChain'
import { ProfessorChat } from './games/ProfessorChat'
import { ProgressTracker } from './components/ProgressTracker'

type Screen = 'home' | 'library' | 'etymology' | 'flashcards' | 'concept-web' | 'root-builder' | 'diagnosis' | 'systems' | 'spelling' | 'word-chain' | 'professor' | 'progress'

const SCREENS = [
  { id: 'library' as Screen, label: 'Term Library', emoji: '📚', description: 'Browse all anatomy terms with etymology', color: '#6c5ce7', category: 'explore' },
  { id: 'systems' as Screen, label: 'Body Systems', emoji: '🫁', description: 'Explore all 10 body systems in depth', color: '#55efc4', category: 'explore' },
  { id: 'concept-web' as Screen, label: 'Concept Web', emoji: '🕸️', description: 'Visualize how concepts connect', color: '#74b9ff', category: 'explore' },
  { id: 'flashcards' as Screen, label: 'Flashcards', emoji: '🃏', description: 'Rapid-fire term review', color: '#00b894', category: 'practice' },
  { id: 'etymology' as Screen, label: 'Etymology Quiz', emoji: '🏛️', description: 'Decode word roots & origins', color: '#e17055', category: 'practice' },
  { id: 'root-builder' as Screen, label: 'Root Builder', emoji: '🧩', description: 'Assemble terms from word roots', color: '#fdcb6e', category: 'practice' },
  { id: 'diagnosis' as Screen, label: 'Diagnosis Challenge', emoji: '🔬', description: 'Match symptoms to conditions', color: '#e84393', category: 'practice' },
  { id: 'spelling' as Screen, label: 'Spelling Bee', emoji: '🐝', description: 'Spell complex medical terms correctly', color: '#f9ca24', category: 'practice' },
  { id: 'word-chain' as Screen, label: 'Word Chain', emoji: '⛓️', description: 'Connect terms via etymology roots', color: '#a29bfe', category: 'practice' },
  { id: 'professor' as Screen, label: 'Ask the Professor', emoji: '👨‍🏫', description: 'AI tutor explains anatomy & etymology', color: '#fd79a8', category: 'ai' },
  { id: 'progress' as Screen, label: 'My Progress', emoji: '📈', description: 'Track XP, achievements, and study stats', color: '#00cec9', category: 'meta' },
]

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedSystem, setSelectedSystem] = useState<BodySystem | null>(null)

  const filteredTerms = selectedSystem
    ? ANATOMY_TERMS.filter(t => t.system === selectedSystem)
    : ANATOMY_TERMS

  const noFilter = screen === 'professor' || screen === 'progress' || screen === 'concept-web' || screen === 'word-chain' || screen === 'systems'

  return (
    <div className="app">
      {screen !== 'home' && (
        <header className="app-header">
          <button className="back-btn" onClick={() => setScreen('home')}>
            ← Back
          </button>
          <div className="header-title">
            {SCREENS.find(s => s.id === screen)?.emoji}{' '}
            {SCREENS.find(s => s.id === screen)?.label}
          </div>
          {!noFilter ? (
            <div className="system-filter">
              <select
                value={selectedSystem || ''}
                onChange={e => setSelectedSystem(e.target.value as BodySystem || null)}
              >
                <option value="">All Systems</option>
                {Object.entries(SYSTEM_EMOJIS).map(([sys, emoji]) => (
                  <option key={sys} value={sys}>
                    {emoji} {sys.charAt(0).toUpperCase() + sys.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div style={{ width: 140 }} />
          )}
        </header>
      )}

      {screen === 'home' && <HomeScreen onNavigate={setScreen} />}
      {screen === 'library' && <TermLibrary terms={filteredTerms} />}
      {screen === 'etymology' && <EtymologyGame terms={filteredTerms} />}
      {screen === 'flashcards' && <FlashcardGame terms={filteredTerms} />}
      {screen === 'concept-web' && <ConceptWeb terms={ANATOMY_TERMS} />}
      {screen === 'root-builder' && <RootBuilder terms={filteredTerms} />}
      {screen === 'diagnosis' && <DiagnosisChallenge terms={filteredTerms} />}
      {screen === 'systems' && <BodySystemExplorer terms={ANATOMY_TERMS} />}
      {screen === 'spelling' && <SpellingBee terms={filteredTerms} />}
      {screen === 'word-chain' && <WordChain terms={ANATOMY_TERMS} />}
      {screen === 'professor' && <ProfessorChat terms={ANATOMY_TERMS} />}
      {screen === 'progress' && <ProgressTracker terms={ANATOMY_TERMS} />}
    </div>
  )
}

function HomeScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const exploreScreens = SCREENS.filter(s => s.category === 'explore')
  const practiceScreens = SCREENS.filter(s => s.category === 'practice')
  const specialScreens = SCREENS.filter(s => s.category === 'ai' || s.category === 'meta')

  return (
    <div className="home">
      <div className="home-hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-badge">Interactive Learning Platform</div>
          <h1 className="hero-title">
            <span className="title-line1">Anatomy &</span>
            <span className="title-line2">Physiology</span>
          </h1>
          <p className="hero-subtitle">
            Master medical terminology through etymology, interactive games, and AI-powered learning
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">{ANATOMY_TERMS.length}</span>
              <span className="stat-label">Terms</span>
            </div>
            <div className="stat-div" />
            <div className="stat">
              <span className="stat-num">{Object.keys(SYSTEM_COLORS).length}</span>
              <span className="stat-label">Systems</span>
            </div>
            <div className="stat-div" />
            <div className="stat">
              <span className="stat-num">10</span>
              <span className="stat-label">Game Modes</span>
            </div>
            <div className="stat-div" />
            <div className="stat">
              <span className="stat-num">AI</span>
              <span className="stat-label">Professor</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <BodyOrb />
        </div>
      </div>

      <div className="home-sections">
        <div className="home-section">
          <div className="section-label">🔍 Explore</div>
          <div className="home-grid home-grid-3">
            {exploreScreens.map((s, i) => (
              <HomeCard key={s.id} screen={s} index={i} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

        <div className="home-section">
          <div className="section-label">🎮 Practice & Games</div>
          <div className="home-grid home-grid-wide">
            {practiceScreens.map((s, i) => (
              <HomeCard key={s.id} screen={s} index={i} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

        <div className="home-section">
          <div className="section-label">✨ Special Features</div>
          <div className="home-grid home-grid-2">
            {specialScreens.map((s, i) => (
              <HomeCard key={s.id} screen={s} index={i} featured onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </div>

      <div className="home-systems">
        <h2>10 Body Systems</h2>
        <div className="system-chips">
          {Object.entries(SYSTEM_COLORS).map(([sys, color]) => (
            <div
              key={sys}
              className="sys-chip"
              style={{ background: color + '22', border: `1px solid ${color}55`, color }}
            >
              {SYSTEM_EMOJIS[sys as BodySystem]} {sys}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function HomeCard({
  screen: s,
  index,
  featured,
  onNavigate,
}: {
  screen: typeof SCREENS[0]
  index: number
  featured?: boolean
  onNavigate: (s: Screen) => void
}) {
  return (
    <button
      className={`mode-card ${featured ? 'mode-card-featured' : ''}`}
      style={{ '--card-color': s.color, animationDelay: `${index * 0.07}s` } as React.CSSProperties}
      onClick={() => onNavigate(s.id)}
    >
      <div className="card-emoji">{s.emoji}</div>
      <div className="card-body">
        <div className="card-label">{s.label}</div>
        <div className="card-desc">{s.description}</div>
      </div>
      <div className="card-arrow">→</div>
    </button>
  )
}

function BodyOrb() {
  const systems = Object.entries(SYSTEM_COLORS)
  return (
    <div className="body-orb">
      <div className="orb-ring orb-ring-1" />
      <div className="orb-ring orb-ring-2" />
      <div className="orb-ring orb-ring-3" />
      {systems.map(([sys, color], i) => {
        const angle = (i / systems.length) * Math.PI * 2
        const r = 90
        const x = 50 + Math.cos(angle) * r
        const y = 50 + Math.sin(angle) * r
        return (
          <div
            key={sys}
            className="orb-dot"
            style={{ left: `${x}%`, top: `${y}%`, background: color, animationDelay: `${i * 0.2}s` }}
            title={sys}
          >
            {SYSTEM_EMOJIS[sys as BodySystem]}
          </div>
        )
      })}
      <div className="orb-center">🫀</div>
    </div>
  )
}

export default App
