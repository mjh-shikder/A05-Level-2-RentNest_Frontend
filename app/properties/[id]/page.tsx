import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Bath,
  BedDouble,
  CalendarDays,
  MapPin,
  Ruler,
  Star,
} from "lucide-react";
import {
  getPropertyDetails,
  PropertyListingsError,
} from "@/lib/properties";

const formatRent = (amount: number) =>
  new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(amount);

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en", {
        dateStyle: "long",
        timeZone: "UTC",
      }).format(date);
};

export default async function PropertyByIdPage({
  params,
}: PageProps<"/properties/[id]">) {
  const { id } = await params;
  let property;

  try {
    property = await getPropertyDetails(id);
  } catch (error) {
    if (error instanceof PropertyListingsError && error.statusCode === 404) {
      notFound();
    }

    return (
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Property details are unavailable
        </h1>
        <p className="mt-3 max-w-lg text-muted-foreground">
          {error instanceof PropertyListingsError
            ? error.message
            : "We could not load this property. Please try again."}
        </p>
        <Link
          href="/properties"
          className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Back to properties
        </Link>
      </main>
    );
  }

  const images = property.images.length
    ? property.images
    : ["/register-bg.jpg"];

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link
        href="/properties"
        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        ← Back to properties
      </Link>

      <div className="mt-6 grid gap-3 overflow-hidden rounded-3xl sm:grid-cols-2">
        <div className="relative min-h-[280px] sm:row-span-2 sm:min-h-[520px]">
          <Image
            src={images[0]}
            alt={property.title}
            fill
            priority
            unoptimized
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        {images.slice(1, 3).map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="relative hidden min-h-[250px] sm:block"
          >
            <Image
              src={image}
              alt={`${property.title} photo ${index + 2}`}
              fill
              unoptimized
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
        {images.length === 1 && (
          <div className="hidden min-h-[250px] bg-muted/40 sm:block" />
        )}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section>
          <div className="flex flex-wrap items-center gap-3">
            {property.category && (
              <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                {property.category}
              </span>
            )}
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-xl dark:bg-black/10">
              {property.status}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {property.title}
          </h1>
          <p className="mt-3 flex items-center gap-2 text-muted-foreground">
            <MapPin aria-hidden="true" className="size-4 shrink-0" />
            {[property.address, property.city, property.country]
              .filter(Boolean)
              .join(", ") || "Location available on request"}
          </p>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-y border-border py-5 text-sm text-muted-foreground">
            {property.bedrooms !== null && (
              <span className="inline-flex items-center gap-2">
                <BedDouble aria-hidden="true" className="size-4" />
                {property.bedrooms} bedrooms
              </span>
            )}
            {property.bathrooms !== null && (
              <span className="inline-flex items-center gap-2">
                <Bath aria-hidden="true" className="size-4" />
                {property.bathrooms} bathrooms
              </span>
            )}
            {property.area !== null && (
              <span className="inline-flex items-center gap-2">
                <Ruler aria-hidden="true" className="size-4" />
                {property.area.toLocaleString()} sq ft
              </span>
            )}
            {property.furnished !== null && (
              <span>{property.furnished ? "Furnished" : "Unfurnished"}</span>
            )}
            {property.floor !== null && <span>Floor {property.floor}</span>}
          </div>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-foreground">
              About this home
            </h2>
            <p className="mt-3 whitespace-pre-line leading-7 text-muted-foreground">
              {property.description || "No description has been added yet."}
            </p>
            {property.availableFrom && (
              <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays aria-hidden="true" className="size-4" />
                Available from {formatDate(property.availableFrom)}
              </p>
            )}
          </section>

          <section className="mt-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-foreground">
                Reviews
              </h2>
              {property.averageRating !== null && (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Star
                    aria-hidden="true"
                    className="size-4 fill-amber-400 text-amber-400"
                  />
                  {property.averageRating.toFixed(1)}
                  <span className="font-normal text-muted-foreground">
                    ({property.totalReviews}{" "}
                    {property.totalReviews === 1 ? "review" : "reviews"})
                  </span>
                </span>
              )}
            </div>
            {property.reviews.length ? (
              <ul className="mt-4 space-y-4">
                {property.reviews.map((review) => (
                  <li
                    key={review.id}
                    className="rounded-2xl border border-white/30 bg-white/10 p-5 backdrop-blur-xl dark:bg-black/10"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-foreground">
                        {review.tenantName}
                      </p>
                      <span className="inline-flex items-center gap-1 text-sm">
                        <Star
                          aria-hidden="true"
                          className="size-4 fill-amber-400 text-amber-400"
                        />
                        {review.rating}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="mt-2 leading-6 text-muted-foreground">
                        {review.comment}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                No reviews yet.
              </p>
            )}
          </section>
        </section>

        <aside className="h-fit rounded-3xl border border-white/30 bg-white/10 p-6 shadow-sm backdrop-blur-xl dark:bg-black/10 lg:sticky lg:top-24">
          <p className="text-sm text-muted-foreground">Monthly rent</p>
          <p className="mt-1 text-3xl font-bold text-primary">
            ৳{formatRent(property.rent)}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              / month
            </span>
          </p>
          {property.securityDeposit !== null && (
            <p className="mt-2 text-sm text-muted-foreground">
              Security deposit: ৳{formatRent(property.securityDeposit)}
            </p>
          )}

          <div className="my-6 border-t border-border/70" />
          <h2 className="font-semibold text-foreground">Property owner</h2>
          {property.landlord ? (
            <div className="mt-4">
              <p className="font-medium text-foreground">
                {property.landlord.name}
              </p>
              {property.landlord.email && (
                <a
                  href={`mailto:${property.landlord.email}`}
                  className="mt-2 block break-all text-sm text-primary underline-offset-4 hover:underline"
                >
                  {property.landlord.email}
                </a>
              )}
              {property.landlord.phone && (
                <a
                  href={`tel:${property.landlord.phone}`}
                  className="mt-1 block text-sm text-primary underline-offset-4 hover:underline"
                >
                  {property.landlord.phone}
                </a>
              )}
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Owner details are not available.
            </p>
          )}
          <p className="mt-5 text-xs leading-5 text-muted-foreground">
            Contact details are provided by the property owner. Verify the
            listing and rental terms before making arrangements.
          </p>
        </aside>
      </div>
    </main>
  );
}