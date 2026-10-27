"use client";

import { useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const PropertyEditDialog = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button
        type="button"
        variant="link"
        className="h-auto p-0 text-sm font-medium text-foreground"
        onClick={() => dialogRef.current?.showModal()}
        aria-haspopup="dialog"
      >
        Edit listing
      </Button>
      <dialog
        ref={dialogRef}
        aria-label={title}
        className="m-auto max-h-[85vh] w-[min(90vw,42rem)] max-w-none overflow-y-auto rounded-2xl border border-border bg-background p-4 text-foreground shadow-xl backdrop:bg-black/50 sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="font-semibold">{title}</h2>
          <form method="dialog">
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              aria-label="Close edit listing dialog"
              className="size-8"
            >
              <X aria-hidden="true" />
            </Button>
          </form>
        </div>
        {children}
      </dialog>
    </>
  );
};

export default PropertyEditDialog;
