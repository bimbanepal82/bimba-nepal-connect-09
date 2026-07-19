export type NoticeCategory = "Notice" | "Report" | "Newsletter" | "Blog";
export type NoticeFilter = "All" | NoticeCategory;

export interface NoticeDocument {
  id: string;
  title: string;
  description: string;
  type: NoticeCategory;
  fileName: string;
  fileUrl: string;
  fileType: string;
  createdAt: string;
  slug: string;
}

export const CATEGORY_TO_DB: Record<NoticeCategory, string> = {
  Notice: "notice",
  Report: "report",
  Newsletter: "newsletter",
  Blog: "blog",
};
