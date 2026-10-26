"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bath,
  BedDouble,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PropertyListing } from "@/lib/properties";


const formatRent = (rent: number) => new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(rent);

const fieldClassName =
  "h-11 rounded-xl border-white/40 bg-white/30 text-foreground shadow-none backdrop-blur-sm dark:border-white/15 dark:bg-black/20";

const PropertiesBrowser = ({properties,}: {properties: PropertyListing[];}) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [bedrooms, setBedrooms] = useState("any");
  const [furnished, setFurnished] = useState("any");
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [sort, setSort] = useState("recommended");

  const categories = useMemo(
    () =>
      [...new Set(properties.map((property) => property.category).filter(Boolean))].sort(),
    [properties],
  );

  const filteredProperties = useMemo(() => {

    const minRentValue = minRent ? Number(minRent) : null;

    const normalizedQuery = query.trim().toLowerCase();

    const maxRentValue = maxRent ? Number(maxRent) : null;

    return properties
      .filter((property) => {
        const searchableText = [
          property.title,
          property.description,
          property.city,
          property.country,
          property.address,
          property.category,
        ]
          .join(" ")
          .toLowerCase();

        return (
          (!normalizedQuery || searchableText.includes(normalizedQuery)) &&
          (category === "all" || property.category === category) &&
          (bedrooms === "any" ||
            (property.bedrooms !== null &&
              property.bedrooms >= Number(bedrooms))) &&
          (furnished === "any" ||
            (furnished === "yes" && property.furnished === true) ||
            (furnished === "no" && property.furnished === false)) &&
          (minRentValue === null ||
            !Number.isFinite(minRentValue) ||
            property.rent >= minRentValue) &&
          (maxRentValue === null ||
            !Number.isFinite(maxRentValue) ||
            property.rent <= maxRentValue)
        );
      })
      .sort((a, b) => {
        if (sort === "rent-low") return a.rent - b.rent;
        if (sort === "rent-high") return b.rent - a.rent;
        return 0;
      });
  }, [properties, query, category, bedrooms, furnished, minRent, maxRent, sort]);

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
    setBedrooms("any");
    setFurnished("any");
    setMinRent("");
    setMaxRent("");
    setSort("recommended");
  };

  return (
    <div>
      <section className="rounded-3xl border border-white/30 bg-white/10 p-4 shadow-sm backdrop-blur-xl dark:bg-black/10 sm:p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="relative block text-xs text-muted-foreground">
            <span className="sr-only">Search properties</span>
                        <span>Search properties</span>

            <Search
              aria-hidden="true"
              className="absolute left-3.5 top-9.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by location or keyword"
              className={`${fieldClassName} pl-10`}
            />
          </label>

          <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
            <span>Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={`w-full px-3 text-sm ${fieldClassName}`}
            >
              <option value="all">All Category</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item.charAt(0) + item.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
            <span>Bedrooms</span>
            <select
              value={bedrooms}
              onChange={(event) => setBedrooms(event.target.value)}
              className={`w-full px-3 text-sm ${fieldClassName}`}
            >
              <option value="any">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </label>



          <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
            <span>Furnishing</span>
            <select
              value={furnished}
              onChange={(event) => setFurnished(event.target.value)}
              className={`w-full px-3 text-sm ${fieldClassName}`}
            >
              <option value="any">Any</option>
              <option value="yes">Furnished</option>
              <option value="no">Unfurnished</option>
            </select>
          </label>



          <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
            <span>Minimum monthly rent</span>
            <Input
              type="number"
              min="0"
              inputMode="numeric"
              value={minRent}
              onChange={(event) => setMinRent(event.target.value)}
              placeholder="No minimum"
              className={fieldClassName}
            />
          </label>

          <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
            <span>Maximum monthly rent</span>
            <Input
              type="number"
              min="0"
              inputMode="numeric"
              value={maxRent}
              onChange={(event) => setMaxRent(event.target.value)}
              placeholder="No limit"
              className={fieldClassName}
            />
          </label>

          <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
            <span>Sort by</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className={`w-full px-3 text-sm ${fieldClassName}`}
            >
              <option value="recommended">Recommended</option>
              <option value="rent-low">Rent: low to high</option>
              <option value="rent-high">Rent: high to low</option>
            </select>
          </label>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          <span className="font-semibold text-foreground">
            {filteredProperties.length}
          </span>{" "}
          {filteredProperties.length === 1 ? "home" : "homes"} found
        </p>
        <Button
          type="button"
          variant="ghost"
          onClick={clearFilters}
          className="text-muted-foreground"
        >
          <SlidersHorizontal aria-hidden="true" />
          Clear filters
        </Button>
      </div>

      {filteredProperties.length ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProperties.map((property) => (
            <article
              key={property.id}
              className="group overflow-hidden rounded-3xl border border-white/30 bg-white/10 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-black/10"
            >
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
                  <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/80 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm backdrop-blur-md dark:bg-black/55 dark:text-white">
                    {property.category || "Rental home"}
                  </span>
                  <span className="absolute right-4 top-4 rounded-full border border-white/30 bg-white/80 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-md dark:bg-black/55 dark:text-white">
                    {property.status.toLowerCase()}
                  </span>
                </div>

                <div className="p-5">
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
                            .join(", ") || property.address || "Location available on request"}
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

                  <div className="mt-5 flex items-end justify-between border-t border-border/60 pt-4">
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
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-3xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            No homes match those filters
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try another search or clear some filters to see more listings.
          </p>
          <Button type="button" variant="outline" onClick={clearFilters} className="mt-5">
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default PropertiesBrowser;
