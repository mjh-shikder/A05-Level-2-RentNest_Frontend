"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { DashboardRole } from "@/lib/dashboard-auth";
import type { PropertyListing } from "@/lib/properties";

type PropertyCardState = {
  propertiesById: Map<string, PropertyListing>;
  role: DashboardRole | null;
};

const PropertyCardContext = createContext<PropertyCardState | null>(null);

export const PropertyCardStateProvider = ({
  properties,
  role,
  children,
}: {
  properties: PropertyListing[];
  role: DashboardRole | null;
  children: ReactNode;
}) => {
  const propertiesById = useMemo(
    () => new Map(properties.map((property) => [property.id, property])),
    [properties],
  );
  const state = useMemo(
    () => ({ propertiesById, role }),
    [propertiesById, role],
  );

  return (
    <PropertyCardContext.Provider value={state}>
      {children}
    </PropertyCardContext.Provider>
  );
};

export const usePropertyCardState = (propertyId: string) => {
  const state = useContext(PropertyCardContext);
  if (!state) {
    throw new Error(
      "PropertyCard must be rendered inside PropertyCardStateProvider.",
    );
  }

  const property = state.propertiesById.get(propertyId);
  if (!property) {
    throw new Error(`Property card data not found for "${propertyId}".`);
  }

  return { property, role: state.role };
};
