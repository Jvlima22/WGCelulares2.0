import type { ReactNode } from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QuoteWidget } from "@/components/site/QuoteWidget";

/**
 * Abre o mesmo formulário do "Orçamento guiado" em um modal centralizado.
 */
export function QuoteDialog({
  children,
  serviceSlug,
}: {
  children: ReactNode;
  serviceSlug?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:max-w-2xl">
        <DialogTitle className="sr-only">Solicitar orçamento</DialogTitle>
        {serviceSlug ? <QuoteWidget serviceSlug={serviceSlug} /> : <QuoteWidget />}
      </DialogContent>
    </Dialog>
  );
}
