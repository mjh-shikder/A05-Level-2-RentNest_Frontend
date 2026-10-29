import Link from "next/link";
import { ArrowRight, ClipboardCheck, Home, LayoutDashboard } from "lucide-react";

const highlights = [
  {
    value: "3 steps",
    label: "From search to home",
    description:
      "Explore available places, send a rental request, then continue to secure checkout when approved.",
    icon: Home,
  },
  {
    value: "1 dashboard",
    label: "Your rental activity",
    description:
      "Keep your requests and payment history together in your tenant dashboard.",
    icon: LayoutDashboard,
  },
  {
    value: "3 roles",
    label: "A platform for everyone",
    description:
      "Purposeful experiences for tenants, landlords, and administrators.",
    icon: ClipboardCheck,
  },
];

const WhyRentNest = () => (
  <section
    aria-labelledby="why-rent-nest-title"
    className="border-y border-border/70 bg-muted/20"
  >
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Renting, made clearer
        </p>
        <h2
          id="why-rent-nest-title"
          className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        >
          Why Rent Nest?
        </h2>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Find a place, manage the important steps, and keep your rental journey
          moving in one thoughtfully connected experience.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {highlights.map(({ value, label, description, icon: Icon }) => (
          <article
            key={label}
            className="rounded-3xl border border-white/30 bg-background/80 p-6 shadow-sm dark:bg-card/80 sm:p-7"
          >
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon aria-hidden="true" className="size-5" />
            </div>
            <p className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
              {value}
            </p>
            <h3 className="mt-1 text-sm font-semibold text-foreground">
              {label}
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/properties"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Find your next home
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </div>
  </section>
);

export default WhyRentNest;
