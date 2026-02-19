import { API_BASE_URL } from "@/src/config/app";

type QueryValue = string | number | boolean | undefined;
type QueryParams = Record<string, QueryValue>;

const buildUrl = (path: string, query?: QueryParams): string => {
  const url = new URL(path.startsWith("/") ? path : `/${path}`, `${API_BASE_URL}/`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
};

const extractErrorMessage = (payload: unknown, status: number): string => {
  if (typeof payload === "object" && payload !== null && "message" in payload) {
    const maybeMessage = payload.message;
    if (typeof maybeMessage === "string" && maybeMessage.trim().length > 0) {
      return maybeMessage;
    }
  }

  return `Request failed (${status}).`;
};

export const apiRequest = async <T>(path: string, init: RequestInit = {}, query?: QueryParams): Promise<T> => {
  const response = await fetch(buildUrl(path, query), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const payload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    throw new Error(extractErrorMessage(payload, response.status));
  }

  return payload as T;
};

