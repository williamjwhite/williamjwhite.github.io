import { useState, useCallback } from 'react'
import type { AnatomyTerm } from '../data/anatomyData'

interface Props {
  terms: AnatomyTerm[]
}

type CardFace = 'term' | 'etymology' | 'definition'
type DeckMode = 'all' | 'etymology' | 'definition' | 'mnemonic'

export function FlashcardGame({ terms }: Props) {
  const [deck, setDeck] = useState<AnatomyTerm[]>([])
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState<Set<string>>(new Set())
  const [unknown, setUnknown] = useState<Set<string>>(new Set())
  const [mode, setMode] = useState<DeckMode>('definition')
  const [phase, setPhase] = useState<'setup' | 'study' | 'done'>('setup')
  const [reviewOnly, setReviewOnly] = useState(false)

  function startDeck() {
    const shuffled = [...terms].sort(() => Math.random() - 0.5)
    setDeck(shuffled)
    setIdx(0)
    setFlipped(false)
    setKnown(new Set())
    setUnknown(new Set())
    setPhase('study')
  }

  function handleKnow() {
    if (!deck[idx]) return
    setKnown(k => new Set([...k, deck[idx].id]))
    advance()
  }

  function handleDontKnow() {
    if (!deck[idx]) return
    setUnknown(k => new Set([...k, deck[idx].id]))
    advance()
  }

  function advance() {
    setFlipped(false)
    setTimeout(() => {
      if (idx + 1 >= deck.length) {
        setPhase('done')
      } else {
        setIdx(i => i + 1)
      }
    }, 150)
  }

  function reviewUnknown() {
    const toReview = deck.filter(t => unknown.has(t.id)).sort(() => Math.random() - 0.5)
    setDeck(toReview)
    setIdx(0)
    setFlipped(false)
    setKnown(new Set())
    setUnknown(new Set())
    setReviewOnly(true)
    setPhase('study')
  }

  if (phase === 'setup') {
    return (
      <div className="game-menu">
        <div className="game-menu-card flashcard-theme">
          <div className="game-icon">🃏</div>
          <h2>Flashcards</h2>
          <p>Study terms with spaced repetition. Mark cards as known or unknown to focus your learning.</p>
          <div className="mode-selector">
            <h4>Study Mode</h4>
            {([
              { id: 'definition', label: '📖 Term → Definition', desc: 'See term, recall definition' },
              { id: 'etymology', label: '🏛️ Term → Etymology', desc: 'See term, recall word origins' },
              { id: 'mnemonic', label: '🧠 Definition → Term', desc: 'See definition, recall term' },
            ] as { id: DeckMode; label: string; desc: string }[]).map(m => (
              <button
                key={m.id}
                className={`mode-select-btn ${mode === m.id ? 'active' : ''}`}
                onClick={() => setMode(m.id)}
              >
                <span>{m.label}</span>
                <span className="mode-select-desc">{m.desc}</span>
              </button>
            ))}
          </div>
          <div className="game-info">
            <span>{terms.length} cards</span>
            <span>·</span>
            <span>Shuffle + track progress</span>
          </div>
          <button className="start-btn" onClick={startDeck}>Start Studying →</button>
        </div>
      </div>
    )
  }

  if (phase === 'done') {
    const total = known.size + unknown.size
    const pct = total > 0 ? Math.round((known.size / total) * 100) : 0

    return (
      <div className="game-result">
        <div className="result-card flashcard-theme">
          <div className="result-icon">{pct >= 80 ? '🌟' : pct >= 60 ? '👍' : '📚'}</div>
          <h3>Session Complete!</h3>
          <div className="result-score">{pct}% Known</div>
          <div className="result-stats">
            <div className="rs-stat good"><span className="rs-val">{known.size}</span><span className="rs-label">✓ Known</span></div>
            <div className="rs-stat bad"><span className="rs-val">{unknown.size}</span><span className="rs-label">✗ Review</span></div>
          </div>
          {unknown.size > 0 && (
            <button className="start-btn" onClick={reviewUnknown}>
              📚 Review {unknown.size} Cards Again
            </button>
          )}
          <button className="outline-btn" onClick={() => setPhase('setup')}>New Session</button>
        </div>
      </div>
    )
  }

  const card = deck[idx]
  if (!card) return null

  const progress = (idx / deck.length) * 100

  return (
    <div className="flashcard-game">
      <div className="game-header">
        <div className="game-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%`, background: '#00b894' }} />
          </div>
          <span>{idx + 1} / {deck.length}</span>
        </div>
        <div className="fc-stats">
          <span className="fc-known">✓ {known.size}</span>
          <span className="fc-unknown">✗ {unknown.size}</span>
        </div>
      </div>

      <div className="fc-wrapper">
        <div
          className={`flashcard ${flipped ? 'flipped' : ''}`}
          style={{ '--card-color': card.color } as React.CSSProperties}
          onClick={() => setFlipped(f => !f)}
        >
          <div className="fc-front">
            <div className="fc-system">{card.system}</div>
            <div className="fc-emoji">{card.emoji}</div>
            <div className="fc-term">{card.term}</div>
            <div className="fc-pronunciation">/{card.pronunciation}/</div>
            <div className="fc-hint">Tap to reveal →</div>
          </div>
          <div className="fc-back">
            <div className="fc-back-label">
              {mode === 'etymology' ? '🏛️ Etymology' : mode === 'mnemonic' ? '🧠 Memory' : '📖 Definition'}
            </div>
            {mode === 'definition' && (
              <p className="fc-back-content">{card.definition}</p>
            )}
            {mode === 'etymology' && (
              <div className="fc-ety">
                <p className="fc-back-content">{card.etymology.fullBreakdown}</p>
                <div className="fc-roots">
                  {card.etymology.roots.map((r, i) => (
                    <div key={i} className="fc-root">
                      <strong>"{r.root}"</strong> ({r.language}) = {r.meaning}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {mode === 'mnemonic' && (
              <div className="fc-mnemonic">
                <p className="fc-back-content">{card.definition}</p>
                {card.mnemonic && (
                  <div className="fc-mnem-box">
                    <span>💡</span> {card.mnemonic}
                  </div>
                )}
                <p className="fc-funfact">🎯 {card.funFact}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {flipped && (
        <div className="fc-actions">
          <button className="fc-btn fc-dont-know" onClick={handleDontKnow}>
            ✗ Still Learning
          </button>
          <button className="fc-btn fc-know" onClick={handleKnow}>
            ✓ Got It!
          </button>
        </div>
      )}

      {!flipped && (
        <div className="fc-skip">
          <button className="skip-btn" onClick={handleDontKnow}>Skip</button>
        </div>
      )}
    </div>
  )
}
