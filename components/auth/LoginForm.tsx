"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      className="space-y-5"
      method="post"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          className="border-white/30 bg-white/10 placeholder:text-foreground/50"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            className="border-white/30 bg-white/10 pr-12 placeholder:text-foreground/50"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 size-8 -translate-y-1/2"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            aria-controls="password"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </Button>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Login
          </Button>
      <p>Error here</p>
    </form>
  );
};

export default LoginForm;
