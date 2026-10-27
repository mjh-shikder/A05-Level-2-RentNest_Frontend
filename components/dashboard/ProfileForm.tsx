"use client";

import { useActionState } from "react";
import {
  updateProfileAction,
  type ProfileActionState,
} from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DashboardUser } from "@/lib/dashboard-auth";

const initialState: ProfileActionState = {
  status: "idle",
  message: "",
};

const ProfileForm = ({ user }: { user: DashboardUser }) => {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    initialState,
  );

  return (
    <section
      id="profile"
      className="scroll-mt-24 rounded-3xl border border-white/30 bg-white/10 p-5 shadow-sm backdrop-blur-xl dark:bg-black/10 sm:p-6"
    >
      <header className="mb-5">
        <h2 className="text-lg font-semibold text-foreground">Edit profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your name, phone number, and avatar.
        </p>
      </header>

      <form action={formAction} className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium text-foreground">
          <span>Name</span>
          <Input
            name="name"
            autoComplete="name"
            defaultValue={user.name}
            maxLength={120}
            required
          />
        </label>

        <label className="space-y-1.5 text-sm font-medium text-foreground">
          <span>Phone</span>
          <Input
            name="phone"
            type="tel"
            autoComplete="tel"
            defaultValue={user.phone}
            maxLength={40}
          />
          {!user.phone && (
            <span className="block text-xs font-normal text-muted-foreground">
              Enter a phone number to add or update it. Leave blank to keep it
              unchanged.
            </span>
          )}
        </label>

        <label className="space-y-1.5 text-sm font-medium text-foreground sm:col-span-2">
          <span>Avatar URL</span>
          <Input
            name="avatar"
            type="text"
            inputMode="url"
            autoComplete="url"
            defaultValue={user.avatar}
            maxLength={2048}
            placeholder="https://example.com/avatar.jpg"
          />
          <span className="block text-xs font-normal text-muted-foreground">
            Leave blank to remove your avatar.
          </span>
        </label>

        {state.message && (
          <p
            role={state.status === "error" ? "alert" : "status"}
            className={`text-sm sm:col-span-2 ${
              state.status === "error"
                ? "text-destructive"
                : "text-primary"
            }`}
          >
            {state.message}
          </p>
        )}

        <div className="sm:col-span-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving profile..." : "Save profile"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default ProfileForm;
