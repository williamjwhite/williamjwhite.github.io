import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ── Simple math CAPTCHA with rotating questions ── */
type Question = { prompt: string; answer: string };

const QUESTIONS: Question[] = [
  { prompt: "What is 3 + 4?", answer: "7" },
  { prompt: "What is 9 − 5?", answer: "4" },
  { prompt: "What is 2 × 6?", answer: "12" },
  { prompt: "What is 15 − 8?", answer: "7" },
  { prompt: "What is 4 + 9?", answer: "13" },
];

function randomQuestion(): Question {
  return QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
}

export function ResumeModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [question, setQuestion] = useState<Question>(randomQuestion);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Rotate question + reset state when modal opens */
  useEffect(() => {
    if (open) {
      setQuestion(randomQuestion());
      setAnswer("");
      setError("");
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  /* Countdown when locked */
  useEffect(() => {
    if (locked && lockTimer > 0) {
      timerRef.current = setInterval(() => {
        setLockTimer((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setLocked(false);
            setAttempts(0);
            setQuestion(randomQuestion());
            setAnswer("");
            setError("");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [locked, lockTimer]);

  function handleVerify() {
    if (locked) return;

    if (answer.trim() === question.answer) {
      window.open("/resume.pdf", "_blank", "noopener,noreferrer");
      onOpenChange(false);
      setAnswer("");
      setAttempts(0);
      setError("");
    } else {
      const next = attempts + 1;
      setAttempts(next);
      setAnswer("");

      if (next >= 3) {
        setLocked(true);
        setLockTimer(30);
        setError("Too many incorrect attempts. Please wait 30 seconds.");
      } else {
        setError(`Incorrect. ${3 - next} attempt${3 - next === 1 ? "" : "s"} remaining.`);
        setQuestion(randomQuestion()); // rotate on wrong answer
      }
      inputRef.current?.focus();
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleVerify();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Human Verification
          </DialogTitle>
          <DialogDescription>
            Answer the question below to access the resume.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div className="space-y-2">
            <label className="text-sm font-medium">{question.prompt}</label>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              disabled={locked}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder={locked ? `Locked — wait ${lockTimer}s` : "Your answer"}
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setError("");
              }}
              onKeyDown={handleKey}
            />
            {error && (
              <p className="text-xs font-medium text-destructive">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleVerify} disabled={locked || !answer.trim()}>
              {locked ? `Wait ${lockTimer}s` : "Verify & Open Resume"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
