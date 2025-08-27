import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { Timestamp } from "../../pb/google/protobuf/timestamp";

interface JwtPayload {
  sub: string;
  full_name: string;
  email: string;
  role: string;
  member_since: Timestamp;
}

interface AuthStoreState {
  isLoggedIn: boolean;
  jwtPayload: JwtPayload | null;
  role: "customer" | "admin";
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  isLoggedIn: false,
  jwtPayload: null,
  role: "customer",

  login: (token: string) =>
    set((state) => {
      try {
        const claims = jwtDecode<JwtPayload>(token);
        return {
          ...state,
          isLoggedIn: true,
          jwtPayload: claims,
          role: claims.role === "admin" ? "admin" : "customer",
        };
      } catch {
        return {
          ...state,
        };
      }
    }),

  logout: () =>
    set((state) => ({
      ...state,
      isLoggedIn: false,
      jwtPayload: null,
      role: "customer",
    })),
}));
