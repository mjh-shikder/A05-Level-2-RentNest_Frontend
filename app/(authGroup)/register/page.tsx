import { Button } from "@/components/ui/button";
import RegisterForm from "@/app/(authGroup)/_authComponents/RegisterForm";
import Link from "next/link";
import React from "react";

const RegisterPage = () => {
  return (
  <div className="fixed inset-0 w-dvw h-dvh overflow-y-auto flex flex-col items-center justify-center bg-[url('/register-bg.jpg')] bg-cover bg-center bg-no-repeat p-4">
  <div className="w-full max-w-lg space-y-6 rounded-lg border border-white/30 bg-white/10 p-8 shadow-lg backdrop-blur-xl">
    {/* Form centric texts */}
    <div className="space-y-2 text-center">
      <h1 className="text-3xl font-bold">Create Your Account</h1>
      <p className="text-gray-900 ">
        Enter your details to get started
      </p>
    </div>

    <RegisterForm />
    
    <p className="text-center text-sm text-muted">
     You have an account? {" "}
      <Button asChild variant="link" className="h-auto p-0">
        <Link href="/login">Login</Link>
      </Button>
    </p>
  </div>
</div>
  );
};

export default RegisterPage;
