"use client";

import { useActionState } from "react";
import {
  createRentalRequestAction,
  type RentalRequestActionState,
} from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: RentalRequestActionState = {
  status: "idle",
  message: "",
};

const RequestRentalForm = ({ propertyId }: { propertyId: string }) => {
  const [state, formAction, pending] = useActionState(
    createRentalRequestAction,
    initialState,
  );

  return (
    <form action={formAction} className="mt-5 space-y-4">

      <input type="hidden" name="propertyId" value={propertyId} />

      <label className="block space-y-2 text-sm font-medium text-foreground">
        <span className="">Move-in date</span>
        <Input
          type="date"
          name="startDate"
          required
          className="rounded-xl border-white/40 bg-white/30 dark:border-white/15 dark:bg-black/20"
        />
      </label>

      <label className="block space-y-1.5 text-sm font-medium text-foreground">
        <span>Move-out date (optional)</span>
        <Input
          type="date"
          name="endDate"
          className="rounded-xl border-white/40 bg-white/30 dark:border-white/15 dark:bg-black/20"
        />
      </label>

      <label className="block space-y-1.5 text-sm font-medium text-foreground">
        <span>Message to the landlord (optional)</span>
        <textarea
          name="message"
          rows={3}
          maxLength={1000}
          className="w-full rounded-xl border border-white/40 bg-white/30 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring dark:border-white/15 dark:bg-black/20"
          placeholder="Introduce yourself or add a note about your request."
        />
      </label>

      {state.message && (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={`text-sm ${
            state.status === "error" ? "text-destructive" : "text-primary"
          }`}
        >
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Sending request..." : "Send rental request"}
      </Button>
    </form>
  );
};

export default RequestRentalForm;
