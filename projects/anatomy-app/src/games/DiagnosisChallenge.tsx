import { useState } from 'react'
import type { AnatomyTerm } from '../data/anatomyData'

interface Props {
  terms: AnatomyTerm[]
}

interface Clue {
  text: string
  revealed: boolean
}

interface DiagnosisQuestion {
  targetTerm: AnatomyTerm
  clues: Clue[]
  options: AnatomyTerm[]
}

const CLUE_TEMPLATES: Record<string, (t: AnatomyTerm) => string[]> = {
  etymology: (t) => [`My name comes from ${t.etymology.language} roots: ${t.etymology.roots.map(r => `"${r.root}" (${r.meaning})`).join(' + ')}`],
  funfact: (t) => [t.funFact],
  system: (t) => [`I am part of the ${t.system} system`],
  category: (t) => [`I am a ${t.category}`],
  related: (t) => t.relatedTerms.length > 1 ? [`I am closely related to: ${t.relatedTerms.slice(0, 2).join(' and ')}`] : [],
  definition_partial: (t) => [`Partial definition: "${t.definition.split('.')[0].substring(0, 60)}..."`],
}

function generateQuestions(terms: AnatomyTerm[]): DiagnosisQuestion[] {
  const shuffled = [...terms].sort(() => Math.random() - 0.5).slice(0, 6)

  return shuffled.map(term => {
    const clueTexts: string[] = [
      ...CLUE_TEMPLATES.system(term),
      ...CLUE_TEMPLATES.category(term),
      ...CLUE_TEMPLATES.etymology(term),
      ...CLUE_TEMPLATES.funfact(term),
      ...CLUE_TEMPLATES.related(term),
      ...CLUE_TEMPLATES.definition_partial(term),
    ].slice(0, 5)

    const clues: Clue[] = clueTexts.map((text, i) => ({ text, revealed: i === 0 }))

    // Get 3 wrong options from same system when possible
    const sameSystem = terms.filter(t => t.id !== term.id && t.system === term.system)
    const otherSystem = terms.filter(t => t.id !== term.id && t.system !== term.system)
    const wrongOptions = [
      ...sameSystem.slice(0, 2),
      ...otherSystem.slice(0, 1),
    ].slice(0, 3)

    const options = [term, ...wrongOptions].sort(() => Math.random() - 0.5)
    return { targetTerm: term, clues, options }
  })
}

