export type DashboardRecord = Record<string, unknown>;

export type DashboardResult = {
  records: DashboardRecord[];
  error: string | null;
};

const isRecord = (value: unknown): value is DashboardRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readMessage = (body: unknown) => {
  if (!isRecord(body) || typeof body.message !== "string") return null;
  return body.message.trim() || null;
}; 


export const getDashboardRecords = async (endpoint: string, token: string,): Promise<DashboardResult> => {
  
  const backendUrl = process.env.BACKEND_URL?.replace(/\/+$/, "");
  if (!backendUrl) {
    return { records: [], error: "The server API URL is not configured." };
  }

  let response: Response;
  try {
    response = await fetch(`${backendUrl}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  } catch {
    return {
      records: [],
      error: "Could not connect to the server. Please try again.",
    };
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return {
      records: [],
      error: "The server returned an invalid response.",
    };
  }

  if (!response.ok) {
    return {
      records: [],
      error:
        readMessage(body) ??
        `The request failed with status ${response.status}.`,
    };
  }

  const data = isRecord(body) ? body.data : null;
  if (Array.isArray(data)) {
    
    if (data.some((item) => !isRecord(item))) {
      return {
        records: [],
        error: "The server returned data in an unexpected format.",
      };
    }
    return { records: data, error: null };
  }

  if (isRecord(data)) return { records: [data], error: null };
  if (data === null) {
    return {
      records: [],
      error: "The server returned data in an unexpected format.",
    };
  }

  return { records: [], error: null };
};

export const textValue = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

export const numberValue = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

export const nestedRecord = (
  value: unknown,
): DashboardRecord | null => (isRecord(value) ? value : null);

export const formatDashboardDate = (value: unknown) => {
  if (typeof value !== "string" || !value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
};

export const formatDashboardMoney = (value: unknown) => {
  const amount = numberValue(value);
  return amount === null
    ? "—"
    : `৳${new Intl.NumberFormat("en-BD", {
        maximumFractionDigits: 0,
      }).format(amount)}`;
};
