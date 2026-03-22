import { useState, useRef, useEffect } from 'react'
import type { AnatomyTerm } from '../data/anatomyData'
import { SYSTEM_COLORS } from '../data/anatomyData'

interface Props {
  terms: AnatomyTerm[]
}

interface Node {
  id: string
  x: number
  y: number
  term: AnatomyTerm
}

interface Edge {
  from: string
  to: string
  relationship: string
  strength: string
}

export function ConceptWeb({ terms }: Props) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [filter, setFilter] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const W = 900
  const H = 600

  // Layout nodes in a force-directed-like arrangement
  const nodes: Node[] = terms.map((term, i) => {
    const systemTerms = terms.filter(t => t.system === term.system)
    const sysIdx = systemTerms.indexOf(term)
    const systemAngle = (Object.keys(SYSTEM_COLORS).indexOf(term.system) / Object.keys(SYSTEM_COLORS).length) * Math.PI * 2

    // Group by system in clusters
    const clusterR = 190
    const nodeR = 55
    const cx = W / 2 + Math.cos(systemAngle) * clusterR
    const cy = H / 2 + Math.sin(systemAngle) * clusterR
    const nodeAngle = (sysIdx / systemTerms.length) * Math.PI * 2
    return {
      id: term.id,
      x: cx + Math.cos(nodeAngle) * nodeR,
      y: cy + Math.sin(nodeAngle) * nodeR,
      term,
    }
  })

  const edges: Edge[] = []
  terms.forEach(term => {
    term.conceptConnections.forEach(conn => {
      if (!edges.find(e => (e.from === term.id && e.to === conn.termId) || (e.from === conn.termId && e.to === term.id))) {
        edges.push({ from: term.id, to: conn.termId, relationship: conn.relationship, strength: conn.strength })
      }
    })
  })

  const visibleNodes = filter ? nodes.filter(n => n.term.system === filter) : nodes
  const visibleIds = new Set(visibleNodes.map(n => n.id))
  const visibleEdges = edges.filter(e => visibleIds.has(e.from) && visibleIds.has(e.to))

  function getNode(id: string) { return nodes.find(n => n.id === id) }

  const selectedTerm = selectedNode ? terms.find(t => t.id === selectedNode) : null

  return (
    <div className="concept-web">
      <div className="web-controls">
        <button
          className={`web-filter-btn ${filter === null ? 'active' : ''}`}
          onClick={() => setFilter(null)}
        >All Systems</button>
        {Object.keys(SYSTEM_COLORS).map(sys => (
          <button
            key={sys}
            className={`web-filter-btn ${filter === sys ? 'active' : ''}`}
            style={{ '--sys-color': SYSTEM_COLORS[sys as keyof typeof SYSTEM_COLORS] } as React.CSSProperties}
            onClick={() => setFilter(filter === sys ? null : sys)}
          >
            {sys}
          </button>
        ))}
      </div>

      <div className="web-container">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="concept-svg"
        >
          <defs>
            {Object.entries(SYSTEM_COLORS).map(([sys, color]) => (
              <radialGradient key={sys} id={`grad-${sys}`} cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={color} stopOpacity="0.5" />
              </radialGradient>
            ))}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Edges */}
          {visibleEdges.map((edge, i) => {
            const fromNode = getNode(edge.from)
            const toNode = getNode(edge.to)
            if (!fromNode || !toNode) return null
            const isHighlighted = selectedNode === edge.from || selectedNode === edge.to
            const opacity = selectedNode ? (isHighlighted ? 0.9 : 0.1) : 0.3
            const strokeWidth = edge.strength === 'strong' ? 2 : edge.strength === 'moderate' ? 1.5 : 1

            return (
              <g key={i}>
                <line
                  x1={fromNode.x} y1={fromNode.y}
                  x2={toNode.x} y2={toNode.y}
                  stroke={isHighlighted ? '#fff' : '#ffffff'}
                  strokeWidth={strokeWidth}
                  strokeOpacity={opacity}
                  strokeDasharray={edge.strength === 'weak' ? '4 4' : 'none'}
                />
                {isHighlighted && (
                  <text
                    x={(fromNode.x + toNode.x) / 2}
                    y={(fromNode.y + toNode.y) / 2 - 6}
                    fill="rgba(255,255,255,0.7)"
                    fontSize="9"
                    textAnchor="middle"
                  >
                    {edge.relationship}
                  </text>
                )}
              </g>
            )
          })}

          {/* Nodes */}
          {visibleNodes.map(node => {
            const isSelected = selectedNode === node.id
            const isHovered = hoveredNode === node.id
            const isConnected = selectedNode
              ? edges.some(e => (e.from === selectedNode && e.to === node.id) || (e.to === selectedNode && e.from === node.id))
              : false
            const isDimmed = selectedNode && !isSelected && !isConnected

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle
                  r={isSelected ? 28 : isHovered ? 24 : 20}
                  fill={`url(#grad-${node.term.system})`}
                  opacity={isDimmed ? 0.2 : 1}
                  filter={isSelected || isHovered ? 'url(#glow)' : undefined}
                  stroke={isSelected ? '#fff' : 'rgba(255,255,255,0.3)'}
                  strokeWidth={isSelected ? 2.5 : 1}
                  style={{ transition: 'all 0.2s ease' }}
                />
                <text
                  y={1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={isSelected ? 20 : 16}
                  opacity={isDimmed ? 0.2 : 1}
                >
                  {node.term.emoji}
                </text>
                <text
                  y={isSelected ? 40 : 32}
                  textAnchor="middle"
                  fill="white"
                  fontSize={isSelected ? 11 : 9}
                  opacity={isDimmed ? 0.2 : isSelected || isHovered ? 1 : 0.8}
                  style={{ transition: 'all 0.2s ease' }}
                >
                  {node.term.term}
                </text>
              </g>
            )
          })}
        </svg>

        {selectedTerm && (
          <div className="web-detail-panel">
            <button className="web-close" onClick={() => setSelectedNode(null)}>×</button>
            <div className="wdp-emoji">{selectedTerm.emoji}</div>
            <h3 className="wdp-term">{selectedTerm.term}</h3>
            <p className="wdp-def">{selectedTerm.definition.split('.')[0]}.</p>
            <div className="wdp-connections">
              <strong>Connections ({selectedTerm.conceptConnections.length}):</strong>
              {selectedTerm.conceptConnections.map((c, i) => {
                const ct = terms.find(t => t.id === c.termId)
                return ct ? (
                  <button
                    key={i}
                    className="wdp-conn"
                    onClick={() => setSelectedNode(c.termId)}
                  >
                    {ct.emoji} {ct.term} <span className="wdp-rel">{c.relationship}</span>
                  </button>
                ) : null
              })}
            </div>
            <div className="wdp-ety">
              <strong>Etymology:</strong> {selectedTerm.etymology.fullBreakdown}
            </div>
          </div>
        )}
      </div>

      <div className="web-legend">
        <span>Line thickness = connection strength</span>
        <span>·</span>
        <span>Dashed = weak connection</span>
        <span>·</span>
        <span>Click node to explore</span>
      </div>
    </div>
  )
}
