import LoginForm from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const LoginPage = () => {
  return (
  <div className="fixed inset-0 w-dvw h-dvh flex flex-col items-center justify-center bg-[url('/login-bg.jpg')] bg-cover bg-center bg-no-repeat">
  <div className="w-full max-w-md space-y-6 rounded-lg border border-white/30 bg-white/10 p-8 shadow-lg backdrop-blur-xl">
    {/* Form centric texts */}
    <div className="space-y-2 text-center">
      <h1 className="text-3xl font-bold">Welcome Back!</h1>
      <p className="text-gray-800">
        Enter Your Credentials Here
      </p>
    </div>
    {/* Form */}
    <LoginForm />
    <p className="text-center text-sm text-muted-foreground">
      Don&apos;t have an account?{" "}
      <Button asChild variant="link" className="h-auto p-0">
        <Link href="/register">Sign up</Link>
      </Button>
    </p>
  </div>
</div>
  );
};

export default LoginPage;
