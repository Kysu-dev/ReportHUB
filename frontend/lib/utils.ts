// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { API } from "./routes";

// ============ TAILWIND MERGE UTILITY ============
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============ TYPES ============

export interface User {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phone: string;
  role: "citizen" | "admin";
  created_at: string;
}

export interface Report {
  id: number;
  report_id: string;
  user_id: number;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "pending" | "in_progress" | "resolved";
  location: string;
  latitude: number;
  longitude: number;
  description: string;
  image_url: string | null;
  created_at: string;
}

export interface ReportTimelineItem {
  status: Report["status"] | string;
  created_at: string;
  notes?: string | null;
}

export interface ReportDetailData {
  report: Report;
  timeline?: ReportTimelineItem[];
}

export interface DashboardStats {
  total_reports: number;
  pending: number;
  in_progress: number;
  resolved: number;
}

// ============ HELPER FUNCTIONS ============

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
};

// ============ AUTH API ============

export const register = async (data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
}) => {
  const response = await fetch(`${API.BASE}${API.REGISTER}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const login = async (data: { email: string; password: string }) => {
  const response = await fetch(`${API.BASE}${API.LOGIN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await handleResponse(response);
  
  // Save token to localStorage
  if (result.success && result.data?.token) {
    localStorage.setItem("token", result.data.token);
    localStorage.setItem("user", JSON.stringify(result.data.user));
  }
  return result;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
};

export const getCurrentUser = (): User | null => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
};

// ============ REPORTS API ============

export const getReports = async (): Promise<Report[]> => {
  const token = getToken();
  const response = await fetch(`${API.BASE}${API.REPORTS}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await handleResponse(response);
  return result.data;
};

export const getReportById = async (id: string): Promise<ReportDetailData> => {
  const token = getToken();
  const response = await fetch(`${API.BASE}${API.REPORT_BY_ID(id)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await handleResponse(response);
  return result.data;
};

export const deleteReport = async (id: string): Promise<void> => {
  const token = getToken();
  const response = await fetch(`${API.BASE}${API.REPORT_BY_ID(id)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  await handleResponse(response);
};

export const updateReportStatus = async (id: string, status: string, notes?: string, assignedTo?: string): Promise<void> => {
  const token = getToken();
  const response = await fetch(`${API.BASE}${API.UPDATE_STATUS(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status, notes, assigned_to: assignedTo }),
  });
  await handleResponse(response);
};

export const createReportWithImage = async (formData: FormData): Promise<Report> => {
  const token = getToken();
  const response = await fetch(`${API.BASE}${API.REPORTS}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await handleResponse(response);
  return result.data;
};

// ============ DASHBOARD API ============

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const token = getToken();
  const response = await fetch(`${API.BASE}${API.DASHBOARD_STATS}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await handleResponse(response);
  return result.data;
};