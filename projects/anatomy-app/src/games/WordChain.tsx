import { useState, useEffect } from 'react'
import type { AnatomyTerm } from '../data/anatomyData'

interface Props { terms: AnatomyTerm[] }

interface ChainNode {
  term: AnatomyTerm
  sharedRoot: string
  sharedMeaning: string
}

interface Challenge {
  start: AnatomyTerm
  target: AnatomyTerm
  maxChain: number
}

// Find shared root between two terms
function sharedRoot(a: AnatomyTerm, b: AnatomyTerm): { root: string; meaning: string } | null {
  for (const rootA of a.etymology.roots) {
    for (const rootB of b.etymology.roots) {
      if (rootA.root === rootB.root) return { root: rootA.root, meaning: rootA.meaning }
      // Check if one term appears in the other's examples
      if (rootA.examples.includes(b.term.toLowerCase()) || rootB.examples.includes(a.term.toLowerCase())) {
        return { root: rootA.root, meaning: rootA.meaning }
      }
      // Check if they share a common substring root
      if (rootA.root.length >= 3 && rootB.root.includes(rootA.root.slice(0, 3))) {
        return { root: rootA.root, meaning: rootA.meaning }
      }
    }
  }
  // Check direct concept connections
  const conn = a.conceptConnections.find(c => c.termId === b.id)
  if (conn) return { root: 'concept link', meaning: conn.relationship }
  return null
}

// Get all terms reachable from a term by shared root
function getNeighbors(term: AnatomyTerm, allTerms: AnatomyTerm[]): { term: AnatomyTerm; root: string; meaning: string }[] {
  const results: { term: AnatomyTerm; root: string; meaning: string }[] = []
  for (const other of allTerms) {
    if (other.id === term.id) continue
    const shared = sharedRoot(term, other)
    if (shared) results.push({ term: other, root: shared.root, meaning: shared.meaning })
    // Also connect by system
    else if (other.system === term.system) {
      results.push({ term: other, root: `${term.system} system`, meaning: `both in ${other.system}` })
    }
  }
  return results
}

function generateChallenges(terms: AnatomyTerm[]): Challenge[] {
  // Create interesting start/target pairs from different systems
  const bySystem: Partial<Record<string, AnatomyTerm[]>> = {}
  terms.forEach(t => {
    if (!bySystem[t.system]) bySystem[t.system] = []
    bySystem[t.system]!.push(t)
  })
  const challenges: Challenge[] = []
  const systems = Object.keys(bySystem)
  for (let i = 0; i < Math.min(5, systems.length - 1); i++) {
    const sys1 = bySystem[systems[i]]!
    const sys2 = bySystem[systems[(i + 1) % systems.length]]!
    if (sys1.length > 0 && sys2.length > 0) {
      challenges.push({
        start: sys1[Math.floor(Math.random() * sys1.length)],
        target: sys2[Math.floor(Math.random() * sys2.length)],
        maxChain: 5,
      })
    }
  }
  return challenges
}

