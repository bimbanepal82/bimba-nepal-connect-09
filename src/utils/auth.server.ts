import { Auth } from "@auth/core";
import type { Session } from "@auth/core/types";
import { authConfig } from "./auth.config";
import { createServerFn } from "@tanstack/react-start";
import { getRequest, setResponseHeader } from "@tanstack/react-start/server";

// get the active session (logged in session throws - user and expires - cookie expiration time)

export const getSession = createServerFn({ method: "GET" }).handler(
  async (): Promise<Session | null> => {
    const request = getRequest();
    const url = new URL("/api/auth/session", request.url);
    const sessionReq = new Request(url, { headers: request.headers });

    const response = await Auth(sessionReq, authConfig);
    const data = (await response.json()) as Session | Record<string, never>;

    return data && Object.keys(data).length > 0 ? (data as Session) : null;
  },
);

// --------------------------------- Login With creds {username , password}

export const loginWithCredentials = createServerFn({ method: "POST" })
  .validator((formData: FormData) => {
    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();
    if (!username || !password) throw new Error("Missing inputs");
    return { username, password };
  })
  .handler(async ({ data }) => {
    const request = getRequest();
    const url = new URL(request.url);

    const csrfReq = new Request(new URL("/api/auth/csrf", url), {
      headers: { cookie: request.headers.get("cookie") ?? "" },
    });
    const csrfRes = await Auth(csrfReq, authConfig);
    const { csrfToken } = await csrfRes.json();
    const csrfSetCookie =
      typeof csrfRes.headers.getSetCookie === "function"
        ? csrfRes.headers.getSetCookie()
        : ([csrfRes.headers.get("set-cookie")].filter(Boolean) as string[]);

    const incomingCookie = request.headers.get("cookie") ?? "";
    const csrfCookieHeader = csrfSetCookie.map((c) => c.split(";")[0]).join("; ");
    const mergedCookie = [incomingCookie, csrfCookieHeader].filter(Boolean).join("; ");

    const body = new URLSearchParams({
      username: data.username,
      password: data.password,
      csrfToken,
      json: "true",
    });

    const callbackReq = new Request(new URL("/api/auth/callback/credentials", url), {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        cookie: mergedCookie,
      },
    });

    const callbackRes = await Auth(callbackReq, authConfig);
    if (callbackRes.status >= 400) {
      throw new Error("Invalid credentials");
    }

    const finalSetCookie =
      typeof callbackRes.headers.getSetCookie === "function"
        ? callbackRes.headers.getSetCookie()
        : ([callbackRes.headers.get("set-cookie")].filter(Boolean) as string[]);

    for (const cookie of finalSetCookie) {
      setResponseHeader("set-cookie", cookie);
    }

    return { success: true };
  });

// --- handle logout

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  const request = getRequest();
  const url = new URL(request.url);

  const csrfReq = new Request(new URL("/api/auth/csrf", url), {
    headers: { cookie: request.headers.get("cookie") ?? "" },
  });
  const csrfRes = await Auth(csrfReq, authConfig);
  const { csrfToken } = await csrfRes.json();
  const csrfSetCookie =
    typeof csrfRes.headers.getSetCookie === "function"
      ? csrfRes.headers.getSetCookie()
      : ([csrfRes.headers.get("set-cookie")].filter(Boolean) as string[]);

  const incomingCookie = request.headers.get("cookie") ?? "";
  const csrfCookieHeader = csrfSetCookie.map((c) => c.split(";")[0]).join("; ");
  const mergedCookie = [incomingCookie, csrfCookieHeader].filter(Boolean).join("; ");

  const body = new URLSearchParams({ csrfToken, json: "true" });

  const signoutReq = new Request(new URL("/api/auth/signout", url), {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      cookie: mergedCookie,
    },
  });

  const signoutRes = await Auth(signoutReq, authConfig);

  const finalSetCookie =
    typeof signoutRes.headers.getSetCookie === "function"
      ? signoutRes.headers.getSetCookie()
      : ([signoutRes.headers.get("set-cookie")].filter(Boolean) as string[]);

  for (const cookie of finalSetCookie) {
    setResponseHeader("set-cookie", cookie);
  }

  return { success: true };
});
