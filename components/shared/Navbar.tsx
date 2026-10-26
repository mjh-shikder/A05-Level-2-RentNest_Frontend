import { cookies } from "next/headers";
import NavbarClient, { type NavbarUser } from "./NavbarClient";

const isUserRole = (role: unknown): role is NavbarUser["role"] =>
  role === "TENANT" || role === "LANDLORD" || role === "ADMIN";

const Navbar = async () => {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has("accessToken");
  let user: NavbarUser | null = null;

  if (isAuthenticated) {
    try {
      const userInfo = JSON.parse(
        cookieStore.get("userInfo")?.value ?? "{}",
      ) as Record<string, unknown>;

      user = {
        name: typeof userInfo.name === "string" ? userInfo.name : "Account",
        role: isUserRole(userInfo.role) ? userInfo.role : "TENANT",
        avatar: typeof userInfo.avatar === "string" ? userInfo.avatar : "",
      };
    } catch {
      user = { name: "Account", role: "TENANT", avatar: "" };
    }
  }

  return <NavbarClient user={user} isAuthenticated={isAuthenticated} />;
};

export default Navbar;
