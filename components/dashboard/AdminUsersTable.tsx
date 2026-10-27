"use client";

import { useMemo, useState } from "react";
import { updateUserStatusAction } from "@/app/dashboard/actions";
import {
  DashboardCell,
  DashboardEmpty,
  DashboardPanel,
  DashboardStatus,
  DashboardTable,
} from "@/components/dashboard/DashboardUI";
import { Button } from "@/components/ui/button";
import { formatDashboardDate } from "@/lib/dashboard-data";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
};

const AdminUsersTable = ({ users }: { users: AdminUser[] }) => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return users;

    return users.filter((user) =>
      [user.name, user.email, user.role, user.status]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, users]);

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div>
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="w-full max-w-sm">
          <span className="sr-only">Search users</span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name, email, role, or status"
            className="h-10 w-full rounded-xl border border-input bg-white/20 px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring dark:bg-black/20"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Rows
          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
            className="h-10 rounded-xl border border-input bg-background px-3 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          per page
        </label>
      </div>

      <DashboardPanel>
        {visibleUsers.length ? (
          <DashboardTable
            headers={["Name", "Email", "Role", "Status", "Joined", "Access"]}
          >
            {visibleUsers.map((account) => {
              const nextStatus =
                account.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";
              return (
                <tr key={account.id}>
                  <DashboardCell className="font-medium text-foreground">
                    {account.name || "Unnamed user"}
                  </DashboardCell>
                  <DashboardCell className="text-muted-foreground">
                    {account.email || "—"}
                  </DashboardCell>
                  <DashboardCell>
                    <DashboardStatus status={account.role || "UNKNOWN"} />
                  </DashboardCell>
                  <DashboardCell>
                    <DashboardStatus status={account.status || "UNKNOWN"} />
                  </DashboardCell>
                  <DashboardCell className="text-muted-foreground">
                    {formatDashboardDate(account.createdAt)}
                  </DashboardCell>
                  <DashboardCell>
                    {account.id ? (
                      <form action={updateUserStatusAction}>
                        <input
                          type="hidden"
                          name="userId"
                          value={account.id}
                        />
                        <input
                          type="hidden"
                          name="status"
                          value={nextStatus}
                        />
                        <Button
                          type="submit"
                          size="sm"
                          variant={
                            nextStatus === "BLOCKED" ? "outline" : "default"
                          }
                        >
                          {nextStatus === "BLOCKED" ? "Block" : "Unblock"}
                        </Button>
                      </form>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </DashboardCell>
                </tr>
              );
            })}
          </DashboardTable>
        ) : (
          <DashboardEmpty
            message={
              query
                ? "No users match your search."
                : "No user accounts found."
            }
          />
        )}
      </DashboardPanel>

      <div className="flex flex-wrap items-center justify-between gap-3 px-1 pt-4">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Showing{" "}
          {filteredUsers.length
            ? (currentPage - 1) * pageSize + 1
            : 0}
          {"–"}
          {Math.min(currentPage * pageSize, filteredUsers.length)} of{" "}
          {filteredUsers.length} users
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="inline-flex items-center px-2 text-sm text-muted-foreground">
            Page {currentPage} of {pageCount}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage >= pageCount}
            onClick={() => setPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersTable;
