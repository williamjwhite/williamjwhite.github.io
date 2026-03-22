import { useState } from 'react'
import type { AnatomyTerm } from '../data/anatomyData'
import { ETYMOLOGY_ROOTS } from '../data/anatomyData'

interface Props {
  terms: AnatomyTerm[]
}

interface RootPuzzle {
  targetTerm: AnatomyTerm
  roots: { text: string; meaning: string; isCorrect: boolean }[]
  hint: string
}

function generatePuzzles(terms: AnatomyTerm[]): RootPuzzle[] {
  const puzzleable = terms.filter(t => t.etymology.roots.length >= 2)

  return puzzleable.slice(0, 8).map(term => {
    const correctRoots = term.etymology.roots.map(r => ({
      text: r.root,
      meaning: r.meaning,
      isCorrect: true,
    }))

    // Add decoy roots
    const decoys = ETYMOLOGY_ROOTS
      .filter(r => !term.etymology.roots.find(tr => tr.root === r.root))
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map(r => ({ text: r.root, meaning: r.meaning, isCorrect: false }))

    const allRoots = [...correctRoots, ...decoys].sort(() => Math.random() - 0.5)

    return {
      targetTerm: term,
      roots: allRoots,
      hint: term.etymology.fullBreakdown,
    }
  })
}

export function RootBuilder({ terms }: Props) {
  const [phase, setPhase] = useState<'menu' | 'playing' | 'done'>('menu')
  const [puzzles, setPuzzles] = useState<RootPuzzle[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [results, setResults] = useState<boolean[]>([])

  function startGame() {
    const ps = generatePuzzles(terms)
    setPuzzles(ps)
    setCurrentIdx(0)
    setSelected(new Set())
    setSubmitted(false)
    setScore(0)
    setShowHint(false)
    setResults([])
    setPhase('playing')
  }

  function toggleRoot(root: string) {
    if (submitted) return
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(root)) next.delete(root)
      else next.add(root)
      return next
    })
  }

  function checkAnswer() {
    if (!puzzles[currentIdx]) return
    const puzzle = puzzles[currentIdx]
    const correctRoots = new Set(puzzle.roots.filter(r => r.isCorrect).map(r => r.text))
    const isCorrect = selected.size === correctRoots.size &&
      [...selected].every(s => correctRoots.has(s))

    if (isCorrect) setScore(s => s + 1)
    setResults(r => [...r, isCorrect])
    setSubmitted(true)
  }

  function nextPuzzle() {
    if (currentIdx + 1 >= puzzles.length) {
      setPhase('done')
    } else {
      setCurrentIdx(i => i + 1)
      setSelected(new Set())
      setSubmitted(false)
      setShowHint(false)
    }
  }

  if (phase === 'menu') {
    return (
      <div className="game-menu">
        <div className="game-menu-card root-theme">
          <div className="game-icon">🧩</div>
          <h2>Root Builder</h2>
          <p>Given a medical term, select the correct word roots that make up the term. Learn how roots combine to create meaning!</p>
          <div className="game-features">
            <div className="gf-item">🔤 Identify correct roots</div>
            <div className="gf-item">🚫 Avoid decoy roots</div>
            <div className="gf-item">💡 Etymology hints available</div>
            <div className="gf-item">🧬 Greek & Latin origins</div>
          </div>
          <div className="game-info">
            <span>8 Puzzles</span>
            <span>·</span>
            <span>Multi-select roots</span>
          </div>
          <button className="start-btn" onClick={startGame}>Start Building →</button>
        </div>
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div className="game-result">
        <div className="result-card root-theme">
          <div className="result-icon">{score >= 6 ? '🧬' : score >= 4 ? '🔬' : '📚'}</div>
          <h3>Builder Complete!</h3>
          <div className="result-score">{score}/{puzzles.length}</div>
          <div className="result-review">
            {puzzles.map((p, i) => (
              <div key={p.targetTerm.id} className={`review-item ${results[i] ? 'correct' : 'wrong'}`}>
                <span>{results[i] ? '✓' : '✗'}</span>
                <span>{p.targetTerm.term}</span>
                <span className="review-roots">
                  {p.roots.filter(r => r.isCorrect).map(r => r.text).join(' + ')}
                </span>
              </div>
            ))}
          </div>
          <button className="start-btn" onClick={startGame}>Play Again</button>
          <button className="outline-btn" onClick={() => setPhase('menu')}>Back</button>
        </div>
      </div>
    )
  }

  const puzzle = puzzles[currentIdx]
  if (!puzzle) return null

  const correctRoots = new Set(puzzle.roots.filter(r => r.isCorrect).map(r => r.text))

  return (
    <div className="root-builder-game">
      <div className="game-header">
        <div className="game-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(currentIdx / puzzles.length) * 100}%`, background: '#fdcb6e' }} />
          </div>
          <span>{currentIdx + 1} / {puzzles.length}</span>
        </div>
        <span className="game-score-display">Score: {score}</span>
      </div>

      <div className="rb-puzzle">
        <div className="rb-target">
          <div className="rb-emoji">{puzzle.targetTerm.emoji}</div>
          <div>
            <div className="rb-term">{puzzle.targetTerm.term}</div>
            <div className="rb-pronunciation">/{puzzle.targetTerm.pronunciation}/</div>
          </div>
        </div>

        <p className="rb-instruction">
          Select the <strong>{correctRoots.size} root(s)</strong> that make up this term:
        </p>

        <div className="rb-roots-grid">
          {puzzle.roots.map((root, i) => {
            const isSelected = selected.has(root.text)
            const isCorrectRoot = correctRoots.has(root.text)
            let cls = 'rb-root-btn'
            if (submitted) {
              if (isCorrectRoot) cls += ' correct'
              else if (isSelected) cls += ' wrong'
              else cls += ' dim'
            } else if (isSelected) {
              cls += ' selected'
            }

            return (
              <button key={i} className={cls} onClick={() => toggleRoot(root.text)} disabled={submitted}>
                <div className="rb-root-text">"{root.text}"</div>
                <div className="rb-root-meaning">{root.meaning}</div>
                {submitted && isCorrectRoot && <div className="rb-root-check">✓</div>}
              </button>
            )
          })}
        </div>

        {!submitted && (
          <div className="rb-actions">
            <button className="hint-btn" onClick={() => setShowHint(h => !h)}>
              {showHint ? '🙈 Hide Hint' : '💡 Show Hint'}
            </button>
            <button
              className="submit-btn"
              onClick={checkAnswer}
              disabled={selected.size === 0}
            >
              Check Answer →
            </button>
          </div>
        )}

        {showHint && !submitted && (
          <div className="rb-hint">
            <span>💡</span> {puzzle.hint}
          </div>
        )}

        {submitted && (
          <div className={`explanation-box ${results[results.length - 1] ? 'correct-exp' : 'wrong-exp'}`}>
            <div className="exp-header">
              {results[results.length - 1] ? '🎉 Perfect!' : '📚 The correct roots are:'}
            </div>
            <div className="rb-correct-breakdown">
              {puzzle.roots.filter(r => r.isCorrect).map((r, i) => (
                <span key={i} className="rb-correct-root">
                  "{r.text}" = {r.meaning}
                  {i < correctRoots.size - 1 && ' + '}
                </span>
              ))}
              <span className="rb-correct-eq"> = {puzzle.targetTerm.term}</span>
            </div>
            <p className="exp-text">{puzzle.hint}</p>
            <button className="next-btn" onClick={nextPuzzle}>
              {currentIdx + 1 >= puzzles.length ? 'See Results →' : 'Next Puzzle →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
