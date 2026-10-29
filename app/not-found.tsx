import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <section
        aria-labelledby="not-found-title"
        className="w-full max-w-lg rounded-3xl border border-white/30 bg-background/80 p-7 text-center shadow-sm backdrop-blur-xl dark:bg-card/80 sm:p-10"
      >
        <p className="text-6xl font-bold tracking-tight text-primary sm:text-7xl">
          404
        </p>
        <h1
          id="not-found-title"
          className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          We couldn&apos;t find that page
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The page may have moved, or the address may be incorrect. Let&apos;s
          help you find your next place.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">Go to homepage</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/properties">Browse properties</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
