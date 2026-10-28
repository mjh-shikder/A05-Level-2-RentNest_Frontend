"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

const PropertyFormSubmitButton = ({ isUpdate }: { isUpdate: boolean }) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} aria-busy={pending}>
      {pending && <LoaderCircle aria-hidden="true" className="animate-spin" />}
      {pending
        ? isUpdate
          ? "Saving changes..."
          : "Creating listing..."
        : isUpdate
          ? "Save changes"
          : "Create listing"}
    </Button>
  );
};

export default PropertyFormSubmitButton;
