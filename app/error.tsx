"use client";

import { useEffect } from "react";
import ErrorFallback from "@/components/shared/ErrorFallback";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return <ErrorFallback retry={retry} />;
}
