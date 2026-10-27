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
    <table className="w-full min-w-[620px] border-collapse text-left text-sm">
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
    <p
      role={type === "error" ? "alert" : "status"}
      className={`rounded-xl border px-4 py-3 text-sm ${
        type === "error"
          ? "border-destructive/25 bg-destructive/5 text-destructive"
          : "border-primary/20 bg-primary/5 text-foreground"
      }`}
    >
      {message}
    </p>
  ) : null;
