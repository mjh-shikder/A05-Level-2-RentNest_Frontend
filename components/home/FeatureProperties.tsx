import Link from "next/link";
import PropertyCard from "@/components/properties/PropertyCard";
import { PropertyCardStateProvider } from "@/components/properties/PropertyCardState";
import {
  getPropertyListings,
  PropertyListingsError,
} from "@/lib/properties";
import { getDashboardRole } from "@/lib/dashboard-auth";

const FeatureProperties = async () => {
  let properties;
  try {
    properties = await getPropertyListings();
  } catch (error) {
    const message =
      error instanceof PropertyListingsError
        ? error.message
        : "We could not load featured properties. Please try again.";

    return (
      <section
        aria-labelledby="featured-properties-title"
        className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8"
      >
        <h2
          id="featured-properties-title"
          className="text-2xl font-semibold tracking-tight text-foreground"
        >
          Featured properties
        </h2>
        <p role="alert" className="mt-4 text-sm text-muted-foreground">
          {message}
        </p>
      </section>
    );
  }

  const featuredProperties = properties
    .filter((property) => property.status.trim().toUpperCase() === "AVAILABLE")
    .slice(0, 3);
  const role = await getDashboardRole();

  return (
    <section
      aria-labelledby="featured-properties-title"
      className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Find your next home
          </p>
          <h2
            id="featured-properties-title"
            className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            Featured properties
          </h2>
        </div>
        <Link
          href="/properties"
          className="text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Browse all properties
        </Link>
      </div>

      {featuredProperties.length ? (
        <PropertyCardStateProvider
          properties={featuredProperties}
          role={role}
        >
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} propertyId={property.id} />
            ))}
          </div>
        </PropertyCardStateProvider>
      ) : (
        <p className="rounded-3xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center text-sm text-muted-foreground">
          There are no available properties to feature right now. Please check
          back soon.
        </p>
      )}
    </section>
  );
};

export default FeatureProperties;
