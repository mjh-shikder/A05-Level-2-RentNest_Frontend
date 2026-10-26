"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { ChevronDown, LogOut, Moon, Sun, UserRound } from "lucide-react";
import { logoutAction } from "@/app/(authGroup)/_authActions/authActions";

export type NavbarUser = {
  name: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
  avatar: string;
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
];

const dashboardByRole: Record<NavbarUser["role"], string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
};

const roleLabel: Record<NavbarUser["role"], string> = {
  TENANT: "Tenant",
  LANDLORD: "Landlord",
  ADMIN: "Admin",
};

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

const NavbarClient = ({
  user,
  isAuthenticated,
}: {
  user: NavbarUser | null;
  isAuthenticated: boolean;
}) => {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // The login and registration screens use full-screen backgrounds and keep
  // their existing focused layout without the site navigation.
  if (pathname === "/login" || pathname === "/register") return null;

  const avatarUrl = user?.avatar
    ? /^https?:\/\//i.test(user.avatar)
      ? user.avatar
      : `https://${user.avatar}`
    : "";

  return (
    <header className="sticky top-0 z-50 border-b border-white/30 bg-white/10 shadow-sm backdrop-blur-xl dark:bg-black/10">
      <div className="mx-auto grid min-h-16 w-full max-w-7xl grid-cols-[1fr_auto] items-center gap-2 px-4 py-2 sm:grid-cols-[1fr_auto_1fr] sm:gap-3 sm:px-6 sm:py-0">
        <Link href="/" aria-label="Rent Nest home" className="w-fit">
          <Image
            src={isDark ? "/ren_nest-Logo-Dark.png" : "/ren_nest-Logo-Light.png"}
            alt="Rent Nest"
            width={160}
            height={40}
            priority
            className="h-7 w-auto object-contain sm:h-9"
          />
        </Link>

        <nav
          aria-label="Main navigation"
          className="col-span-2 row-start-2 justify-self-center sm:col-span-1 sm:row-start-auto"
        >
          <ul className="flex items-center gap-2 sm:gap-6">
            {navLinks.map(({ href, label }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);

              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className="rounded-full px-3 py-2 text-sm font-medium text-foreground/85 transition-colors hover:bg-white/15 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4"
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="col-start-2 row-start-1 flex items-center justify-self-end gap-2 sm:col-auto sm:row-auto">
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            title={`Switch to ${isDark ? "light" : "dark"} theme`}
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-foreground transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          {isAuthenticated && user ? (
            <details className="group relative">
              <summary
                aria-label="Open account menu"
                className="flex size-10 cursor-pointer list-none items-center justify-center rounded-full border border-white/30 bg-white/10 text-foreground marker:hidden transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={`${user.name}'s avatar`}
                    width={40}
                    height={40}
                    unoptimized
                    className="size-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold" aria-hidden="true">
                    {getInitials(user.name)}
                  </span>
                )}
                <ChevronDown className="absolute -bottom-0.5 -right-1 size-3 rounded-full bg-background text-foreground group-open:rotate-180" />
              </summary>

              <div className="absolute right-0 mt-3 w-60 rounded-xl border border-white/30 bg-background/90 p-2 text-foreground shadow-xl backdrop-blur-xl">
                <div className="border-b border-border px-3 py-2">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {roleLabel[user.role]}
                  </p>
                </div>
                <Link
                  href={dashboardByRole[user.role]}
                  className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                >
                  <UserRound className="size-4" />
                  Dashboard
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="size-4" />
                    Log out
                  </button>
                </form>
              </div>
            </details>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/login"
                className="rounded-full px-3 py-2 text-sm font-medium text-foreground hover:bg-white/15 sm:px-4"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 sm:inline-flex"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavbarClient;
