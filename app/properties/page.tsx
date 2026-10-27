import Link from "next/link";
import PropertiesBrowser from "@/components/properties/PropertiesBrowser";
import {
  getPropertyListings,
  PropertyListingsError,
} from "@/lib/properties";
import type { PropertyListing } from "@/lib/properties";
import { getDashboardRole } from "@/lib/dashboard-auth";

export default async function PropertiesPage() {
  const role = await getDashboardRole();
  let properties: PropertyListing[] | null = null;
  let errorMessage: string | null = null;

  try {
    properties = await getPropertyListings();
  } catch (error) {
    errorMessage =
      error instanceof PropertyListingsError
        ? error.message
        : "We could not load properties. Please try again.";
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="mb-8 max-w-2xl sm:mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Find your next place
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Homes for rent
        </h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          Browse available homes and find a place that feels like yours.
        </p>
      </header>

      {errorMessage ? (
        <section
          role="alert"
          className="rounded-3xl border border-destructive/25 bg-destructive/5 px-6 py-12 text-center"
        >
          <h2 className="text-lg font-semibold text-foreground">
            Properties are temporarily unavailable
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            {errorMessage}
          </p>
          <Link
            href="/properties"
            className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Try again
          </Link>
        </section>
      ) : properties?.length ? (
        <PropertiesBrowser properties={properties} role={role} />
      ) : (
        <section className="rounded-3xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            No properties listed yet
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Check back soon to discover available homes.
          </p>
        </section>
      )}
    </main>
  );
}
