import * as React from "react";
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

  React.useEffect(() => {
    const theme = isDark ? "dark" : "light";
    document.documentElement.classList.toggle("dark", isDark);
    setThemeCookie(theme);
  }, [isDark]);

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

  return (
    <div className="min-h-dvh">
      <TopNav isDark={isDark} onToggleTheme={toggle} />

      <main className="w-full max-w-6xl px-4 pb-16 mx-auto">
        <IntroHeader />

        {/* Tabs moved up: directly below intro + avatar */}
        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="justify-start w-full">
            <TabsTrigger value="overview">
              <Globe className="w-4 h-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="about">
              <FileText className="w-4 h-4" /> About
            </TabsTrigger>
            <TabsTrigger value="experience">
              <Briefcase className="w-4 h-4" /> Experience
            </TabsTrigger>
            <TabsTrigger value="projects">
              <Code2 className="w-4 h-4" /> Projects
            </TabsTrigger>
            <TabsTrigger value="docs">
              <BookOpen className="w-4 h-4" /> Docs
            </TabsTrigger>
            <TabsTrigger value="connect">
              <Mail className="w-4 h-4" /> Connect
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <TwoCol
              left={
                <Card>
                  <CardHeader>
                    <CardTitle>What this site is</CardTitle>
                    <CardDescription>
                      A combination of my Professional experience, current and
                      past projects, resouces and tools I use, guides I've
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
                        You'll find About, Experience, and how to contact me in
                        the Connect section.
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
        </Tabs>

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
                Full Stack Developer
              </div>
              <h1 className="text-2xl font-black tracking-tight md:text-3xl">
                William J. White
              </h1>
            </div>
          </div>

          <p className="mt-4 text-base text-muted-foreground">
            I enjoy Architecting Scalable Solutions, Empowering Teams, and
            Elevating Customer Success
            {/* I build maintainable full-stack systems with strong
            developer experience: design systems, documentation, automation, and
            pragmatic architecture. */}
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
            <Badge>React</Badge>
            <Badge>Laravel</Badge>
            <Badge>SwiftUI</Badge>
            <Badge>Docs-as-Product</Badge>
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
                  <Truck className="w-4 h-4" />
                </span>
                <div>Relocating back to New York from Seattle.</div>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">
                  <Search className="w-4 h-4" />
                </span>
                <div>
                  Reviewing fulltime opportunities in the New York area.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">
                  <MessageCircleQuestionMark className="w-4 h-4" />
                </span>
                <div>Client consultaitons.</div>
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
          With over two decades of experience spanning software development, IT,
          customer success, and enterprise architecture, I specialize in
          bridging technical execution with business strategy. My career has
          evolved from Tier III technical support and full stack development to
          leading roles in customer success, project management, and solutions
          architecture. I thrive at designing scalable systems, guiding teams
          through complex transformations, and ensuring technology delivers
          measurable business outcomes. Whether architecting cloud-native
          solutions, driving customer adoption, or mentoring technical teams, I
          bring a proven ability to align innovation with impact.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <Stat
            label="Focus"
            value="Full Stack"
            icon={<Terminal className="w-4 h-4" />}
          />
          <Stat
            label="Primary stack"
            value="React • Laravel • SwiftUI"
            icon={<Code2 className="w-4 h-4" />}
          />
          <Stat
            label="Strength"
            value="DX + Docs"
            icon={<BookOpen className="w-4 h-4" />}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge>Systems Thinking</Badge>
          <Badge>Design Systems</Badge>
          <Badge>Automation</Badge>
          <Badge>Observability</Badge>
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
          From Full Stack to Enterprise Strategy: 20+ Years of Building,
          Leading, and Transforming Technology
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <Stat
            label="Delivery"
            value="Product-grade"
            icon={<Layers3 className="w-4 h-4" />}
          />
          <Stat
            label="Bias"
            value="Maintainability"
            icon={<FileText className="w-4 h-4" />}
          />
          <Stat
            label="Ops"
            value="Practical"
            icon={<Terminal className="w-4 h-4" />}
          />
        </div>

        <div className="mt-6">
          <Accordion type="single" collapsible>
            <AccordionItem value="highlights">
              <AccordionTrigger>Highlights</AccordionTrigger>
              <AccordionContent>
                <ul className="pl-5 list-disc">
                  <li>
                    Builds developer-first systems: tooling, docs, automation.
                  </li>
                  <li>
                    Strong UI systems: shadcn/Tailwind, design tokens,
                    consistent navigation.
                  </li>
                  <li>
                    Operational focus: deployment, performance, maintainability.
                  </li>
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

// function IconLink({
//   href,
//   label,
//   icon,
// }: {
//   href: string;
//   label: string;
//   icon: React.ReactNode;
// }) {
//   return (
//     <a
//       href={href}
//       className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold transition border rounded-xl border-border bg-card hover:bg-muted/50"
//     >
//       <span className="text-primary">{icon}</span>
//       {label}
//     </a>
//   );
// }
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// export default function App() {
//   return (
//     <div className="min-h-dvh bg-background text-foreground">
//       <main className="max-w-5xl px-4 py-12 mx-auto">
//         <div className="grid gap-8 md:grid-cols-2 md:items-center">
//           <div className="space-y-4">
//             <div className="inline-flex items-center px-3 py-1 text-xs border rounded-full text-muted-foreground">
//               GitHub Pages • Vite • Tailwind v4 • shadcn/ui
//             </div>
//             <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
//               William J. White
//             </h1>
//             <p className="text-pretty text-muted-foreground">
//               Shipping maintainable full-stack systems with strong developer experience.
//             </p>
//             <div className="flex flex-col gap-2 sm:flex-row">
//               <Button asChild>
//                 <a href="mailto:you@williamjwhite.me">Contact</a>
//               </Button>
//               <Button variant="outline" asChild>
//                 <a href="https://github.com/williamjwhite" target="_blank" rel="noreferrer">
//                   GitHub
//                 </a>
//               </Button>
//             </div>
//           </div>

//           <Card>
//             <CardHeader>
//               <CardTitle>Now</CardTitle>
//               <CardDescription>Initial landing page is live.</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-2 text-sm text-muted-foreground">
//               <div>• Hooking up `williamjwhite.me` → GitHub Pages</div>
//               <div>• Tailwind v4 working without CLI init</div>
//               <div>• shadcn-style UI components ready</div>
//             </CardContent>
//           </Card>
//         </div>
//       </main>
//     </div>
//   );
// }
