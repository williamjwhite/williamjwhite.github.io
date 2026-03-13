
import * as React from "react";
import { useState } from "react";
import { getThemeCookie, setThemeCookie } from "@/lib/theme-cookie";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Code2,
  FileText,
  Github,
  Globe,
  Layers3,
  Mail,
  Map,
  Moon,
  Sun,
  Truck,
  Terminal,
  MessageCircleQuestionMark,
  Search,
  ShieldCheck,
  Clock,
  Cloud,
  CheckCircle,
  Zap,
} from "lucide-react";

import { LinkedinIcon } from "@/components/icons/linkedin-icon";

import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Separator } from "./components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion";
import { IconLink } from "./components/icon-link";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "./components/ui/dialog";

const LINKS = {
  docs: "https://docs.williamjwhite.me",
  github: "https://github.com/williamjwhite",
  linkedin: "https://www.linkedin.com/in/william-j-white-ny",
  email: "mailto:hello@williamjwhite.me",
};

function useThemeToggle() {
  const [isDark, setIsDark] = React.useState<boolean>(() => {
    return getThemeCookie() === "dark";
  });

  // Apply to DOM + persist cookie
  React.useEffect(() => {
    const theme = isDark ? "dark" : "light";
    document.documentElement.classList.toggle("dark", isDark);
    setThemeCookie(theme);
  }, [isDark]);

  // Re-sync from cookie when user comes back to this tab
  React.useEffect(() => {
    function syncFromCookie() {
      const cookie = getThemeCookie();
      if (!cookie) return;
      setIsDark(cookie === "dark");
    }

    // When the tab becomes active again (most reliable cross-site signal)
    function onVisibility() {
      if (document.visibilityState === "visible") syncFromCookie();
    }

    window.addEventListener("focus", syncFromCookie);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("focus", syncFromCookie);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return { isDark, toggle: () => setIsDark((v) => !v) };
}

function isExternalUrl(href: string) {
  return /^https?:\/\//i.test(href) || /^mailto:/i.test(href);
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function App() {
  const { isDark, toggle } = useThemeToggle();

  const [showResumeModal, setShowResumeModal] = useState(false);
  const [answer, setAnswer] = useState("");

  function handleVerify() {
    if (answer.trim() === "7") {
      window.open("/resume.pdf", "_blank", "noopener,noreferrer");
      setShowResumeModal(false);
    }
  }

  return (
    <div className="min-h-dvh">
      <TopNav isDark={isDark} onToggleTheme={toggle} />

      <main className="w-full max-w-6xl px-4 pb-16 mx-auto">
        <IntroHeader />

        {/* Tabs: mobile-safe horizontal scroll rail */}
        <Tabs defaultValue="overview" className="mt-6">
          {/* Wrapper ensures the TabsList can scroll without pushing layout wider */}
          <div className="w-full max-w-full overflow-x-hidden">
            <TabsList
              className={[
                "tab-rail", // defined in index.css below
                "w-full justify-start",
                "flex-nowrap",
                "gap-1",
              ].join(" ")}
            >
              <TabsTrigger
                className="shrink-0 whitespace-nowrap"
                value="overview"
              >
                <Globe className="w-4 h-4" /> Overview
              </TabsTrigger>

              <TabsTrigger className="shrink-0 whitespace-nowrap" value="about">
                <FileText className="w-4 h-4" /> About
              </TabsTrigger>

              <TabsTrigger
                className="shrink-0 whitespace-nowrap"
                value="experience"
              >
                <Briefcase className="w-4 h-4" /> Experience
              </TabsTrigger>

              <TabsTrigger
                className="shrink-0 whitespace-nowrap"
                value="projects"
              >
                <Code2 className="w-4 h-4" /> Projects
              </TabsTrigger>

              <TabsTrigger className="shrink-0 whitespace-nowrap" value="docs">
                <BookOpen className="w-4 h-4" /> Docs
              </TabsTrigger>

              <TabsTrigger
                className="shrink-0 whitespace-nowrap"
                value="connect"
              >
                <Mail className="w-4 h-4" /> Connect
              </TabsTrigger>
              {/* New Tabs */}
              <TabsTrigger className="shrink-0 whitespace-nowrap" value="services">
                <Layers3 className="w-4 h-4" /> Services
              </TabsTrigger>

              <TabsTrigger className="shrink-0 whitespace-nowrap" value="case-study">
                <FileText className="w-4 h-4" /> Case Study
              </TabsTrigger>

              <TabsTrigger className="shrink-0 whitespace-nowrap" value="cloud">
                <Globe className="w-4 h-4" /> Cloud Architecture
              </TabsTrigger>

              <TabsTrigger className="shrink-0 whitespace-nowrap" value="ai">
                <Code2 className="w-4 h-4" /> AI Automation
              </TabsTrigger>

            </TabsList>
          </div>

          <TabsContent value="overview">
            <TwoCol
              left={
                <Card>
                  <CardHeader>
                    <CardTitle>What this site is</CardTitle>
                    <CardDescription>
                      A combination of my Professional experience, current and
                      past projects, resouces and tools I use, guides I&apos;ve
                      created I hope you find useful.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="pl-5 text-sm list-disc text-muted-foreground">
                      <li>
                        My primary website: <strong>williamjwhite.me</strong>
                      </li>
                      <li>
                        Developer Guides + reference at{" "}
                        <strong>docs.williamjwhite.me</strong>
                      </li>
                      <li>
                        You&apos;ll find About, Experience, and how to contact
                        me in the Connect section.
                      </li>
                    </ul>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <Badge>React 19</Badge>
                      <Badge>Vite</Badge>
                      <Badge>Tailwind v4</Badge>
                      <Badge>shadcn/ui</Badge>
                    </div>
                  </CardContent>
                </Card>
              }
              right={
                <Card>
                  <CardHeader>
                    <CardTitle>Fast paths</CardTitle>
                    <CardDescription>
                      Where most visitors should go next.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <FastLink
                      icon={<FileText className="w-4 h-4" />}
                      title="About"
                      desc="Quick bio, focus areas, and working style."
                      href="#about"
                    />
                    <FastLink
                      icon={<Briefcase className="w-4 h-4" />}
                      title="Experience"
                      desc="High-signal summary with optional drill-down."
                      href="#experience"
                    />
                    <FastLink
                      icon={<Mail className="w-4 h-4" />}
                      title="Connect"
                      desc="Email + social links; fastest ways to reach me."
                      href="#connect"
                    />
                    <FastLink
                      icon={<BookOpen className="w-4 h-4" />}
                      title="Developer Guides"
                      desc="Guides, standards, tooling, and references."
                      href={LINKS.docs}
                    />
                  </CardContent>
                </Card>
              }
            />
          </TabsContent>

          <TabsContent value="about">
            <div id="about" className="scroll-mt-24">
              <AboutSection />
            </div>
          </TabsContent>

          <TabsContent value="experience">
            <div id="experience" className="scroll-mt-24">
              <ExperienceSection />
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <div className="grid gap-4 md:grid-cols-2">
              <ProjectCard
  title="Digital Mortgage Workflow"
  desc="DocuSign + eOriginal integration with automated routing, eVaulting, and audit‑grade lifecycle tracking."
  href={`${LINKS.docs}/projects/digital-mortgage`}
  tags={["DocuSign", "eOriginal", "AWS", "Automation"]}
/>

<ProjectCard
  title="AI Document Processing"
  desc="LLM‑powered classification, extraction, and workflow routing for enterprise document pipelines."
  href={`${LINKS.docs}/projects/ai-docs`}
  tags={["AI/ML", "Python", "FastAPI", "OpenAI"]}
/>

<ProjectCard
  title="Cloud‑Native Platform"
  desc="Multi‑service architecture deployed on AWS with Docker, ECS, CI/CD, and observability."
  href={`${LINKS.docs}/projects/cloud-platform`}
  tags={["AWS", "Docker", "CI/CD", "Architecture"]}
/>

<ProjectCard
  title="Workflow Automation Suite"
  desc="Full‑stack automation tools for internal operations, approvals, and document lifecycle management."
  href={`${LINKS.docs}/projects/workflow-automation`}
  tags={["React", "Node", "Automation", "DX"]}
/>

              <ProjectCard
                title="TrakTeam"
                desc="Multi-platform operational tooling for crew workflows and commissary ordering."
                href={`${LINKS.docs}/projects/trakteam/overview`}
                tags={["SwiftUI", "Operations", "Inventory"]}
              />
              <ProjectCard
                title="CodeVault"
                desc="Multi-platform snippet management, formatting, and future cloud sync."
                href={`${LINKS.docs}/projects/codevault/overview`}
                tags={["SwiftUI", "DevTools", "Productivity"]}
              />
            </div>
          </TabsContent>

          <TabsContent value="docs">
            <Card>
              <CardHeader>
                <CardTitle>Developer Guides (Docs Site)</CardTitle>
                <CardDescription>
                  Structured content, searchable, versionable.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                <DocTile
                  icon={<BookOpen className="w-4 h-4" />}
                  title="Developer Guides"
                  href={`${LINKS.docs}/developer-guides`}
                  items={["Tooling", "Frontend", "Backend"]}
                />
                <DocTile
                  icon={<Layers3 className="w-4 h-4" />}
                  title="Deep Dives"
                  href={`${LINKS.docs}/deep-dives`}
                  items={["Architecture", "Performance"]}
                />
                <DocTile
                  icon={<FileText className="w-4 h-4" />}
                  title="Cheatsheets"
                  href={`${LINKS.docs}/cheatsheets`}
                  items={["Git", "Node", "DNS"]}
                />
                <DocTile
                  icon={<Map className="w-4 h-4" />}
                  title="General"
                  href={`${LINKS.docs}/general`}
                  items={["Notes", "Reference"]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connect">
            <div id="connect" className="scroll-mt-24">
              <ConnectSection />
            </div>
          </TabsContent>
          {/* New Tabs - Content */}
          <TabsContent value="services">
            <div id="services" className="scroll-mt-24">
              <TwoCol
                left={
                  <Card>
                    <CardHeader>
                      <CardTitle>Services</CardTitle>
                      <CardDescription>
                        Full‑stack engineering, architecture, and workflow automation.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-muted-foreground">
                      <p>
                        I help organizations design, build, and scale secure digital
                        workflows, cloud‑native applications, and enterprise‑grade
                        eSignature systems. My work blends engineering depth with
                        solutions‑architecture clarity.
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <Badge>Full‑Stack</Badge>
                        <Badge>Cloud</Badge>
                        <Badge>DevOps</Badge>
                        <Badge>DocuSign</Badge>
                        <Badge>eOriginal</Badge>
                        <Badge>AI/ML</Badge>
                      </div>
                    </CardContent>
                  </Card>
                }
                right={
                  <Card>
                    <CardHeader>
                      <CardTitle>What I Deliver</CardTitle>
                      <CardDescription>High‑impact technical outcomes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                      <ul className="pl-5 list-disc">
                        <li>Full‑stack application development (React, Node, Python)</li>
                        <li>Cloud architecture & DevOps (AWS, Docker, CI/CD)</li>
                        <li>DocuSign API + eOriginal eVaulting integrations</li>
                        <li>Workflow automation & system modernization</li>
                        <li>AI‑powered document processing & routing</li>
                        <li>Technical leadership & digital transformation</li>
                      </ul>
                    </CardContent>
                  </Card>
                }
              />
            </div>
          </TabsContent>
          <TabsContent value="case-study">
            <div id="case-study" className="scroll-mt-24">
              <Card>
                <CardHeader>
                  <CardTitle>Case Study: Digital Mortgage Workflow</CardTitle>
                  <CardDescription>
                    DocuSign + eOriginal eVaulting architecture for regulated lending.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 text-sm text-muted-foreground">
                  <TwoCol
                    left={
                      <div className="space-y-3">
                        <Stat
                          label="Processing Time"
                          value="Days → Hours"
                          icon={<Clock className="w-4 h-4" />}
                        />
                        <Stat
                          label="Manual Work"
                          value="−70%"
                          icon={<Layers3 className="w-4 h-4" />}
                        />
                        <Stat
                          label="Compliance"
                          value="Fully Digital"
                          icon={<ShieldCheck className="w-4 h-4" />}
                        />
                      </div>
                    }
                    right={
                      <p>
                        Architected a fully digital mortgage workflow integrating
                        DocuSign, eOriginal, and internal LOS systems. Automated envelope
                        creation, routing, eVaulting, and audit‑grade event processing.
                      </p>
                    }
                  />

                  <Accordion type="single" collapsible>
                    <AccordionItem value="challenge">
                      <AccordionTrigger>Challenge</AccordionTrigger>
                      <AccordionContent>
                        Manual document handling, slow closing cycles, and compliance
                        friction across multiple systems.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="solution">
                      <AccordionTrigger>Solution</AccordionTrigger>
                      <AccordionContent>
                        <ul className="pl-5 list-disc">
                          <li>DocuSign API envelope automation</li>
                          <li>Webhook‑driven event processing</li>
                          <li>eOriginal eVaulting + secure transfer</li>
                          <li>Audit‑grade lifecycle tracking</li>
                          <li>Cloud‑native deployment</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="results">
                      <AccordionTrigger>Results</AccordionTrigger>
                      <AccordionContent>
                        <ul className="pl-5 list-disc">
                          <li>Closing time reduced from days to hours</li>
                          <li>Eliminated manual document handling</li>
                          <li>Improved compliance and audit readiness</li>
                          <li>Better borrower experience</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="cloud">
            <div id="cloud" className="scroll-mt-24">
              <Card>
                <CardHeader>
                  <CardTitle>Cloud Architecture</CardTitle>
                  <CardDescription>
                    Scalable, secure, cloud‑native deployment patterns.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <TwoCol
                    left={
                      <div className="space-y-3">
                        <Stat
                          label="Platform"
                          value="AWS"
                          icon={<Cloud className="w-4 h-4" />}
                        />
                        <Stat
                          label="Orchestration"
                          value="Docker / ECS"
                          icon={<Layers3 className="w-4 h-4" />}
                        />
                        <Stat
                          label="Deployments"
                          value="CI/CD"
                          icon={<Terminal className="w-4 h-4" />}
                        />
                      </div>
                    }
                    right={
                      <p>
                        Designed and deployed multi‑service cloud architectures using AWS,
                        Docker, ECS, and GitHub Actions. Focus on security, observability,
                        and zero‑downtime releases.
                      </p>
                    }
                  />

                  <div className="flex flex-wrap gap-2">
                    <Badge>AWS</Badge>
                    <Badge>Docker</Badge>
                    <Badge>CI/CD</Badge>
                    <Badge>PostgreSQL</Badge>
                    <Badge>Redis</Badge>
                    <Badge>API Gateway</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="ai">
            <div id="ai" className="scroll-mt-24">
              <Card>
                <CardHeader>
                  <CardTitle>AI Workflow Automation</CardTitle>
                  <CardDescription>
                    Intelligent document processing and routing.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <TwoCol
                    left={
                      <p>
                        Built AI‑powered systems that classify, extract, and route
                        documents using LLMs and embeddings. Integrated with existing
                        workflow systems for real‑time automation.
                      </p>
                    }
                    right={
                      <div className="space-y-3">
                        <Stat
                          label="Manual Review"
                          value="−85%"
                          icon={<Search className="w-4 h-4" />}
                        />
                        <Stat
                          label="Accuracy"
                          value="High"
                          icon={<CheckCircle className="w-4 h-4" />}
                        />
                        <Stat
                          label="Latency"
                          value="Low"
                          icon={<Zap className="w-4 h-4" />}
                        />
                      </div>
                    }
                  />

                  <Accordion type="single" collapsible>
                    <AccordionItem value="features">
                      <AccordionTrigger>Features</AccordionTrigger>
                      <AccordionContent>
                        <ul className="pl-5 list-disc">
                          <li>Document classification via embeddings</li>
                          <li>Field extraction using LLMs</li>
                          <li>Smart routing based on business rules</li>
                          <li>Real‑time audit logging</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </TabsContent>


        </Tabs>

        
        {/* Human Verification Modal */}
        <Dialog open={showResumeModal} onOpenChange={setShowResumeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Human Verification</DialogTitle>
              <DialogDescription>
                To protect against bots, please answer this simple question.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <label className="text-sm font-medium">What is 3 + 4?</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md bg-background"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>

            <div className="flex justify-end mt-4">
              <Button onClick={handleVerify}>Verify & Download</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Separator className="my-10" />

        <HighlightsCards onJump={(id) => scrollToId(id)} />

        <Separator className="my-10" />

        <CTA />

        <Footer />
      </main>
    </div>
  );
}

function TopNav({
  isDark,
  onToggleTheme,
}: {
  isDark: boolean;
  onToggleTheme: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/75 backdrop-blur">
      <div className="flex items-center justify-between max-w-6xl px-4 py-3 mx-auto">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 text-left"
        >
          <div className="grid font-black h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            W
          </div>
          <div className="leading-tight">
            <div className="text-sm font-extrabold">William J. White</div>
            <div className="text-xs text-muted-foreground">
              Portfolio • Projects • Docs
            </div>
          </div>
        </button>

        <nav className="items-center hidden gap-2 md:flex">
          <NavLink href="#about" label="About" />
          <NavLink href="#experience" label="Experience" />
          <NavLink href={LINKS.docs} label="Docs" />
          <NavLink href="#connect" label="Connect" />
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="inline-flex items-center justify-center transition rounded-full w-9 h-9 hover:bg-muted"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>
          <Button
            onClick={() =>
              window.open(LINKS.docs, "_blank", "noopener,noreferrer")
            }
            className="hidden sm:inline-flex"
          >
            Open Docs <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  const external = isExternalUrl(href);

  if (!external && href.startsWith("#")) {
    return (
      <button
        type="button"
        onClick={() => scrollToId(href.slice(1))}
        className="px-3 py-2 text-sm font-semibold transition rounded-xl text-foreground/80 hover:bg-muted hover:text-foreground"
      >
        {label}
      </button>
    );
  }

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      className="px-3 py-2 text-sm font-semibold transition rounded-xl text-foreground/80 hover:bg-muted hover:text-foreground"
    >
      {label}
    </a>
  );
}

function IntroHeader() {
  return (
    <section className="pt-10">
      <div className="grid gap-6 md:grid-cols-5 md:items-center">
        <div className="md:col-span-3">
          <div className="flex items-center gap-4">
            {/* Put your image at: public/headshot.jpg */}
            <img
              src="/headshot.png"
              alt="William J. White"
              className="object-cover w-16 h-16 border rounded-full border-border"
              loading="eager"
            />
            <div>
              <div className="text-sm font-semibold text-muted-foreground">
                Technical Solutions Architect & Full‑Stack Engineer
              </div>
              <h1 className="text-2xl font-black tracking-tight md:text-3xl">
                William J. White
              </h1>
            </div>
          </div>

          <p className="mt-4 text-base text-muted-foreground">
            I design and build scalable software systems, modernize digital workflows,
            and help organizations ship reliable, secure, and maintainable products.
            My work blends engineering depth with architecture clarity and a strong
            focus on developer experience.
          </p>

          <div className="flex flex-wrap gap-2 mt-5">
            <Button onClick={() => scrollToId("connect")}>
              Connect <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                window.open(LINKS.github, "_blank", "noopener,noreferrer")
              }
            >
              GitHub <Github className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                window.open(LINKS.email, "_blank", "noopener,noreferrer")
              }
            >
              Email <Mail className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge>Full‑Stack</Badge>
            <Badge>Cloud Architecture</Badge>
            <Badge>Workflow Automation</Badge>
            <Badge>eSignature Systems</Badge>
          </div>
        </div>

        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Now</CardTitle>
              <CardDescription>Current Projects and focus.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">
                  <Terminal className="w-4 h-4" />
                </span>
                <div>
                  This site - it's a work in progess. Started 12/12/2025
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">
                  <Terminal className="w-4 h-4" />
                </span>
                <div>Updating williamjwhite.me with new content and case studies.</div>
              </div>

              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">
                  <Truck className="w-4 h-4" />
                </span>
                <div>Recently relocated to New York from Seattle and exploring new opportunities.</div>
              </div>

              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">
                  <Search className="w-4 h-4" />
                </span>
                <div>Open to full‑time roles and consulting engagements.</div>
              </div>

              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">
                  <MessageCircleQuestionMark className="w-4 h-4" />
                </span>
                <div>Client consultations and architecture reviews.</div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function TwoCol({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {left}
      {right}
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-4 border rounded-2xl border-border bg-card">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-muted-foreground">
          {label}
        </div>
        <div className="text-primary">{icon}</div>
      </div>
      <div className="mt-2 text-lg font-black">{value}</div>
    </div>
  );
}

function AboutSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
        <CardDescription>Professional Summary</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          I’m a technical solutions architect and full‑stack engineer with deep
          experience across software development, cloud architecture, workflow
          automation, and enterprise eSignature systems. My background spans
          engineering, customer success, and IT operations — giving me a unique
          ability to bridge business needs with technical execution.
          <br /><br />
          I specialize in designing scalable systems, modernizing legacy workflows,
          and delivering solutions that are secure, maintainable, and built for
          long‑term success. Whether I’m building full‑stack applications, integrating
          DocuSign and eOriginal, or architecting cloud‑native platforms, I focus on
          clarity, reliability, and developer experience.
        </p>


        <div className="grid gap-4 md:grid-cols-3">
          <Stat label="Focus" value="Architecture + Engineering" icon={<Terminal className="w-4 h-4" />} />
          <Stat label="Primary Stack" value="React • Node • AWS" icon={<Code2 className="w-4 h-4" />} />
          <Stat label="Strength" value="DX + Automation" icon={<BookOpen className="w-4 h-4" />} />

        </div>

        <div className="flex flex-wrap gap-2">
          <Badge>Cloud</Badge>
          <Badge>Workflow Automation</Badge>
          <Badge>eSignature</Badge>
          <Badge>Systems Design</Badge>

        </div>
      </CardContent>
    </Card>
  );
}

function ExperienceSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Experience</CardTitle>
        <CardDescription>
          Engineering, architecture, and workflow automation across SaaS, financial
          services, digital mortgage, and enterprise platforms. I build systems that
          scale, teams that deliver, and processes that reduce operational friction.
        </CardDescription>

      </CardHeader>
      <CardContent>
        <Button
  onClick={() =>
    window.open("/resume.pdf", "_blank", "noopener,noreferrer")
  }
>
  <FileText className="w-4 h-4 mr-2" />
  View Resume
</Button>
      </CardContent>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          
          <Stat label="Delivery" value="Production‑grade" icon={<Layers3 className="w-4 h-4" />} />
          <Stat label="Bias" value="Simplicity + Maintainability" icon={<FileText className="w-4 h-4" />} />
          <Stat label="Ops" value="Secure + Observable" icon={<Terminal className="w-4 h-4" />} />

        </div>

        <div className="mt-6">
          <Accordion type="single" collapsible>
            <AccordionItem value="highlights">
              <AccordionTrigger>Highlights</AccordionTrigger>
              <AccordionContent>
                <ul className="pl-5 list-disc">
                  <li>Architected cloud‑native systems with strong security and observability.</li>
                  <li>Integrated DocuSign + eOriginal for regulated digital workflows.</li>
                  <li>Built full‑stack applications with React, Node, Python, and SwiftUI.</li>
                  <li>Designed developer‑first tooling, documentation, and automation.</li>
                  <li>Led technical delivery across cross‑functional teams.</li>
                </ul>

              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="timeline">
              <AccordionTrigger>Resume + detailed timeline</AccordionTrigger>
              <AccordionContent>
                <div className="text-sm text-muted-foreground">
                  Recommended: add <strong>/public/resume.pdf</strong> and link
                  it here.
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(
                        "/resume.pdf",
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    Open Resume PDF <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      window.open(LINKS.docs, "_blank", "noopener,noreferrer")
                    }
                  >
                    Docs (Deep Dives) <BookOpen className="w-4 h-4" />
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}

function ConnectSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect</CardTitle>
        <CardDescription>Fastest ways to reach me.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <ConnectTile
            icon={<Mail className="w-4 h-4" />}
            title="Email"
            desc="Best for hiring, consulting, and collaborations."
            href={LINKS.email}
          />
          <ConnectTile
            icon={<LinkedinIcon className="w-4 h-4" />}
            title="LinkedIn"
            desc="Professional networking and messaging."
            href={LINKS.linkedin}
          />
          <ConnectTile
            icon={<Github className="w-4 h-4" />}
            title="GitHub"
            desc="Repos, issues, and project work."
            href={LINKS.github}
          />
          <ConnectTile
            icon={<BookOpen className="w-4 h-4" />}
            title="Docs"
            desc="Guides, standards, deep dives."
            href={LINKS.docs}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge>Open to roles</Badge>
          <Badge>Consulting</Badge>
          <Badge>Partnerships</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function ConnectTile({
  icon,
  title,
  desc,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
}) {
  const external = isExternalUrl(href);
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      className="p-4 transition border rounded-2xl border-border bg-card hover:bg-muted/50"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-extrabold">
          <span className="text-primary">{icon}</span>
          {title}
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{desc}</div>
    </a>
  );
}

function FastLink({
  icon,
  title,
  desc,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
}) {
  const external = isExternalUrl(href);
  const isAnchor = href.startsWith("#");

  return (
    <a
      href={href}
      onClick={(e) => {
        if (isAnchor) {
          e.preventDefault();
          scrollToId(href.slice(1));
        }
      }}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      className="flex items-start justify-between gap-3 p-4 transition border rounded-2xl border-border bg-card hover:bg-muted/50"
    >
      <div>
        <div className="flex items-center gap-2 text-sm font-extrabold">
          <span className="text-primary">{icon}</span>
          {title}
        </div>
        <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
      </div>
      <ArrowRight className="w-4 h-4 mt-1 text-muted-foreground" />
    </a>
  );
}

function ProjectCard({
  title,
  desc,
  href,
  tags,
}: {
  title: string;
  desc: string;
  href: string;
  tags: string[];
}) {
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
        <Button
          variant="outline"
          onClick={() => window.open(href, "_blank", "noopener,noreferrer")}
        >
          View docs <ArrowRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function DocTile({
  icon,
  title,
  href,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
  items: string[];
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="p-4 transition border rounded-2xl border-border bg-card hover:bg-muted/50"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-extrabold">
          <span className="text-primary">{icon}</span>
          {title}
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="mt-2 text-sm text-muted-foreground">
        {items.join(" • ")}
      </div>
    </a>
  );
}

function HighlightsCards({ onJump }: { onJump: (id: string) => void }) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>Professional Summary</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Full-stack developer with a bias toward systems that are
            maintainable, documented, and ergonomic.
          </p>
          <div className="mt-4">
            <Button variant="outline" onClick={() => onJump("about")}>
              Jump to About <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Experience</CardTitle>
          <CardDescription>Highlights + resume path.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            High-signal summary with optional drill-down.
          </p>
          <div className="mt-4">
            <Button variant="outline" onClick={() => onJump("experience")}>
              Jump to Experience <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connect</CardTitle>
          <CardDescription>Hiring, consulting, collaborations.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Email is best for structured inquiries; LinkedIn for networking.
          </p>
          <div className="mt-4">
            <Button variant="outline" onClick={() => onJump("connect")}>
              Jump to Connect <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function CTA() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Developer Guides and Code</CardTitle>
        <CardDescription>
          Front-end, back-end, environement setup, design, framework and device
          setup and references.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground">
          Just some guides and code I use often and find useful.
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() =>
              window.open(LINKS.docs, "_blank", "noopener,noreferrer")
            }
          >
            Open Docs <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              window.open(LINKS.github, "_blank", "noopener,noreferrer")
            }
          >
            GitHub <Github className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Footer() {
  return (
    <footer className="pt-8 mt-12 border-t border-border">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} William J. White. Designed and developed
          with care.
        </div>

        <div className="flex flex-wrap gap-2">
          <IconLink
            href={LINKS.github}
            label="GitHub"
            icon={<Github className="w-4 h-4" />}
          />
          <IconLink
            href={LINKS.linkedin}
            label="LinkedIn"
            icon={<LinkedinIcon className="w-4 h-4" />}
          />
          <IconLink
            href={LINKS.docs}
            label="Docs"
            icon={<BookOpen className="w-4 h-4" />}
          />
          <IconLink
            href={LINKS.email}
            label="Email"
            icon={<Mail className="w-4 h-4" />}
          />
        </div>
      </div>
    </footer>
  );
}

