import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const RegisterPage = () => {
  return (
  <div className="fixed inset-0 w-dvw h-dvh flex flex-col items-center justify-center bg-[url('/register-bg.jpg')] bg-cover bg-center bg-no-repeat">
  <div className="w-full max-w-md space-y-6 rounded-lg border bg-background/90 backdrop-blur-sm p-8 shadow-lg">
    {/* Form centric texts */}
    <div className="space-y-2 text-center">
      <h1 className="text-3xl font-bold">Welcome Back!</h1>
      <p className="text-amber-900 ">
        Enter Your Credentials
      </p>
    </div>
    
    <p className="text-center text-sm text-muted-foreground">
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
