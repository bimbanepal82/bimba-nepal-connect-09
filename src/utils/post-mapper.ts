import type { Post } from "@/lib/api/blog.functions";
import { NoticeCategory, NoticeDocument } from "@/types/notice.type";

const NOTICE_TYPES: NoticeCategory[] = ["Notice", "Report", "Newsletter", "Blog"];

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toTitleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export function mapPostToNotice(post: Post): NoticeDocument | null {
  const category = toTitleCase(post.type) as NoticeCategory;
  if (!NOTICE_TYPES.includes(category)) return null;

  const attachment = post.attachments?.[0];

  return {
    id: post.id,
    title: post.title,
    description: stripHtml(post.content).slice(0, 220),
    type: category,
    fileName: attachment?.name ?? "",
    fileUrl: attachment?.url ?? "",
    fileType: attachment?.type ?? "",
    createdAt: post.created_at,
  };
}
