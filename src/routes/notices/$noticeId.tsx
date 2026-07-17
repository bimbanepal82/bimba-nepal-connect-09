import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Calendar, Download, Eye, FileText, Image as ImageIcon } from "lucide-react";
import { getPostById } from "@/lib/api/blog.functions";
import { NoticePreviewModal } from "@/components/home/notices/notice-preview-modal";
import type { NoticeDocument } from "@/types/notice.type";
import { Header } from "@/components/home/header";
import { Footer } from "@/components/home/footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/notices/$noticeId")({
  loader: async ({ params }) => {
    const post = await getPostById({ data: { id: params.noticeId } });
    if (!post || !post.published) throw notFound();
    return post;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} | Bimba Nepal` },
          { name: "description", content: loaderData.title },
        ]
      : [],
  }),
  component: NoticeDetailRoute,
});

const TYPE_STYLES: Record<string, string> = {
  notice: "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
  report: "bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400",
  newsletter: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  blog: "bg-primary/10 text-primary",
};

function NoticeDetailRoute() {
  const post = Route.useLoaderData();
  const attachment = post.attachments?.[0];
  const typeLabel = post.type.charAt(0).toUpperCase() + post.type.slice(1);
  const [previewDoc, setPreviewDoc] = useState<NoticeDocument | null>(null);

  const isImageAttachment = attachment?.type.startsWith("image/");
  const isPdfAttachment = attachment?.type === "application/pdf";
  const canPreview = isImageAttachment || isPdfAttachment;

  const openPreview = () => {
    if (!attachment) return;
    setPreviewDoc({
      id: post.id,
      title: post.title,
      description: "",
      type: typeLabel as NoticeDocument["type"],
      fileName: attachment.name,
      fileUrl: attachment.url,
      fileType: attachment.type,
      createdAt: post.created_at,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <Link
          to="/notices"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Notice Board
        </Link>

        <div className="mt-8 flex items-center gap-3">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
              TYPE_STYLES[post.type] ?? TYPE_STYLES.blog
            }`}
          >
            {typeLabel}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {new Date(post.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight md:text-5xl">
          {post.title}
        </h1>

        {attachment && (
          <div className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-[--shadow-soft]">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {isImageAttachment ? (
                  <ImageIcon className="h-5 w-5" />
                ) : (
                  <FileText className="h-5 w-5" />
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{attachment.name}</p>
                <p className="text-xs text-muted-foreground">
                  Attached {isPdfAttachment ? "PDF" : isImageAttachment ? "image" : "file"}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              {canPreview && (
                <Button
                  onClick={openPreview}
                  title="Preview"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              <Link
                to={attachment.url}
                download={attachment.name}
                title="Download"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground shadow-[--shadow-warm] transition hover:opacity-90"
              >
                <Download className="h-4 w-4" />
                Download
              </Link>
            </div>
          </div>
        )}

        {post.cover_url && (
          <img
            src={post.cover_url}
            alt={post.title}
            className="mt-10 max-h-152 w-full rounded-2xl border border-border object-cover"
          />
        )}

        <div
          className={
            "mt-10 text-base leading-relaxed text-foreground " +
            "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-2 " +
            "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1.5 " +
            "[&_p]:mb-4 [&_p:last-child]:mb-0 " +
            "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 " +
            "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 " +
            "[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:mb-4"
          }
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-16 border-t border-border pt-8">
          <Link
            to="/notices"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition hover:gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Notice Board
          </Link>
        </div>
      </main>

      <Footer />

      {previewDoc && <NoticePreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />}
    </div>
  );
}
