
import { Suspense } from "react";
import Hero from "@/components/home/Hero";
import FeatureProperties from "@/components/home/FeatureProperties";

const FeaturedPropertiesFallback = () => (
  <section
    aria-hidden="true"
    className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8"
  >
    <div className="mb-6 h-8 w-56 animate-pulse rounded bg-muted/50" />
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="aspect-4/3 animate-pulse rounded-3xl bg-muted/50"
        />
      ))}
    </div>
  </section>
);

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Suspense fallback={<FeaturedPropertiesFallback />}>
        <FeatureProperties />
      </Suspense>
    </main>
  );
}
