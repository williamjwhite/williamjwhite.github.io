// src/components/wizards/wizard-modal.tsx
// Generic wizard shell — wraps react-use-wizard in a Dialog.
// Used by both DocumentWizard and ConsultationWizard.

import * as React from "react";
import { Wizard, useWizard } from "react-use-wizard";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { WizardConfig, WizardField, WizardStep } from "@/lib/wizard-config";

// ─── Form data context ────────────────────────────────────────────────────────

interface FormData { [fieldId: string]: string | boolean | File | null; }

const FormCtx = React.createContext<{
  data:    FormData;
  setField: (id: string, val: FormData[string]) => void;
}>({ data: {}, setField: () => {} });

export function useFormData() { return React.useContext(FormCtx); }

// ─── Step progress bar ────────────────────────────────────────────────────────

function StepProgress({ steps }: { steps: WizardStep[] }) {
  const { activeStep } = useWizard();
  return (
    <div className="flex items-center gap-1 mb-6">
      {steps.map((step, i) => {
        const done    = i < activeStep;
        const current = i === activeStep;
        return (
          <React.Fragment key={step.id}>
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all shrink-0 ${
              done    ? "bg-primary text-primary-foreground"
              : current ? "bg-primary/20 text-primary ring-2 ring-primary"
              : "bg-muted text-muted-foreground"
            }`}>
              {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 transition-all ${i < activeStep ? "bg-primary" : "bg-muted"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Field renderer ───────────────────────────────────────────────────────────

function FieldRenderer({ field }: { field: WizardField }) {
  const { data, setField } = useFormData();
  const val = data[field.id];

  const inputCls = "w-full px-3 py-2 text-sm border rounded-md bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </label>

      {field.helpText && (
        <p className="text-xs text-muted-foreground">{field.helpText}</p>
      )}

      {(field.type === "text" || field.type === "email" || field.type === "phone") && (
        <Input
          type={field.type === "phone" ? "tel" : field.type}
          placeholder={field.placeholder}
          value={(val as string) ?? ""}
          onChange={e => setField(field.id, e.target.value)}
          className="h-9"
        />
      )}

      {field.type === "textarea" && (
        <textarea
          placeholder={field.placeholder}
          value={(val as string) ?? ""}
          onChange={e => setField(field.id, e.target.value)}
          className={`${inputCls} resize-none h-24`}
        />
      )}

      {field.type === "select" && field.options && (
        <select
          value={(val as string) ?? ""}
          onChange={e => setField(field.id, e.target.value)}
          className={`${inputCls} h-9`}
        >
          <option value="">Select…</option>
          {field.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      )}

      {field.type === "radio" && field.options && (
        <div className="space-y-2">
          {field.options.map(o => (
            <label key={o} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name={field.id}
                value={o}
                checked={(val as string) === o}
                onChange={() => setField(field.id, o)}
                className="accent-primary"
              />
              {o}
            </label>
          ))}
        </div>
      )}

      {field.type === "file" && (
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
          className="w-full text-sm text-muted-foreground file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-muted file:text-foreground hover:file:bg-muted/70"
          onChange={e => setField(field.id, e.target.files?.[0] ?? null)}
        />
      )}

      {field.type === "checkbox" && (
        <label className="flex items-start gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(val)}
            onChange={e => setField(field.id, e.target.checked)}
            className="mt-0.5 accent-primary"
          />
          <span>{field.placeholder || field.label}</span>
        </label>
      )}
    </div>
  );
}

// ─── Review / summary step ───────────────────────────────────────────────────

function ReviewStep({ config }: { config: WizardConfig }) {
  const { data } = useFormData();
  const allFields = config.steps
    .flatMap(s => s.fields)
    .filter(f => f.id in data && data[f.id] !== "" && data[f.id] !== false && data[f.id] !== null);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Please review your information before submitting.
      </p>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {allFields.map(field => {
          const val = data[field.id];
          const display =
            val instanceof File ? `📎 ${val.name}`
            : typeof val === "boolean" ? (val ? "✓ Yes" : "")
            : String(val);
          if (!display) return null;
          return (
            <div key={field.id} className="flex justify-between gap-3 py-1.5 border-b border-border/50 last:border-0 text-sm">
              <span className="text-muted-foreground font-medium shrink-0">{field.label}</span>
              <span className="text-right text-foreground">{display}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Individual step wrapper ──────────────────────────────────────────────────

interface StepProps {
  step:      WizardStep;
  config:    WizardConfig;
  isReview:  boolean;
  onSubmit:  () => Promise<void>;
  submitStatus: "idle" | "sending" | "sent" | "error";
}

function WizardStepContent({ step, config, isReview, onSubmit, submitStatus }: StepProps) {
  const { previousStep, nextStep, isFirstStep, isLastStep, isLoading } = useWizard();
  const { data } = useFormData();

  // Validate required fields before advancing
  function validate(): boolean {
    return step.fields
      .filter(f => f.required)
      .every(f => {
        const v = data[f.id];
        if (typeof v === "boolean") return v === true;
        if (v instanceof File)      return true;
        return Boolean(v && String(v).trim());
      });
  }

  const canAdvance = validate();

  return (
    <div className="space-y-5">
      {/* Step header */}
      <div>
        <h3 className="text-base font-semibold">{step.title}</h3>
        {step.description && (
          <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>
        )}
      </div>

      {/* Fields or review */}
      {isReview
        ? <ReviewStep config={config} />
        : <div className="space-y-4">{step.fields.map(f => <FieldRenderer key={f.id} field={f} />)}</div>}

      {/* Error */}
      {submitStatus === "error" && (
        <p className="text-xs text-destructive">
          Submission failed. Please email{" "}
          <a href="mailto:hello@williamjwhite.me" className="underline">hello@williamjwhite.me</a>.
        </p>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <Button
          variant="outline" size="sm"
          onClick={previousStep}
          disabled={isFirstStep || isLoading}
          className="gap-1.5"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back
        </Button>

        {isLastStep ? (
          <Button
            size="sm"
            onClick={onSubmit}
            disabled={submitStatus === "sending" || !canAdvance}
            className="gap-1.5"
          >
            {submitStatus === "sending"
              ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting…</>
              : "Submit"}
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={nextStep}
            disabled={!canAdvance || isLoading}
            className="gap-1.5"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessScreen({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
        <Check className="w-7 h-7 text-primary" />
      </div>
      <div>
        <h3 className="text-base font-semibold">Submitted!</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Your {title.toLowerCase()} has been received. I'll be in touch shortly.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
    </div>
  );
}

// ─── Main WizardModal ─────────────────────────────────────────────────────────

interface WizardModalProps {
  config:       WizardConfig;
  open:         boolean;
  onOpenChange: (v: boolean) => void;
  trigger:      React.ReactNode;
}

export function WizardModal({ config, open, onOpenChange, trigger }: WizardModalProps) {
  const [data,         setData]         = React.useState<FormData>({});
  const [submitStatus, setSubmitStatus] = React.useState<"idle" | "sending" | "sent" | "error">("idle");

  function setField(id: string, val: FormData[string]) {
    setData(prev => ({ ...prev, [id]: val }));
  }

  function resetAll() {
    setData({});
    setSubmitStatus("idle");
  }

  function handleClose(v: boolean) {
    if (!v) resetAll();
    onOpenChange(v);
  }

  async function handleSubmit() {
    setSubmitStatus("sending");
    try {
      const isMultipart = Object.values(data).some(v => v instanceof File);

      if (isMultipart) {
        const fd = new FormData();
        Object.entries(data).forEach(([k, v]) => {
          if (v instanceof File) fd.append(k, v);
          else if (v !== null && v !== undefined) fd.append(k, String(v));
        });
        fd.append("wizardId",  config.id);
        fd.append("timestamp", new Date().toISOString());
        const res = await fetch(config.submitEndpoint, { method: "POST", body: fd });
        setSubmitStatus(res.ok ? "sent" : "error");
      } else {
        const res = await fetch(config.submitEndpoint, {
          method:  "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body:    JSON.stringify({ ...data, wizardId: config.id, timestamp: new Date().toISOString() }),
        });
        setSubmitStatus(res.ok ? "sent" : "error");
      }
    } catch {
      setSubmitStatus("error");
    }
  }

  if (!config.published) return <>{trigger}</>;

  return (
    <>
      <span onClick={() => onOpenChange(true)} className="contents">{trigger}</span>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          className="max-w-lg"
          onPointerDownOutside={e => e.preventDefault()}
          onInteractOutside={e => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{config.title}</DialogTitle>
            <DialogDescription>{config.description}</DialogDescription>
          </DialogHeader>

          {submitStatus === "sent" ? (
            <SuccessScreen title={config.title} onClose={() => handleClose(false)} />
          ) : (
            <FormCtx.Provider value={{ data, setField }}>
              <Wizard>
                {/* Progress bar lives in header — needs useWizard so it's a child */}
                {config.steps.map((step, idx) => (
                  <ProgressWrapper key={step.id} steps={config.steps}>
                    <WizardStepContent
                      step={step}
                      config={config}
                      isReview={idx === config.steps.length - 1 && step.fields.length === 0}
                      onSubmit={handleSubmit}
                      submitStatus={submitStatus}
                    />
                  </ProgressWrapper>
                ))}
              </Wizard>
            </FormCtx.Provider>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── ProgressWrapper — child of Wizard so useWizard works ────────────────────

function ProgressWrapper({ steps, children }: { steps: WizardStep[]; children: React.ReactNode }) {
  return (
    <div>
      <StepProgress steps={steps} />
      {children}
    </div>
  );
}
