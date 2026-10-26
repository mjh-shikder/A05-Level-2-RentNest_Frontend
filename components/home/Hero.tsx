import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";

const Hero = () => {
  return (
    <section className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-16">
      <div className="max-w-xl">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
          <MapPin aria-hidden="true" className="size-4" />
          A better way to find home
        </p>

        <h1 className="text-4xl font-semibold leading-[1.12] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Find a place
          <br />
          <span className="text-primary">to call home.</span>
        </h1>

        <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          Your next chapter starts with the right space. Explore homes that fit
          your life, or share a place of your own with the people looking for it.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/properties"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Explore properties
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          <Link
            href="/properties"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Get started
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">RentNest makes it easy to</span>
          <span>Discover</span>
          <span aria-hidden="true" className="text-border">
            /
          </span>
          <span>Connect</span>
          <span aria-hidden="true" className="text-border">
            /
          </span>
          <span>Move in</span>
        </div>
      </div>

      <div className="relative min-h-85 overflow-hidden rounded-3xl sm:min-h-110 lg:min-h-135">
        <Image
          src="/hero.jpg"
          alt="A warmly lit modern home surrounded by greenery at dusk"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover "
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-black/65 via-black/5 to-black/10"
        />
        <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
          <p className="text-sm font-medium text-white/80">Make room for</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            what comes next.
          </p>
        </div>
        <div className="absolute right-4 top-4 rounded-full border border-white/30 bg-black/20 px-4 py-2 text-xs font-medium tracking-wide text-white backdrop-blur-md sm:right-6 sm:top-6">
          YOUR NEXT CHAPTER
        </div>
      </div>
    </section>
  );
};

export default Hero;
