const API_URL = import.meta.env.VITE_API_URL;

type ApiOptions = RequestInit & {
  withAuth?: boolean;
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function api<T>(
  path: string,
  { withAuth = true, ...options }: ApiOptions = {},
): Promise<T> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      ...(withAuth && token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (response.status === 401 && withAuth) {
    localStorage.removeItem("token");
    window.location.href = "/";
    throw new ApiError(401, "Tu sesión expiró");
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new ApiError(
      response.status,
      errorBody?.message ?? "Ocurrió un error al conectar el servidor",
    );
  }

  if (response.status === 204) return undefined as T;

  return response.json();
}