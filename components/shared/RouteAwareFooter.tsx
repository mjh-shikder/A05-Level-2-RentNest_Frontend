"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

const RouteAwareFooter = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") return null;

  return children;
};

export default RouteAwareFooter;
