import type { AuthConfig } from "@auth/core";
import Credentials from "@auth/core/providers/credentials";
import { getSupabaseAuthClient } from "@/lib/supabase.server";

export const authConfig: AuthConfig = {
  basePath: "/api/auth",
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username / Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const { data, error } = await getSupabaseAuthClient().auth.signInWithPassword({
          email: credentials.username as string,
          password: credentials.password as string,
        });

        if (error || !data.session) throw new Error(error?.message || "Invalid login");
        return {
          id: data.user.id,
          email: data.user.email ?? "",
          name: (data.user.user_metadata?.name as string | undefined) ?? data.user.email ?? "",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
};
