const PropertiesLoading = () => (
  <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
    <div className="mb-10 space-y-3">
      <div className="h-4 w-40 animate-pulse rounded bg-muted/60" />
      <div className="h-10 w-64 animate-pulse rounded bg-muted/60" />
      <div className="h-5 w-full max-w-lg animate-pulse rounded bg-muted/60" />
    </div>
    <div className="h-32 animate-pulse rounded-3xl bg-muted/50" />
    <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="h-80 animate-pulse rounded-3xl bg-muted/50"
        />
      ))}
    </div>
  </main>
);

export default PropertiesLoading;
