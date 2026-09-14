import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import apiClient from "@/services/api/apiClient";
import { store } from "@/app/store";
import { baseApi } from "@/services/api/baseApi";
import type { Account, UserProfile } from "@/types/auth";

interface AuthContextType {
  account: Account | null;
  profile: UserProfile | null;
  checking: boolean;
  login: (email: string, password: string) => Promise<Account>;
  logout: () => Promise<void>;
  setAuthToken: (token: string, acct?: Account, prof?: UserProfile) => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [checking, setChecking] = useState<boolean>(true);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem("nestora_token");
    if (!token) {
      setAccount(null);
      setProfile(null);
      setChecking(false);
      return;
    }
    try {
      const { data } = await apiClient.get<{ account: Account; profile: UserProfile }>("/auth/me");
      setAccount(data.account);
      setProfile(data.profile);
    } catch {
      localStorage.removeItem("nestora_token");
      store.dispatch(baseApi.util.resetApiState());
      setAccount(null);
      setProfile(null);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (email: string, password: string): Promise<Account> => {
    store.dispatch(baseApi.util.resetApiState());
    const { data } = await apiClient.post<{ token: string; account: Account }>("/auth/login", {
      email,
      password,
    });
    localStorage.setItem("nestora_token", data.token);
    setAccount(data.account);
    await refresh();
    return data.account;
  };

  const setAuthToken = async (token: string, acct?: Account, prof?: UserProfile): Promise<void> => {
    store.dispatch(baseApi.util.resetApiState());
    localStorage.setItem("nestora_token", token);
    if (acct) setAccount(acct);
    if (prof) setProfile(prof);
    await refresh();
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // Ignore logout errors
    }
    localStorage.removeItem("nestora_token");
    store.dispatch(baseApi.util.resetApiState());
    setAccount(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{ account, profile, checking, login, logout, setAuthToken, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
