"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireDashboardUser } from "@/lib/dashboard-auth";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const messageFrom = (body: unknown) =>
  isRecord(body) && typeof body.message === "string"
    ? body.message.trim()
    : "";

const redirectWithNotice = (
  path: string,
  message: string,
  type: "success" | "error",
): never => {
  const query = new URLSearchParams({
    notice: message.slice(0, 180),
    type,
  });
  redirect(`${path}?${query.toString()}`);
};

const postDashboardAction = async (
  endpoint: string,
  token: string,
  method: "DELETE" | "PATCH" | "POST" | "PUT",
  body?: Record<string, unknown>,
) => {
  const backendUrl = process.env.BACKEND_URL?.replace(/\/+$/, "");
  if (!backendUrl) {
    return { ok: false, message: "The server API URL is not configured." };
  }

  try {
    const response = await fetch(`${backendUrl}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
    const result: unknown = await response.json().catch(() => null);
    return {
      ok: response.ok,
      message:
        messageFrom(result) ||
        (response.ok
          ? "Your changes have been saved."
          : `The request failed with status ${response.status}.`),
    };
  } catch {
    return {
      ok: false,
      message: "Could not connect to the server. Please try again.",
    };
  }
};

export const updateRentalRequestAction = async (formData: FormData) => {
  const { token } = await requireDashboardUser("LANDLORD");
  const requestId = formData.get("requestId");
  const status = formData.get("status");
  const validRequestId = typeof requestId === "string" ? requestId : "";
  if (
    !validRequestId.trim() ||
    (status !== "APPROVED" && status !== "REJECTED")
  ) {
    redirectWithNotice(
      "/dashboard/landlord",
      "The request details are invalid.",
      "error",
    );
  }

  const result = await postDashboardAction(
    `/api/rental/landlord/requests/${encodeURIComponent(validRequestId)}`,
    token,
    "PATCH",
    { status },
  );
  revalidatePath("/dashboard/landlord");
  redirectWithNotice(
    "/dashboard/landlord",
    result.message,
    result.ok ? "success" : "error",
  );
};

export const updateUserStatusAction = async (formData: FormData) => {
  const { token } = await requireDashboardUser("ADMIN");
  const userId = formData.get("userId");
  const status = formData.get("status");
  const validUserId = typeof userId === "string" ? userId : "";
  if (
    !validUserId.trim() ||
    (status !== "ACTIVE" && status !== "BLOCKED")
  ) {
    redirectWithNotice(
      "/dashboard/admin",
      "The user details are invalid.",
      "error",
    );
  }

  const result = await postDashboardAction(
    `/api/admin/users/${encodeURIComponent(validUserId)}`,
    token,
    "PATCH",
    { status },
  );
  revalidatePath("/dashboard/admin");
  redirectWithNotice(
    "/dashboard/admin",
    result.message,
    result.ok ? "success" : "error",
  );
};

const parseOptionalNumber = (value: FormDataEntryValue | null) => {
  if (typeof value !== "string" || !value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : Number.NaN;
};

const getPropertyFormData = (formData: FormData) => {
  const title = formData.get("title");
  const categoryId = formData.get("categoryId");
  const address = formData.get("address");
  const city = formData.get("city");
  const country = formData.get("country");
  const rent = parseOptionalNumber(formData.get("rent"));
  const securityDeposit = parseOptionalNumber(
    formData.get("securityDeposit"),
  );
  const availableFrom = formData.get("availableFrom");
  const status = formData.get("status");
  const furnished = formData.get("furnished");
  const description = formData.get("description");
  const images = formData.get("images");
  const bedrooms = parseOptionalNumber(formData.get("bedrooms"));
  const bathrooms = parseOptionalNumber(formData.get("bathrooms"));
  const area = parseOptionalNumber(formData.get("area"));
  const floor = parseOptionalNumber(formData.get("floor"));

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof categoryId !== "string" ||
    !categoryId.trim() ||
    typeof address !== "string" ||
    !address.trim() ||
    typeof city !== "string" ||
    !city.trim() ||
    typeof country !== "string" ||
    !country.trim() ||
    rent === null ||
    !Number.isFinite(rent) ||
    rent <= 0 ||
    !(status === "AVAILABLE" || status === "UNAVAILABLE") ||
    !(furnished === "true" || furnished === "false") ||
    typeof availableFrom !== "string" ||
    !availableFrom.trim()
  ) {
    return {
      error: "Complete the required property fields with valid values.",
    };
  }

  const date = new Date(`${availableFrom}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return { error: "Enter a valid availability date." };
  }

  const optionalValues = [securityDeposit, bedrooms, bathrooms, area, floor];
  if (optionalValues.some((value) => value !== null && !Number.isFinite(value))) {
    return { error: "Enter valid non-negative property details." };
  }

  const imageUrls =
    typeof images === "string"
      ? images
          .split(/[\n,]+/)
          .map((image) => image.trim())
          .filter(Boolean)
      : [];
  if (
    imageUrls.some((image) => {
      try {
        const imageUrl = new URL(image);
        return imageUrl.protocol !== "https:" && imageUrl.protocol !== "http:";
      } catch {
        return true;
      }
    })
  ) {
    return { error: "Use valid http or https URLs for property images." };
  }

  return {
    payload: {
      title: title.trim(),
      categoryId: categoryId.trim(),
      description:
        typeof description === "string" && description.trim()
          ? description.trim()
          : undefined,
      bedrooms: bedrooms ?? undefined,
      bathrooms: bathrooms ?? undefined,
      area: area ?? undefined,
      floor: floor ?? undefined,
      furnished: furnished === "true",
      rent,
      securityDeposit: securityDeposit ?? undefined,
      address: address.trim(),
      city: city.trim(),
      country: country.trim(),
      availableFrom: date.toISOString(),
      status,
      images: imageUrls,
    },
  };
};

export const savePropertyAction = async (formData: FormData) => {
  const { token } = await requireDashboardUser("LANDLORD");
  const propertyId = formData.get("propertyId");
  const validPropertyId = typeof propertyId === "string" ? propertyId.trim() : "";
  const isUpdate = Boolean(validPropertyId);
  const result = getPropertyFormData(formData);

  if ("error" in result) {
    return redirectWithNotice(
      "/dashboard/landlord",
      result.error ?? "The property details are invalid.",
      "error",
    );
  }

  const response = await postDashboardAction(
    isUpdate
      ? `/api/landlord/properties/${encodeURIComponent(validPropertyId)}`
      : "/api/landlord/properties",
    token,
    isUpdate ? "PUT" : "POST",
    result.payload,
  );
  revalidatePath("/dashboard/landlord");
  redirectWithNotice(
    "/dashboard/landlord",
    response.message,
    response.ok ? "success" : "error",
  );
};

export const deletePropertyAction = async (formData: FormData) => {
  const { token } = await requireDashboardUser("LANDLORD");
  const propertyId = formData.get("propertyId");
  const validPropertyId = typeof propertyId === "string" ? propertyId : "";
  if (!validPropertyId.trim()) {
    redirectWithNotice(
      "/dashboard/landlord",
      "The property details are invalid.",
      "error",
    );
  }

  const result = await postDashboardAction(
    `/api/landlord/properties/${encodeURIComponent(validPropertyId)}`,
    token,
    "DELETE",
  );
  revalidatePath("/dashboard/landlord");
  redirectWithNotice(
    "/dashboard/landlord",
    result.message,
    result.ok ? "success" : "error",
  );
};

export const createReviewAction = async (formData: FormData) => {
  const { token } = await requireDashboardUser("TENANT");
  const propertyId = formData.get("propertyId");
  const requestId = formData.get("requestId");
  const rating = formData.get("rating");
  const comment = formData.get("comment");
  const validPropertyId = typeof propertyId === "string" ? propertyId : "";
  const validRequestId = typeof requestId === "string" ? requestId : "";
  const validRating = typeof rating === "string" ? Number(rating) : Number.NaN;

  if (
    !validPropertyId.trim() ||
    !validRequestId.trim() ||
    !Number.isFinite(validRating) ||
    validRating < 1 ||
    validRating > 5
  ) {
    redirectWithNotice(
      "/dashboard/tenant",
      "Enter a valid rating before submitting your review.",
      "error",
    );
  }

  const result = await postDashboardAction(
    "/api/review/create",
    token,
    "POST",
    {
      propertyId: validPropertyId,
      rentalRequestId: validRequestId,
      rating: validRating,
      comment:
        typeof comment === "string" && comment.trim()
          ? comment.trim()
          : undefined,
    },
  );
  revalidatePath("/dashboard/tenant");
  redirectWithNotice(
    "/dashboard/tenant",
    result.message,
    result.ok ? "success" : "error",
  );
};

export const createCheckoutAction = async (formData: FormData) => {
  const { token } = await requireDashboardUser("TENANT");
  const requestId = formData.get("requestId");
  const validRequestId = typeof requestId === "string" ? requestId : "";
  if (!validRequestId.trim()) {
    redirectWithNotice(
      "/dashboard/tenant",
      "The rental request details are invalid.",
      "error",
    );
  }

  const backendUrl = process.env.BACKEND_URL?.replace(/\/+$/, "");
  if (!backendUrl) {
    redirectWithNotice(
      "/dashboard/tenant",
      "The server API URL is not configured.",
      "error",
    );
  }

  let response: Response;
  try {
    response = await fetch(`${backendUrl}/api/payment/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rentalRequestId: validRequestId }),
      cache: "no-store",
    });
  } catch {
    return redirectWithNotice(
      "/dashboard/tenant",
      "Could not connect to the payment service. Please try again.",
      "error",
    );
  }

  const result: unknown = await response.json().catch(() => null);
  const data = isRecord(result) && isRecord(result.data) ? result.data : null;
  const checkoutUrl =
    data && typeof data.checkoutUrl === "string" ? data.checkoutUrl : "";

  if (!response.ok || !checkoutUrl) {
    redirectWithNotice(
      "/dashboard/tenant",
      messageFrom(result) || "We could not start checkout. Please try again.",
      "error",
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(checkoutUrl);
  } catch {
    return redirectWithNotice(
      "/dashboard/tenant",
      "The payment service returned an invalid checkout link.",
      "error",
    );
  }
  if (
    parsedUrl.protocol !== "https:" ||
    parsedUrl.hostname !== "checkout.stripe.com"
  ) {
    redirectWithNotice(
      "/dashboard/tenant",
      "The payment service returned an invalid checkout link.",
      "error",
    );
  }

  redirect(checkoutUrl);
};
