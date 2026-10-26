"use client";

import { useActionState, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction, type LoginState } from "../../app/(authGroup)/_authActions/authActions";
import { toast } from "sonner";


const LoginForm = () => {
    // action trigger korle loginAction call hobe, loginAction er result ta state e set hobe
  const initialState: LoginState = {
    message: "",
    data: {
      user: {
        id: "",
        name: "",
        email: "",
        phone: "",
        avatar: "",
        role: "TENANT",
        status: "ACTIVE",
        createdAt: "",
        updatedAt: "",
      },
      accessToken: "",
    },
  };
  const [state, action, pending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (!state?.message) return;

    if (state.data) {
      toast.success(state.message || "Login Successful");
    } else {
      toast.error(state.error || state.message || "Login Failed!");
    }
  }, [state]);

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="space-y-5" method="POST">
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
          className="auth-glass-input border-white/30 placeholder:text-foreground/50"
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
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            className="auth-glass-input border-white/30 pr-12 placeholder:text-foreground/50"
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
              {
        pending ? "Submittion..." : "Login"
       }
      </Button>
      {state.error && (
        <p role="alert" className="text-sm font-medium text-center text-red-800">
          {state.error}
        </p>
      )}
    </form>
  );
};

export default LoginForm;
