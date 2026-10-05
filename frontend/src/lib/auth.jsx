// === MODULE_BUILD ===
// id: fe_lib_auth
//   module_name: auth
//   module_kind: ui_lib
//   summary: AuthContext + useAuth hook + ProtectedRoute — manages web JWT-cookie and native bearer sessions, exposes user/loading/login/register/logout/refresh, redirects unauthenticated traffic to /login while keeping the splash & login routes public
//   owner: Erin Spencer
//   public_surface: AuthProvider, useAuth, ProtectedRoute, formatApiErrorDetail
//   internal_surface: AuthCtx
//   auth_boundary: bearer
//   storage_boundary: write
//   network_boundary: external
//   user_data_boundary: write
//   admin_only: false
//   tests: frontend/src/lib/auth.test.jsx
//   rollout: default_enabled
//   rollback: revert; app becomes single-user demo again
// === END MODULE_BUILD ===
// === BOUNDARIES ===
// id: fe_lib_auth_boundaries
//   summary: client-side auth state container + axios wrapper
//   auth_boundary: bearer
//   storage_boundary: write
//   network_boundary: external
//   user_data_boundary: write
//   admin_only: false
//   owner: Erin Spencer
// === END BOUNDARIES ===
// === CAPABILITIES ===
// id: fe_lib_auth
//   summary: auth state + ProtectedRoute
//   exposes: AuthProvider, useAuth, ProtectedRoute, formatApiErrorDetail
//   boundaries: auth:bearer, storage:write, network:external, user_data:write
//   owner: Erin Spencer
// === END CAPABILITIES ===

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import client, { acceptSession, clearSession } from "./client";
import { listenNativeOAuth } from "./nativeOAuth";

export function formatApiErrorDetail(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map(e => e?.msg || JSON.stringify(e)).join(" · ");
  if (detail?.msg) return detail.msg;
  return String(detail);
}

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = checking, null = anon, obj = authed
  const [error, setError] = useState(null);

  const sessionVersion = useRef(0);

  const refresh = useCallback(async () => {
    const version = sessionVersion.current;
    try {
      const { data } = await client.get("/auth/me");
      if (version === sessionVersion.current) setUser(data.user || null);
    } catch (e) {
      if (version === sessionVersion.current) setUser(null);
    }
  }, []);

  useEffect(() => {
    refresh();
    const changed = () => { sessionVersion.current++; setUser(null); setError(null); };
    window.addEventListener("a0:backend-changed", changed);
    return () => window.removeEventListener("a0:backend-changed", changed);
  }, [refresh]);

  useEffect(() => {
    let cancelled = false, stop;
    listenNativeOAuth(data => { sessionVersion.current++;
      acceptSession(data); setUser(data.user); }, e => setError(e.message))
      .then(cleanup => { if (cancelled) cleanup(); else stop = cleanup; })
      .catch(e => setError(e.message));
    return () => { cancelled = true; stop?.(); };
  }, []);

  const register = useCallback(async ({ username, email, passphrase }) => {
    setError(null);
    try {
      const { data } = await client.post("/auth/register", { username, email, passphrase });
      sessionVersion.current++;
      acceptSession(data);
      setUser(data.user);
      return data.user;
    } catch (e) {
      const msg = formatApiErrorDetail(e.response?.data?.detail) || e.message;
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const login = useCallback(async ({ identifier, passphrase }) => {
    setError(null);
    try {
      const { data } = await client.post("/auth/login", { identifier, passphrase });
      sessionVersion.current++;
      acceptSession(data);
      setUser(data.user);
      return data.user;
    } catch (e) {
      const msg = formatApiErrorDetail(e.response?.data?.detail) || e.message;
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await client.post("/auth/logout");
    } catch (e) {
      // Non-fatal: clear local session even if the network call fails.
      console.debug("logout request failed; clearing local session anyway", e);
    }
    sessionVersion.current++;
    clearSession();
    setUser(null);
  }, []);

  const googleSession = useCallback(async (session_id) => {
    const { data } = await client.post("/auth/oauth/google-session", { session_id });
    sessionVersion.current++;
      acceptSession(data);
      setUser(data.user);
    return data.user;
  }, []);

  const githubExchange = useCallback(async (code) => {
    const { data } = await client.post("/auth/oauth/github/callback", { code });
    sessionVersion.current++;
      acceptSession(data);
      setUser(data.user);
    return data.user;
  }, []);

  const value = { user, error, refresh, register, login, logout, googleSession, githubExchange };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const v = useContext(AuthCtx);
  if (!v) throw new Error("useAuth must be inside <AuthProvider>");
  return v;
}

export function ProtectedRoute({ children, fallback = "/login" }) {
  const { user } = useAuth();
  const location = useLocation();
  if (user === undefined) {
    return (
      <div className="min-h-[40vh] grid place-items-center text-neutral-500 font-mono text-xs" data-testid="auth-checking">
        verifying session…
      </div>
    );
  }
  if (!user) {
    return <Navigate to={fallback} replace state={{ from: location }} />;
  }
  return children;
}
