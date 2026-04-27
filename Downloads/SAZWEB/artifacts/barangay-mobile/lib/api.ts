const DOMAIN = process.env.EXPO_PUBLIC_DOMAIN ?? "localhost";
const BASE = `https://${DOMAIN}/barangay-portal/api`;

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? res.statusText);
  }
  return res.json();
}

export const api = {
  documents: {
    list: (residentId?: string) => req<any[]>(`/documents${residentId ? `?residentId=${residentId}` : ""}`),
    create: (data: any) => req<any>("/documents", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => req<any>(`/documents/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => req<any>(`/documents/${id}`, { method: "DELETE" }),
  },
  blotter: {
    list: (reportedById?: string) => req<any[]>(`/blotter${reportedById ? `?reportedById=${reportedById}` : ""}`),
    create: (data: any) => req<any>("/blotter", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => req<any>(`/blotter/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  },
  announcements: {
    list: () => req<any[]>("/announcements"),
  },
  ordinances: {
    list: () => req<any[]>("/ordinances"),
  },
};
