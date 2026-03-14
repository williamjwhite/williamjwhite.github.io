import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

/* ── Math CAPTCHA shared helper ── */
type Q = { prompt: string; answer: string };
const QUESTIONS: Q[] = [
  { prompt: "What is 5 + 3?", answer: "8" },
  { prompt: "What is 12 − 7?", answer: "5" },
  { prompt: "What is 3 × 3?", answer: "9" },
  { prompt: "What is 6 + 8?", answer: "14" },
];
const rq = (): Q => QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];

type Status = "idle" | "verified" | "sent" | "error";

export function ContactForm() {
  const [q, setQ] = useState<Q>(rq);
  const [captcha, setCaptcha] = useState("");
  const [captchaOk, setCaptchaOk] = useState(false);
  const [captchaErr, setCaptchaErr] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [submitting, setSubmitting] = useState(false);

  const captchaRef = useRef<HTMLInputElement>(null);

  function verifyCaptcha() {
    if (captcha.trim() === q.answer) {
      setCaptchaOk(true);
      setCaptchaErr("");
    } else {
      setCaptchaErr("Incorrect answer. Try again.");
      setCaptcha("");
      setQ(rq());
      captchaRef.current?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!captchaOk) { setCaptchaErr("Please verify you are human first."); return; }
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      /* Replace with your actual form endpoint (Formspree, Resend, etc.) */
      const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setStatus("sent");
        setName(""); setEmail(""); setMessage("");
        setCaptcha(""); setCaptchaOk(false); setQ(rq());
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle className="w-8 h-8 text-primary" />
        <p className="text-sm font-semibold">Message sent — I'll be in touch soon.</p>
        <Button variant="outline" size="sm" onClick={() => setStatus("idle")}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="font-medium">Name</label>
          <input
            required
            className="w-full px-3 py-2 border rounded-md bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="font-medium">Email</label>
          <input
            required
            type="email"
            className="w-full px-3 py-2 border rounded-md bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="font-medium">Message</label>
        <textarea
          required
          rows={4}
          className="w-full px-3 py-2 border rounded-md bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {/* Human verification */}
      <div className="p-4 space-y-2 border rounded-xl border-border bg-muted/40">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Human Verification
        </p>
        {captchaOk ? (
          <p className="flex items-center gap-1.5 text-sm text-primary font-medium">
            <CheckCircle className="w-4 h-4" /> Verified
          </p>
        ) : (
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-1">
              <label className="font-medium">{q.prompt}</label>
              <input
                ref={captchaRef}
                inputMode="numeric"
                className="w-full px-3 py-2 border rounded-md bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring"
                value={captcha}
                onChange={(e) => { setCaptcha(e.target.value); setCaptchaErr(""); }}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), verifyCaptcha())}
              />
              {captchaErr && <p className="text-xs text-destructive">{captchaErr}</p>}
            </div>
            <Button type="button" variant="outline" onClick={verifyCaptcha}>
              Verify
            </Button>
          </div>
        )}
      </div>

      {status === "error" && (
        <p className="text-xs text-destructive">
          Something went wrong. Try emailing me directly at hello@williamjwhite.me
        </p>
      )}

      <Button type="submit" disabled={submitting || !captchaOk} className="w-full">
        {submitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
