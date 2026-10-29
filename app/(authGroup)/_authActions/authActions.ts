"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type LoginState = {
  message: string;
  error?: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
      avatar: string;
      role: "LANDLORD" | "TENANT" | "ADMIN";
      status: "ACTIVE" | "BLOCKED";
      createdAt: string;
      updatedAt: string;
    };
    accessToken: string;
  };
};



//* Login Function
export const loginAction = async (_prevState: LoginState, formData: FormData,): Promise<LoginState> => {

  const email = formData.get("email");

  const password = formData.get("password");

  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {

    return {
      message: "Please enter your email and password.",
      error: "Please enter your email and password.",
    };
  }

  const backendUrl = process.env.BACKEND_URL?.replace(/\/+$/, "");


  if (!backendUrl) {
    
    return {
      message: "The server API URL is not configured.",
      error: "The server API URL is not configured.",
    };
  }

  let response: Response;
  let result: {
    message?: unknown;
    error?: unknown;
    data?: LoginState["data"];
  } | null;

  try {
    response = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
      cache: "no-store",
    });

    result = await response.json().catch(() => null);
  } catch {
    return {
      message: "Could not connect to the server. Please try again.",
      error: "Could not connect to the server. Please try again.",
    };
  }

  const apiError =
    typeof result?.error === "string" && result.error.trim()
      ? result.error
      : typeof result?.message === "string" && result.message.trim()
        ? result.message
        : "Invalid Email or Password";

  if (!response.ok || !result?.data?.user || !result.data.accessToken) {
    return {
      message: typeof result?.message === "string" ? result.message : apiError,
      error: apiError,
    };
  }

  const userData = result.data;
  const cookieStore = await cookies();

  cookieStore.set("accessToken", userData.accessToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  cookieStore.set(
    "userInfo",
    JSON.stringify({
      id: userData.user.id,
      name: userData.user.name,
      role: userData.user.role,
      avatar: userData.user.avatar,
    }),
    {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
  );

  redirect("/");
};

export const logoutAction = async () => {
    const cookieStore = await cookies()
    cookieStore.delete("accessToken")
    cookieStore.delete("userInfo")
    redirect("/login")
}


export type RegisterState = {
  message: string;
  success: boolean;
  error?: string;
};

const getResponseText = (body: unknown, field: "message" | "error") => {
  if (typeof body === "object" && body !== null && field in body) {
    const value = (body as Record<string, unknown>)[field];
    if (typeof value === "string" && value.trim()) return value;
    if (Array.isArray(value)) return value.join(" ");
  }

  return undefined;
};

export const registerAction = async (
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> => {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const phone = formData.get("phone");
  const avatar = formData.get("avatar");
  const role = formData.get("role");

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password ||
    (role !== "TENANT" && role !== "LANDLORD")
  ) {
    const error = "Please complete all required fields.";
    return { message: error, error, success: false };
  }

  const payload = {
    name: name.trim(),
    email: email.trim(),
    password,
    phone: typeof phone === "string" && phone.trim() ? phone.trim() : undefined,
    avatar:
      typeof avatar === "string" && avatar.trim() ? avatar.trim() : undefined,
    role,
  };

  const backendUrl = process.env.BACKEND_URL?.replace(/\/+$/, "");
  if (!backendUrl) {
    const error = "The server API URL is not configured.";
    return { message: error, error, success: false };
  }

  try {
    const response = await fetch(
      `${backendUrl}/api/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      },
    );

    const result: unknown = await response.json().catch(() => null);
    const responseMessage = getResponseText(result, "message");
    const responseError = getResponseText(result, "error");

    if (!response.ok) {
      const error =
        responseError ||
        responseMessage ||
        `Registration failed (${response.status}). Please try again.`;
      return {
        message: responseMessage || error,
        error,
        success: false,
      };
    }

  } catch {
    const error = "Could not connect to the server. Please try again.";
    return {
      message: error,
      error,
      success: false,
    };
  }

  redirect("/login");
};
