import { useState, useRef, useEffect } from 'react'
import type { AnatomyTerm } from '../data/anatomyData'

interface Props { terms: AnatomyTerm[] }

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const STARTER_QUESTIONS = [
  'How does the cardiovascular and respiratory system work together?',
  'Explain the etymology of "tachycardia" and related heart terms',
  'What is homeostasis and how does the endocrine system maintain it?',
  'How do osteoblasts and osteoclasts work together in bone remodeling?',
  'What is the difference between an axon and a dendrite?',
  'Explain how the immune system uses different types of blood cells',
  'Why is the liver considered the body\'s chemical factory?',
  'What Greek or Latin roots are most common in medical terminology?',
]

const SYSTEM_PROMPT = (termsContext: string) => `You are Dr. Morgan, a brilliant and warm anatomy and physiology professor with deep expertise in medical etymology. You make complex concepts vivid and memorable.

You have access to the following terms from the student's study app:
${termsContext}

Your teaching style:
- Always connect terminology to its Greek/Latin roots to make it memorable
- Use vivid analogies and real-world comparisons
- Point out fascinating connections between different body systems  
- Highlight when terms share etymology roots (e.g., "-cyte" in erythrocyte, leukocyte, thrombocyte all mean "cell")
- Mention mnemonics when helpful
- Format responses with occasional **bold** for key terms and emoji for visual interest
- Keep responses conversational but substantive (150-300 words typical)
- End responses with a thought-provoking question or interesting fact to encourage further exploration

When explaining concepts, always tie the word origin to the meaning — students remember terminology much better this way.`

export function ProfessorChat({ terms }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I'm **Dr. Morgan**, your anatomy and physiology guide. 🎓\n\nI'm here to help you understand the body's systems, decode medical terminology through etymology, and see how everything connects.\n\nI can see you're studying ${terms.length} terms across ${new Set(terms.map(t => t.system)).size} body systems. What would you like to explore today?\n\nYou might ask me about word origins, how systems interact, or why certain conditions are named the way they are. The etymology of medical terms is absolutely fascinating!`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const termsContext = terms.map(t =>
    `- ${t.term} (${t.system}): ${t.definition.slice(0, 80)}... Etymology: ${t.etymology.fullBreakdown.slice(0, 80)}`
  ).join('\n')

  async function sendMessage(text?: string) {
    const messageText = text || input.trim()
    if (!messageText || loading) return

    const userMessage: Message = { role: 'user', content: messageText, timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT(termsContext),
          messages: [
            ...messages.slice(1).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: messageText },
          ],
        }),
      })

      if (!response.ok) throw new Error(`API error: ${response.status}`)

      const data = await response.json()
      const assistantText = data.content?.find((c: { type: string; text?: string }) => c.type === 'text')?.text || 'Sorry, I could not generate a response.'

      setMessages(prev => [...prev, { role: 'assistant', content: assistantText, timestamp: new Date() }])
    } catch (err) {
      setError('Could not connect to the AI professor. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  function renderMessage(content: string) {
    // Simple markdown-ish rendering
    const parts = content.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <div className="professor-chat">
      <div className="prof-header">
        <div className="prof-avatar">👨‍🏫</div>
        <div className="prof-info">
          <div className="prof-name">Dr. Morgan</div>
          <div className="prof-title">AI Anatomy & Etymology Professor</div>
        </div>
        <div className="prof-status">
          <span className={`status-dot ${loading ? 'thinking' : 'online'}`} />
          {loading ? 'Thinking...' : 'Online'}
        </div>
      </div>

      <div className="prof-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`prof-message ${msg.role}`}>
            {msg.role === 'assistant' && <div className="msg-avatar">👨‍🏫</div>}
            <div className="msg-bubble">
              <div className="msg-content">
                {msg.content.split('\n').map((line, j) => (
                  <p key={j} style={{ margin: '0 0 6px' }}>{renderMessage(line)}</p>
                ))}
              </div>
              <div className="msg-time">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            {msg.role === 'user' && <div className="msg-avatar user-avatar">🧑‍💻</div>}
          </div>
        ))}

        {loading && (
          <div className="prof-message assistant">
            <div className="msg-avatar">👨‍🏫</div>
            <div className="msg-bubble">
              <div className="typing-indicator">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="prof-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="prof-starters">
        <div className="starters-label">Suggested questions:</div>
        <div className="starters-scroll">
          {STARTER_QUESTIONS.map((q, i) => (
            <button key={i} className="starter-btn" onClick={() => sendMessage(q)}>
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="prof-input-area">
        <textarea
          ref={inputRef}
          className="prof-input"
          placeholder="Ask Dr. Morgan anything about anatomy, physiology, or medical etymology..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          rows={2}
        />
        <button
          className="prof-send"
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
        >
          {loading ? '...' : '→'}
        </button>
      </div>
    </div>
  )
}
