import { useState, lazy, Suspense } from "react";

import {
  BookOpen, Briefcase, Code2, FileText, Globe, Layers3, Mail,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useThemeToggle } from "@/hooks/use-theme-toggle";
import { scrollToId } from "@/lib/utils";
import { LINKS } from "@/constants/links";

import { TopNav } from "@/components/sections/top-nav";
import { IntroHeader } from "@/components/sections/intro-header";
import { OverviewTab } from "@/components/sections/overview-tab";
import { AboutSection } from "@/components/sections/about-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ConnectSection } from "@/components/sections/connect-section";
import { ServicesTab } from "@/components/sections/services-tab";
import { CaseStudyTab } from "@/components/sections/case-study-tab";
import { CloudTab } from "@/components/sections/cloud-tab";
import { AiTab } from "@/components/sections/ai-tab";
import { HighlightsCards } from "@/components/sections/highlights-cards";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import { ResumeModal } from "@/components/shared/resume-modal";
import { ProjectCard } from "@/components/shared/project-docs-modal";
import { DocTile } from "@/components/shared/doc-tile";
import { AdminPage } from "@/components/sections/admin-page";

import { DemoGrid } from "@/components/shared/demo-grid";

// Lazy-loaded — only bundled when the Cheatsheets tab is first visited
const CheatsheetApp = lazy(() => import("@/features/cheatsheets"));

function CheatsheetsSkeleton() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-36 rounded-[var(--radius)]" />)}
      </div>
    </div>
  );
}

