"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import { getPropertyDetails, PropertyListingsError } from "@/lib/properties";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const messageFrom = (body: unknown, depth = 0): string => {
  if (depth > 4) return "";
  if (typeof body === "string") {
    const message = body.trim();
    return message && !message.startsWith("<") ? message.slice(0, 500) : "";
  }
  if (Array.isArray(body)) {
    return body
      .map((item) => messageFrom(item, depth + 1))
      .filter(Boolean)
      .join(" ");
  }
  if (!isRecord(body)) return "";

  const constraints = isRecord(body.constraints)
    ? Object.values(body.constraints)
        .filter((value): value is string => typeof value === "string")
        .join(" ")
    : "";
  if (constraints) return constraints.slice(0, 500);

  for (const key of ["errors", "issues", "details", "message", "error", "data"]) {
    const message = messageFrom(body[key], depth + 1);
    if (message) return message;
  }
  return "";
};

const readResponseBody = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text.trim()) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
};

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

export type ProfileActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const isValidAvatarUrl = (value: string) => {
  if (!value) return true;
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

export const updateProfileAction = async (
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> => {
  const { token, user } = await requireDashboardUser();
  const name = formData.get("name");
  const phone = formData.get("phone");
  const avatar = formData.get("avatar");

  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.trim().length > 120 ||
    typeof phone !== "string" ||
    phone.trim().length > 40 ||
    typeof avatar !== "string" ||
    avatar.trim().length > 2048 ||
    !isValidAvatarUrl(avatar.trim())
  ) {
    return {
      status: "error",
      message: "Enter a valid name, phone number, and avatar URL.",
    };
  }

  const backendUrl = process.env.BACKEND_URL?.replace(/\/+$/, "");
  if (!backendUrl) {
    return {
      status: "error",
      message: "The server API URL is not configured.",
    };
  }

  let response: Response;
  let result: unknown;
  try {
    response = await fetch(`${backendUrl}/api/user/update`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        ...(phone.trim() ? { phone: phone.trim() } : {}),
        avatar: avatar.trim(),
      }),
      cache: "no-store",
    });
    result = await response.json().catch(() => null);
  } catch {
    return {
      status: "error",
      message: "Could not connect to the server. Please try again.",
    };
  }

  if (!response.ok) {
    return {
      status: "error",
      message:
        messageFrom(result) ||
        `Profile update failed with status ${response.status}.`,
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(
    "userInfo",
    JSON.stringify({
      ...user,
      name: name.trim(),
      phone: phone.trim() || user.phone,
      avatar: avatar.trim(),
    }),
    {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
  );

  revalidatePath("/dashboard/tenant");
  revalidatePath("/dashboard/landlord");
  revalidatePath("/dashboard/admin");
  revalidatePath("/");

  return {
    status: "success",
    message: messageFrom(result) || "Your profile has been updated.",
  };
};

const postDashboardAction = async (
  endpoint: string,
  token: string,
  method: "DELETE" | "PATCH" | "POST" | "PUT",
  body?: Record<string, unknown>,
  failureMessage = "The request could not be completed.",
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
    const result = await readResponseBody(response);
    const ok = response.ok && !(isRecord(result) && result.success === false);
    return {
      ok,
      message:
        messageFrom(result) ||
        (ok
          ? "Your changes have been saved."
          : `${failureMessage}${
              response.ok ? "" : ` (HTTP ${response.status}).`
            }`),
    };
  } catch {
    return {
      ok: false,
      message: "Could not connect to the server. Please try again.",
    };
  }
};

export type RentalRequestActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const isDateInput = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

export const createRentalRequestAction = async (
  _previousState: RentalRequestActionState,
  formData: FormData,
): Promise<RentalRequestActionState> => {
  const { token } = await requireDashboardUser("TENANT");
  const propertyId = formData.get("propertyId");
  const startDate = formData.get("startDate");
  const endDate = formData.get("endDate");
  const message = formData.get("message");

  if (
    typeof propertyId !== "string" ||
    !propertyId.trim() ||
    typeof startDate !== "string" ||
    !isDateInput(startDate) ||
    (typeof endDate !== "string" && endDate !== null) ||
    (typeof endDate === "string" &&
      endDate !== "" &&
      (!isDateInput(endDate) || endDate <= startDate)) ||
    (typeof message !== "string" && message !== null)
  ) {
    return {
      status: "error",
      message: "Enter a valid start date and an end date after it.",
    };
  }

  const result = await postDashboardAction(
    "/api/rental/create-request",
    token,
    "POST",
    {
      propertyId: propertyId.trim(),
      startDate,
      ...(typeof endDate === "string" && endDate ? { endDate } : {}),
      ...(typeof message === "string" && message.trim()
        ? { message: message.trim() }
        : {}),
    },
  );

  if (result.ok) {
    revalidatePath("/dashboard/tenant");
    revalidatePath("/properties");
    return { status: "success", message: result.message };
  }

  return { status: "error", message: result.message };
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
  const securityDeposit = parseOptionalNumber(formData.get("securityDeposit"));
  const availableFrom = formData.get("availableFrom");
  const submittedStatus = formData.get("status");
  const status =
    typeof submittedStatus === "string"
      ? submittedStatus.trim().toUpperCase()
      : "";
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
    !["AVAILABLE", "MAINTENANCE", "RENTED"].includes(status) ||
    typeof description !== "string" ||
    !description.trim() ||
    typeof availableFrom !== "string" ||
    !availableFrom.trim()
  ) {
    return {
      error: "Complete all required fields and enter a valid monthly rent.",
    };
  }

  const optionalNumbers = [securityDeposit, bedrooms, bathrooms, area, floor];
  if (
    optionalNumbers.some(
      (value) => value !== null && (!Number.isFinite(value) || value < 0),
    ) ||
    [bedrooms, bathrooms, floor].some(
      (value) => value !== null && !Number.isInteger(value),
    )
  ) {
    return { error: "Enter valid non-negative values for property details." };
  }

  const date = new Date(`${availableFrom}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return { error: "Enter a valid availability date." };
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
      description: description.trim(),
      ...(bedrooms !== null ? { bedrooms } : {}),
      ...(bathrooms !== null ? { bathrooms } : {}),
      ...(area !== null ? { area } : {}),
      ...(floor !== null ? { floor } : {}),
      furnished: furnished === "true",
      rent,
      ...(securityDeposit !== null ? { securityDeposit } : {}),
      address: address.trim(),
      city: city.trim(),
      country: country.trim(),
      availableFrom: date.toISOString(),
      status,
      images: imageUrls,
    },
  };
};

const getAuthenticatedUserId = async (
  token: string,
): Promise<{ id: string } | { error: string }> => {
  const backendUrl = process.env.BACKEND_URL?.replace(/\/+$/, "");
  if (!backendUrl) {
    return { error: "The server API URL is not configured." };
  }

  try {
    const response = await fetch(`${backendUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const result = await readResponseBody(response);
    const data =
      isRecord(result) && isRecord(result.data) ? result.data : null;
    const nestedUser = data && isRecord(data.user) ? data.user : null;
    const id = data?.id ?? nestedUser?.id;

    if (response.ok && typeof id === "string" && id.trim()) {
      return { id: id.trim() };
    }

    return {
      error:
        messageFrom(result) ||
        `Could not identify your account (HTTP ${response.status}). Please sign in again.`,
    };
  } catch {
    return {
      error: "Could not verify your account. Please try again.",
    };
  }
};

export const savePropertyAction = async (formData: FormData) => {
  const { token, user } = await requireDashboardUser("LANDLORD");
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

  const account = user.id?.trim()
    ? { id: user.id.trim() }
    : await getAuthenticatedUserId(token);
  if ("error" in account) {
    return redirectWithNotice(
      "/dashboard/landlord",
      account.error,
      "error",
    );
  }

  const response = await postDashboardAction(
    isUpdate
      ? `/api/landlord/properties/${encodeURIComponent(validPropertyId)}`
      : "/api/landlord/properties",
    token,
    isUpdate ? "PUT" : "POST",
    { ...result.payload, landlordId: account.id },
    isUpdate
      ? "Could not update the property."
      : "Could not create the property.",
  );
  if (response.ok) revalidatePath("/dashboard/landlord");
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

export const deleteAdminPropertyAction = async (formData: FormData) => {
  const { token } = await requireDashboardUser("ADMIN");
  const propertyId = formData.get("propertyId");
  const validPropertyId = typeof propertyId === "string" ? propertyId.trim() : "";
  if (!validPropertyId) {
    redirectWithNotice(
      "/dashboard/admin",
      "The property details are invalid.",
      "error",
    );
  }

  let property;
  try {
    property = await getPropertyDetails(validPropertyId);
  } catch (error) {
    return redirectWithNotice(
      "/dashboard/admin",
      error instanceof PropertyListingsError
        ? `Could not verify property status: ${error.message}`
        : "Could not verify the property status. Please try again.",
      "error",
    );
  }

  if (property.status.trim().toUpperCase() !== "AVAILABLE") {
    redirectWithNotice(
      "/dashboard/admin",
      "Only available properties can be deleted.",
      "error",
    );
  }

  const result = await postDashboardAction(
    `/api/landlord/properties/${encodeURIComponent(validPropertyId)}`,
    token,
    "DELETE",
  );
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/landlord");
  revalidatePath("/properties");
  redirectWithNotice(
    "/dashboard/admin",
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
