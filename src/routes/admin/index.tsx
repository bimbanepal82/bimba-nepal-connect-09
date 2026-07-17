import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deletePost, listAllPosts, type Post } from "@/lib/api/blog.functions";
import { logout } from "@/utils/auth.server";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import {
  Eye,
  Loader2,
  PlusCircle,
  Trash2,
  LogOut,
  ArrowLeft,
  Pencil,
  Paperclip,
  Download,
  LayoutGrid,
  Rows3,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getSession } from "@/utils/auth.server";
import { PDFViewer } from "@embedpdf/react-pdf-viewer";

type StatusFilter = "all" | "published" | "draft";
type PostType = "blog" | "newsletter" | "report" | "notice";
type TypeFilter = "all" | PostType;
type ViewMode = "grid" | "list";
const pageSize = 6;

const TYPE_LABELS: Record<PostType, string> = {
  blog: "Blog",
  newsletter: "Newsletter",
  report: "Report",
  notice: "Notice",
};

// One accent per content type — used as a quiet left-edge marker and a tinted
// tag, so the type reads at a glance without another badge competing for
// attention with the published/draft status.
const TYPE_ACCENT: Record<PostType, { bar: string; dot: string; tag: string }> = {
  blog: {
    bar: "border-l-sky-500",
    dot: "bg-sky-500",
    tag: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  },
  newsletter: {
    bar: "border-l-violet-500",
    dot: "bg-violet-500",
    tag: "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  },
  report: {
    bar: "border-l-amber-500",
    dot: "bg-amber-500",
    tag: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  notice: {
    bar: "border-l-rose-500",
    dot: "bg-rose-500",
    tag: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  },
};

function TypeTag({ type }: { type: PostType }) {
  const accent = TYPE_ACCENT[type];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${accent.tag}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
      {TYPE_LABELS[type]}
    </span>
  );
}

// Falls back to "blog" if the post predates the `type` field.
const getPostType = (post: Post): PostType => {
  const value = (post as Post & { type?: string }).type;
  return value && value in TYPE_LABELS ? (value as PostType) : "blog";
};

// Optional file attached to a post (PDF report/notice/newsletter, etc).
const getAttachmentUrl = (post: Post): string | null => {
  const value = post?.attachments?.[0]?.url;
  return value ?? null;
};

const isPdfAttachment = (url: string) => url.toLowerCase().split("?")[0].endsWith(".pdf");

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session?.user) {
      throw redirect({ to: "/login" });
    }
    return { session };
  },
  head: () => ({
    meta: [
      { title: "Admin Portal | Bimba Nepal" },
      { name: "description", content: "Admin blog manager for Bimba Nepal Connect." },
    ],
  }),
  component: AdminRoute,
});

