const DashboardLoading = () => (
  <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row lg:gap-8 lg:px-8">
    <div className="h-36 animate-pulse rounded-3xl bg-muted/50 lg:w-64" />
    <div className="flex-1 space-y-6">
      <div className="h-24 animate-pulse rounded-3xl bg-muted/50" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl bg-muted/50"
          />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-3xl bg-muted/50" />
    </div>
  </div>
);

export default DashboardLoading;
