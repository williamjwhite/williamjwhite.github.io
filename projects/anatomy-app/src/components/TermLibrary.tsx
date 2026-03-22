import { useState } from 'react'
import type { AnatomyTerm } from '../data/anatomyData'

interface Props {
  terms: AnatomyTerm[]
}

export function TermLibrary({ terms }: Props) {
  const [selected, setSelected] = useState<AnatomyTerm | null>(null)
  const [search, setSearch] = useState('')

  const filtered = terms.filter(t =>
    t.term.toLowerCase().includes(search.toLowerCase()) ||
    t.definition.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="term-library">
      <div className="library-search">
        <input
          placeholder="🔍  Search terms, definitions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span className="result-count">{filtered.length} terms</span>
      </div>

      <div className="library-layout">
        <div className="term-list">
          {filtered.map(term => (
            <button
              key={term.id}
              className={`term-list-item ${selected?.id === term.id ? 'active' : ''}`}
              style={{ '--term-color': term.color } as React.CSSProperties}
              onClick={() => setSelected(term)}
            >
              <span className="tli-emoji">{term.emoji}</span>
              <div className="tli-body">
                <div className="tli-name">{term.term}</div>
                <div className="tli-sys">{term.system}</div>
              </div>
              <span className="tli-cat">{term.category}</span>
            </button>
          ))}
        </div>

        <div className="term-detail">
          {selected ? (
            <TermDetail term={selected} allTerms={terms} onSelectTerm={setSelected} />
          ) : (
            <div className="term-detail-empty">
              <div className="empty-icon">📖</div>
              <p>Select a term to explore its definition, etymology, and connections</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TermDetail({ term, allTerms, onSelectTerm }: { term: AnatomyTerm; allTerms: AnatomyTerm[]; onSelectTerm: (t: AnatomyTerm) => void }) {
  const [tab, setTab] = useState<'overview' | 'etymology' | 'connections'>('overview')

  const connectedTerms = term.conceptConnections
    .map(c => ({ ...c, termData: allTerms.find(t => t.id === c.termId) }))
    .filter(c => c.termData)

  return (
    <div className="term-detail-card" style={{ '--term-color': term.color } as React.CSSProperties}>
      <div className="detail-header">
        <div className="detail-emoji">{term.emoji}</div>
        <div>
          <h2 className="detail-term">{term.term}</h2>
          <div className="detail-pronunciation">/{term.pronunciation}/</div>
          <div className="detail-meta">
            <span className="meta-tag" style={{ background: term.color + '33', color: term.color }}>{term.system}</span>
            <span className="meta-tag">{term.category}</span>
          </div>
        </div>
      </div>

      <div className="detail-tabs">
        {(['overview', 'etymology', 'connections'] as const).map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'overview' ? '📋' : t === 'etymology' ? '🏛️' : '🕸️'} {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="detail-tab-content">
          <p className="detail-definition">{term.definition}</p>
          <div className="fun-fact">
            <span className="fun-fact-icon">💡</span>
            <p>{term.funFact}</p>
          </div>
          {term.mnemonic && (
            <div className="mnemonic">
              <span className="mnemonic-icon">🧠</span>
              <p><strong>Memory trick:</strong> {term.mnemonic}</p>
            </div>
          )}
          <div className="related-terms">
            <h4>Related Terms</h4>
            <div className="related-chips">
              {term.relatedTerms.map(rt => (
                <span key={rt} className="related-chip">{rt}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'etymology' && (
        <div className="detail-tab-content">
          <div className="etymology-header">
            <div className="ety-language">🏛️ {term.etymology.language} origin</div>
            {term.etymology.year && <div className="ety-year">First used: {term.etymology.year}</div>}
          </div>
          <p className="ety-breakdown">{term.etymology.fullBreakdown}</p>
          <div className="roots-list">
            <h4>Word Roots</h4>
            {term.etymology.roots.map((root, i) => (
              <div key={i} className="root-card">
                <div className="root-header">
                  <span className="root-word">"{root.root}"</span>
                  <span className="root-lang">{root.language}</span>
                </div>
                <div className="root-meaning">= {root.meaning}</div>
                {root.examples.length > 0 && (
                  <div className="root-examples">
                    <span>Also in: </span>
                    {root.examples.slice(0, 4).map(e => (
                      <span key={e} className="root-example-tag">{e}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="term-decompose">
            <h4>Term Breakdown</h4>
            <div className="decompose-visual">
              {term.etymology.roots.map((root, i) => (
                <div key={i} className="decompose-piece">
                  <div className="dp-root" style={{ background: `hsl(${i * 60}, 60%, 25%)`, border: `1px solid hsl(${i * 60}, 60%, 40%)` }}>{root.root}</div>
                  <div className="dp-meaning">{root.meaning}</div>
                  {i < term.etymology.roots.length - 1 && <div className="dp-plus">+</div>}
                </div>
              ))}
              <div className="dp-equals">=</div>
              <div className="dp-result">{term.term}</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'connections' && (
        <div className="detail-tab-content">
          <p className="connections-intro">How <strong>{term.term}</strong> connects to other concepts:</p>
          {connectedTerms.length > 0 ? (
            <div className="connections-list">
              {connectedTerms.map((c, i) => c.termData && (
                <button
                  key={i}
                  className="connection-card"
                  style={{ '--conn-color': c.termData.color } as React.CSSProperties}
                  onClick={() => onSelectTerm(c.termData!)}
                >
                  <div className="conn-left">
                    <span className="conn-emoji">{c.termData.emoji}</span>
                    <div>
                      <div className="conn-term">{c.termData.term}</div>
                      <div className="conn-rel">{c.relationship}</div>
                    </div>
                  </div>
                  <div className={`conn-strength conn-${c.strength}`}>{c.strength}</div>
                </button>
              ))}
            </div>
          ) : (
            <p className="no-connections">No direct connections mapped yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
