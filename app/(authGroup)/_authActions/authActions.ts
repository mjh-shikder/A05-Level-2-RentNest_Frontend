"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type LoginState = {
  message: string;
  data: {
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
export const loginAction = async (prevState: LoginState, formData: FormData) => {

    const email = formData.get("email")
    const password = formData.get("password")

    const payload = {email, password}


    const res = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, 
        {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(payload)
        })

    const result: LoginState = await res.json()

    if (result.data) { 
        const cookieStore = await cookies() 

        cookieStore.set("accessToken", result.data.accessToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24,
            sameSite: "lax"
        })

        redirect('/')

    }

    // console.log(result, "RESult");

//? sample output of result
//     {
//   message: 'user logged in successfully',
//   data: {
//     user: {
//       id: 'dd01d503-7934-4a91-b95a-59e69c0fcfa1',
//       name: 'Mr TENANT ',
//       email: 'tenant@yz.com',
//       phone: '01912345678',
//       avatar: 'www.google.com',
//       role: 'TENANT',
//       status: 'ACTIVE',
//       createdAt: '2026-10-08T09:42:43.893Z',
//       updatedAt: '2026-10-08T09:42:43.893Z'
//     },
//     accessToken: ''
//   }




    return result
    
    
};


export type RegisterState = {
  message: string;
  success: boolean;
};

const getResponseMessage = (body: unknown) => {
  if (typeof body === "object" && body !== null && "message" in body) {
    const { message } = body;
    if (typeof message === "string" && message.trim()) return message;
    if (Array.isArray(message)) return message.join(" ");
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
    return { message: "Please complete all required fields.", success: false };
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
    return { message: "The server API URL is not configured.", success: false };
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
    const responseMessage = getResponseMessage(result);

    if (!response.ok) {
      return {
        message:
          responseMessage ||
          `Registration failed (${response.status}). Please try again.`,
        success: false,
      };
    }

    return {
      message: responseMessage || "Registration successful. You can now log in.",
      success: true,
      };
  } catch {
    return {
      message: "Could not connect to the server. Please try again.",
      success: false,
    };
  }
};
