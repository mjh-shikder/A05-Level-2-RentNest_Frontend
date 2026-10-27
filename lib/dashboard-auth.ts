import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type DashboardRole = "TENANT" | "LANDLORD" | "ADMIN";

export type DashboardUser = {
  name: string;
  role: DashboardRole;
  avatar: string;
};

const isDashboardRole = (value: unknown): value is DashboardRole =>
  value === "TENANT" || value === "LANDLORD" || value === "ADMIN";

export const requireDashboardUser = async (
  expectedRole?: DashboardRole,
): Promise<{ token: string; user: DashboardUser }> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) redirect("/login");

  let userInfo: unknown;
  try {
    userInfo = JSON.parse(cookieStore.get("userInfo")?.value ?? "null");
  } catch {
    redirect("/login");
  }

  if (
    typeof userInfo !== "object" ||
    userInfo === null ||
    !("role" in userInfo) ||
    !isDashboardRole(userInfo.role)
  ) {
    redirect("/login");
  }

  if (expectedRole && userInfo.role !== expectedRole) {
    redirect(`/dashboard/${userInfo.role.toLowerCase()}`);
  }

  return {
    token,
    user: {
      name:
        "name" in userInfo && typeof userInfo.name === "string"
          ? userInfo.name
          : "Account",
      role: userInfo.role,
      avatar:
        "avatar" in userInfo && typeof userInfo.avatar === "string"
          ? userInfo.avatar
          : "",
    },
  };
};
