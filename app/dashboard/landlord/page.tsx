import Link from "next/link";
import { deletePropertyAction } from "@/app/dashboard/actions";
import PropertyForm from "@/components/dashboard/PropertyForm";
import {
  DashboardCell,
  DashboardEmpty,
  DashboardError,
  DashboardNotice,
  DashboardPageHeader,
  DashboardPanel,
  DashboardSection,
  DashboardStat,
  DashboardStatus,
  DashboardTable,
  firstSearchParam,
} from "@/components/dashboard/DashboardUI";
import { Button } from "@/components/ui/button";
import {
  updateRentalRequestAction,
} from "@/app/dashboard/actions";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import {
  formatDashboardDate,
  formatDashboardMoney,
  getDashboardRecords,
  nestedRecord,
  numberValue,
  textValue,
} from "@/lib/dashboard-data";

export default async function LandlordDashboard({
  searchParams,
}: PageProps<"/dashboard/landlord">) {
  const { token, user } = await requireDashboardUser("LANDLORD");
  const params = await searchParams;
  const [propertiesResult, requestsResult, categoriesResult] = await Promise.all([
    getDashboardRecords("/api/landlord/properties", token),
    getDashboardRecords("/api/rental/landlord/requests", token),
    getDashboardRecords("/api/category/all", token),
  ]);
  const properties = propertiesResult.records;
  const requests = requestsResult.records;
  const pendingRequests = requests.filter(
    (request) => request.status === "PENDING",
  ).length;
  const availableProperties = properties.filter(
    (property) => property.status === "AVAILABLE",
  ).length;
  const monthlyRentTotal = properties.reduce(
    (sum, property) => sum + (numberValue(property.rent) ?? 0),
    0,
  );

  return (
    <div className="space-y-7">
      <DashboardPageHeader
        eyebrow="Landlord dashboard"
        title={`Welcome${user.name ? `, ${user.name}` : ""}`}
        description="Manage your listings and respond to tenant requests."
      />
      <DashboardNotice
        message={firstSearchParam(params.notice)}
        type={firstSearchParam(params.type)}
      />

      {propertiesResult.error && (
        <DashboardError message={propertiesResult.error} />
      )}
      {requestsResult.error && <DashboardError message={requestsResult.error} />}
      {categoriesResult.error && (
        <DashboardError message={categoriesResult.error} />
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStat
          label="Total properties"
          value={propertiesResult.error ? "—" : properties.length}
          detail="Listings in your account"
        />
        <DashboardStat
          label="Available listings"
          value={propertiesResult.error ? "—" : availableProperties}
          detail="Currently open to requests"
        />
        <DashboardStat
          label="Pending requests"
          value={requestsResult.error ? "—" : pendingRequests}
          detail="Need your review"
        />
        <DashboardStat
          label="Listed monthly rent"
          value={
            propertiesResult.error ? "—" : formatDashboardMoney(monthlyRentTotal)
          }
          detail="Combined rent across your listings"
        />
      </div>

      <DashboardSection
        id="properties"
        title="Property management"
        description="Create, update, and remove your rental listings."
      >
        <details className="mb-4 rounded-2xl border border-white/30 bg-white/10 p-5 backdrop-blur-xl dark:bg-black/10">
          <summary className="cursor-pointer list-none font-semibold text-foreground marker:hidden">
            Add a property listing
          </summary>
          {categoriesResult.error ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Property categories are unavailable, so a listing cannot be
              created right now.
            </p>
          ) : (
            <div className="mt-5">
              <PropertyForm
                categories={categoriesResult.records
                  .filter(
                    (category) =>
                      typeof category.id === "string" &&
                      typeof category.name === "string",
                  )
                  .map((category) => ({
                    id: textValue(category.id),
                    name: textValue(category.name),
                  }))}
              />
            </div>
          )}
        </details>

        <DashboardPanel>
          {propertiesResult.error ? (
            <DashboardEmpty message="Your properties could not be loaded." />
          ) : properties.length ? (
            <DashboardTable
              headers={[
                "Property",
                "Location",
                "Monthly rent",
                "Requests",
                "Status",
              "Manage",
              ]}
            >
              {properties.map((property, index) => {
                const count = nestedRecord(property._count);
              const propertyId = textValue(property.id);
              return (
                <tr
                  key={propertyId || `${textValue(property.title)}-${index}`}
                >
                    <DashboardCell className="font-medium text-foreground">
                      {textValue(property.title, "Untitled property")}
                    </DashboardCell>
                    <DashboardCell className="text-muted-foreground">
                      {[textValue(property.city), textValue(property.country)]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </DashboardCell>
                    <DashboardCell className="text-foreground">
                      {formatDashboardMoney(property.rent)}
                    </DashboardCell>
                    <DashboardCell className="text-muted-foreground">
                      {count
                        ? String(numberValue(count.rentalRequests) ?? 0)
                        : requests.filter(
                            (request) =>
                              request.propertyId === property.id,
                          ).length}
                    </DashboardCell>
                    <DashboardCell>
                      <DashboardStatus
                        status={textValue(property.status, "UNKNOWN")}
                      />
                    </DashboardCell>
                    <DashboardCell className="space-y-2">
                      <Link
                        href={`/properties/${encodeURIComponent(propertyId)}`}
                        className="block text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        View listing
                      </Link>
                      {propertyId && (
                        <div className="flex flex-wrap gap-3">
                          <details className="max-w-[min(80vw,42rem)]">
                            <summary className="cursor-pointer text-sm font-medium text-foreground underline-offset-4 hover:underline">
                              Edit listing
                            </summary>
                            <div className="mt-3 w-[min(80vw,42rem)] rounded-2xl border border-border bg-background/95 p-4 shadow-lg backdrop-blur-xl sm:p-6">
                              <h3 className="mb-4 font-semibold text-foreground">
                                Edit {textValue(property.title, "listing")}
                              </h3>
                              {categoriesResult.error ? (
                                <DashboardError
                                  message="Property categories could not be loaded."
                                />
                              ) : (
                                <PropertyForm
                                  categories={categoriesResult.records
                                    .filter(
                                      (category) =>
                                        typeof category.id === "string" &&
                                        typeof category.name === "string",
                                    )
                                    .map((category) => ({
                                      id: textValue(category.id),
                                      name: textValue(category.name),
                                    }))}
                                  property={property}
                                />
                              )}
                            </div>
                          </details>
                          <form action={deletePropertyAction}>
                            <input
                              type="hidden"
                              name="propertyId"
                              value={propertyId}
                            />
                            <Button
                              type="submit"
                              size="sm"
                              variant="destructive"
                            >
                              Delete
                            </Button>
                          </form>
                        </div>
                      )}
                    </DashboardCell>
                  </tr>
                );
              })}
            </DashboardTable>
          ) : (
            <div className="p-1">
              <DashboardEmpty message="You have not listed any properties yet." />
              <div className="pb-5 text-center">
                <Button asChild variant="outline">
                  <Link href="/properties">Explore the marketplace</Link>
                </Button>
              </div>
            </div>
          )}
        </DashboardPanel>
      </DashboardSection>

      <DashboardSection
        id="requests"
        title="Incoming rental requests"
        description="Approve or reject requests from prospective tenants."
      >
        <DashboardPanel>
          {requestsResult.error ? (
            <DashboardEmpty message="Rental requests could not be loaded." />
          ) : requests.length ? (
            <DashboardTable
              headers={[
                "Tenant",
                "Property",
                "Requested start",
                "Monthly rent",
                "Status",
                "Decision",
              ]}
            >
              {requests.map((request, index) => {
                const tenant = nestedRecord(request.tenant);
                const property = nestedRecord(request.property);
                const requestId = textValue(request.id);
                const isPending = request.status === "PENDING";
                return (
                  <tr
                    key={textValue(request.id, `request-${index}`)}
                    className="align-top"
                  >
                    <DashboardCell>
                      <p className="font-medium text-foreground">
                        {textValue(tenant?.name, "Tenant")}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {textValue(tenant?.email)}
                      </p>
                    </DashboardCell>
                    <DashboardCell className="font-medium text-foreground">
                      {textValue(property?.title, "Rental property")}
                    </DashboardCell>
                    <DashboardCell className="text-muted-foreground">
                      {formatDashboardDate(request.startDate)}
                    </DashboardCell>
                    <DashboardCell className="text-foreground">
                      {formatDashboardMoney(request.monthlyRent)}
                    </DashboardCell>
                    <DashboardCell>
                      <DashboardStatus
                        status={textValue(request.status, "UNKNOWN")}
                      />
                    </DashboardCell>
                    <DashboardCell>
                      {isPending && requestId ? (
                        <div className="flex flex-wrap gap-2">
                          <form action={updateRentalRequestAction}>
                            <input
                              type="hidden"
                              name="requestId"
                              value={requestId}
                            />
                            <input
                              type="hidden"
                              name="status"
                              value="APPROVED"
                            />
                            <Button type="submit" size="sm">
                              Approve
                            </Button>
                          </form>
                          <form action={updateRentalRequestAction}>
                            <input
                              type="hidden"
                              name="requestId"
                              value={requestId}
                            />
                            <input
                              type="hidden"
                              name="status"
                              value="REJECTED"
                            />
                            <Button
                              type="submit"
                              size="sm"
                              variant="outline"
                            >
                              Reject
                            </Button>
                          </form>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </DashboardCell>
                  </tr>
                );
              })}
            </DashboardTable>
          ) : (
            <DashboardEmpty message="No rental requests to review." />
          )}
        </DashboardPanel>
      </DashboardSection>
    </div>
  );
}
