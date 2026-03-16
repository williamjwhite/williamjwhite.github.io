#!/usr/bin/env node

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT = process.cwd()
const ICON_DIR = path.join(ROOT, "components/icons")
const CONFIG_DIR = path.join(ROOT, "config")

const outDir = path.join(__dirname, "test-files");


const lucideIcons = {
  react: "Atom",
  typescript: "FileCode",
  node: "Server",
  python: "Terminal",
  django: "Layers",
  flask: "FlaskConical",

  aws: "Cloud",
  docker: "Container",
  kubernetes: "Boxes",
  terraform: "Box",

  cicd: "Workflow",
  githubActions: "GitBranch",

  graphql: "Share2",
  rest: "Network",

  radix: "Component",
  tailwind: "Wind",
  shadcn: "Sparkles",

  observability: "Activity",
  automation: "Bot",

  docusign: "PenLine",
  evault: "Archive",
  mortgage: "FileText"
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function iconComponent(name, lucide) {
  return `
import { ${lucide} } from "lucide-react"
import type { SVGProps } from "react"

export function ${name}Icon({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <${lucide}
      className={className}
      strokeWidth={1.8}
      {...props}
    />
  )
}
`
}

function generateIcons() {
  for (const [key, lucide] of Object.entries(lucideIcons)) {
    const name = key.charAt(0).toUpperCase() + key.slice(1)

    const file = path.join(ICON_DIR, `${key}-icon.tsx`)

    fs.writeFileSync(file, iconComponent(name, lucide))
  }
}

function generateIndex() {
  const exports = Object.keys(lucideIcons)
    .map((k) => `export * from "./${k}-icon"`)
    .join("\n")

  fs.writeFileSync(path.join(ICON_DIR, "index.ts"), exports)
}

function generateSkillsConfig() {
  const skills = `
export const skills = [
  {
    category: "Languages & Frameworks",
    items: [
      { name: "React", icon: "ReactIcon" },
      { name: "TypeScript", icon: "TypescriptIcon" },
      { name: "Node.js", icon: "NodeIcon" },
      { name: "Python", icon: "PythonIcon" },
      { name: "Django", icon: "DjangoIcon" },
      { name: "Flask", icon: "FlaskIcon" }
    ]
  },
  {
    category: "Architecture & Cloud",
    items: [
      { name: "AWS", icon: "AwsIcon" },
      { name: "Docker", icon: "DockerIcon" },
      { name: "Kubernetes", icon: "KubernetesIcon" },
      { name: "Terraform", icon: "TerraformIcon" },
      { name: "CI/CD", icon: "CicdIcon" }
    ]
  },
  {
    category: "Workflow & eSignature",
    items: [
      { name: "DocuSign", icon: "DocusignIcon" },
      { name: "eVaulting", icon: "EvaultIcon" },
      { name: "Digital Mortgage Systems", icon: "MortgageIcon" }
    ]
  },
  {
    category: "Frontend & UI",
    items: [
      { name: "Radix UI", icon: "RadixIcon" },
      { name: "Tailwind", icon: "TailwindIcon" },
      { name: "shadcn/ui", icon: "ShadcnIcon" }
    ]
  },
  {
    category: "Engineering Tools",
    items: [
      { name: "GitHub Actions", icon: "GithubActionsIcon" },
      { name: "GraphQL", icon: "GraphqlIcon" },
      { name: "REST API Design", icon: "RestIcon" },
      { name: "Observability", icon: "ObservabilityIcon" },
      { name: "Automation", icon: "AutomationIcon" }
    ]
  }
]
`

  ensureDir(CONFIG_DIR)

  fs.writeFileSync(path.join(CONFIG_DIR, "skills.ts"), skills)
}

function main() {
  ensureDir(ICON_DIR)

  generateIcons()
  generateIndex()
  generateSkillsConfig()

  console.log("✅ Icon system generated successfully")
}

main()