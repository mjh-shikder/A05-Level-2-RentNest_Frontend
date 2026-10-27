import Image from "next/image";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { Home, LayoutDashboard, LogOut, ShieldCheck, Users } from "lucide-react";
import { logoutAction } from "@/app/(authGroup)/_authActions/authActions";
import { Button } from "@/components/ui/button";
import {
  requireDashboardUser,
  type DashboardRole,
} from "@/lib/dashboard-auth";

const roleLabels: Record<DashboardRole, string> = {
  TENANT: "Tenant",
  LANDLORD: "Landlord",
  ADMIN: "Admin",
};

const dashboardLinks: Record<
  DashboardRole,
  { href: string; label: string; icon: typeof LayoutDashboard }[]
> = {
  TENANT: [
    { href: "#overview", label: "Overview", icon: LayoutDashboard },
    { href: "#requests", label: "My requests", icon: Home },
    { href: "#payments", label: "Payments", icon: ShieldCheck },
    { href: "#reviews", label: "Reviews", icon: ShieldCheck },
  ],
  LANDLORD: [
    { href: "#overview", label: "Overview", icon: LayoutDashboard },
    { href: "#properties", label: "My properties", icon: Home },
    { href: "#requests", label: "Rental requests", icon: Users },
  ],
  ADMIN: [
    { href: "#overview", label: "Overview", icon: LayoutDashboard },
    { href: "#users", label: "Users", icon: Users },
    { href: "#properties", label: "Properties", icon: Home },
    { href: "#rentals", label: "Rentals", icon: ShieldCheck },
  ],
};

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

const getAvatarUrl = (avatar: string) => {
  if (!avatar) return "";
  return /^https?:\/\//i.test(avatar) ? avatar : `https://${avatar}`;
};

const DashboardShell = async ({ children }: { children: ReactNode }) => {
  const { user } = await requireDashboardUser();
  const avatarUrl = getAvatarUrl(user.avatar);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row lg:gap-8 lg:px-8">
      <aside className="h-fit w-full shrink-0 rounded-3xl border border-white/30 bg-white/10 p-4 shadow-sm backdrop-blur-xl dark:bg-black/10 lg:sticky lg:top-24 lg:w-64">
        <Link
          href={`/dashboard/${user.role.toLowerCase()}`}
          className="flex items-center gap-3 rounded-2xl p-3"
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={`${user.name}'s profile`}
              width={48}
              height={48}
              unoptimized
              className="size-12 rounded-full border border-white/30 object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
            >
              {getInitials(user.name)}
            </span>
          )}
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-foreground">
              {user.name}
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              {roleLabels[user.role]}
            </span>
          </span>
        </Link>

        <nav aria-label="Dashboard navigation" className="mt-4">
          <ul className="flex gap-2 overflow-x-auto lg:flex-col">
            {dashboardLinks[user.role].map(({ href, label, icon: Icon }) => (
              <li key={href} className="shrink-0">
                <a
                  href={href}
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:bg-white/10 lg:w-full"
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-4 border-t border-border/70 pt-4">
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-destructive"
            >
              <LogOut aria-hidden="true" />
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
};

const DashboardLayout = ({ children }: { children: ReactNode }) => (
  <Suspense
    fallback={
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row lg:gap-8 lg:px-8">
        <div className="h-36 animate-pulse rounded-3xl bg-muted/50 lg:w-64" />
        <div className="h-80 flex-1 animate-pulse rounded-3xl bg-muted/50" />
      </div>
    }
  >
    <DashboardShell>{children}</DashboardShell>
  </Suspense>
);

export default DashboardLayout;
