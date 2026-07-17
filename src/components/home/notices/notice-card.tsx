import { Link } from "@tanstack/react-router";
import { isPreviewSupported } from "@/lib/document-storage";
import { NoticeDocument } from "@/types/notice.type";
import { ArrowUpRight, Calendar, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BADGE_STYLES: Record<NoticeDocument["type"], string> = {
  Notice: "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
  Report: "bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400",
  Newsletter: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  Blog: "bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400",
};

interface NoticeCardProps {
  doc: NoticeDocument;
  onPreview: (doc: NoticeDocument) => void;
}

export function NoticeCard({ doc, onPreview }: NoticeCardProps) {
  return (
    <Link
      to="/notices/$noticeId"
      params={{ noticeId: doc.id }}
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all shadow-[--shadow-soft] hover:shadow-sm hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <div>
        <div className="flex items-center justify-between gap-4">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize tracking-wider ${BADGE_STYLES[doc.type]}`}
          >
            {doc.type}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {new Date(doc.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h3 className="mt-4 font-serif text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
          {doc.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{doc.description}</p>
      </div>

      <div className="mt-6 border-t border-border/60 pt-4 flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1 text-xs  font-medium text-primary opacity-80 transition-all group-hover:gap-1.5 group-hover:opacity-100">
          Read more
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
        <div className="flex gap-2 shrink-0">
          {doc.fileUrl && isPreviewSupported(doc.fileType) && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPreview(doc);
              }}
              title="Quick preview"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {doc.fileUrl && (
            <Link
              to={doc.fileUrl}
              download={doc.fileName}
              onClick={(e) => e.stopPropagation()}
              title="Download Document"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <Download className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </Link>
  );
}
