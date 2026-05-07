// lib/routes.ts

export const ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN_CITIZEN: "/auth/login-citizen",
  LOGIN_ADMIN: "/auth/login-admin",
  
  // Citizen routes
  CITIZEN_DASHBOARD: "/citizen/dashboard",
  CITIZEN_REPORTS: "/citizen/reports",
  CITIZEN_SUBMIT: "/citizen/submit",
  CITIZEN_SETTINGS: "/citizen/settings",
  
  // Admin routes
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_ANALYTICS: "/admin/analytics",
  ADMIN_SETTINGS: "/admin/settings",
};

// API Endpoints
export const API = {
  // In production, prefer same-origin `/api` (ALB path routing / reverse proxy).
  // For local dev, set `NEXT_PUBLIC_API_URL=http://localhost:8080/api` (or via docker-compose).
  BASE: process.env.NEXT_PUBLIC_API_URL || "/api",
  
  // Auth
  REGISTER: "/register",
  LOGIN: "/login",
  
  // Reports
  REPORTS: "/reports",
  REPORT_BY_ID: (id: string) => `/reports/${id}`,
  UPDATE_STATUS: (id: string) => `/admin/reports/${id}/status`,
  
  // Dashboard
  DASHBOARD_STATS: "/dashboard/stats",
};