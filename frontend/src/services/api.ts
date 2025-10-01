import UserService from "../modules/auth/services/keycloakService";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/* ================= CONFIG ================= */
const BASE_URL = import.meta.env.VITE_BASE_URL as string;
const LOGIN_PATH = (import.meta.env.VITE_LOGIN_PATH as string) || "/auth/login";
const SIGNUP_PATH = (import.meta.env.VITE_SIGNUP_PATH as string) || "/auth/register";

// ép base về backend local nếu chưa có biến môi trường
const API_BASE = BASE_URL || "http://localhost:8081";

if (!BASE_URL) {
  console.warn("[api] Missing VITE_BASE_URL. Using fallback:", API_BASE);
} else {
  console.log("[api] Using API URL:", API_BASE);
}

/* ================== TYPES ================== */
export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  agreeTerms: boolean;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  userId?: string;
}

/* ================ CORE REQUEST ================ */
async function request<TResponse = unknown>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: unknown;
    headers?: Record<string, string>;
    query?: Record<string, string | number | boolean | undefined | null>;
  } = {}
): Promise<TResponse> {
  const method: HttpMethod = options.method ?? "GET";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  // Attach bearer token nếu có
  const token = UserService.getToken?.();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const isAbsolute = /^https?:\/\//i.test(path);
  const suffix = path.startsWith("/") ? path : `/${path}`;
  const urlString = isAbsolute ? path : `${API_BASE}${suffix}`;
  const url = new URL(urlString);

  // query params
  if (options.query) {
    Object.entries(options.query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  console.log(`[api] ${method} ${url.toString()}`);
  if (options.body) {
    console.log("[api] Request body:", options.body);
  }

  const resp = await fetch(url.toString(), {
    method,
    headers,
    body: method === "GET" || method === "DELETE" ? undefined : JSON.stringify(options.body ?? {}),
    credentials: "include",
  });

  console.log(`[api] Response status: ${resp.status}`);

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`HTTP ${resp.status}: ${text || resp.statusText}`);
  }

  const contentType = resp.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await resp.json()) as TResponse;
  }
  return (await resp.text()) as TResponse;
}

/* ================ API METHODS ================ */
export const api = {
  get: <T = unknown>(path: string, query?: Record<string, string | number | boolean | undefined | null>, headers?: Record<string, string>) =>
    request<T>(path, { method: "GET", query, headers }),

  post: <T = unknown>(path: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(path, { method: "POST", body, headers }),

  put: <T = unknown>(path: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(path, { method: "PUT", body, headers }),

  patch: <T = unknown>(path: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(path, { method: "PATCH", body, headers }),

  delete: <T = unknown>(path: string, headers?: Record<string, string>) =>
    request<T>(path, { method: "DELETE", headers }),

  // login
  login: (data: LoginData) =>
    request<LoginResponse>(LOGIN_PATH, { method: "POST", body: data }),

  // signup
  signup: (data: SignupData) =>
    request<SignupResponse>(SIGNUP_PATH, { method: "POST", body: data }),
};

export default api;
