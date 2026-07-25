import { createFileRoute, notFound } from "@tanstack/react-router";
import { getPostBySlug } from "@/lib/api/blog.functions";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getPostBySlug({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return post;
  },
  component: BlogPost,
});

function BlogPost() {
  const post = Route.useLoaderData();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      {post.cover_url && (
        <img src={post.cover_url} alt={post.title} className="mb-6 w-full rounded-lg" />
      )}
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {new Date(post.created_at).toLocaleDateString()}
      </p>
      <div className="prose mt-8 max-w-none whitespace-pre-wrap">{post.content}</div>
    </article>
  );
}
