import { useState, useEffect } from 'react'
import type { AnatomyTerm } from '../data/anatomyData'
import { QUIZ_QUESTIONS, ETYMOLOGY_ROOTS } from '../data/anatomyData'

interface Props {
  terms: AnatomyTerm[]
}

type GamePhase = 'menu' | 'playing' | 'result'

interface Question {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
  relatedTerms: string[]
  type: 'etymology' | 'meaning' | 'identify'
}

function generateQuestions(terms: AnatomyTerm[]): Question[] {
  const questions: Question[] = [...QUIZ_QUESTIONS.etymology]

  // Generate "what does this term mean" questions
  const termQuestions = terms.slice(0, 8).map((term, i) => {
    const wrongTerms = terms.filter(t => t.id !== term.id && t.system === term.system)
    const wrongOptions = wrongTerms.slice(0, 3).map(t => t.definition.split('.')[0])
    const options = [term.definition.split('.')[0], ...wrongOptions].sort(() => Math.random() - 0.5)
    const correctIdx = options.indexOf(term.definition.split('.')[0])
    return {
      id: `term-${i}`,
      question: `What is ${term.term} (${term.pronunciation})?`,
      options,
      correct: correctIdx,
      explanation: `${term.term}: ${term.definition} ${term.funFact}`,
      relatedTerms: term.relatedTerms.slice(0, 3),
      type: 'meaning' as const,
    }
  })

  // Generate root identification questions
  const rootQuestions = ETYMOLOGY_ROOTS.slice(0, 6).map((root, i) => {
    const wrongRoots = ETYMOLOGY_ROOTS.filter(r => r.root !== root.root).slice(0, 3)
    const options = [root.meaning, ...wrongRoots.map(r => r.meaning)].sort(() => Math.random() - 0.5)
    const correctIdx = options.indexOf(root.meaning)
    return {
      id: `root-${i}`,
      question: `The medical root "${root.root}" (${root.language}) means:`,
      options,
      correct: correctIdx,
      explanation: `"${root.root}" means ${root.meaning}. Found in: ${root.examples.slice(0, 3).join(', ')}`,
      relatedTerms: root.examples.slice(0, 3),
      type: 'identify' as const,
    }
  })

  return [...questions, ...termQuestions, ...rootQuestions]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10)
}

