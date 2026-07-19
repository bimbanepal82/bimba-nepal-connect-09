import { useMemo, useState } from "react";
import { ArrowUpRight, FileText, Search } from "lucide-react";
import { useNotices } from "@/hooks/use-notices";
import { NoticeDocument, NoticeFilter } from "@/types/notice.type";
import { NoticeCard } from "./notice-card";
import { NoticePreviewModal } from "./notice-preview-modal";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const CATEGORIES: NoticeFilter[] = ["All", "Notice", "Report", "Newsletter"];

export function NoticesSection() {
  const { notices, loading } = useNotices();
  const [selectedCategory, setSelectedCategory] = useState<NoticeFilter>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [previewDoc, setPreviewDoc] = useState<NoticeDocument | null>(null);

  const filteredDocuments = useMemo(() => {
    return notices
      .filter((doc) => selectedCategory === "All" || doc.type === selectedCategory)
      .filter((doc) => {
        if (!searchTerm.trim()) return true;
        const query = searchTerm.trim().toLowerCase();
        return (
          doc.title.toLowerCase().includes(query) ||
          doc.description.toLowerCase().includes(query) ||
          doc.fileName.toLowerCase().includes(query)
        );
      });
  }, [notices, selectedCategory, searchTerm]);

  return (
    <section id="notices" className="mx-auto max-w-7xl px-6 py-24 md:py-32 scroll-mt-20">
      {/* <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"> */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-wider text-primary">
            Updates & Publications
          </span>
          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight md:text-5xl">
            Notice Board & Document Library
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Access Bimba Nepal's official notices, project reports, announcements, and newsletter
            updates.
          </p>
        </div>
        <Link
          to="/notices"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary transition hover:gap-1.5 shrink-0"
        >
          View all documents <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-12 flex flex-wrap gap-2.5 border-b border-border pb-6">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground shadow-[--shadow-warm]"
                : "border border-input bg-card text-foreground hover:bg-muted"
            }`}
          >
            {cat === "All" ? "All Documents" : `${cat}s`}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="mt-12 text-center py-20 text-sm text-muted-foreground">
          Loading documents…
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="mt-12 text-center py-20 rounded-2xl border border-dashed border-border bg-card">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/60" />
          <h3 className="mt-4 font-serif text-xl font-medium">No documents found</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
            {searchTerm.trim()
              ? "We couldn't find any documents matching your search term."
              : `There are currently no published ${selectedCategory === "All" ? "documents" : selectedCategory.toLowerCase() + "s"}.`}
          </p>
        </div>
      ) : (
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc) => (
            <NoticeCard key={doc.id} doc={doc} onPreview={setPreviewDoc} />
          ))}
        </div>
      )}

      {previewDoc && <NoticePreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />}
    </section>
  );
}
