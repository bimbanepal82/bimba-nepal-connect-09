import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession, logout } from "@/utils/auth.server";
import { ContentEditor, isRichTextEmpty } from "@/components/blog/content-editor";
import {
  getPostById,
  createPost,
  updatePost,
  uploadCoverImage,
  uploadPostFile,
  type Attachment,
} from "@/lib/api/blog.functions";
import {
  ArrowLeft,
  File as FileIcon,
  ImagePlus,
  Loader2,
  LogOut,
  Paperclip,
  Save,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/updateBlog")({
  validateSearch: z.object({ id: z.string().optional() }),
  beforeLoad: async () => {
    const session = await getSession();
    if (!session?.user) throw redirect({ to: "/login" });
  },
  loaderDeps: ({ search }) => ({ id: search.id }),
  loader: ({ deps }) => (deps.id ? getPostById({ data: { id: deps.id } }) : null),
  component: BlogManager,
});

const emptyForm = {
  id: "",
  title: "",
  slug: "",
  type: "blog", // blog | notice | newsletter | report
  content: "",
  cover_url: "",
  published: false,
};
const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024; // 5MB

// "My First Blog Post!" -> "my-first-blog-post"
function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Slug is derived from the title + a short uuid fragment so it's unique without
// ever needing user input. This is intentionally NOT exposed in the UI.
function generateSlug(title: string) {
  const base = slugify(title) || "post";
  const uniquePart = crypto.randomUUID().split("-")[0]; // short 8-char fragment
  return `${base}-${uniquePart}`;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageFile(nameOrType: string) {
  return /^image\//.test(nameOrType) || /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(nameOrType);
}

function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden="true">
      {" "}
      *
    </span>
  );
}

