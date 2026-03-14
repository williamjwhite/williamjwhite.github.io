#!/bin/bash

mkdir -p src/components/landing
mkdir -p src/components/layout
mkdir -p src/components/sections
mkdir -p src/components/protected
mkdir -p src/hooks
mkdir -p src/lib

# Landing / Brand
touch src/components/landing/IntroHeader.tsx
touch src/components/landing/NowCard.tsx
touch src/components/landing/BrandHeader.tsx

# Sections
touch src/components/sections/ProjectsSection.tsx
touch src/components/sections/ServicesSection.tsx
touch src/components/sections/CaseStudySection.tsx
touch src/components/sections/CloudArchitectureSection.tsx
touch src/components/sections/AIAutomationSection.tsx

# Protected Sections
touch src/components/protected/ExperienceSection.tsx
touch src/components/protected/ResumeSection.tsx
touch src/components/protected/ContactSection.tsx
touch src/components/protected/ContactVerificationPopup.tsx

# Layout
touch src/components/layout/Footer.tsx
touch src/components/layout/Container.tsx
touch src/components/layout/TopNav.tsx

# Hooks
touch src/hooks/useThemeToggle.ts
touch src/hooks/use-mobile.tsx

# App
touch src/App.tsx

echo "Scaffolding complete."