export function EtymologyGame({ terms }: Props) {
  const [phase, setPhase] = useState<GamePhase>('menu')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)

  function startGame() {
    const qs = generateQuestions(terms)
    setQuestions(qs)
    setCurrentQ(0)
    setSelected(null)
    setShowResult(false)
    setScore(0)
    setAnswers([])
    setStreak(0)
    setMaxStreak(0)
    setPhase('playing')
  }

  function handleSelect(idx: number) {
    if (selected !== null) return
    setSelected(idx)
    setShowResult(true)

    const isCorrect = idx === questions[currentQ].correct
    if (isCorrect) {
      setScore(s => s + 1)
      setStreak(s => {
        const newStreak = s + 1
        setMaxStreak(m => Math.max(m, newStreak))
        return newStreak
      })
    } else {
      setStreak(0)
    }
    setAnswers(prev => [...prev, idx])
  }

  function nextQuestion() {
    if (currentQ + 1 >= questions.length) {
      setPhase('result')
    } else {
      setCurrentQ(q => q + 1)
      setSelected(null)
      setShowResult(false)
    }
  }

  if (phase === 'menu') {
    return (
      <div className="game-menu">
        <div className="game-menu-card etymology-theme">
          <div className="game-icon">🏛️</div>
          <h2>Etymology Quiz</h2>
          <p>Test your knowledge of medical word roots, prefixes, and their origins across ancient Greek and Latin.</p>
          <div className="game-features">
            <div className="gf-item">📚 Word root identification</div>
            <div className="gf-item">🔤 Term meaning challenges</div>
            <div className="gf-item">🔗 Root connection patterns</div>
            <div className="gf-item">⚡ Streak bonuses</div>
          </div>
          <div className="game-info">
            <span>10 Questions</span>
            <span>·</span>
            <span>Multiple Choice</span>
            <span>·</span>
            <span>Explanation after each</span>
          </div>
          <button className="start-btn" onClick={startGame}>Start Quiz →</button>
        </div>
      </div>
    )
  }

  if (phase === 'result') {
    const pct = Math.round((score / questions.length) * 100)
    const grade = pct >= 90 ? '🏆' : pct >= 70 ? '🥈' : pct >= 50 ? '🥉' : '📚'
    const msg = pct >= 90 ? 'Outstanding!' : pct >= 70 ? 'Great job!' : pct >= 50 ? 'Keep studying!' : 'More practice needed!'

    return (
      <div className="game-result">
        <div className="result-card etymology-theme">
          <div className="result-icon">{grade}</div>
          <div className="result-score">{score}/{questions.length}</div>
          <div className="result-pct">{pct}%</div>
          <div className="result-msg">{msg}</div>
          <div className="result-stats">
            <div className="rs-stat">
              <span className="rs-val">{maxStreak}</span>
              <span className="rs-label">Best Streak</span>
            </div>
            <div className="rs-stat">
              <span className="rs-val">{questions.length - score}</span>
              <span className="rs-label">To Review</span>
            </div>
          </div>
          <div className="result-review">
            {questions.map((q, i) => (
              <div key={q.id} className={`review-item ${answers[i] === q.correct ? 'correct' : 'wrong'}`}>
                <span>{answers[i] === q.correct ? '✓' : '✗'}</span>
                <span className="review-q">{q.question.slice(0, 50)}...</span>
              </div>
            ))}
          </div>
          <button className="start-btn" onClick={startGame}>Play Again</button>
          <button className="outline-btn" onClick={() => setPhase('menu')}>Back to Menu</button>
        </div>
      </div>
    )
  }

  const q = questions[currentQ]
  const progress = ((currentQ) / questions.length) * 100

  return (
    <div className="etymology-game">
      <div className="game-header">
        <div className="game-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span>{currentQ + 1} / {questions.length}</span>
        </div>
        <div className="game-score-display">
          <span>Score: {score}</span>
          {streak > 1 && <span className="streak-badge">🔥 {streak}x</span>}
        </div>
      </div>

      <div className="question-card">
        <div className="q-type-badge">
          {q.type === 'etymology' ? '🏛️ Etymology' : q.type === 'meaning' ? '📖 Definition' : '🔤 Word Root'}
        </div>
        <h3 className="question-text">{q.question}</h3>

        <div className="options-grid">
          {q.options.map((opt, i) => (
            <button
              key={i}
              className={`option-btn ${
                selected !== null
                  ? i === q.correct
                    ? 'correct'
                    : i === selected
                    ? 'wrong'
                    : 'dim'
                  : ''
              }`}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
            >
              <span className="option-letter">{String.fromCharCode(65 + i)}</span>
              <span className="option-text">{opt}</span>
              {selected !== null && i === q.correct && <span className="option-check">✓</span>}
            </button>
          ))}
        </div>

        {showResult && (
          <div className={`explanation-box ${selected === q.correct ? 'correct-exp' : 'wrong-exp'}`}>
            <div className="exp-header">
              {selected === q.correct ? '🎉 Correct!' : '📚 Not quite — here\'s why:'}
            </div>
            <p className="exp-text">{q.explanation}</p>
            {q.relatedTerms.length > 0 && (
              <div className="exp-related">
                Related: {q.relatedTerms.map(t => <span key={t} className="exp-tag">{t}</span>)}
              </div>
            )}
            <button className="next-btn" onClick={nextQuestion}>
              {currentQ + 1 >= questions.length ? 'See Results →' : 'Next Question →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
