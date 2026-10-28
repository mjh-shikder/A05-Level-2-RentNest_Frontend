"use client";

import type { ComponentProps } from "react";
import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type DashboardActionButtonProps = {
  label: string;
  pendingLabel: string;
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
};

const DashboardActionButton = ({
  label,
  pendingLabel,
  variant,
  size = "sm",
}: DashboardActionButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size={size}
      variant={variant}
      disabled={pending}
      aria-busy={pending}
    >
      {pending && <LoaderCircle aria-hidden="true" className="animate-spin" />}
      {pending ? pendingLabel : label}
    </Button>
  );
};

export default DashboardActionButton;
