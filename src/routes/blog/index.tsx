import { createFileRoute, Link } from "@tanstack/react-router";
import { listPosts } from "@/lib/api/blog.functions";

export const Route = createFileRoute("/blog/")({
  loader: () => listPosts(),
  component: BlogIndex,
});

function BlogIndex() {
  const posts = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Blog</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="block rounded-lg border p-5 hover:bg-muted"
          >
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </Link>
        ))}
        {posts.length === 0 && <p className="text-muted-foreground">No posts yet.</p>}
      </div>
    </div>
  );
}
