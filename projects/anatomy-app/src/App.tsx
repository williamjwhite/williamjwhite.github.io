import { useState } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────
interface BodySystem {
  id: string
  name: string
  icon: string
  color: string
  description: string
  organs: string[]
  functions: string[]
}

// ── Data ───────────────────────────────────────────────────────────────────
const SYSTEMS: BodySystem[] = [
  {
    id: 'skeletal',
    name: 'Skeletal',
    icon: '🦴',
    color: '#e8d5b0',
    description: 'The framework of 206 bones that supports and protects the body.',
    organs: ['Bones', 'Cartilage', 'Ligaments', 'Tendons', 'Joints'],
    functions: ['Support & structure', 'Protection of organs', 'Movement leverage', 'Blood cell production', 'Mineral storage'],
  },
  {
    id: 'muscular',
    name: 'Muscular',
    icon: '💪',
    color: '#ff6b6b',
    description: 'Over 600 muscles that enable movement, posture, and circulation.',
    organs: ['Skeletal muscle', 'Smooth muscle', 'Cardiac muscle'],
    functions: ['Body movement', 'Posture maintenance', 'Heat production', 'Organ function'],
  },
  {
    id: 'cardiovascular',
    name: 'Cardiovascular',
    icon: '❤️',
    color: '#ff4757',
    description: 'The heart and blood vessels that circulate blood throughout the body.',
    organs: ['Heart', 'Arteries', 'Veins', 'Capillaries', 'Blood'],
    functions: ['Oxygen transport', 'Nutrient delivery', 'Waste removal', 'Temperature regulation', 'Immune defense'],
  },
  {
    id: 'nervous',
    name: 'Nervous',
    icon: '🧠',
    color: '#ffa502',
    description: 'The brain, spinal cord, and nerves that coordinate body functions.',
    organs: ['Brain', 'Spinal cord', 'Peripheral nerves', 'Sensory organs'],
    functions: ['Sensory processing', 'Motor control', 'Cognition & memory', 'Autonomic regulation', 'Reflex actions'],
  },
  {
    id: 'respiratory',
    name: 'Respiratory',
    icon: '🫁',
    color: '#57c4dc',
    description: 'The lungs and airways responsible for gas exchange.',
    organs: ['Lungs', 'Trachea', 'Bronchi', 'Diaphragm', 'Nose & sinuses'],
    functions: ['Oxygen intake', 'CO₂ expulsion', 'pH regulation', 'Voice production', 'Olfaction'],
  },
  {
    id: 'digestive',
    name: 'Digestive',
    icon: '🫄',
    color: '#2ed573',
    description: 'Breaks down food into nutrients that can be absorbed by the body.',
    organs: ['Mouth', 'Esophagus', 'Stomach', 'Small intestine', 'Large intestine', 'Liver', 'Pancreas'],
    functions: ['Food breakdown', 'Nutrient absorption', 'Waste elimination', 'Enzyme production', 'Hormone secretion'],
  },
  {
    id: 'endocrine',
    name: 'Endocrine',
    icon: '⚗️',
    color: '#a29bfe',
    description: 'Glands that produce hormones to regulate body processes.',
    organs: ['Pituitary', 'Thyroid', 'Adrenal glands', 'Pancreas (islets)', 'Ovaries / Testes'],
    functions: ['Metabolism control', 'Growth & development', 'Mood regulation', 'Reproductive control', 'Stress response'],
  },
  {
    id: 'immune',
    name: 'Immune / Lymphatic',
    icon: '🛡️',
    color: '#00b894',
    description: 'Defends the body against pathogens and maintains fluid balance.',
    organs: ['Lymph nodes', 'Spleen', 'Thymus', 'Bone marrow', 'Tonsils'],
    functions: ['Pathogen defense', 'Antibody production', 'Fluid balance', 'Fat absorption', 'Waste filtration'],
  },
]

// ── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [selected, setSelected] = useState<BodySystem | null>(null)
  const [search, setSearch] = useState('')

  const filtered = SYSTEMS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.organs.some(o => o.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a2e', color: '#eee', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #16213e, #0f3460)',
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>
            🫀 Anatomy &amp; Physiology
          </h1>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: '3px 0 0', fontFamily: 'monospace' }}>
            Body Systems Reference
          </p>
        </div>
        <input
          type="text"
          placeholder="Search systems or organs…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8, padding: '8px 14px', color: '#eee', fontSize: 13,
            outline: 'none', width: 220,
          }}
        />
      </header>

      <div style={{ display: 'flex', height: 'calc(100vh - 73px)' }}>
        {/* Sidebar */}
        <nav style={{
          width: 200, flexShrink: 0,
          background: '#16213e', borderRight: '1px solid rgba(255,255,255,0.07)',
          overflowY: 'auto', padding: 12,
        }}>
          {filtered.map(s => (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '10px 12px', marginBottom: 4,
                background: selected?.id === s.id ? `${s.color}22` : 'transparent',
                border: selected?.id === s.id ? `1px solid ${s.color}55` : '1px solid transparent',
                borderRadius: 8, cursor: 'pointer', color: '#eee', fontSize: 13,
                textAlign: 'left', transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <span style={{ fontWeight: selected?.id === s.id ? 600 : 400 }}>{s.name}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p style={{ color: '#64748b', fontSize: 12, padding: 8 }}>No matches</p>
          )}
        </nav>

        {/* Detail Panel */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
          {selected ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <span style={{
                  fontSize: 40, width: 64, height: 64,
                  background: `${selected.color}22`, border: `1px solid ${selected.color}44`,
                  borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{selected.icon}</span>
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: selected.color, margin: 0 }}>
                    {selected.name} System
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: 13, margin: '4px 0 0' }}>{selected.description}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Organs */}
                <div style={{
                  background: '#16213e', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, padding: 18,
                }}>
                  <h3 style={{ fontSize: 13, color: selected.color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                    Key Structures
                  </h3>
                  {selected.organs.map(o => (
                    <div key={o} style={{
                      padding: '7px 10px', marginBottom: 6,
                      background: 'rgba(255,255,255,0.04)', borderRadius: 6,
                      fontSize: 13, color: '#e2e8f0',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: selected.color, flexShrink: 0 }} />
                      {o}
                    </div>
                  ))}
                </div>

                {/* Functions */}
                <div style={{
                  background: '#16213e', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, padding: 18,
                }}>
                  <h3 style={{ fontSize: 13, color: selected.color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                    Primary Functions
                  </h3>
                  {selected.functions.map((f, i) => (
                    <div key={f} style={{
                      padding: '7px 10px', marginBottom: 6,
                      background: 'rgba(255,255,255,0.04)', borderRadius: 6,
                      fontSize: 13, color: '#e2e8f0',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      <span style={{
                        width: 18, height: 18, borderRadius: '50%',
                        background: `${selected.color}33`, border: `1px solid ${selected.color}66`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, color: selected.color, flexShrink: 0, fontWeight: 700,
                      }}>{i + 1}</span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14, color: '#475569' }}>
              <span style={{ fontSize: 56 }}>🫀</span>
              <p style={{ fontSize: 16, fontWeight: 600 }}>Select a body system</p>
              <p style={{ fontSize: 13 }}>Choose from the sidebar to explore structures and functions.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