export function WordChain({ terms }: Props) {
  const [phase, setPhase] = useState<'menu' | 'playing' | 'done'>('menu')
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [challengeIdx, setChallengeIdx] = useState(0)
  const [chain, setChain] = useState<ChainNode[]>([])
  const [selectedTerm, setSelectedTerm] = useState<AnatomyTerm | null>(null)
  const [score, setScore] = useState(0)
  const [results, setResults] = useState<{ success: boolean; chainLength: number }[]>([])
  const [hint, setHint] = useState<string | null>(null)

  function startGame() {
    const ch = generateChallenges(terms)
    setChallenges(ch)
    setChallengeIdx(0)
    setScore(0)
    setResults([])
    if (ch.length > 0) {
      startChallenge(ch[0])
    }
    setPhase('playing')
  }

  function startChallenge(challenge: Challenge) {
    setChain([{ term: challenge.start, sharedRoot: 'start', sharedMeaning: 'Starting term' }])
    setSelectedTerm(null)
    setHint(null)
  }

  const challenge = challenges[challengeIdx]
  const lastInChain = chain[chain.length - 1]?.term

  const neighbors = lastInChain ? getNeighbors(lastInChain, terms).filter(n => !chain.find(c => c.term.id === n.term.id)) : []

  function addToChain(neighbor: { term: AnatomyTerm; root: string; meaning: string }) {
    const newChain = [...chain, { term: neighbor.term, sharedRoot: neighbor.root, sharedMeaning: neighbor.meaning }]
    setChain(newChain)
    setHint(null)

    // Check if we reached the target
    if (neighbor.term.id === challenge.target.id) {
      const pts = Math.max(challenge.maxChain - newChain.length + 2, 1) * 2
      setScore(s => s + pts)
      setResults(r => [...r, { success: true, chainLength: newChain.length }])
      setTimeout(() => nextChallenge(), 2000)
    }
  }

  function giveUp() {
    setResults(r => [...r, { success: false, chainLength: chain.length }])
    nextChallenge()
  }

  function nextChallenge() {
    if (challengeIdx + 1 >= challenges.length) {
      setPhase('done')
    } else {
      const next = challengeIdx + 1
      setChallengeIdx(next)
      startChallenge(challenges[next])
    }
  }

  function showHint() {
    if (!challenge || !lastInChain) return
    const hintNeighbors = getNeighbors(lastInChain, terms)
    const towardTarget = hintNeighbors.find(n => n.term.system === challenge.target.system)
    if (towardTarget) {
      setHint(`Try connecting via the "${towardTarget.root}" root — look for a ${challenge.target.system} system term`)
    } else {
      setHint(`You're looking for: ${challenge.target.term} (${challenge.target.system} system). Try terms that share word roots.`)
    }
  }

  if (phase === 'menu') {
    return (
      <div className="game-menu">
        <div className="game-menu-card chain-theme">
          <div className="game-icon">⛓️</div>
          <h2>Word Chain</h2>
          <p>Connect two anatomy terms by building a chain where each link shares an etymology root or concept connection. Shorter chains score more!</p>
          <div className="game-features">
            <div className="gf-item">🔗 Link terms by shared roots</div>
            <div className="gf-item">🗺️ Navigate across body systems</div>
            <div className="gf-item">📏 Shorter chains = higher score</div>
            <div className="gf-item">🧭 Hints available if stuck</div>
          </div>
          <div className="game-info">
            <span>5 Challenges</span><span>·</span><span>Cross-system connections</span>
          </div>
          <button className="start-btn" onClick={startGame}>Start Chaining →</button>
        </div>
      </div>
    )
  }

  if (phase === 'done') {
    const maxPossible = challenges.length * 10
    const successCount = results.filter(r => r.success).length
    return (
      <div className="game-result">
        <div className="result-card chain-theme">
          <div className="result-icon">{successCount >= 4 ? '⛓️' : successCount >= 2 ? '🔗' : '📚'}</div>
          <h3>Chain Complete!</h3>
          <div className="result-score">{score}</div>
          <div className="result-stats">
            <div className="rs-stat good"><span className="rs-val">{successCount}</span><span className="rs-label">Chains Made</span></div>
            <div className="rs-stat"><span className="rs-val">{(results.reduce((s, r) => s + r.chainLength, 0) / results.length).toFixed(1)}</span><span className="rs-label">Avg Length</span></div>
          </div>
          <div className="result-review">
            {results.map((r, i) => (
              <div key={i} className={`review-item ${r.success ? 'correct' : 'wrong'}`}>
                <span>{r.success ? '✓' : '✗'}</span>
                <span>{challenges[i]?.start.term} → {challenges[i]?.target.term}</span>
                {r.success && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.chainLength} steps</span>}
              </div>
            ))}
          </div>
          <button className="start-btn" onClick={startGame}>Play Again</button>
          <button className="outline-btn" onClick={() => setPhase('menu')}>Back</button>
        </div>
      </div>
    )
  }

  if (!challenge) return null

  const reachedTarget = chain[chain.length - 1]?.term.id === challenge.target.id

  return (
    <div className="word-chain-game">
      <div className="game-header">
        <div className="game-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(challengeIdx / challenges.length) * 100}%`, background: '#a29bfe' }} />
          </div>
          <span>{challengeIdx + 1} / {challenges.length}</span>
        </div>
        <span className="game-score-display">Score: {score}</span>
      </div>

      <div className="wc-layout">
        <div className="wc-target-bar">
          <div className="wc-start">
            <span style={{ color: challenge.start.color }}>{challenge.start.emoji} {challenge.start.term}</span>
          </div>
          <div className="wc-arrow">─── connect in ≤{challenge.maxChain} steps ───→</div>
          <div className="wc-end">
            <span style={{ color: challenge.target.color }}>{challenge.target.emoji} {challenge.target.term}</span>
          </div>
        </div>

        {/* Chain visualization */}
        <div className="wc-chain">
          {chain.map((node, i) => (
            <div key={i} className="wc-chain-node">
              <div className="wc-node-card" style={{ borderColor: node.term.color + '66', background: node.term.color + '11' }}>
                <span className="wc-node-emoji">{node.term.emoji}</span>
                <div>
                  <div className="wc-node-term">{node.term.term}</div>
                  <div className="wc-node-sys">{node.term.system}</div>
                </div>
              </div>
              {i < chain.length - 1 && (
                <div className="wc-chain-link">
                  <div className="wc-link-root">"{chain[i + 1].sharedRoot}"</div>
                  <div className="wc-link-meaning">{chain[i + 1].sharedMeaning}</div>
                  <div className="wc-link-arrow">↓</div>
                </div>
              )}
            </div>
          ))}
          {reachedTarget && (
            <div className="wc-success">
              🎉 Connected in {chain.length} steps!
            </div>
          )}
        </div>

        {!reachedTarget && (
          <div className="wc-choices">
            <h4>Choose the next link ({neighbors.length} options):</h4>
            <div className="wc-choices-grid">
              {neighbors.slice(0, 8).map((n, i) => (
                <button
                  key={i}
                  className="wc-choice-btn"
                  style={{ '--choice-color': n.term.color } as React.CSSProperties}
                  onClick={() => addToChain(n)}
                >
                  <div className="wc-choice-top">
                    <span>{n.term.emoji}</span>
                    <span className="wc-choice-term">{n.term.term}</span>
                    {n.term.id === challenge.target.id && <span className="wc-target-badge">🎯 TARGET</span>}
                  </div>
                  <div className="wc-choice-connection">
                    via <strong>"{n.root}"</strong> — {n.meaning}
                  </div>
                </button>
              ))}
            </div>
            {chain.length > challenge.maxChain && (
              <div className="wc-over-limit">⚠️ Over the ideal limit — but keep going!</div>
            )}
            <div className="wc-actions">
              <button className="hint-btn" onClick={showHint}>🧭 Hint</button>
              <button className="skip-btn" onClick={giveUp}>Give Up</button>
            </div>
            {hint && <div className="wc-hint-box">{hint}</div>}
          </div>
        )}
      </div>
    </div>
  )
}
