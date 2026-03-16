// src/components/wizards/consultation-wizard.tsx
import * as React from "react";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WizardModal } from "@/components/wizards/wizard-modal";
import { getWizardConfig } from "@/lib/wizard-config";

export function ConsultationWizard() {
  const [open, setOpen] = React.useState(false);
  const [config, setConfig] = React.useState(() => getWizardConfig("consultation"));

  React.useEffect(() => {
    function onUpdate(e: Event) {
      const id = (e as CustomEvent<string>).detail;
      if (id === "consultation") setConfig(getWizardConfig("consultation"));
    }
    window.addEventListener("wjw:wizard-config-change", onUpdate);
    return () => window.removeEventListener("wjw:wizard-config-change", onUpdate);
  }, []);

  if (!config.published) {
    return (
      <Button variant="outline" size="sm" className="w-full gap-2" disabled>
        <CalendarDays className="w-3.5 h-3.5" /> Request a Consultation (unavailable)
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
          <CalendarDays className="w-3.5 h-3.5 text-primary" /> Request a Consultation
        </Button>
      }
    />
  );
}
