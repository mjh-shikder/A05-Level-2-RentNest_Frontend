"use client";

import { useActionState, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerAction, type RegisterState } from "../_authActions/authActions";
import { toast } from "sonner";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const initialState: RegisterState = { message: "", success: false };
  const [state, action, pending] = useActionState(registerAction, initialState);

  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-white">
          Name
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Your full name"
          autoComplete="name"
          required
          className="placeholder:text-foreground/50"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-white">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          className="placeholder:text-foreground/50"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-white">
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            autoComplete="new-password"
            required
            className="pr-12 placeholder:text-foreground/50"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 size-8 -translate-y-1/2 text-white"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            aria-controls="password"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-white">
          Phone <span className="text-muted-foreground">(optional)</span>
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="Your phone number"
          autoComplete="tel"
          className="placeholder:text-foreground/50"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="avatar" className="text-sm font-medium text-white">
          Avatar URL <span className="text-muted-foreground">(optional)</span>
        </label>
        <Input
          id="avatar"
          name="avatar"
          type="url"
          placeholder="https://example.com/your-photo.jpg"
          autoComplete="url"
          className="placeholder:text-foreground/50"
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-white">Role</legend>
        <div className="flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-white">
            <input
              type="radio"
              name="role"
              value="TENANT"
              defaultChecked
              className="size-4 accent-primary"
            />
            Tenant
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-white">
            <input
              type="radio"
              name="role"
              value="LANDLORD"
              className="size-4 accent-primary"
            />
            Landlord
          </label>
        </div>
      </fieldset>

      <Button type="submit" className="w-full">
        {pending ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
};

export default RegisterForm;
