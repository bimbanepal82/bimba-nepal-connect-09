interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

const supabaseWorker = {
  async scheduled(controller: unknown, env: Env, ctx: unknown): Promise<void> {
    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/users?select=id&limit=1`,
      {
        headers: {
          apikey: env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
        },
      },
    );

    if (!response.ok) {
      console.error(await response.text());
      return;
    }

    console.log("Supabase ping successful");
  },
};

export default supabaseWorker;