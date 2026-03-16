// src/components/wizards/document-wizard.tsx
import * as React from "react";
import { FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WizardModal } from "@/components/wizards/wizard-modal";
import { getWizardConfig } from "@/lib/wizard-config";

export function DocumentWizard() {
  const [open, setOpen] = React.useState(false);
  const [config, setConfig] = React.useState(() => getWizardConfig("doc-submission"));

  // Re-read config if admin changes it
  React.useEffect(() => {
    function onUpdate(e: Event) {
      const id = (e as CustomEvent<string>).detail;
      if (id === "doc-submission") setConfig(getWizardConfig("doc-submission"));
    }
    window.addEventListener("wjw:wizard-config-change", onUpdate);
    return () => window.removeEventListener("wjw:wizard-config-change", onUpdate);
  }, []);

  if (!config.published) {
    return (
      <Button variant="outline" size="sm" className="w-full gap-2" disabled>
        <FileUp className="w-3.5 h-3.5" /> Document Submission (unavailable)
      </Button>
    );
  }

  return (
    <WizardModal
      config={config}
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant="outline" size="sm" className="w-full gap-2">
          <FileUp className="w-3.5 h-3.5 text-primary" /> Document Submission
        </Button>
      }
    />
  );
}
