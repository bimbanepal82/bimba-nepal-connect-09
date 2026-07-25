import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase.server";
import { requireAuth } from "@/utils/require-auth";

export interface Attachment {
  name: string;
  url: string;
  type: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  type: string;
  cover_url: string | null;
  attachments: Attachment[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

// --------------------------------- Public reads

export const listPosts = createServerFn({ method: "GET" }).handler(async (): Promise<Post[]> => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[listPosts] Supabase error:", error);
    return [];
  }
  return data ?? [];
});

const publicPostsInput = z.object({
  type: z.enum(["notice", "report", "newsletter", "blog"]).optional(),
  search: z.string().trim().max(200).optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(50).default(9),
});

export const listPublicPosts = createServerFn({ method: "GET" })
  .inputValidator(publicPostsInput)
  .handler(async ({ data }): Promise<{ posts: Post[]; total: number }> => {
    const supabase = getSupabaseServerClient();
    const from = (data.page - 1) * data.pageSize;
    const to = from + data.pageSize - 1;

    let query = supabase.from("posts").select("*", { count: "exact" }).eq("published", true);

    if (data.type) query = query.eq("type", data.type);

    if (data.search) {
      const term = data.search.replace(/[%,]/g, "");
      query = query.or(`title.ilike.%${term}%,content.ilike.%${term}%`);
    }

    const {
      data: posts,
      error,
      count,
    } = await query.order("created_at", { ascending: false }).range(from, to);

    if (error) {
      console.error("[listPublicPosts] Supabase error:", error);
      return { posts: [], total: 0 };
    }
    return { posts: posts ?? [], total: count ?? 0 };
  });

export const getPostBySlug = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data }): Promise<Post | null> => {
    const supabase = getSupabaseServerClient();
    const { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return post;
  });

// --------------------------------- Admin read (drafts + published)

export const listAllPosts = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .handler(async (): Promise<Post[]> => {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[listAllPosts] Supabase error:", error);
      return [];
    }
    return data ?? [];
  });

// --------------------------------- Create / update / delete

const postInput = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().min(1),
  type: z.string().min(1),
  cover_url: z.string().optional(),
  attachments: z
    .array(z.object({ name: z.string(), url: z.string(), type: z.string() }))
    .optional(),
  published: z.boolean().default(false),
});

export const createPost = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator(postInput)
  .handler(async ({ data }): Promise<Post> => {
    const supabase = getSupabaseServerClient();
    const { data: post, error } = await supabase.from("posts").insert(data).select().single();
    if (error) throw new Error(error.message);
    return post;
  });

export const updatePost = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator(postInput.partial().extend({ id: z.string() }))
  .handler(async ({ data }): Promise<Post> => {
    const supabase = getSupabaseServerClient();
    const { id, ...update } = data;
    const { data: post, error } = await supabase
      .from("posts")
      .update({ ...update, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return post;
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

// --------------------------------- File uploads

export const uploadCoverImage = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((formData: FormData) => formData)
  .handler(async ({ data: formData }): Promise<{ url: string }> => {
    const supabase = getSupabaseServerClient();
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    const path = `${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage
      .from("blog-covers")
      .upload(path, file, { contentType: file.type });
    if (error) throw new Error(error.message);

    const { data: pub } = supabase.storage.from("blog-covers").getPublicUrl(path);
    return { url: pub.publicUrl };
  });

export const uploadPostFile = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((formData: FormData) => formData)
  .handler(async ({ data: formData }): Promise<Attachment> => {
    const supabase = getSupabaseServerClient();
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    const path = `${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage
      .from("blog-files")
      .upload(path, file, { contentType: file.type });
    if (error) throw new Error(error.message);

    const { data: pub } = supabase.storage.from("blog-files").getPublicUrl(path);
    return { name: file.name, url: pub.publicUrl, type: file.type || "application/octet-stream" };
  });

export const getPostById = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }): Promise<Post | null> => {
    const supabase = getSupabaseServerClient();
    const { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return post;
  });
