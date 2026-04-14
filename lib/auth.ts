"use client";

const TOKEN_KEY = "sock_token";
const COOKIE_NAME = "sock_session";

/** Read the JWT from localStorage */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/** Persist the JWT to localStorage and write a companion cookie so
 *  middleware.ts (which runs on the server) can read it for route protection. */
export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  // Non-httpOnly, same-site cookie — readable by server middleware
  document.cookie = `${COOKIE_NAME}=${token}; path=/; SameSite=Lax; max-age=${60 * 60 * 24 * 30}`;
}

/** Remove the JWT from both localStorage and the cookie */
export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${COOKIE_NAME}=; path=/; SameSite=Lax; max-age=0`;
}

/** Check whether a token is currently stored */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}
