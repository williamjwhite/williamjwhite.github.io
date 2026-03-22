import { useState, useRef, useEffect } from 'react'
import { Lock } from 'lucide-react'
import { authenticate } from '../lib/storage'
import { Button } from '@/components/ui/button'

interface Props { onUnlock: () => void }

export function PinGate({ onUnlock }: Props) {
  const [digits, setDigits] = useState(['', '', '', ''])
  const [error, setError]   = useState(false)
  const [shake, setShake]   = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => { inputs.current[0]?.focus() }, [])

  function handleChange(i: number, val: string) {
    if (!/^\d?$/.test(val)) return
    const next = [...digits]
    next[i] = val
    setDigits(next)
    setError(false)
    if (val && i < 3) inputs.current[i + 1]?.focus()
    if (i === 3 && val) {
      const pin = [...next.slice(0, 3), val].join('')
      if (authenticate(pin)) {
        onUnlock()
      } else {
        setError(true)
        setShake(true)
        setTimeout(() => { setShake(false); setDigits(['', '', '', '']); inputs.current[0]?.focus() }, 600)
      }
    }
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputs.current[i - 1]?.focus()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-8">
      <div className="flex flex-col items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Lock size={22} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold">Editor locked</h2>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Enter your 4-digit PIN to access the cheatsheet editor.
        </p>
      </div>

      <div
        className="flex gap-3"
        style={shake ? { animation: 'cs-shake 0.5s ease' } : {}}
      >
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => { inputs.current[i] = el }}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className={[
              'h-14 w-12 text-center text-2xl font-mono rounded-[var(--radius)] border-2 bg-background focus:outline-none transition-all',
              error ? 'border-destructive text-destructive' : d ? 'border-primary' : 'border-border focus:border-primary/60',
            ].join(' ')}
          />
        ))}
      </div>

      {error && (
        <p className="text-sm text-destructive">Incorrect PIN — try again</p>
      )}

      <p className="text-xs text-muted-foreground">Default PIN: 1234 · Change it in Editor → Settings</p>

      <style>{`
        @keyframes cs-shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-6px); }
          40%      { transform: translateX(6px); }
          60%      { transform: translateX(-4px); }
          80%      { transform: translateX(4px); }
        }
      `}</style>
    </div>
  )
}
