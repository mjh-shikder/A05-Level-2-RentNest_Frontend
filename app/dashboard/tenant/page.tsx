import Link from "next/link";
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
  createCheckoutAction,
  createReviewAction,
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

export default async function TenantDashboard({
  searchParams,
}: PageProps<"/dashboard/tenant">) {
  const { token, user } = await requireDashboardUser("TENANT");
  const params = await searchParams;
  const [requestsResult, paymentsResult] = await Promise.all([
    getDashboardRecords("/api/rental/tenants-requests", token),
    getDashboardRecords("/api/payment/history", token),
  ]);
  const requests = requestsResult.records;
  const payments = paymentsResult.records;
  const approvedCount = requests.filter(
    (request) => request.status === "APPROVED",
  ).length;
  const activeCount = requests.filter((request) =>
    ["ACTIVE", "PAID"].includes(textValue(request.status)),
  ).length;
  const completedPayments = payments.filter(
    (payment) => payment.status === "COMPLETED",
  );
  const paidTotal = completedPayments.reduce(
    (sum, payment) => sum + (numberValue(payment.amount) ?? 0),
    0,
  );

  return (
    <div className="space-y-7">
      <DashboardPageHeader
        eyebrow="Tenant dashboard"
        title={`Welcome${user.name ? `, ${user.name}` : ""}`}
        description="Keep track of your rental requests and payment activity."
      />
      <DashboardNotice
        message={firstSearchParam(params.notice)}
        type={firstSearchParam(params.type)}
      />

      {requestsResult.error && <DashboardError message={requestsResult.error} />}
      {paymentsResult.error && <DashboardError message={paymentsResult.error} />}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStat
          label="Rental requests"
          value={requestsResult.error ? "—" : requests.length}
          detail="Requests you have submitted"
        />
        <DashboardStat
          label="Awaiting payment"
          value={requestsResult.error ? "—" : approvedCount}
          detail="Approved by the property owner"
        />
        <DashboardStat
          label="Active rentals"
          value={requestsResult.error ? "—" : activeCount}
          detail="Paid or currently active"
        />
        <DashboardStat
          label="Payments completed"
          value={paymentsResult.error ? "—" : formatDashboardMoney(paidTotal)}
          detail={`${completedPayments.length} completed ${
            completedPayments.length === 1 ? "payment" : "payments"
          }`}
        />
      </div>

      <DashboardSection
        id="requests"
        title="My rental requests"
        description="Check each request status and continue to secure checkout when approved."
      >
        <DashboardPanel>
          {requestsResult.error ? (
            <DashboardEmpty message="Requests could not be loaded." />
          ) : requests.length ? (
            <DashboardTable
              headers={[
                "Property",
                "Location",
                "Start date",
                "Monthly rent",
                "Status",
                "Action",
              ]}
            >
              {requests.map((request) => {
                const property = nestedRecord(request.property);
                const requestId = textValue(request.id);
                const status = textValue(request.status, "UNKNOWN");

                return (
                  <tr key={requestId}>
                    <DashboardCell className="font-medium text-foreground">
                      {textValue(property?.title, "Rental property")}
                    </DashboardCell>
                    <DashboardCell className="text-muted-foreground">
                      {[textValue(property?.city), textValue(property?.country)]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </DashboardCell>
                    <DashboardCell className="text-muted-foreground">
                      {formatDashboardDate(request.startDate)}
                    </DashboardCell>
                    <DashboardCell className="text-foreground">
                      {formatDashboardMoney(request.monthlyRent)}
                    </DashboardCell>
                    <DashboardCell>
                      <DashboardStatus status={status} />
                    </DashboardCell>
                    <DashboardCell>
                      {status === "APPROVED" && requestId ? (
                        <form action={createCheckoutAction}>
                          <input
                            type="hidden"
                            name="requestId"
                            value={requestId}
                          />
                          <Button type="submit" size="sm">
                            Pay now
                          </Button>
                        </form>
                      ) : status === "COMPLETED" && property?.id ? (
                        <Link
                          href={`/properties/${encodeURIComponent(
                            textValue(property.id),
                          )}`}
                          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                        >
                          View property
                        </Link>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </DashboardCell>
                  </tr>
                );
              })}
            </DashboardTable>
          ) : (
            <div className="p-1">
              <DashboardEmpty message="You have not submitted any rental requests yet." />
              <div className="pb-5 text-center">
                <Button asChild variant="outline">
                  <Link href="/properties">Browse properties</Link>
                </Button>
              </div>
            </div>
          )}
        </DashboardPanel>
      </DashboardSection>

      <DashboardSection
        id="payments"
        title="Payment history"
        description="A record of payments made through RentNest."
      >
        <DashboardPanel>
          {paymentsResult.error ? (
            <DashboardEmpty message="Payment history could not be loaded." />
          ) : payments.length ? (
            <DashboardTable
              headers={["Property", "Transaction", "Date", "Amount", "Status"]}
            >
              {payments.map((payment, index) => {
                const rental = nestedRecord(payment.rentalRequest);
                const property = nestedRecord(rental?.property);
                return (
                  <tr
                    key={textValue(
                      payment.id,
                      `${textValue(payment.transactionId)}-${index}`,
                    )}
                  >
                    <DashboardCell className="font-medium text-foreground">
                      {textValue(property?.title, "Rental payment")}
                    </DashboardCell>
                    <DashboardCell className="text-muted-foreground">
                      {textValue(payment.transactionId, "—")}
                    </DashboardCell>
                    <DashboardCell className="text-muted-foreground">
                      {formatDashboardDate(payment.paidAt ?? payment.createdAt)}
                    </DashboardCell>
                    <DashboardCell className="text-foreground">
                      {formatDashboardMoney(payment.amount)}
                    </DashboardCell>
                    <DashboardCell>
                      <DashboardStatus
                        status={textValue(payment.status, "UNKNOWN")}
                      />
                    </DashboardCell>
                  </tr>
                );
              })}
            </DashboardTable>
          ) : (
            <DashboardEmpty message="No payments to show yet." />
          )}
        </DashboardPanel>
      </DashboardSection>

      <DashboardSection
        id="reviews"
        title="Share your experience"
        description="Leave a review for a completed rental."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {requests
            .filter(
              (request) =>
                request.status === "COMPLETED" && !request.review,
            )
            .map((request) => {
              const property = nestedRecord(request.property);
              const propertyId =
                textValue(property?.id) || textValue(request.propertyId);
              const requestId = textValue(request.id);
              return (
                <form
                  key={requestId}
                  action={createReviewAction}
                  className="rounded-2xl border border-white/30 bg-white/10 p-5 shadow-sm backdrop-blur-xl dark:bg-black/10"
                >
                  <input
                    type="hidden"
                    name="propertyId"
                    value={propertyId}
                  />
                  <input
                    type="hidden"
                    name="requestId"
                    value={requestId}
                  />
                  <h3 className="font-semibold text-foreground">
                    {textValue(property?.title, "Completed rental")}
                  </h3>
                  <label className="mt-4 block space-y-1.5 text-sm font-medium text-foreground">
                    Rating
                    <select
                      name="rating"
                      required
                      defaultValue="5"
                      className="h-10 w-full rounded-xl border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Good</option>
                      <option value="3">3 - Average</option>
                      <option value="2">2 - Below average</option>
                      <option value="1">1 - Poor</option>
                    </select>
                  </label>
                  <label className="mt-4 block space-y-1.5 text-sm font-medium text-foreground">
                    Comment
                    <textarea
                      name="comment"
                      rows={3}
                      maxLength={1000}
                      placeholder="What should future tenants know?"
                      className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </label>
                  <Button type="submit" className="mt-4">
                    Submit review
                  </Button>
                </form>
              );
            })}
        </div>
        {!requests.some(
          (request) => request.status === "COMPLETED" && !request.review,
        ) && (
          <DashboardPanel>
            <DashboardEmpty message="Completed rentals eligible for review will appear here." />
          </DashboardPanel>
        )}
      </DashboardSection>
    </div>
  );
}
