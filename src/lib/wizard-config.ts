// src/lib/wizard-config.ts
// ─── Types ────────────────────────────────────────────────────────────────────

export type FieldType =
  | "text"
  | "email"
  | "phone"
  | "textarea"
  | "select"
  | "file"
  | "checkbox"
  | "radio";

export interface WizardField {
  id:          string;
  type:        FieldType;
  label:       string;
  placeholder?: string;
  required:    boolean;
  options?:    string[];   // for select / radio
  helpText?:   string;
}

export interface WizardStep {
  id:          string;
  title:       string;
  description?: string;
  fields:      WizardField[];
}

export interface WizardConfig {
  id:          string;   // "doc-submission" | "consultation"
  title:       string;
  description: string;
  published:   boolean;
  submitEndpoint: string;
  steps:       WizardStep[];
  updatedAt:   string;
}

// ─── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = "wjw_wizard_configs";

export function getWizardConfigs(): Record<string, WizardConfig> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function saveWizardConfig(config: WizardConfig): void {
  const all = getWizardConfigs();
  all[config.id] = { ...config, updatedAt: new Date().toISOString() };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(all)); } catch { }
  window.dispatchEvent(new CustomEvent("wjw:wizard-config-change", { detail: config.id }));
}

export function getWizardConfig(id: string): WizardConfig {
  const all = getWizardConfigs();
  return all[id] ?? getDefaultConfig(id);
}

// ─── ID helpers ───────────────────────────────────────────────────────────────

export function makeId(prefix = "f"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Default configs ──────────────────────────────────────────────────────────

export function getDefaultConfig(id: string): WizardConfig {
  if (id === "doc-submission") return DEFAULT_DOC_WIZARD;
  if (id === "consultation")   return DEFAULT_CONSULT_WIZARD;
  return DEFAULT_DOC_WIZARD;
}

export const DEFAULT_DOC_WIZARD: WizardConfig = {
  id:             "doc-submission",
  title:          "Document Submission",
  description:    "Securely submit documents for proposals, contracts, or project briefs.",
  published:      true,
  submitEndpoint: "/api/documents/submit",
  updatedAt:      new Date().toISOString(),
  steps: [
    {
      id:          "contact",
      title:       "Your Information",
      description: "Let me know who you are so I can follow up.",
      fields: [
        { id: "name",    type: "text",  label: "Full name",     placeholder: "Jane Smith",           required: true  },
        { id: "email",   type: "email", label: "Email address", placeholder: "jane@example.com",     required: true  },
        { id: "company", type: "text",  label: "Company",       placeholder: "Acme Corp (optional)", required: false },
      ],
    },
    {
      id:          "document",
      title:       "Document Details",
      description: "Tell me what you're submitting and why.",
      fields: [
        {
          id:       "docType",
          type:     "select",
          label:    "Document type",
          required: true,
          options:  ["Proposal / RFP", "Contract", "Project Brief", "NDA", "Other"],
        },
        { id: "note", type: "textarea", label: "Brief note", placeholder: "Context, urgency, or anything else I should know.", required: false },
      ],
    },
    {
      id:          "upload",
      title:       "Upload File",
      description: "Attach your document. PDF, DOC, or DOCX preferred.",
      fields: [
        { id: "file",    type: "file",     label: "Attach file",               required: false, helpText: "PDF, DOC, DOCX, PNG, JPG — max 10 MB" },
        { id: "consent", type: "checkbox", label: "I agree to secure handling of this document.", required: true },
      ],
    },
    {
      id:          "review",
      title:       "Review & Submit",
      description: "Confirm your submission before sending.",
      fields: [],   // review step renders a summary, no fields
    },
  ],
};

export const DEFAULT_CONSULT_WIZARD: WizardConfig = {
  id:             "consultation",
  title:          "Request a Consultation",
  description:    "Tell me about your project and I'll reach out within 1–2 business days.",
  published:      true,
  submitEndpoint: "https://formspree.io/f/YOUR_FORM_ID",
  updatedAt:      new Date().toISOString(),
  steps: [
    {
      id:          "intro",
      title:       "About You",
      description: "A bit about who you are.",
      fields: [
        { id: "name",    type: "text",  label: "Full name",     placeholder: "Jane Smith",           required: true  },
        { id: "email",   type: "email", label: "Email address", placeholder: "jane@example.com",     required: true  },
        { id: "company", type: "text",  label: "Company",       placeholder: "Acme Corp (optional)", required: false },
        { id: "phone",   type: "phone", label: "Phone",         placeholder: "+1 (555) 000-0000",    required: false },
      ],
    },
    {
      id:          "project",
      title:       "Your Project",
      description: "Help me understand what you need.",
      fields: [
        {
          id:       "projectType",
          type:     "radio",
          label:    "Type of engagement",
          required: true,
          options:  ["Full-stack development", "Cloud architecture", "Workflow automation", "DocuSign / eSignature", "Consulting / advisory", "Other"],
        },
        { id: "description", type: "textarea", label: "Project description", placeholder: "What are you building or solving?", required: true },
      ],
    },
    {
      id:          "scope",
      title:       "Scope & Timeline",
      description: "Help me size the engagement.",
      fields: [
        {
          id:       "budget",
          type:     "select",
          label:    "Budget range",
          required: false,
          options:  ["Under $5k", "$5k – $15k", "$15k – $50k", "$50k+", "To be determined"],
        },
        {
          id:       "timeline",
          type:     "select",
          label:    "Desired start",
          required: false,
          options:  ["ASAP", "Within 1 month", "1–3 months", "3+ months", "Flexible"],
        },
        { id: "goals", type: "textarea", label: "Key goals or outcomes", placeholder: "What does success look like?", required: false },
      ],
    },
    {
      id:          "confirm",
      title:       "Review & Send",
      description: "Confirm your request before sending.",
      fields: [],   // summary step
    },
  ],
};
