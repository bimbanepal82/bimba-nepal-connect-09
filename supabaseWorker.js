export default {
  async scheduled(controller, env, ctx) {
    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/users?select=id&limit=1`,
      {
        headers: {
          apikey: env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.error(await response.text());
      return;
    }

    console.log("Supabase ping successful");
  },
};