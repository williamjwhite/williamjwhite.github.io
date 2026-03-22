import { useState, useEffect, useRef } from 'react'
import type { AnatomyTerm } from '../data/anatomyData'

interface Props { terms: AnatomyTerm[] }

interface Round {
  term: AnatomyTerm
  attempts: number
  solved: boolean
  skipped: boolean
  hintsUsed: number
}

export function SpellingBee({ terms }: Props) {
  const [phase, setPhase] = useState<'menu' | 'playing' | 'done'>('menu')
  const [queue, setQueue] = useState<AnatomyTerm[]>([])
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong' | 'close'>('idle')
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [rounds, setRounds] = useState<Round[]>([])
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)

  function startGame() {
    const shuffled = [...terms]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(8, terms.length))
    setQueue(shuffled)
    setIdx(0)
    setInput('')
    setFeedback('idle')
    setHintsRevealed(0)
    setRounds([])
    setShowAnswer(false)
    setScore(0)
    setPhase('playing')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const currentTerm = queue[idx]

  function checkSpelling() {
    if (!currentTerm || !input.trim()) return
    const typed = input.trim().toLowerCase()
    const correct = currentTerm.term.toLowerCase()

    if (typed === correct) {
      const pts = Math.max(3 - (rounds[idx]?.attempts || 0), 1) + (hintsRevealed === 0 ? 2 : 0)
      setScore(s => s + pts)
      setFeedback('correct')
      const newRound: Round = {
        term: currentTerm,
        attempts: (rounds[idx]?.attempts || 0) + 1,
        solved: true,
        skipped: false,
        hintsUsed: hintsRevealed,
      }
      setRounds(r => {
        const updated = [...r]
        updated[idx] = newRound
        return updated
      })
      setTimeout(() => advance(true), 1000)
    } else {
      // Check how close
      const similarity = levenshtein(typed, correct)
      const isClose = similarity <= 2
      setFeedback(isClose ? 'close' : 'wrong')
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setRounds(r => {
        const updated = [...r]
        updated[idx] = { ...(updated[idx] || { term: currentTerm, solved: false, skipped: false, hintsUsed: 0 }), attempts: (updated[idx]?.attempts || 0) + 1 }
        return updated
      })
      setTimeout(() => setFeedback('idle'), 1500)
    }
    setInput('')
  }

  function levenshtein(a: string, b: string): number {
    const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
      Array.from({ length: b.length + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0)
    )
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
      }
    }
    return dp[a.length][b.length]
  }

  function advance(solved: boolean) {
    if (!solved) {
      setRounds(r => {
        const updated = [...r]
        updated[idx] = { term: currentTerm, attempts: updated[idx]?.attempts || 0, solved: false, skipped: true, hintsUsed: hintsRevealed }
        return updated
      })
    }
    if (idx + 1 >= queue.length) {
      setPhase('done')
    } else {
      setIdx(i => i + 1)
      setInput('')
      setFeedback('idle')
      setHintsRevealed(0)
      setShowAnswer(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  function getHint() {
    setHintsRevealed(h => h + 1)
  }

  function getLetterHint() {
    if (!currentTerm) return ''
    const word = currentTerm.term
    // Reveal letters progressively
    if (hintsRevealed === 0) return word[0] + '_'.repeat(word.length - 1)
    if (hintsRevealed === 1) return word[0] + '_'.repeat(Math.floor(word.length / 2) - 1) + word[Math.floor(word.length / 2)] + '_'.repeat(word.length - Math.floor(word.length / 2) - 1)
    if (hintsRevealed === 2) return word.split('').map((c, i) => i % 2 === 0 ? c : '_').join('')
    return word
  }

  // Color-code the typed letters against the answer
  function renderColorInput() {
    if (!currentTerm || feedback === 'idle') return null
    const typed = input || (feedback === 'correct' ? currentTerm.term : '')
    const correct = currentTerm.term
    return (
      <div className="spelling-color-feedback">
        {correct.split('').map((ch, i) => {
          const typedCh = typed[i]
          let cls = 'scf-char'
          if (!typedCh) cls += ' scf-missing'
          else if (typedCh.toLowerCase() === ch.toLowerCase()) cls += ' scf-correct'
          else cls += ' scf-wrong'
          return <span key={i} className={cls}>{typedCh || ch}</span>
        })}
        {typed.length > correct.length && (
          typed.slice(correct.length).split('').map((ch, i) => (
            <span key={`extra-${i}`} className="scf-char scf-extra">{ch}</span>
          ))
        )}
      </div>
    )
  }

  if (phase === 'menu') {
    return (
      <div className="game-menu">
        <div className="game-menu-card spelling-theme">
          <div className="game-icon">🐝</div>
          <h2>Medical Spelling Bee</h2>
          <p>Read the definition and etymology clues, then spell the medical term correctly. Fewer hints = more points!</p>
          <div className="game-features">
            <div className="gf-item">📖 Definition + etymology clues</div>
            <div className="gf-item">💡 Progressive letter hints</div>
            <div className="gf-item">🎨 Letter-by-letter feedback</div>
            <div className="gf-item">⭐ Bonus points for no hints</div>
          </div>
          <div className="scoring-info">
            <h4>Scoring</h4>
            <div className="score-table">
              <div>First try, no hints → <strong>5 pts</strong></div>
              <div>With hints → <strong>1–3 pts</strong></div>
            </div>
          </div>
          <button className="start-btn" onClick={startGame}>Start Spelling →</button>
        </div>
      </div>
    )
  }

  if (phase === 'done') {
    const maxScore = queue.length * 5
    const solved = rounds.filter(r => r.solved).length
    return (
      <div className="game-result">
        <div className="result-card spelling-theme">
          <div className="result-icon">{score >= maxScore * 0.8 ? '🏆' : score >= maxScore * 0.5 ? '🥈' : '📚'}</div>
          <h3>Spelling Bee Complete!</h3>
          <div className="result-score">{score}<span style={{ fontSize: '0.5em' }}>/{maxScore}</span></div>
          <div className="result-stats">
            <div className="rs-stat good"><span className="rs-val">{solved}</span><span className="rs-label">✓ Spelled</span></div>
            <div className="rs-stat bad"><span className="rs-val">{queue.length - solved}</span><span className="rs-label">✗ Missed</span></div>
          </div>
          <div className="result-review">
            {rounds.map((r, i) => r && (
              <div key={i} className={`review-item ${r.solved ? 'correct' : 'wrong'}`}>
                <span>{r.solved ? '✓' : '✗'}</span>
                <span style={{ flex: 1 }}>{r.term.term}</span>
                {r.solved && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {r.hintsUsed === 0 ? '🌟 no hints' : `${r.hintsUsed} hint${r.hintsUsed > 1 ? 's' : ''}`}
                </span>}
              </div>
            ))}
          </div>
          <button className="start-btn" onClick={startGame}>Play Again</button>
          <button className="outline-btn" onClick={() => setPhase('menu')}>Back</button>
        </div>
      </div>
    )
  }

  if (!currentTerm) return null

  const progress = (idx / queue.length) * 100
  const hintDisplay = hintsRevealed > 0 ? getLetterHint() : null

  return (
    <div className="spelling-game">
      <div className="game-header">
        <div className="game-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%`, background: '#f9ca24' }} />
          </div>
          <span>{idx + 1} / {queue.length}</span>
        </div>
        <span className="game-score-display">Score: {score}</span>
      </div>

      <div className="spelling-card">
        <div className="spelling-system">
          <span style={{ background: currentTerm.color + '22', color: currentTerm.color, padding: '4px 12px', borderRadius: '100px', fontSize: 12, fontWeight: 600 }}>
            {currentTerm.emoji} {currentTerm.system} · {currentTerm.category}
          </span>
        </div>

        <div className="spelling-definition">
          <h3>What term is being described?</h3>
          <p className="spelling-def-text">{currentTerm.definition}</p>
        </div>

        <div className="spelling-etymology">
          <div className="ety-clue-header">🏛️ Etymology clue</div>
          <p className="ety-clue-text">{currentTerm.etymology.fullBreakdown}</p>
          {currentTerm.etymology.roots.map((r, i) => (
            <div key={i} className="ety-clue-root">
              <span className="ety-clue-word">"{r.root}"</span>
              <span className="ety-clue-lang">{r.language}</span>
              <span className="ety-clue-meaning">= {r.meaning}</span>
            </div>
          ))}
        </div>

        {hintDisplay && (
          <div className="spelling-hint-display">
            <span className="hint-label">💡 Letter hint:</span>
            <span className="hint-letters">{hintDisplay.split('').map((ch, i) => (
              <span key={i} className={`hint-ch ${ch === '_' ? 'hint-blank' : 'hint-revealed'}`}>{ch === '_' ? '?' : ch}</span>
            ))}</span>
          </div>
        )}

        <div className={`spelling-input-area ${shake ? 'shake' : ''}`}>
          <input
            ref={inputRef}
            className={`spelling-input ${feedback === 'correct' ? 'input-correct' : feedback === 'wrong' || feedback === 'close' ? 'input-wrong' : ''}`}
            type="text"
            placeholder="Type the medical term..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && checkSpelling()}
            disabled={feedback === 'correct'}
            autoComplete="off"
            spellCheck={false}
          />
          <button className="spelling-submit" onClick={checkSpelling} disabled={!input.trim() || feedback === 'correct'}>
            Check →
          </button>
        </div>

        {feedback === 'correct' && (
          <div className="spelling-feedback correct-fb">
            🎉 Correct! <strong>{currentTerm.term}</strong>
          </div>
        )}
        {feedback === 'close' && (
          <div className="spelling-feedback close-fb">
            Almost! Check your spelling carefully...
          </div>
        )}
        {feedback === 'wrong' && (
          <div className="spelling-feedback wrong-fb">
            Not quite. Try again!
          </div>
        )}

        <div className="spelling-actions">
          {hintsRevealed < 3 && feedback !== 'correct' && (
            <button className="hint-btn" onClick={getHint}>
              💡 Hint ({3 - hintsRevealed} left)
            </button>
          )}
          <button className="skip-btn" onClick={() => { setShowAnswer(true); setTimeout(() => advance(false), 2000) }}>
            Skip / Show Answer
          </button>
        </div>

        {showAnswer && (
          <div className="show-answer-box">
            Answer: <strong>{currentTerm.term}</strong>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>/{currentTerm.pronunciation}/</div>
          </div>
        )}
      </div>
    </div>
  )
}
