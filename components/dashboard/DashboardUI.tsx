import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

export const firstSearchParam = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export const DashboardPageHeader = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) => (
  <header id="overview" className="scroll-mt-24">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
      {eyebrow}
    </p>
    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
      {title}
    </h1>
    <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
  </header>
);

export const DashboardLoading = () => (
  <div
    aria-label="Loading dashboard"
    aria-busy="true"
    className="space-y-7"
  >
    <div aria-hidden="true" className="space-y-3">
      <div className="h-3 w-36 animate-pulse rounded bg-muted" />
      <div className="h-8 w-72 max-w-full animate-pulse rounded bg-muted" />
      <div className="h-4 w-96 max-w-full animate-pulse rounded bg-muted" />
    </div>

    <div
      aria-hidden="true"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="space-y-3 rounded-2xl border border-white/30 bg-white/10 p-5 shadow-sm backdrop-blur-xl dark:bg-black/10"
        >
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-7 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>

    {Array.from({ length: 2 }, (_, sectionIndex) => (
      <section key={sectionIndex} aria-hidden="true">
        <div className="mb-4 space-y-2">
          <div className="h-5 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded bg-muted" />
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/30 bg-white/10 shadow-sm backdrop-blur-xl dark:bg-black/10">
          <div className="overflow-x-auto">
            <div className="min-w-155">
              <div className="grid grid-cols-5 gap-4 border-b border-border/70 px-4 py-3">
                {Array.from({ length: 5 }, (_, cellIndex) => (
                  <div
                    key={cellIndex}
                    className="h-3 w-2/3 animate-pulse rounded bg-muted"
                  />
                ))}
              </div>
              {Array.from({ length: 4 }, (_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid grid-cols-5 gap-4 border-b border-border/50 px-4 py-4 last:border-b-0"
                >
                  {Array.from({ length: 5 }, (_, cellIndex) => (
                    <div
                      key={cellIndex}
                      className={`h-4 animate-pulse rounded bg-muted ${
                        cellIndex === 0 ? "w-4/5" : "w-2/3"
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ))}
  </div>
);

export const DashboardStat = ({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) => (
  <article className="rounded-2xl border border-white/30 bg-white/10 p-5 shadow-sm backdrop-blur-xl dark:bg-black/10">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
      {value}
    </p>
    <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
  </article>
);

export const DashboardSection = ({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}) => (
  <section id={id} className="scroll-mt-24">
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
    {children}
  </section>
);

export const DashboardPanel = ({ children }: { children: ReactNode }) => (
  <div className="overflow-hidden rounded-2xl border border-white/30 bg-white/10 shadow-sm backdrop-blur-xl dark:bg-black/10">
    {children}
  </div>
);

export const DashboardTable = ({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-155 border-collapse text-left text-sm">
      <thead>
        <tr className="border-b border-border/70 text-xs uppercase tracking-wide text-muted-foreground">
          {headers.map((header) => (
            <th key={header} scope="col" className="px-4 py-3 font-medium">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border/50">{children}</tbody>
    </table>
  </div>
);

export const DashboardCell = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => <td className={`px-4 py-3.5 align-middle ${className}`}>{children}</td>;

export const DashboardStatus = ({ status }: { status: string }) => {
  const normalized = status.toUpperCase();
  const className =
    normalized === "APPROVED" ||
    normalized === "ACTIVE" ||
    normalized === "PAID"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : normalized === "PENDING"
        ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
        : normalized === "REJECTED" ||
            normalized === "BLOCKED" ||
            normalized === "CANCELLED"
          ? "bg-destructive/10 text-destructive"
          : "bg-muted text-muted-foreground";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {normalized.replaceAll("_", " ")}
    </span>
  );
};

export const DashboardEmpty = ({ message }: { message: string }) => (
  <p className="px-5 py-8 text-center text-sm text-muted-foreground">
    {message}
  </p>
);

export const DashboardError = ({ message }: { message: string }) => (
  <div
    role="alert"
    className="flex items-start gap-3 rounded-2xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-foreground"
  >
    <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-destructive" />
    <p>{message}</p>
  </div>
);

export const DashboardNotice = ({
  message,
  type,
}: {
  message?: string;
  type?: string;
}) =>
  message ? (
    <div
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
      className={`flex items-start gap-3 rounded-2xl border p-4 text-sm ${
        type === "error"
          ? "border-destructive/25 bg-destructive/5 text-foreground"
          : "border-primary/20 bg-primary/5 text-foreground"
      }`}
    >
      {type === "error" && (
        <AlertCircle
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-destructive"
        />
      )}
      <p>{message}</p>
    </div>
  ) : null;
