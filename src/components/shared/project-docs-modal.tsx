import * as React from "react";
import { ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// ─── Access Modal ─────────────────────────────────────────────────────────────

interface ProjectDocsModalProps {
  title: string;
  url: string;
}

export function ProjectDocsModal({ title, url }: ProjectDocsModalProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");

  // Remove Radix scroll lock when dialog closes
  React.useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-scroll-locked");
      // reset fields on close
      setName("");
      setEmail("");
      setCode("");
      setError("");
    }
  }, [open]);

  function handleSubmit() {
    setError("");

    // Access code path — takes priority
    if (code.trim() !== "") {
      if (code.trim().toLowerCase() === "letmein") {
        window.open(url, "_blank", "noopener,noreferrer");
        setOpen(false);
      } else {
        setError("Invalid access code.");
      }
      return;
    }

    // Name + email path
    if (!name.trim() || !email.trim()) {
      setError("Please enter your name and email, or use an access code.");
      return;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-1.5">
          <Lock className="w-3.5 h-3.5 text-destructive" />
          View docs
          <ArrowRight className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-md"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-destructive" />
            Request Access
          </DialogTitle>
          <DialogDescription>
            Enter your details or an access code to view documentation for{" "}
            <strong>{title}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2" onKeyDown={handleKey}>
          {/* Name + email */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Name &amp; email</p>
            <Input
              placeholder="Your name"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
            />
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Access code */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Access code</p>
            <Input
              placeholder="Enter access code"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(""); }}
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={!code.trim() && (!name.trim() || !email.trim())}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── ProjectCard with locked docs button ─────────────────────────────────────

interface ProjectCardProps {
  title: string;
  desc: string;
  href: string;
  tags: string[];
}

export function ProjectCard({ title, desc, href, tags }: ProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
        <ProjectDocsModal title={title} url={href} />
      </CardContent>
    </Card>
  );
}
