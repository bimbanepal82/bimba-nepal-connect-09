import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import type { NoticeFilter } from "@/types/notice.type";
import { Button } from "@/components/ui/button";

const CATEGORIES: NoticeFilter[] = ["All", "Notice", "Report", "Newsletter", "Blog"];

interface NoticeFiltersProps {
  category: NoticeFilter;
  search: string;
  onCategoryChange: (category: NoticeFilter) => void;
  onSearchChange: (search: string) => void;
}

export function NoticeFilters({
  category,
  search,
  onCategoryChange,
  onSearchChange,
}: NoticeFiltersProps) {
  const [inputValue, setInputValue] = useState(search);

  useEffect(() => setInputValue(search), [search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputValue !== search) onSearchChange(inputValue);
    }, 400);
    return () => clearTimeout(timeout);
  }, [inputValue]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-6">
      <div className="relative w-full md:max-w-xs shrink-0">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground pointer-events-none">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search documents..."
          className="w-full rounded-full border border-input bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="flex flex-wrap gap-2.5 border-b border-border pb-6">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
              category === cat
                ? "bg-primary text-primary-foreground shadow-[--shadow-warm]"
                : "border border-input bg-card text-foreground hover:bg-muted"
            }`}
          >
            {cat === "All" ? "All Documents" : `${cat}s`}
          </Button>
        ))}
      </div>
    </div>
  );
}
