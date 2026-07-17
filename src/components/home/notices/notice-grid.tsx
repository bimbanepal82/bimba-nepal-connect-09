import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoticeCard } from "./notice-card";
import type { NoticeDocument, NoticeFilter } from "@/types/notice.type";

interface NoticeGridProps {
  documents: NoticeDocument[];
  loading: boolean;
  hasSearch: boolean;
  category: NoticeFilter;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onPreview: (doc: NoticeDocument) => void;
}

export function NoticeGrid({
  documents,
  loading,
  hasSearch,
  category,
  page,
  pageCount,
  onPageChange,
  onPreview,
}: NoticeGridProps) {
  if (loading) {
    return (
      <div className="mt-12 text-center py-20 text-sm text-muted-foreground">
        Loading documents…
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="mt-12 text-center py-20 rounded-2xl border border-dashed border-border bg-card">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground/60" />
        <h3 className="mt-4 font-serif text-xl font-medium">No documents found</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
          {hasSearch
            ? "We couldn't find any documents matching your search term."
            : `There are currently no published ${category === "All" ? "documents" : category.toLowerCase() + "s"}.`}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <NoticeCard key={doc.id} doc={doc} onPreview={onPreview} />
        ))}
      </div>

      {pageCount > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
}
