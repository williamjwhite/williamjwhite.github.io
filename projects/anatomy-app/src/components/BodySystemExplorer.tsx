import { useState } from 'react'
import type { AnatomyTerm, BodySystem } from '../data/anatomyData'
import { SYSTEM_COLORS, SYSTEM_EMOJIS } from '../data/anatomyData'

interface Props {
  terms: AnatomyTerm[]
}

const SYSTEM_DESCRIPTIONS: Record<BodySystem, { desc: string; function: string; keyFacts: string[] }> = {
  cardiovascular: {
    desc: 'The cardiovascular system circulates blood throughout the body, delivering oxygen and nutrients while removing waste.',
    function: 'Oxygen & nutrient transport',
    keyFacts: ['Heart beats ~100,000 times/day', 'Blood vessels total ~60,000 miles', 'Pumps 2,000 gallons of blood daily'],
  },
  respiratory: {
    desc: 'The respiratory system enables gas exchange, bringing oxygen into the body and expelling carbon dioxide.',
    function: 'Gas exchange & breathing',
    keyFacts: ['We breathe ~20,000 times/day', 'Alveoli have tennis-court surface area', 'Lungs contain ~300 million alveoli'],
  },
  nervous: {
    desc: 'The nervous system processes information and coordinates body functions through electrical and chemical signals.',
    function: 'Signal processing & coordination',
    keyFacts: ['86 billion neurons in the brain', 'Signals travel up to 268 mph', '100 trillion synaptic connections'],
  },
  digestive: {
    desc: 'The digestive system breaks down food into nutrients, absorbs them, and eliminates waste products.',
    function: 'Nutrient absorption & waste elimination',
    keyFacts: ['Digestive tract is 30 feet long', 'Stomach acid is pH 1.5-3.5', 'Takes 24-72 hours for full digestion'],
  },
  musculoskeletal: {
    desc: 'The musculoskeletal system provides structure, protection, and movement through bones, muscles, and connective tissue.',
    function: 'Structure, movement & protection',
    keyFacts: ['206 bones in adult body', '639 named muscles', 'Femur can support 30x body weight'],
  },
  endocrine: {
    desc: 'The endocrine system regulates body functions through hormones secreted by glands into the bloodstream.',
    function: 'Hormonal regulation & homeostasis',
    keyFacts: ['9 major endocrine glands', 'Hormones travel via bloodstream', 'Hypothalamus is master regulator'],
  },
  immune: {
    desc: 'The immune system defends the body against pathogens, foreign substances, and abnormal cells.',
    function: 'Defense & foreign body elimination',
    keyFacts: ['Produces 10 million antibodies/day', '1 trillion immune cells', 'Memory can last a lifetime'],
  },
  integumentary: {
    desc: 'The integumentary system includes skin, hair, and nails — providing protection and regulating temperature.',
    function: 'Protection, temperature regulation & sensation',
    keyFacts: ['Skin is the largest organ (2 sq m)', 'Regenerates completely every ~27 days', 'Contains 2-4 million sweat glands'],
  },
  urinary: {
    desc: 'The urinary system filters blood, removes waste products, and regulates fluid and electrolyte balance.',
    function: 'Waste filtration & fluid balance',
    keyFacts: ['Kidneys filter 180L of blood daily', 'Produce 1-2L of urine daily', 'Each kidney has ~1 million nephrons'],
  },
  reproductive: {
    desc: 'The reproductive system enables the production of offspring through specialized organs and hormones.',
    function: 'Reproduction & hormone production',
    keyFacts: ['Produces hormones affecting whole body', 'Development begins in fetal stage', 'Activates fully at puberty'],
  },
}

