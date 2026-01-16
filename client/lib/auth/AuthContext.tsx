import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest, getApiUrl } from "@/lib/query-client";
import { User, AuthState } from "@/types/user";

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, goalWeight?: number) => Promise<void>;
  logout: () => Promise<void>;
  updateGoalWeight: (goalWeight: number | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STATE_KEY = "@peso_tracker_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch(new URL("/api/auth/me", getApiUrl()).toString(), {
        credentials: "include",
      });

      if (response.ok) {
        const user = await response.json();
        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
        await AsyncStorage.setItem(AUTH_STATE_KEY, JSON.stringify(user));
      } else {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
        await AsyncStorage.removeItem(AUTH_STATE_KEY);
      }
    } catch (error) {
      const cached = await AsyncStorage.getItem(AUTH_STATE_KEY);
      if (cached) {
        setState({
          user: JSON.parse(cached),
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (username: string, password: string) => {
    const response = await apiRequest("POST", "/api/auth/login", { username, password });
    const user = await response.json();
    setState({
      user,
      isLoading: false,
      isAuthenticated: true,
    });
    await AsyncStorage.setItem(AUTH_STATE_KEY, JSON.stringify(user));
  }, []);

  const register = useCallback(async (username: string, password: string, goalWeight?: number) => {
    const response = await apiRequest("POST", "/api/auth/register", {
      username,
      password,
      goalWeight: goalWeight || undefined,
    });
    const user = await response.json();
    setState({
      user,
      isLoading: false,
      isAuthenticated: true,
    });
    await AsyncStorage.setItem(AUTH_STATE_KEY, JSON.stringify(user));
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
    } catch (error) {
    }
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
    await AsyncStorage.removeItem(AUTH_STATE_KEY);
  }, []);

  const updateGoalWeight = useCallback(async (goalWeight: number | null) => {
    const response = await apiRequest("PUT", "/api/auth/me", { goalWeight });
    const user = await response.json();
    setState((prev) => ({
      ...prev,
      user,
    }));
    await AsyncStorage.setItem(AUTH_STATE_KEY, JSON.stringify(user));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateGoalWeight,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