function AdminRoute() {
  const { session } = Route.useRouteContext();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [openBlogPreview, setOpenBlogPreview] = useState(false);
  const [openAttachmentPreview, setOpenAttachmentPreview] = useState(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const refresh = () =>
    listAllPosts()
      .then(setPosts)
      .catch((err) => {
        console.error(err);
        toast.error(err instanceof Error ? err.message : "Failed to load posts");
      });

  useEffect(() => {
    if (session?.user) {
      setLoading(true);
      refresh().finally(() => setLoading(false));
    }
  }, [session?.user]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, typeFilter, searchTerm, sortOrder]);

  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        if (statusFilter === "published") return post.published;
        if (statusFilter === "draft") return !post.published;
        return true;
      })
      .filter((post) => {
        if (typeFilter === "all") return true;
        return getPostType(post) === typeFilter;
      })
      .filter((post) => {
        if (!searchTerm.trim()) return true;
        const query = searchTerm.trim().toLowerCase();
        return (
          post.title.toLowerCase().includes(query) ||
          post.slug.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (sortOrder === "newest") return b.created_at.localeCompare(a.created_at);
        return a.created_at.localeCompare(b.created_at);
      });
  }, [posts, statusFilter, typeFilter, searchTerm, sortOrder]);

  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const pagedPosts = filteredPosts.slice((page - 1) * pageSize, page * pageSize);
  const activePost = activePostId ? (posts.find((p) => p.id === activePostId) ?? null) : null;
  const deleteTargetPost = deleteTargetId
    ? (posts.find((p) => p.id === deleteTargetId) ?? null)
    : null;

  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.length - publishedCount;
  const typeCounts = useMemo(() => {
    const counts: Record<PostType, number> = { blog: 0, newsletter: 0, report: 0, notice: 0 };
    posts.forEach((post) => {
      counts[getPostType(post)] += 1;
    });
    return counts;
  }, [posts]);

  const handleLogout = () => {
    window.localStorage.removeItem("bimba_admin_authenticated");
    logout();
    navigate({ to: "/login" });
  };

  const handleBlogPreview = (post: Post) => {
    setOpenBlogPreview(true);
    setActivePostId(post.id);
  };

  const handleAttachmentPreview = (post: Post) => {
    console.log({ post: post?.attachments?.[0]?.url });

    setOpenAttachmentPreview(true);
    setActivePostId(post.id);
  };

  const handleEditNavigate = (id: string) => {
    navigate({ to: "/admin/updateBlog", search: { id } });
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await deletePost({ data: { id: deleteTargetId } });
      if (activePostId === deleteTargetId) setActivePostId(null);
      toast.success("Post deleted successfully!");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete post");
    } finally {
      setDeleting(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/85 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground transition flex items-center gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" /> Home
            </Link>
            <span className="text-border">|</span>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Admin Control Panel
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            <div className="space-y-3 rounded-lg border border-border bg-card p-6 sm:p-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                    Blog Manager
                  </p>
                  <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
                    View and manage blog posts
                  </h1>
                </div>
                <Link to="/admin/addBlogs">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Blog
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Status</CardTitle>
                <CardDescription>Filter the library by publish state.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { key: "all" as StatusFilter, label: "All posts", count: posts.length },
                    { key: "published" as StatusFilter, label: "Published", count: publishedCount },
                    { key: "draft" as StatusFilter, label: "Drafts", count: draftCount },
                  ].map(({ key, label, count }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setStatusFilter(key)}
                      className={
                        statusFilter === key
                          ? "rounded-2xl border border-primary bg-primary/10 px-4 py-4 text-left transition"
                          : "rounded-2xl border border-border bg-muted px-4 py-4 text-left transition hover:bg-muted/70"
                      }
                    >
                      <p className="font-mono text-2xl font-semibold tabular-nums text-foreground">
                        {count}
                      </p>
                      <p className="text-sm text-muted-foreground">{label}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card className="border-border bg-card p-6">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>Narrow the library by type, then search or sort.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Content type</Label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setTypeFilter("all")}
                      className={
                        typeFilter === "all"
                          ? "rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition"
                          : "rounded-full border border-input bg-background px-3 py-1 text-xs text-foreground transition hover:bg-muted"
                      }
                    >
                      All ({posts.length})
                    </button>
                    {(Object.keys(TYPE_LABELS) as PostType[]).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setTypeFilter(key)}
                        className={
                          typeFilter === key
                            ? `inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${TYPE_ACCENT[key].tag}`
                            : "inline-flex items-center gap-1.5 rounded-full border border-input bg-background px-3 py-1 text-xs text-muted-foreground transition hover:bg-muted"
                        }
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${TYPE_ACCENT[key].dot}`} />
                        {TYPE_LABELS[key]} ({typeCounts[key]})
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="search">Search posts</Label>
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search title, slug, or content"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sort">Sort order</Label>
                  <Select
                    value={sortOrder}
                    onValueChange={(value) => setSortOrder(value as "newest" | "oldest")}
                  >
                    <SelectTrigger id="sort">
                      <SelectValue>
                        {sortOrder === "newest" ? "Newest first" : "Oldest first"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest first</SelectItem>
                      <SelectItem value="oldest">Oldest first</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        <section className="mt-10 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">
                {statusFilter === "all"
                  ? "All"
                  : statusFilter === "published"
                    ? "Published"
                    : "Drafts"}
                {typeFilter !== "all" ? ` • ${TYPE_LABELS[typeFilter]}` : ""}
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Library</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm tabular-nums text-muted-foreground">
                {filteredPosts.length} posts • page {page} of {pageCount}
              </span>
              <div className="flex items-center rounded-md border border-border p-0.5 gap-1">
                <button
                  type="button"
                  aria-label="Grid view"
                  aria-pressed={viewMode === "grid"}
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid"
                      ? "rounded-sm bg-primary px-2 py-1.5 text-primary-foreground cursor-pointer"
                      : "rounded-sm px-2 py-1.5 text-muted-foreground transition hover:text-foreground cursor-pointer"
                  }
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="List view"
                  aria-pressed={viewMode === "list"}
                  onClick={() => setViewMode("list")}
                  className={
                    viewMode === "list"
                      ? "rounded-sm bg-primary px-2 py-1.5 text-primary-foreground cursor-pointer"
                      : "rounded-sm px-2 py-1.5 text-muted-foreground transition hover:text-foreground cursor-pointer"
                  }
                >
                  <Rows3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid place-items-center rounded-lg border border-border bg-card p-14 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : pagedPosts.length === 0 ? (
            <Card className="border-dashed border-border bg-card p-10 text-center text-muted-foreground">
              <CardTitle>No posts found</CardTitle>
              <CardDescription>
                Publish your first post to see it appear in the library.
              </CardDescription>
              <div className="mt-4">
                <Link to="/admin/addBlogs">
                  <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Blog
                  </Button>
                </Link>
              </div>
            </Card>
          ) : viewMode === "list" ? (
            <div className="overflow-hidden rounded-md border border-border">
              {pagedPosts?.map((post, index) => {
                const type = getPostType(post);
                return (
                  <div
                    key={post.id}
                    className={
                      "flex flex-col gap-3 bg-card p-4 transition hover:bg-muted/40 sm:flex-row sm:items-center sm:gap-4 " +
                      (index !== pagedPosts.length - 1 ? " border-b border-border" : "")
                    }
                  >
                    {post.cover_url ? (
                      <img
                        src={post.cover_url}
                        alt={post.title}
                        className="h-12 w-12 shrink-0 rounded-lg border border-border object-cover"
                      />
                    ) : (
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-muted text-[10px] text-muted-foreground">
                        No image
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium text-foreground">{post.title}</p>
                        <TypeTag type={type} />
                        <Badge
                          variant={post.published ? "default" : "secondary"}
                          className="shrink-0"
                        >
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                        {getAttachmentUrl(post) ? (
                          <Button size="sm" variant="outline">
                            <Paperclip
                              className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                              onClick={() => handleAttachmentPreview(post)}
                            />
                          </Button>
                        ) : null}
                      </div>
                      <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                        /{post.slug} · {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleBlogPreview(post)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditNavigate(post.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteTargetId(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {pagedPosts.map((post) => {
                const type = getPostType(post);
                return (
                  <Card
                    key={post.id}
                    className={
                      "group overflow-hidden border-border bg-card transition hover:border-foreground/20 hover:shadow-md "
                    }
                  >
                    {post.cover_url ? (
                      <img
                        src={post.cover_url}
                        alt={post.title}
                        className="h-44 w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-44 w-full place-items-center bg-muted text-sm text-muted-foreground">
                        No cover image
                      </div>
                    )}
                    <CardContent className="space-y-3 p-6">
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-lg leading-snug">{post.title}</CardTitle>
                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                          <Badge variant={post.published ? "default" : "secondary"}>
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                          <TypeTag type={type} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        <span className="truncate max-w-[160px]">/{post.slug}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t border-border p-4">
                      <div className="flex flex-wrap gap-2">
                        {getAttachmentUrl(post) ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAttachmentPreview(post)}
                          >
                            <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          </Button>
                        ) : null}
                        <Button size="sm" variant="outline" onClick={() => handleBlogPreview(post)}>
                          <Eye className="mr-2 h-4 w-4" /> Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditNavigate(post.id)}
                        >
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteTargetId(post.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
            <span className="text-sm text-muted-foreground">
              Showing {pagedPosts.length} of {filteredPosts.length}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= pageCount}
                onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Preview modal */}
      <Dialog
        open={Boolean(activePost) && openBlogPreview}
        onOpenChange={(open) => !open && setActivePostId(null) && setOpenBlogPreview(false)}
      >
        <DialogContent className="h-[90vh] max-w-5xl overflow-y-auto">
          {activePost ? (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={activePost.published ? "default" : "secondary"}>
                    {activePost.published ? "Published" : "Draft"}
                  </Badge>
                  <TypeTag type={getPostType(activePost)} />
                  <span className="font-mono text-xs text-muted-foreground">
                    /{activePost.slug}
                  </span>
                </div>
                <DialogTitle className="text-2xl">{activePost.title}</DialogTitle>
                <DialogDescription>
                  Created {new Date(activePost.created_at).toLocaleDateString()} • Updated{" "}
                  {new Date(activePost.updated_at).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>

              {activePost.cover_url ? (
                <img
                  src={activePost.cover_url}
                  alt={activePost.title}
                  className="max-h-72 w-full rounded-2xl border border-border object-cover"
                />
              ) : null}

              <div
                className={
                  "text-sm leading-relaxed text-foreground " +
                  "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-2 " +
                  "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1.5 " +
                  "[&_p]:mb-4 [&_p:last-child]:mb-0 " +
                  "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 " +
                  "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 " +
                  "[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:mb-4 " +
                  "[&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm " +
                  "[&_pre]:bg-muted [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:mb-4 [&_pre]:overflow-x-auto " +
                  "[&_hr]:my-6 [&_hr]:border-border"
                }
                dangerouslySetInnerHTML={{ __html: activePost.content }}
              />

              <DialogFooter className="gap-2 sm:justify-between">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDeleteTargetId(activePost.id);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleEditNavigate(activePost.id)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button onClick={() => setActivePostId(null)}>Close</Button>
                </div>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Attachmet Preview Modal */}
      <Dialog
        open={Boolean(activePost) && openAttachmentPreview}
        onOpenChange={(open) => !open && setOpenAttachmentPreview(false)}
      >
        <DialogContent className="h-[85vh] max-w-3xl overflow-y-auto">
          {activePost ? (
            <PDFViewer
              config={{ src: getAttachmentUrl(activePost)! }}
              style={{ height: "78vh", width: "100%" }}
            />
          ) : null}
        </DialogContent>
      </Dialog>
      {/* Delete confirmation */}
      <AlertDialog
        open={Boolean(deleteTargetId)}
        onOpenChange={(open) => !open && !deleting && setDeleteTargetId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTargetPost ? (
                <>
                  This will permanently remove{" "}
                  <span className="font-medium text-foreground">"{deleteTargetPost.title}"</span>.
                  This action cannot be undone.
                </>
              ) : (
                "This action will remove the post permanently."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
