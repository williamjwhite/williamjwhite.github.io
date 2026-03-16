// src/components/sections/wizard-admin.tsx
// Admin panel section for creating, editing, and publishing wizards.
// Drop inside AdminPage as an <AdminSection>.

import * as React from "react";
import {
  AlertTriangle, Check, ChevronDown, ChevronUp, Edit3, Eye,
  EyeOff, GripVertical, Loader2, Plus, Save, Trash2, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  type FieldType,
  type WizardConfig,
  type WizardField,
  type WizardStep,
  getWizardConfig,
  saveWizardConfig,
  makeId,
  DEFAULT_DOC_WIZARD,
  DEFAULT_CONSULT_WIZARD,
} from "@/lib/wizard-config";

// ─── Field type options ───────────────────────────────────────────────────────

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "text",     label: "Text"       },
  { value: "email",    label: "Email"      },
  { value: "phone",    label: "Phone"      },
  { value: "textarea", label: "Text area"  },
  { value: "select",   label: "Dropdown"   },
  { value: "radio",    label: "Radio"      },
  { value: "file",     label: "File upload"},
  { value: "checkbox", label: "Checkbox"   },
];

// ─── Field editor ─────────────────────────────────────────────────────────────

function FieldEditor({
  field, onChange, onRemove,
}: {
  field:    WizardField;
  onChange: (f: WizardField) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const needsOptions = field.type === "select" || field.type === "radio";

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      {/* Field header */}
      <div
        className="flex items-center gap-2 px-3 py-2 bg-muted/30 cursor-pointer"
        onClick={() => setExpanded(v => !v)}
      >
        <GripVertical className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
        <span className="flex-1 text-xs font-medium truncate">{field.label || "(untitled field)"}</span>
        <Badge variant="outline" className="text-[10px] px-1.5">{field.type}</Badge>
        {field.required && <Badge className="text-[10px] px-1.5">required</Badge>}
        <button onClick={e => { e.stopPropagation(); onRemove(); }}
          className="text-muted-foreground hover:text-destructive transition-colors ml-1">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </div>

      {expanded && (
        <div className="p-3 space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-medium">Label *</label>
              <Input className="h-8 text-xs" value={field.label}
                onChange={e => onChange({ ...field, label: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Type</label>
              <select
                className="w-full h-8 px-2 text-xs border rounded-md bg-background border-input"
                value={field.type}
                onChange={e => onChange({ ...field, type: e.target.value as FieldType })}
              >
                {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>

          {field.type !== "checkbox" && field.type !== "file" && field.type !== "radio" && (
            <div className="space-y-1">
              <label className="text-xs font-medium">Placeholder</label>
              <Input className="h-8 text-xs" value={field.placeholder ?? ""}
                onChange={e => onChange({ ...field, placeholder: e.target.value })} />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium">Help text</label>
            <Input className="h-8 text-xs" value={field.helpText ?? ""}
              onChange={e => onChange({ ...field, helpText: e.target.value })}
              placeholder="Optional hint shown below the field" />
          </div>

          {needsOptions && (
            <div className="space-y-1">
              <label className="text-xs font-medium">Options (one per line)</label>
              <textarea
                className="w-full px-3 py-1.5 text-xs border rounded-md bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring resize-none h-24"
                value={(field.options ?? []).join("\n")}
                onChange={e => onChange({ ...field, options: e.target.value.split("\n").filter(Boolean) })}
              />
            </div>
          )}

          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input type="checkbox" checked={field.required}
              onChange={e => onChange({ ...field, required: e.target.checked })}
              className="accent-primary" />
            Required field
          </label>
        </div>
      )}
    </div>
  );
}

// ─── Step editor ──────────────────────────────────────────────────────────────

function StepEditor({
  step, stepIndex, totalSteps, onChange, onRemove, onMoveUp, onMoveDown,
}: {
  step:       WizardStep;
  stepIndex:  number;
  totalSteps: number;
  onChange:   (s: WizardStep) => void;
  onRemove:   () => void;
  onMoveUp:   () => void;
  onMoveDown: () => void;
}) {
  const [expanded, setExpanded] = React.useState(stepIndex === 0);
  const isReviewStep = step.fields.length === 0 && stepIndex === totalSteps - 1;

  function addField() {
    onChange({
      ...step,
      fields: [...step.fields, {
        id:       makeId("fld"),
        type:     "text",
        label:    "",
        required: false,
      }],
    });
  }

  function updateField(i: number, f: WizardField) {
    const fields = [...step.fields];
    fields[i] = f;
    onChange({ ...step, fields });
  }

  function removeField(i: number) {
    onChange({ ...step, fields: step.fields.filter((_, idx) => idx !== i) });
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      {/* Step header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 bg-muted/50 cursor-pointer"
        onClick={() => setExpanded(v => !v)}
      >
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
          {stepIndex + 1}
        </span>
        <span className="flex-1 text-sm font-medium truncate">{step.title || "(untitled step)"}</span>
        {isReviewStep && <Badge variant="secondary" className="text-[10px]">review</Badge>}
        <span className="flex gap-0.5">
          <button onClick={e => { e.stopPropagation(); onMoveUp(); }}
            disabled={stepIndex === 0}
            className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors p-0.5">
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button onClick={e => { e.stopPropagation(); onMoveDown(); }}
            disabled={stepIndex === totalSteps - 1}
            className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors p-0.5">
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </span>
        <button onClick={e => { e.stopPropagation(); onRemove(); }}
          className="text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </div>

      {expanded && (
        <div className="p-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-medium">Step title *</label>
              <Input className="h-8 text-xs" value={step.title}
                onChange={e => onChange({ ...step, title: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Description</label>
              <Input className="h-8 text-xs" value={step.description ?? ""}
                onChange={e => onChange({ ...step, description: e.target.value })} />
            </div>
          </div>

          {isReviewStep ? (
            <p className="text-xs text-muted-foreground italic">
              This is the review/summary step. It displays all collected data for confirmation and has no fields.
            </p>
          ) : (
            <>
              <div className="space-y-2">
                {step.fields.map((field, i) => (
                  <FieldEditor
                    key={field.id}
                    field={field}
                    onChange={f => updateField(i, f)}
                    onRemove={() => removeField(i)}
                  />
                ))}
              </div>
              <Button size="sm" variant="outline" onClick={addField} className="gap-1.5 w-full">
                <Plus className="w-3.5 h-3.5" /> Add field to this step
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Wizard editor ────────────────────────────────────────────────────────────

function WizardEditor({ wizardId }: { wizardId: string }) {
  const [config, setConfig]       = React.useState<WizardConfig>(() => getWizardConfig(wizardId));
  const [saved,  setSaved]        = React.useState(false);
  const [preview, setPreview]     = React.useState(false);

  function updateConfig(partial: Partial<WizardConfig>) {
    setConfig(prev => ({ ...prev, ...partial }));
  }

  function addStep() {
    const newStep: WizardStep = {
      id:     makeId("stp"),
      title:  "New Step",
      fields: [],
    };
    // Insert before last (review) step if last step has no fields
    const steps = [...config.steps];
    const lastIsReview = steps[steps.length - 1]?.fields.length === 0;
    if (lastIsReview) {
      steps.splice(steps.length - 1, 0, newStep);
    } else {
      steps.push(newStep);
    }
    updateConfig({ steps });
  }

  function updateStep(i: number, s: WizardStep) {
    const steps = [...config.steps];
    steps[i] = s;
    updateConfig({ steps });
  }

  function removeStep(i: number) {
    if (!confirm("Remove this step?")) return;
    updateConfig({ steps: config.steps.filter((_, idx) => idx !== i) });
  }

  function moveStep(i: number, dir: -1 | 1) {
    const steps = [...config.steps];
    const j = i + dir;
    if (j < 0 || j >= steps.length) return;
    [steps[i], steps[j]] = [steps[j], steps[i]];
    updateConfig({ steps });
  }

  function resetToDefault() {
    if (!confirm("Reset to default configuration? Any customizations will be lost.")) return;
    const def = wizardId === "doc-submission" ? DEFAULT_DOC_WIZARD : DEFAULT_CONSULT_WIZARD;
    setConfig(def);
  }

  function save() {
    saveWizardConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const label = wizardId === "doc-submission" ? "Document Submission" : "Consultation Request";

  return (
    <div className="space-y-4">
      {/* Wizard meta */}
      <div className="space-y-3 p-4 border rounded-xl border-border bg-muted/20">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{label}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateConfig({ published: !config.published })}
              className="flex items-center gap-1.5 text-xs font-medium hover:text-primary transition-colors"
            >
              {config.published
                ? <><Eye  className="w-3.5 h-3.5 text-primary" /> Published</>
                : <><EyeOff className="w-3.5 h-3.5 text-muted-foreground" /> Draft</>}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs font-medium">Wizard title</label>
            <Input className="h-8 text-xs" value={config.title}
              onChange={e => updateConfig({ title: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Submit endpoint</label>
            <Input className="h-8 text-xs font-mono" value={config.submitEndpoint}
              onChange={e => updateConfig({ submitEndpoint: e.target.value })} />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium">Description</label>
          <Input className="h-8 text-xs" value={config.description}
            onChange={e => updateConfig({ description: e.target.value })} />
        </div>

        {!config.published && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            Draft — this wizard is hidden from visitors. Publish to make it live.
          </div>
        )}
      </div>

      {/* Steps */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Steps ({config.steps.length})
        </p>
        {config.steps.map((step, i) => (
          <StepEditor
            key={step.id}
            step={step}
            stepIndex={i}
            totalSteps={config.steps.length}
            onChange={s => updateStep(i, s)}
            onRemove={() => removeStep(i)}
            onMoveUp={() => moveStep(i, -1)}
            onMoveDown={() => moveStep(i, 1)}
          />
        ))}
        <Button size="sm" variant="outline" onClick={addStep} className="gap-1.5 w-full">
          <Plus className="w-3.5 h-3.5" /> Add step
        </Button>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        <Button size="sm" onClick={save} className="gap-1.5 flex-1">
          {saved
            ? <><Check className="w-3.5 h-3.5" /> Saved & published</>
            : <><Save  className="w-3.5 h-3.5" /> Save wizard</>}
        </Button>
        <Button size="sm" variant="outline" onClick={resetToDefault} className="gap-1.5">
          Reset defaults
        </Button>
      </div>

      {config.updatedAt && (
        <p className="text-xs text-muted-foreground">
          Last saved: {new Date(config.updatedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}

// ─── Main export — two tabs, one for each wizard ──────────────────────────────

export function WizardAdmin() {
  const [tab, setTab] = React.useState<"doc-submission" | "consultation">("doc-submission");

  const tabs = [
    { id: "doc-submission" as const, label: "Document Submission" },
    { id: "consultation"   as const, label: "Consultation Request" },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Create and edit multi-step wizards. Changes take effect immediately — no deploy needed.
        Use the Published toggle to show or hide a wizard from visitors.
      </p>

      {/* Tab switcher */}
      <div className="flex gap-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              tab === t.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <WizardEditor key={tab} wizardId={tab} />
    </div>
  );
}
