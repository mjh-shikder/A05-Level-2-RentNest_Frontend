"use client";

import { useEffect } from "react";
import "./globals.css";
import ErrorFallback from "@/components/shared/ErrorFallback";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("Root layout error:", error);
  }, [error]);

  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <ErrorFallback retry={retry} />
      </body>
    </html>
  );
}
