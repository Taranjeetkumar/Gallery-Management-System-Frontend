"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getCurrentUser } from "@/store/slices/authSlice";
import type { UserRole } from "@/types/auth";
import { Box, CircularProgress } from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}:any) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user,role, isLoading } = useAppSelector(
    (state:any) => state.auth,
  );

  useEffect(() => {
    const token = Cookies.get("authToken");

    if (!token) {
      router.push("/auth");
      return;
    }

    if (!user && token) {
      // Try to fetch user data if we have a token but no user
      dispatch(getCurrentUser());
    }
  }, [dispatch, user, router]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, isLoading, router]);

  // Check role-based access
  useEffect(() => {
    if (user && requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(role)) {
        // Redirect to dashboard if user doesn't have required role
        router.push("/dashboard");
      }
    }
  }, [user, requiredRoles, router]);

  if (isLoading || (!isAuthenticated && Cookies.get("authToken"))) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <CircularProgress size={60} sx={{ color: "white" }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (requiredRoles && requiredRoles.length > 0 && user) {
    if (!requiredRoles.includes(user.role)) {
      return null; // Will redirect in useEffect
    }
  }

  return <>{children}</>;
};