export default function App() {
  // Simple client-side route — no React Router needed
  if (window.location.pathname === "/admin") {
    return <AdminPage />;
  }

  const { isDark, toggle } = useThemeToggle();
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  function navJump(tab: string) {
    setActiveTab(tab);
    setTimeout(() => scrollToId(tab), 80);
  }

  return (
    <div className="min-h-dvh">
      <TopNav isDark={isDark} onToggleTheme={toggle} onNavJump={navJump} />

      <main className="w-full max-w-6xl px-4 sm:px-8 md:px-12 lg:px-16 pb-16 mx-auto">
        <IntroHeader />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <div className="w-full max-w-full overflow-x-hidden">
            <TabsList className="tab-rail w-full justify-start flex-nowrap gap-1">
              <TabsTrigger className="shrink-0 whitespace-nowrap" value="overview">
                <Globe className="w-4 h-4" /> Overview
              </TabsTrigger>
              <TabsTrigger className="shrink-0 whitespace-nowrap" value="about">
                <FileText className="w-4 h-4" /> About
              </TabsTrigger>
              <TabsTrigger className="shrink-0 whitespace-nowrap" value="experience">
                <Briefcase className="w-4 h-4" /> Experience
              </TabsTrigger>
              <TabsTrigger className="shrink-0 whitespace-nowrap" value="projects">
                <Code2 className="w-4 h-4" /> Projects
              </TabsTrigger>
              <TabsTrigger className="shrink-0 whitespace-nowrap" value="cheatsheets">
                <BookOpen className="w-4 h-4" /> Cheatsheets
              </TabsTrigger>
              <TabsTrigger className="shrink-0 whitespace-nowrap" value="docs">
                <BookOpen className="w-4 h-4" /> Docs
              </TabsTrigger>
              <TabsTrigger className="shrink-0 whitespace-nowrap" value="connect">
                <Mail className="w-4 h-4" /> Connect
              </TabsTrigger>
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

          <TabsContent value="overview"><OverviewTab /></TabsContent>

          <TabsContent value="about">
            <div id="about" className="scroll-mt-24"><AboutSection /></div>
          </TabsContent>

          <TabsContent value="experience">
            <div id="experience" className="scroll-mt-24">
              <ExperienceSection onViewResume={() => setShowResumeModal(true)} />
            </div>
          </TabsContent>

<TabsContent value="projects">
  <div className="flex flex-col gap-8">

    {/* ── PUBLIC DEMOS ─────────────────────────────────────────────────── */}
    <section>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
          Interactive Demos
        </h2>
        <div className="flex-1 h-px bg-border" />
        <span className="text-[10px] font-mono text-muted-foreground border border-border rounded-full px-2 py-0.5">
          Public
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-5 max-w-prose">
        Standalone tools and apps — open directly in your browser, installable as PWAs where supported.
      </p>

      {/* DemoGrid auto-reads /projects/projects.json — add slugs there to surface new demos */}
      <DemoGrid />
    </section>

    {/* ── CASE STUDIES / LOCKED DOCS ───────────────────────────────────── */}
    <section>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
          Case Studies
        </h2>
        <div className="flex-1 h-px bg-border" />
        <span className="text-[10px] font-mono text-muted-foreground border border-border rounded-full px-2 py-0.5">
          Docs
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-5 max-w-prose">
        In-depth technical documentation for production systems — available on request.
      </p>

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
    </section>

  </div>
</TabsContent>
{/*           <TabsContent value="projects">
            <div className="grid gap-4 md:grid-cols-2">
              <ProjectCard title="Digital Mortgage Workflow" desc="DocuSign + eOriginal integration with automated routing, eVaulting, and audit‑grade lifecycle tracking." href={`${LINKS.docs}/projects/digital-mortgage`} tags={["DocuSign", "eOriginal", "AWS", "Automation"]} />
              <ProjectCard title="AI Document Processing" desc="LLM‑powered classification, extraction, and workflow routing for enterprise document pipelines." href={`${LINKS.docs}/projects/ai-docs`} tags={["AI/ML", "Python", "FastAPI", "OpenAI"]} />
              <ProjectCard title="Cloud‑Native Platform" desc="Multi‑service architecture deployed on AWS with Docker, ECS, CI/CD, and observability." href={`${LINKS.docs}/projects/cloud-platform`} tags={["AWS", "Docker", "CI/CD", "Architecture"]} />
              <ProjectCard title="Workflow Automation Suite" desc="Full‑stack automation tools for internal operations, approvals, and document lifecycle management." href={`${LINKS.docs}/projects/workflow-automation`} tags={["React", "Node", "Automation", "DX"]} />
              <ProjectCard title="TrakTeam" desc="Multi-platform operational tooling for crew workflows and commissary ordering." href={`${LINKS.docs}/projects/trakteam/overview`} tags={["SwiftUI", "Operations", "Inventory"]} />
              <ProjectCard title="CodeVault" desc="Multi-platform snippet management, formatting, and future cloud sync." href={`${LINKS.docs}/projects/codevault/overview`} tags={["SwiftUI", "DevTools", "Productivity"]} />
            </div>
          </TabsContent> */}

          {/* Lazy-loaded cheatsheets feature */}
          <TabsContent value="cheatsheets">
            <Suspense fallback={<CheatsheetsSkeleton />}>
              <CheatsheetApp />
            </Suspense>
          </TabsContent>

          <TabsContent value="docs">
            <Card>
              <CardHeader>
                <CardTitle>Developer Guides (Docs Site)</CardTitle>
                <CardDescription>Structured content, searchable, versionable.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                <DocTile icon={<BookOpen className="w-4 h-4" />} title="Developer Guides" href={`${LINKS.docs}/developer-guides`} items={["Tooling", "Frontend", "Backend"]} />
                <DocTile icon={<Layers3 className="w-4 h-4" />} title="Deep Dives" href={`${LINKS.docs}/deep-dives`} items={["Architecture", "Performance"]} />
                <DocTile icon={<FileText className="w-4 h-4" />} title="Cheatsheets" href={`${LINKS.docs}/cheatsheets`} items={["Git", "Node", "DNS"]} />
                <DocTile icon={<Globe className="w-4 h-4" />} title="General" href={`${LINKS.docs}/general`} items={["Notes", "Reference"]} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connect">
            <div id="connect" className="scroll-mt-24"><ConnectSection /></div>
          </TabsContent>
          <TabsContent value="services">
            <div id="services" className="scroll-mt-24"><ServicesTab /></div>
          </TabsContent>
          <TabsContent value="case-study">
            <div id="case-study" className="scroll-mt-24"><CaseStudyTab /></div>
          </TabsContent>
          <TabsContent value="cloud">
            <div id="cloud" className="scroll-mt-24"><CloudTab /></div>
          </TabsContent>
          <TabsContent value="ai">
            <div id="ai" className="scroll-mt-24"><AiTab /></div>
          </TabsContent>
        </Tabs>

        <ResumeModal open={showResumeModal} onOpenChange={setShowResumeModal} />
        <Separator className="my-10" />
        <HighlightsCards onJump={navJump} />
        <Separator className="my-10" />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
