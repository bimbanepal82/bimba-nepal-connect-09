import { useEffect, useState } from "react";
import { listPosts } from "@/lib/api/blog.functions";
import { NoticeDocument } from "@/types/notice.type";
import { mapPostToNotice } from "@/utils/post-mapper";

export function useNotices() {
  const [notices, setNotices] = useState<NoticeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    listPosts()
      .then((posts) => {
        if (!active) return;
        const mapped = posts
          .map(mapPostToNotice)
          .filter((n): n is NoticeDocument => n !== null)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        setNotices(mapped);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Failed to load documents");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { notices, loading, error };
}
