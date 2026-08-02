import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import { listPublicPosts } from "@/lib/api/blog.functions";
import { NoticeFilters } from "@/components/home/notices/notice-filters";
import { NoticeGrid } from "@/components/home/notices/notice-grid";
import { NoticePreviewModal } from "@/components/home/notices/notice-preview-modal";
import { CATEGORY_TO_DB, type NoticeDocument, type NoticeFilter } from "@/types/notice.type";
import type { Post } from "@/lib/api/blog.functions";
import { Header } from "@/components/home/header";
import { NoticesHero } from "@/components/home/notices/notice-hero-section";
import { Footer } from "@/components/home/footer";

const PAGE_SIZE = 9;

const searchSchema = z.object({
  type: z.enum(["Notice", "Report", "Newsletter", "Blog"]).optional(),
  q: z.string().optional(),
  page: z.number().int().min(1).optional(),
});

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function mapPostToNotice(post: Post): NoticeDocument {
  const attachment = post.attachments?.[0];
  return {
    id: post.id,
    title: post.title,
    description: stripHtml(post.content).slice(0, 220),
    type: (post.type.charAt(0).toUpperCase() + post.type.slice(1)) as NoticeDocument["type"],
    fileName: attachment?.name ?? "",
    fileUrl: attachment?.url ?? "",
    fileType: attachment?.type ?? "",
    createdAt: post.created_at,
    slug: post.slug,
  };
}

export const Route = createFileRoute("/notices/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => {
    return listPublicPosts({
      data: {
        type: deps.type
          ? (CATEGORY_TO_DB[deps.type] as "notice" | "report" | "newsletter" | "blog")
          : undefined,
        search: deps.q,
        page: deps.page ?? 1,
        pageSize: PAGE_SIZE,
      },
    });
  },
  head: () => ({
    meta: [
      { title: "Notice Board & Documents | Bimba Nepal" },
      {
        name: "description",
        content: "Official notices, project reports, and newsletter updates from Bimba Nepal.",
      },
      { property: "og:title", content: "Notice Board & Documents | Bimba Nepal" },
      {
        property: "og:description",
        content:
          "Official notices, project reports, and newsletter updates from Bimba Nepal — connecting our community with essential information and support (Reg. No. 132-082-83).",
      },
    ],
  }),
  component: NoticesListRoute,
});

function NoticesListRoute() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { posts, total } = Route.useLoaderData();
  const [previewDoc, setPreviewDoc] = useState<NoticeDocument | null>(null);

  const category: NoticeFilter = search.type ?? "All";
  const page = search.page ?? 1;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const documents = posts.map(mapPostToNotice);

  const updateSearch = (patch: Partial<z.infer<typeof searchSchema>>) => {
    navigate({
      search: (prev) => ({ ...prev, ...patch }),
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <NoticesHero />

      <main className="relative mx-auto max-w-7xl px-6 pb-16">
        <div className="relative rounded-3xl pt-10 sm:pt-12">
          <div className="flex flex-col gap-3 border-b border-border/60 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="mt-3 font-serif text-2xl font-semibold leading-tight sm:text-3xl">
                Browse Documents
              </h2>
              <p className="mt-2 max-w-lg text-sm text-muted-foreground sm:text-base">
                Filter by category or search to find a specific notice, report, or newsletter.
              </p>
            </div>
          </div>

          <div className="pt-8">
            <NoticeFilters
              category={category}
              search={search.q ?? ""}
              onCategoryChange={(cat) =>
                updateSearch({ type: cat === "All" ? undefined : cat, page: undefined })
              }
              onSearchChange={(q) => updateSearch({ q: q || undefined, page: undefined })}
            />
          </div>
        </div>

        <NoticeGrid
          documents={documents}
          loading={false}
          hasSearch={Boolean(search.q?.trim())}
          category={category}
          page={page}
          pageCount={pageCount}
          onPageChange={(next) => updateSearch({ page: next === 1 ? undefined : next })}
          onPreview={setPreviewDoc}
        />
      </main>

      <Footer />

      {previewDoc && <NoticePreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />}
    </div>
  );
}
