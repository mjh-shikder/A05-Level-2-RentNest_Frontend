"use client";

import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PropertyCard from "@/components/properties/PropertyCard";
import { PropertyCardStateProvider } from "@/components/properties/PropertyCardState";
import type { PropertyListing } from "@/lib/properties";
import type { DashboardRole } from "@/lib/dashboard-auth";

const PAGE_SIZE = 9;

const fieldClassName =
  "h-11 rounded-xl border-white/40 bg-white/30 text-foreground shadow-none backdrop-blur-sm dark:border-white/15 dark:bg-black/20";

const PropertiesBrowser = ({
  properties,
  role,
}: {
  properties: PropertyListing[];
  role: DashboardRole | null;
}) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [bedrooms, setBedrooms] = useState("any");
  const [furnished, setFurnished] = useState("any");
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [sort, setSort] = useState("recommended");
  const [page, setPage] = useState(1);

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
          (status === "all" ||
            (status === "AVAILABLE" &&
              property.status.trim().toUpperCase() === "AVAILABLE") ||
            (status === "RENTED" &&
              ["RENTED", "UNAVAILABLE"].includes(
                property.status.trim().toUpperCase(),
              ))) &&
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
  }, [
    properties,
    query,
    category,
    status,
    bedrooms,
    furnished,
    minRent,
    maxRent,
    sort,
  ]);

  const pageCount = Math.max(1, Math.ceil(filteredProperties.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleProperties = filteredProperties.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
    setStatus("all");
    setBedrooms("any");
    setFurnished("any");
    setMinRent("");
    setMaxRent("");
    setSort("recommended");
    setPage(1);
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
            <span>Property status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className={`w-full px-3 text-sm ${fieldClassName}`}
            >
              <option value="all">Any status</option>
              <option value="AVAILABLE">Available</option>
              <option value="RENTED">Rented</option>
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
        <PropertyCardStateProvider properties={visibleProperties} role={role}>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visibleProperties.map((property) => (
              <PropertyCard key={property.id} propertyId={property.id} />
            ))}
          </div>
        </PropertyCardStateProvider>
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

      {filteredProperties.length > 0 && (
        <nav
          aria-label="Property listing pages"
          className="mt-6 flex flex-wrap items-center justify-between gap-3"
        >
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filteredProperties.length)} of{" "}
            {filteredProperties.length} properties
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              Previous
            </Button>
            <span className="px-2 text-sm text-muted-foreground">
              Page {currentPage} of {pageCount}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage === pageCount}
              onClick={() => setPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default PropertiesBrowser;
