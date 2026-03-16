// src/components/wizards/client-portal-modal.tsx
import * as React from "react";
import { LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function ClientPortalModal() {
  const [open,     setOpen]     = React.useState(false);
  const [email,    setEmail]    = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading,  setLoading]  = React.useState(false);
  const [error,    setError]    = React.useState("");

  function reset() { setEmail(""); setPassword(""); setError(""); }

  function handleClose(v: boolean) {
    if (!v) reset();
    setOpen(v);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError("Please enter your email and password."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/client/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const { redirectUrl } = await res.json();
        window.location.href = redirectUrl ?? "/client/dashboard";
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => setOpen(true)}>
        <LogIn className="w-3.5 h-3.5" /> Client Portal Login
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="w-4 h-4 text-primary" /> Client Portal
            </DialogTitle>
            <DialogDescription>
              Sign in to access your client dashboard.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLogin} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                disabled={loading}
                autoFocus
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                disabled={loading}
              />
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleClose(false)}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={loading || !email.trim() || !password.trim()}
                className="flex-1 gap-1.5"
              >
                {loading
                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Signing in…</>
                  : <><LogIn className="w-3.5 h-3.5" /> Sign In</>}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Need access?{" "}
              <a href="mailto:hello@williamjwhite.me" className="text-primary hover:underline">
                Contact William
              </a>
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
