// PATCH for sidebar-card.tsx
// Replace the three inline component blocks with these imports.
// Everything else in sidebar-card.tsx stays the same.

// ─── ADD these three imports at the top of sidebar-card.tsx ──────────────────

// import { DocumentWizard }      from "@/components/wizards/document-wizard";
// import { ConsultationWizard }  from "@/components/wizards/consultation-wizard";
// import { ClientPortalModal }   from "@/components/wizards/client-portal-modal";

// ─── REMOVE these functions entirely from sidebar-card.tsx ───────────────────
//   function DocumentSubmission() { ... }
//   function ConsultationRequest() { ... }
//   function ClientPortal() { ... }

// ─── REPLACE the three JSX blocks in SidebarCard with ────────────────────────

/*

        {/* Document submission *\/}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <FileUp className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Document Submission
            </span>
          </div>
          <DocumentWizard />
        </div>

        <Separator />

        {/* Consultation *\/}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <CalendarDays className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Request a Consultation
            </span>
          </div>
          <ConsultationWizard />
        </div>

        <Separator />

        {/* Client portal *\/}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <LogIn className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Client Access
            </span>
          </div>
          <ClientPortalModal />
        </div>

*/

// You can also REMOVE these lucide imports from sidebar-card.tsx
// since they are now only used inside the extracted components:
//   FileUp, CalendarDays, LogIn, X, CheckCircle (from the old inline forms)
