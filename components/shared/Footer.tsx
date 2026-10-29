import { Suspense } from "react";
import Link from "next/link";
import { io } from "next/cache";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CodeXml,
  UsersRound,
} from "lucide-react";

const projectUrl =
  "https://github.com/mjh-shikder/A05-Level-2-RentNest_Frontend";

const socialLinks = [
  { label: "GitHub", icon: CodeXml },
  { label: "LinkedIn", icon: BriefcaseBusiness },
  { label: "Facebook", icon: UsersRound },
];

const CopyrightNotice = async () => {
  await io();
  const year = new Date().getFullYear();

  return <p>© {year} RentNest. All rights reserved.</p>;
};

const Footer = () => {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border/70 bg-muted/20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 size-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-5 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <div className="grid gap-10 rounded-3xl border border-white/30 bg-background/70 p-6 shadow-sm backdrop-blur-xl dark:bg-card/70 sm:p-8 lg:grid-cols-[1.3fr_0.7fr] lg:gap-14">
          <div className="flex flex-col items-start">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Rent<span className="text-primary">Nest</span>
            </Link>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              A clearer way to find a place to call home. Explore available
              properties and keep your rental journey moving.
            </p>
            <Link
              href="/properties"
              className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Explore properties
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-[1fr_auto]">
            <nav aria-label="Footer navigation">
              <h2 className="text-sm font-semibold text-foreground">
                Explore
              </h2>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="/properties"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Properties
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Log in
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Sign up
                  </Link>
                </li>
              </ul>
            </nav>

            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Follow along
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {socialLinks.map(({ label, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={projectUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`RentNest on ${label}`}
                      title={label}
                      className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Icon aria-hidden="true" className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-border/70 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <Suspense fallback={<p>© RentNest. All rights reserved.</p>}>
            <CopyrightNotice />
          </Suspense>
          <p>Made for finding your next place to call home.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