export function BodySystemExplorer({ terms }: Props) {
  const [selectedSystem, setSelectedSystem] = useState<BodySystem | null>(null)
  const [selectedTerm, setSelectedTerm] = useState<AnatomyTerm | null>(null)

  const systemTerms = selectedSystem ? terms.filter(t => t.system === selectedSystem) : []

  const systems = Object.keys(SYSTEM_COLORS) as BodySystem[]

  return (
    <div className="body-systems">
      <div className="systems-layout">
        <div className="systems-list">
          {systems.map(sys => {
            const sysTerms = terms.filter(t => t.system === sys)
            const info = SYSTEM_DESCRIPTIONS[sys]
            return (
              <button
                key={sys}
                className={`system-card ${selectedSystem === sys ? 'active' : ''}`}
                style={{ '--sys-color': SYSTEM_COLORS[sys] } as React.CSSProperties}
                onClick={() => { setSelectedSystem(sys); setSelectedTerm(null) }}
              >
                <div className="sc-emoji">{SYSTEM_EMOJIS[sys]}</div>
                <div className="sc-body">
                  <div className="sc-name">{sys}</div>
                  <div className="sc-fn">{info.function}</div>
                  <div className="sc-count">{sysTerms.length} terms</div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="system-detail">
          {selectedSystem ? (
            <div className="sd-content">
              {!selectedTerm ? (
                <>
                  <div className="sd-header" style={{ background: SYSTEM_COLORS[selectedSystem] + '22', borderColor: SYSTEM_COLORS[selectedSystem] + '44' }}>
                    <div className="sd-emoji">{SYSTEM_EMOJIS[selectedSystem]}</div>
                    <div>
                      <h2 className="sd-name" style={{ color: SYSTEM_COLORS[selectedSystem] }}>
                        {selectedSystem.charAt(0).toUpperCase() + selectedSystem.slice(1)} System
                      </h2>
                      <p className="sd-desc">{SYSTEM_DESCRIPTIONS[selectedSystem].desc}</p>
                    </div>
                  </div>

                  <div className="sd-facts">
                    <h3>Key Facts</h3>
                    {SYSTEM_DESCRIPTIONS[selectedSystem].keyFacts.map((fact, i) => (
                      <div key={i} className="fact-item">
                        <span className="fact-bullet" style={{ background: SYSTEM_COLORS[selectedSystem] }} />
                        {fact}
                      </div>
                    ))}
                  </div>

                  <div className="sd-terms">
                    <h3>Terms in this System ({systemTerms.length})</h3>
                    <div className="sys-terms-grid">
                      {systemTerms.map(term => (
                        <button
                          key={term.id}
                          className="sys-term-btn"
                          style={{ '--term-color': term.color } as React.CSSProperties}
                          onClick={() => setSelectedTerm(term)}
                        >
                          <span className="stb-emoji">{term.emoji}</span>
                          <div>
                            <div className="stb-term">{term.term}</div>
                            <div className="stb-cat">{term.category}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="sd-term-detail">
                  <button className="back-to-system" onClick={() => setSelectedTerm(null)}>
                    ← Back to {selectedSystem}
                  </button>
                  <div className="std-card">
                    <div className="std-header">
                      <span className="std-emoji">{selectedTerm.emoji}</span>
                      <div>
                        <h2 className="std-term">{selectedTerm.term}</h2>
                        <div className="std-pron">/{selectedTerm.pronunciation}/</div>
                      </div>
                    </div>
                    <p className="std-def">{selectedTerm.definition}</p>
                    <div className="std-ety">
                      <h4>🏛️ Etymology</h4>
                      <p>{selectedTerm.etymology.fullBreakdown}</p>
                      <div className="std-roots">
                        {selectedTerm.etymology.roots.map((r, i) => (
                          <div key={i} className="std-root">
                            <span className="std-root-word">"{r.root}"</span>
                            <span className="std-root-lang">{r.language}</span>
                            <span>= {r.meaning}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="std-fact">
                      <span>💡</span> {selectedTerm.funFact}
                    </div>
                    {selectedTerm.mnemonic && (
                      <div className="std-mnem">
                        <span>🧠</span> {selectedTerm.mnemonic}
                      </div>
                    )}
                    <div className="std-related">
                      <h4>Related Terms</h4>
                      {selectedTerm.relatedTerms.map(rt => (
                        <span key={rt} className="std-related-chip">{rt}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="sd-empty">
              <div className="sd-empty-icon">🫁</div>
              <p>Select a body system to explore its terms, functions, and key facts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
