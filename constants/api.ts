import { useStaffStore } from "@/store/StaffStore";
import axios from "axios";

export const baseInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true, // send cookies automatically
});

// Add interceptor
baseInstance.interceptors.response.use(
  (response) => response, // Pass through if success
  async (error) => {
    const originalRequest = error.config;

    // Don't retry on login, register, or refresh-token endpoints
    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                          originalRequest.url?.includes('/auth/register') || 
                          originalRequest.url?.includes('/auth/refresh-token');

    // If request failed with 401, we haven't retried yet, and it's not an auth endpoint
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        console.log("🔄 Attempting token refresh...");
        // Call refresh token endpoint
        await baseInstance.post("/staff/auth/refresh-token");
        console.log("✅ Token refreshed successfully");

        // Retry the original request
        return baseInstance(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh token failed:", refreshError);
        // Clear any stored user data
        useStaffStore.getState().setNull();
        
        // Only redirect if we're not already on the login page
        if (window.location.pathname !== '/sign-in') {
          window.location.href = "/sign-in";
        }
      }
    }

    return Promise.reject(error);
  }
);