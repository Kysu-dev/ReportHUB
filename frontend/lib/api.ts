// lib/api.ts
import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor: tambah token ke setiap request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: handle 401 Unauthorized
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth/login-citizen";
    }
    return Promise.reject(error);
  }
);

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
  severity: string;
  status: "pending" | "in_progress" | "resolved";
  location: string;
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

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// ============ AUTH API ============
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post("/login", { email, password });
  if (response.data.success && response.data.data.token) {
    localStorage.setItem("token", response.data.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.data.user));
  }
  return response.data;
};

export const register = async (data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) => {
  const response = await api.post("/register", data);
  if (response.data.success && response.data.data.token) {
    localStorage.setItem("token", response.data.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.data.user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
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
  const response = await api.get("/reports");
  return response.data.data;
};

export const getReportById = async (id: string): Promise<ReportDetailData> => {
  const response = await api.get(`/reports/${id}`);
  return response.data.data;
};

export const createReport = async (data: {
  type: string;
  severity: string;
  location: string;
  description: string;
}): Promise<Report> => {
  const response = await api.post("/reports", data);
  return response.data.data;
};

export const deleteReport = async (id: string): Promise<void> => {
  await api.delete(`/reports/${id}`);
};

export const updateReportStatus = async (id: string, status: string, notes?: string): Promise<void> => {
  await api.put(`/admin/reports/${id}/status`, { status, notes });
};

// ============ DASHBOARD API ============
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get("/dashboard/stats");
  return response.data.data;
};

export default api;