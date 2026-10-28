"use client";

import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, MapPin, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePropertyCardState } from "@/components/properties/PropertyCardState";

const formatRent = (rent: number) =>
  new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(rent);

const PropertyCard = ({ propertyId }: { propertyId: string }) => {
  const { property, role } = usePropertyCardState(propertyId);
  const propertyStatus = property.status.trim().toUpperCase();

  return (
    <article>
      <Card className="group gap-0 overflow-hidden rounded-3xl border border-white/30 bg-white/10 py-0 text-foreground shadow-sm backdrop-blur-xl ring-0 transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-black/10">
        <Link
          href={`/properties/${encodeURIComponent(property.id)}`}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          aria-label={`View ${property.title}`}
        >
          <div className="relative aspect-4/3 overflow-hidden bg-muted/50">
            <Image
              src={property.images[0] || "/register-bg.jpg"}
              alt={property.title}
              fill
              unoptimized
              sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md dark:bg-black/10 dark:text-white">
              {property.category || "Rental home"}
            </span>
            <span className={`absolute right-4 top-4 rounded-full border-2 ${propertyStatus === "AVAILABLE" ? 'border-green-600/30' : 'border-amber-300/70'}  bg-white/70 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-md dark:bg-black/10 dark:text-white`}>
              {property.status.toLowerCase()}
            </span>
          </div>

          <CardContent className="px-5 py-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold tracking-tight text-foreground">
                  {property.title}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin aria-hidden="true" className="size-4 shrink-0" />
                  <span className="truncate">
                    {[property.city, property.country]
                      .filter(Boolean)
                      .join(", ") ||
                      property.address ||
                      "Location available on request"}
                  </span>
                </p>
              </div>
              {property.averageRating !== null && (
                <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-foreground">
                  <Star
                    aria-hidden="true"
                    className="size-4 fill-amber-400 text-amber-400"
                  />
                  {property.averageRating.toFixed(1)}
                </span>
              )}
            </div>

            <div className="mt-5 flex min-h-6 items-center gap-4 text-sm text-muted-foreground">
              {property.bedrooms !== null && (
                <span className="inline-flex items-center gap-1.5">
                  <BedDouble aria-hidden="true" className="size-4" />
                  {property.bedrooms} beds
                </span>
              )}
              {property.bathrooms !== null && (
                <span className="inline-flex items-center gap-1.5">
                  <Bath aria-hidden="true" className="size-4" />
                  {property.bathrooms} baths
                </span>
              )}
              {property.area !== null && (
                <span>{property.area.toLocaleString()} sq ft</span>
              )}
            </div>

            <CardFooter className="mt-5 items-end justify-between border-t border-border/60 px-0 pt-4">
              <p className="text-sm text-muted-foreground">
                <span className="text-xl font-bold text-primary">
                  ৳{formatRent(property.rent)}
                </span>{" "}
                / month
              </p>
              {property.totalReviews > 0 && (
                <span className="text-xs text-muted-foreground">
                  {property.totalReviews}{" "}
                  {property.totalReviews === 1 ? "review" : "reviews"}
                </span>
              )}
            </CardFooter>
          </CardContent>
        </Link>

        {role === "TENANT" && (
          <CardFooter className="px-5 pb-5 pt-0">
            {propertyStatus === "AVAILABLE" ? (
              <Link
                href={`/properties/${encodeURIComponent(property.id)}#rental-request`}
                className="inline-flex min-h-10 w-full items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Request to rent
              </Link>
            ) : ["RENTED", "UNAVAILABLE", "MAINTENANCE"].includes(
                propertyStatus,
              ) ? (
              <Button
                type="button"
                disabled
                className="min-h-10 w-full cursor-not-allowed rounded-full"
              >
                Not available for rent
              </Button>
            ) : null}
          </CardFooter>
        )}
      </Card>
    </article>
  );
};

export default PropertyCard;