export function DiagnosisChallenge({ terms }: Props) {
  const [phase, setPhase] = useState<'menu' | 'playing' | 'done'>('menu')
  const [questions, setQuestions] = useState<DiagnosisQuestion[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [cluesRevealed, setCluesRevealed] = useState(1)
  const [guessed, setGuessed] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [pointsPerQ, setPointsPerQ] = useState<number[]>([])
  const [results, setResults] = useState<{ correct: boolean; term: string; points: number }[]>([])

  function startGame() {
    const qs = generateQuestions(terms)
    setQuestions(qs)
    setCurrentIdx(0)
    setCluesRevealed(1)
    setGuessed(false)
    setSelectedAnswer(null)
    setScore(0)
    setPointsPerQ([])
    setResults([])
    setPhase('playing')
  }

  function revealNextClue() {
    setCluesRevealed(c => c + 1)
  }

  function makeGuess(termId: string) {
    if (guessed) return
    const q = questions[currentIdx]
    const isCorrect = termId === q.targetTerm.id
    const points = isCorrect ? Math.max(5 - cluesRevealed + 1, 1) : 0
    setSelectedAnswer(termId)
    setGuessed(true)
    if (isCorrect) setScore(s => s + points)
    setPointsPerQ(p => [...p, points])
    setResults(r => [...r, { correct: isCorrect, term: q.targetTerm.term, points }])
  }

  function nextQuestion() {
    if (currentIdx + 1 >= questions.length) {
      setPhase('done')
    } else {
      setCurrentIdx(i => i + 1)
      setCluesRevealed(1)
      setGuessed(false)
      setSelectedAnswer(null)
    }
  }

  if (phase === 'menu') {
    return (
      <div className="game-menu">
        <div className="game-menu-card diagnosis-theme">
          <div className="game-icon">🔬</div>
          <h2>Diagnosis Challenge</h2>
          <p>Uncover clues one by one and identify the anatomy term or condition. Fewer clues needed = higher score!</p>
          <div className="game-features">
            <div className="gf-item">🔍 Progressive clue reveals</div>
            <div className="gf-item">⭐ Score more with fewer clues</div>
            <div className="gf-item">🏛️ Etymology, fun facts, systems</div>
            <div className="gf-item">🎯 Test deductive reasoning</div>
          </div>
          <div className="scoring-info">
            <h4>Scoring:</h4>
            <div className="score-table">
              <div>1 clue used → <strong>5 pts</strong></div>
              <div>2 clues → <strong>4 pts</strong></div>
              <div>3 clues → <strong>3 pts</strong></div>
              <div>4+ clues → <strong>1-2 pts</strong></div>
            </div>
          </div>
          <button className="start-btn" onClick={startGame}>Start Diagnosing →</button>
        </div>
      </div>
    )
  }

  if (phase === 'done') {
    const maxScore = questions.length * 5
    const pct = Math.round((score / maxScore) * 100)
    return (
      <div className="game-result">
        <div className="result-card diagnosis-theme">
          <div className="result-icon">{pct >= 80 ? '🏥' : pct >= 60 ? '🩺' : '📋'}</div>
          <h3>Diagnosis Complete!</h3>
          <div className="result-score">{score}<span style={{ fontSize: '0.5em' }}>/{maxScore}</span></div>
          <div className="result-pct">{pct}% efficiency</div>
          <div className="result-review">
            {results.map((r, i) => (
              <div key={i} className={`review-item ${r.correct ? 'correct' : 'wrong'}`}>
                <span>{r.correct ? '✓' : '✗'}</span>
                <span>{r.term}</span>
                <span>{r.correct ? `+${r.points}pts` : '0pts'}</span>
              </div>
            ))}
          </div>
          <button className="start-btn" onClick={startGame}>Play Again</button>
          <button className="outline-btn" onClick={() => setPhase('menu')}>Back</button>
        </div>
      </div>
    )
  }

  const q = questions[currentIdx]
  if (!q) return null
  const revealedClues = q.clues.slice(0, cluesRevealed)
  const canRevealMore = cluesRevealed < q.clues.length && !guessed

  return (
    <div className="diagnosis-game">
      <div className="game-header">
        <div className="game-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(currentIdx / questions.length) * 100}%`, background: '#e84393' }} />
          </div>
          <span>{currentIdx + 1} / {questions.length}</span>
        </div>
        <div className="game-score-display">
          <span>Score: {score}</span>
          <span className="pts-preview">({Math.max(5 - cluesRevealed + 1, 1)}pts if correct)</span>
        </div>
      </div>

      <div className="diagnosis-card">
        <div className="diag-clues">
          <h3>🔍 Clues Revealed ({cluesRevealed}/{q.clues.length})</h3>
          {revealedClues.map((clue, i) => (
            <div key={i} className={`clue-item clue-${i}`} style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="clue-num">{i + 1}</span>
              <span className="clue-text">{clue.text}</span>
            </div>
          ))}
          {canRevealMore && (
            <button className="reveal-btn" onClick={revealNextClue}>
              🔓 Reveal Next Clue (−1 pt)
            </button>
          )}
        </div>

        <div className="diag-options">
          <h4>What am I?</h4>
          <div className="diag-options-grid">
            {q.options.map(opt => {
              let cls = 'diag-opt'
              if (guessed) {
                if (opt.id === q.targetTerm.id) cls += ' correct'
                else if (opt.id === selectedAnswer) cls += ' wrong'
                else cls += ' dim'
              }
              return (
                <button
                  key={opt.id}
                  className={cls}
                  style={{ '--opt-color': opt.color } as React.CSSProperties}
                  onClick={() => makeGuess(opt.id)}
                  disabled={guessed}
                >
                  <span className="opt-emoji">{opt.emoji}</span>
                  <span className="opt-term">{opt.term}</span>
                  <span className="opt-sys">{opt.system}</span>
                </button>
              )
            })}
          </div>
        </div>

        {guessed && (
          <div className={`explanation-box ${selectedAnswer === q.targetTerm.id ? 'correct-exp' : 'wrong-exp'}`}>
            <div className="exp-header">
              {selectedAnswer === q.targetTerm.id
                ? `🎯 Correct! +${pointsPerQ[pointsPerQ.length - 1]} pts`
                : `❌ It was ${q.targetTerm.term}`}
            </div>
            <p className="exp-text">{q.targetTerm.definition}</p>
            <p className="exp-text">
              <strong>Etymology:</strong> {q.targetTerm.etymology.fullBreakdown}
            </p>
            <button className="next-btn" onClick={nextQuestion}>
              {currentIdx + 1 >= questions.length ? 'See Results →' : 'Next →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
