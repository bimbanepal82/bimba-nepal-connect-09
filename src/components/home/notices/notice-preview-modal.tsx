import { NoticeDocument } from "@/types/notice.type";
import { X } from "lucide-react";

interface NoticePreviewModalProps {
  doc: NoticeDocument;
  onClose: () => void;
}

export function NoticePreviewModal({ doc, onClose }: NoticePreviewModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl border border-border bg-card p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h3 className="font-serif text-xl font-bold">{doc.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{doc.fileName}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-muted transition text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 min-h-[50vh] mt-4 flex items-center justify-center overflow-auto rounded-xl bg-muted p-2">
          {doc.fileType.startsWith("image/") ? (
            <img
              src={doc.fileUrl}
              alt={doc.title}
              className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm"
            />
          ) : doc.fileType === "application/pdf" ? (
            <iframe
              src={doc.fileUrl}
              title={doc.title}
              className="w-full h-[60vh] rounded-lg border-0"
            />
          ) : (
            <div className="text-center p-8 text-sm text-muted-foreground">
              Preview is not supported for this file type.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
