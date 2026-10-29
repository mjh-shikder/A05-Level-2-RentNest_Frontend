import Link from "next/link";
import { ArrowRight, Building2, ClipboardList, Home } from "lucide-react";

const audiences = [
  {
    title: "For tenants",
    description:
      "Explore available homes, send rental requests, and keep track of your rental and payment activity.",
    icon: Home,
  },
  {
    title: "For landlords",
    description:
      "Create and manage property listings, then review and respond to incoming rental requests.",
    icon: Building2,
  },
  {
    title: "For administrators",
    description:
      "Oversee users, property listings, and rental activity from a dedicated dashboard.",
    icon: ClipboardList,
  },
];

export default function AboutPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            About RentNest
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            A clearer way to find and manage a rental home
          </h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            RentNest brings tenants and landlords together in one rental
            marketplace. Browse homes, manage requests, and keep the important
            steps of renting organized in one place.
          </p>
          <Link
            href="/properties"
            className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Explore properties
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="about-experience-title"
        className="border-y border-border/70 bg-muted/20"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="about-experience-title"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              One platform, different rental journeys
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Each account has tools to support its part of the rental process.
            </p>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {audiences.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="rounded-3xl border border-white/30 bg-background/80 p-6 shadow-sm dark:bg-card/80 sm:p-7"
              >
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
