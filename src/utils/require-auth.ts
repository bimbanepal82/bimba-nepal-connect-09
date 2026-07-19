import { createMiddleware } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";
import { getSession, logout } from "./auth.server";

export const requireAuth = createMiddleware().server(async ({ next }) => {
  const session = await getSession();

  if (!session?.user) {
    await logout();
    throw redirect({
      to: "/login",
      search: { reason: "session_expired" },
    });
  }

  return next({ context: { user: session.user } });
});