function BlogManager() {
  const existingPost = Route.useLoaderData();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Only one attachment is allowed at a time. `existingAttachment` holds a
  // previously-saved attachment (from Supabase); `attachmentFile` holds a
  // newly-picked file waiting to be uploaded on save. Picking a new file
  // clears whichever of the two was previously set.
  const [existingAttachment, setExistingAttachment] = useState<Attachment | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentPreviewUrl, setAttachmentPreviewUrl] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(form.id);

  useEffect(() => {
    if (existingPost) {
      setForm({
        id: existingPost.id,
        title: existingPost.title,
        slug: existingPost.slug,
        type: existingPost.type || "blog",
        content: existingPost.content,
        cover_url: existingPost.cover_url ?? "",
        published: existingPost.published,
      });
      // Only one attachment is supported, so just take the first if present.
      setExistingAttachment(existingPost.attachments?.[0] ?? null);
    }
  }, [existingPost]);

  // Build/revoke an object URL preview whenever a new pending attachment
  // (that happens to be an image) is selected.
  useEffect(() => {
    if (attachmentFile && isImageFile(attachmentFile.type || attachmentFile.name)) {
      const url = URL.createObjectURL(attachmentFile);
      setAttachmentPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setAttachmentPreviewUrl(null);
  }, [attachmentFile]);

  const handleLogout = async () => {
    window.localStorage.removeItem("bimba_admin_authenticated");
    await logout();
    navigate({ to: "/login" });
  };

  const handleCoverChange = (file: File | null) => {
    setCoverFile(file);
    setCoverPreview(file ? URL.createObjectURL(file) : null);
  };

  const displayedCover = coverPreview ?? form.cover_url;
  const hasCover = Boolean(coverFile || form.cover_url);

  // Validates size and replaces whatever attachment (existing or pending)
  // was previously set, since only one attachment is allowed.
  const handleAttachmentChange = (files: FileList | null) => {
    const file = files?.[0] ?? null;
    if (!file) return;

    if (file.size > MAX_ATTACHMENT_SIZE) {
      toast.error(`${file.name} exceeds the 5MB limit and was not added.`);
      return;
    }

    setAttachmentFile(file);
    setExistingAttachment(null); // a new pick replaces any previously-saved attachment
  };

  const removeAttachment = () => {
    setAttachmentFile(null);
    setExistingAttachment(null);
  };

  const hasAttachment = Boolean(attachmentFile || existingAttachment);
  const attachmentDisplayName = attachmentFile?.name ?? existingAttachment?.name ?? null;

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!form.type.trim()) {
      toast.error("Please select a category.");
      return;
    }
    if (isRichTextEmpty(form.content)) {
      toast.error("Content is required.");
      return;
    }

    setSaving(true);
    try {
      let cover_url = form.cover_url;
      if (coverFile) {
        const body = new FormData();
        body.set("file", coverFile);
        const uploaded = await uploadCoverImage({ data: body });
        cover_url = uploaded.url;
      }

      let attachments: Attachment[] = existingAttachment ? [existingAttachment] : [];
      if (attachmentFile) {
        const body = new FormData();
        body.set("file", attachmentFile);
        const uploaded = await uploadPostFile({ data: body });
        attachments = [uploaded];
      }

      // Existing posts keep their original slug; new posts get a fresh,
      // unique one generated from the title + uuid. Never shown in the UI.
      const slug = isEditing ? form.slug : generateSlug(form.title);

      await updatePost({
        data: {
          id: form.id,
          title: form.title,
          slug,
          type: form.type,
          content: form.content,
          cover_url,
          attachments,
          published: form.published,
        },
      });
      toast.success("Post updated");

      navigate({ to: "/admin" });
    } catch (err) {
      // Log the raw error — Supabase errors aren't always plain Error instances,
      // and err.message alone can hide what actually went wrong.
      console.error("Save post failed:", err);
      const message = err instanceof Error ? err.message : String(err);

      if (
        message.toLowerCase().includes("duplicate key") ||
        message.toLowerCase().includes("already exists")
      ) {
        toast.error("That slug collided unexpectedly — please try saving again.");
      } else {
        toast.error(message || "Failed to save post");
      }
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/85 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="text-sm text-muted-foreground hover:text-foreground transition flex items-center gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Admin
            </Link>
            <span className="text-border">|</span>
            <span className="text-sm font-semibold text-primary capitalize tracking-wider">
              Edit Blog
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
        <div className="space-y-3 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 mb-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium captalize tracking-[0.2em] text-primary">
                Blog Manager
              </p>
              <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Update this post</h1>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section>
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>{isEditing ? "Edit post" : "New post"}</CardTitle>
                <CardDescription>
                  Title, content, and a cover image are required. A unique URL slug is generated
                  automatically — no need to set one.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Title
                      <RequiredMark />
                    </Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                      placeholder="Enter blog title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">
                      Category
                      <RequiredMark />
                    </Label>

                    <Select
                      value={form.type}
                      onValueChange={(value) =>
                        setForm((prev) => ({
                          ...prev,
                          type: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="blog">Blog</SelectItem>
                        <SelectItem value="notice">Notice</SelectItem>
                        <SelectItem value="newsletter">Newsletter</SelectItem>
                        <SelectItem value="report">Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">
                      Content
                      <RequiredMark />
                    </Label>
                    <ContentEditor
                      value={form.content}
                      onChange={(html) => setForm((p) => ({ ...p, content: html }))}
                      placeholder="Write your post..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cover">
                      Cover image
                      <RequiredMark />
                    </Label>
                    <Input
                      id="cover"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCoverChange(e.target.files?.[0] ?? null)}
                      // Note: native `required` is intentionally omitted here — file
                      // inputs can't be pre-filled, so on the edit screen (where a
                      // cover already exists) it would block a valid submit. The
                      // "cover image required" rule is enforced in handleSave instead.
                    />
                    {displayedCover && (
                      <div className="relative mt-2 inline-block">
                        <img
                          src={displayedCover}
                          alt="Selected cover"
                          className="h-32 w-auto rounded-xl border border-border object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            handleCoverChange(null);
                            setForm((p) => ({ ...p, cover_url: "" }));
                          }}
                          className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm hover:opacity-90"
                          aria-label="Remove cover image"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                    {coverFile ? (
                      <p className="text-sm text-muted-foreground font-medium">
                        Selected: <span className="text-foreground">{coverFile.name}</span>
                      </p>
                    ) : (
                      !displayedCover && (
                        <p className="text-sm text-muted-foreground">
                          Recommended: a wide image, at least 1200px.
                        </p>
                      )
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="attachment">Attachment</Label>
                    <Input
                      id="attachment"
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*"
                      onChange={(e) => {
                        handleAttachmentChange(e.target.files);
                        // reset so re-picking the same file still fires onChange
                        e.target.value = "";
                      }}
                    />
                    <p className="text-sm text-muted-foreground">
                      One file only — PDF, DOCX, XLSX, PPTX, or image. Max 5MB.
                    </p>

                    {hasAttachment && attachmentDisplayName && (
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted px-4 py-2.5 text-sm">
                        <span className="flex min-w-0 items-center gap-3">
                          {attachmentPreviewUrl ? (
                            <img
                              src={attachmentPreviewUrl}
                              alt={attachmentDisplayName}
                              className="h-12 w-12 shrink-0 rounded-lg border border-border object-cover"
                            />
                          ) : (
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
                              <FileIcon className="h-5 w-5 text-muted-foreground" />
                            </span>
                          )}
                          <span className="flex min-w-0 flex-col">
                            <span className="truncate font-medium text-foreground">
                              {attachmentDisplayName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {attachmentFile
                                ? formatFileSize(attachmentFile.size)
                                : "Previously uploaded"}
                            </span>
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={removeAttachment}
                          className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Remove ${attachmentDisplayName}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between rounded-md bg-muted px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Published</p>
                      <p className="text-xs text-muted-foreground">
                        Only published posts appear on the public blog.
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={form.published}
                        onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))}
                        className="peer sr-only"
                      />
                      <div className="h-6 w-11 rounded-full bg-input transition peer-checked:bg-primary" />
                      <div className="absolute left-1 h-4 w-4 rounded-full bg-background transition peer-checked:translate-x-5" />
                    </label>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Link to="/admin">
                      <Button type="button" variant="outline" className="w-full sm:w-auto">
                        Cancel
                      </Button>
                    </Link>
                    <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                      {saving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Update post
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card className="border-border bg-card p-1">
              <CardHeader>
                <CardTitle>Cover preview</CardTitle>
              </CardHeader>
              <CardContent>
                {displayedCover ? (
                  <img
                    src={displayedCover}
                    alt="Cover preview"
                    className="h-52 w-full rounded-md object-cover"
                  />
                ) : (
                  <div className="grid h-52 place-items-center rounded-md border border-dashed border-border bg-muted text-sm text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <ImagePlus className="h-6 w-6" />
                      <span>No cover image yet</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
