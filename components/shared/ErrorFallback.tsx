"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ErrorFallback = ({ retry }: { retry: () => void }) => (
  <main className="flex flex-1 items-center justify-center px-4 py-16">
    <section
      aria-labelledby="error-title"
      className="w-full max-w-lg rounded-3xl border border-white/30 bg-background/80 p-7 text-center shadow-sm backdrop-blur-xl dark:bg-card/80 sm:p-10"
    >
      <div
        aria-hidden="true"
        className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive"
      >
        <AlertTriangle className="size-7" />
      </div>
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
        RentNest
      </p>
      <h1
        id="error-title"
        className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
      >
        Something went wrong
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        We couldn&apos;t load this page. Please try again, or return to the
        homepage.
      </p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <Button type="button" onClick={retry}>
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Go to homepage</Link>
        </Button>
      </div>
    </section>
  </main>
);

export default ErrorFallback;
