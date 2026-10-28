import { Suspense } from "react";
import {
  DashboardCell,
  DashboardEmpty,
  DashboardError,
  DashboardLoading,
  DashboardNotice,
  DashboardPageHeader,
  DashboardPanel,
  DashboardSection,
  DashboardStat,
  DashboardStatus,
  DashboardTable,
  firstSearchParam,
} from "@/components/dashboard/DashboardUI";
import AdminUsersTable from "@/components/dashboard/AdminUsersTable";
import { deleteAdminPropertyAction } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import {
  formatDashboardDate,
  formatDashboardMoney,
  getDashboardRecords,
  nestedRecord,
  textValue,
} from "@/lib/dashboard-data";

async function AdminDashboardContent({
  searchParams,
}: {
  searchParams: PageProps<"/dashboard/admin">["searchParams"];
}) {
  const { token, user } = await requireDashboardUser("ADMIN");
  const params = await searchParams;
  const [usersResult, propertiesResult, rentalsResult] = await Promise.all([
    getDashboardRecords("/api/admin/all-users", token),
    getDashboardRecords("/api/admin/all-properties", token),
    getDashboardRecords("/api/admin/all-rentals", token),
  ]);
  const users = usersResult.records;
  const properties = propertiesResult.records;
  const rentals = rentalsResult.records;
  const pendingRentals = rentals.filter(
    (rental) => rental.status === "PENDING",
  ).length;
  const blockedUsers = users.filter((account) => account.status === "BLOCKED").length;

  return (
    <div className="space-y-7">
      <DashboardPageHeader
        eyebrow="Administration"
        title={`Welcome${user.name ? `, ${user.name}` : ""}`}
        description="Monitor platform activity and manage user access."
      />
      <DashboardNotice
        message={firstSearchParam(params.notice)}
        type={firstSearchParam(params.type)}
      />

      {usersResult.error && <DashboardError message={usersResult.error} />}
      {propertiesResult.error && (
        <DashboardError message={propertiesResult.error} />
      )}
      {rentalsResult.error && <DashboardError message={rentalsResult.error} />}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStat
          label="Users"
          value={usersResult.error ? "—" : users.length}
          detail="Registered platform accounts"
        />
        <DashboardStat
          label="Blocked users"
          value={usersResult.error ? "—" : blockedUsers}
          detail="Accounts with restricted access"
        />
        <DashboardStat
          label="Properties"
          value={propertiesResult.error ? "—" : properties.length}
          detail="Listings across the platform"
        />
        <DashboardStat
          label="Pending rentals"
          value={rentalsResult.error ? "—" : pendingRentals}
          detail="Rental requests awaiting review"
        />
      </div>

      <DashboardSection
        id="users"
        title="User management"
        description="Search, paginate, and manage account access."
      >
        {usersResult.error ? (
          <DashboardPanel>
            <DashboardEmpty message="Users could not be loaded." />
          </DashboardPanel>
        ) : (
          <AdminUsersTable
            users={users.map((account) => ({
              id: textValue(account.id),
              name: textValue(account.name),
              email: textValue(account.email),
              role: textValue(account.role, "UNKNOWN"),
              status: textValue(account.status, "UNKNOWN"),
              createdAt: textValue(account.createdAt),
            }))}
          />
        )}
      </DashboardSection>

      <DashboardSection
        id="properties"
        title="Property listings"
        description="A snapshot of the homes currently listed on the platform."
      >
        <DashboardPanel>
          {propertiesResult.error ? (
            <DashboardEmpty message="Property listings could not be loaded." />
          ) : properties.length ? (
            <DashboardTable
              headers={[
                "Property",
                "Location",
                "Monthly rent",
                "Status",
                "Action",
              ]}
            >
              {properties.map((property, index) => {
                const propertyId = textValue(property.id);
                const isAvailable =
                  textValue(property.status).trim().toUpperCase() ===
                  "AVAILABLE";

                return (
                  <tr key={propertyId || `property-${index}`}>
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
                    <DashboardCell>
                      <DashboardStatus
                        status={textValue(property.status, "UNKNOWN")}
                      />
                    </DashboardCell>
                    <DashboardCell>
                      {propertyId && isAvailable ? (
                        <form action={deleteAdminPropertyAction}>
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
                      ) : propertyId ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          disabled
                          aria-label={`Cannot delete ${textValue(
                            property.title,
                            "property",
                          )} because it is not available`}
                        >
                          Delete
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </DashboardCell>
                  </tr>
                );
              })}
            </DashboardTable>
          ) : (
            <DashboardEmpty message="No property listings found." />
          )}
        </DashboardPanel>
      </DashboardSection>

      <DashboardSection
        id="rentals"
        title="Rental requests"
        description="Track rental activity and request statuses platform-wide."
      >
        <DashboardPanel>
          {rentalsResult.error ? (
            <DashboardEmpty message="Rental requests could not be loaded." />
          ) : rentals.length ? (
            <DashboardTable
              headers={[
                "Property",
                "Tenant",
                "Landlord",
                "Start date",
                "Monthly rent",
                "Status",
              ]}
            >
              {rentals.map((rental, index) => {
                const property = nestedRecord(rental.property);
                const tenant = nestedRecord(rental.tenant);
                const landlord = nestedRecord(rental.landlord);
                return (
                  <tr key={textValue(rental.id, `rental-${index}`)}>
                    <DashboardCell className="font-medium text-foreground">
                      {textValue(property?.title, "Rental property")}
                    </DashboardCell>
                    <DashboardCell className="text-muted-foreground">
                      {textValue(tenant?.name, textValue(rental.tenantId, "—"))}
                    </DashboardCell>
                    <DashboardCell className="text-muted-foreground">
                      {textValue(
                        landlord?.name,
                        textValue(rental.landlordId, "—"),
                      )}
                    </DashboardCell>
                    <DashboardCell className="text-muted-foreground">
                      {formatDashboardDate(rental.startDate)}
                    </DashboardCell>
                    <DashboardCell className="text-foreground">
                      {formatDashboardMoney(rental.monthlyRent)}
                    </DashboardCell>
                    <DashboardCell>
                      <DashboardStatus
                        status={textValue(rental.status, "UNKNOWN")}
                      />
                    </DashboardCell>
                  </tr>
                );
              })}
            </DashboardTable>
          ) : (
            <DashboardEmpty message="No rental requests found." />
          )}
        </DashboardPanel>
      </DashboardSection>
    </div>
  );
}

export default function AdminDashboard({
  searchParams,
}: PageProps<"/dashboard/admin">) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <AdminDashboardContent searchParams={searchParams} />
    </Suspense>
  );
}
