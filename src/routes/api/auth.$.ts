import { createFileRoute } from "@tanstack/react-router";
import { Auth } from "@auth/core";
import { authConfig } from "@/utils/auth.config";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return Auth(request, authConfig);
      },

      POST: async ({ request }) => {
        return Auth(request, authConfig);
      },
    },
  },
});
