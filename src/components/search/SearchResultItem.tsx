import { searchCategoryIconMap } from "@/constants/infoCategory";
import type { InfoSearchResult } from "@/types/search";

interface SearchResultItemProps {
  item: InfoSearchResult;
  keyword: string;
  isActive: boolean;
  isKeyboardNavigation: boolean;
  onSelect: (item: InfoSearchResult) => void;
  onMouseMove: () => void;
  setRef: (el: HTMLButtonElement | null) => void;
}

function highlightText(text: string, keyword: string) {
  if (!keyword.trim()) return text;

  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escapedKeyword})`, "gi"));

  return parts.map((part, index) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <span key={index} className="text-primary">
        {part}
      </span>
    ) : (
      part
    )
  );
}

export default function SearchResultItem({
  item,
  keyword,
  isActive,
  isKeyboardNavigation,
  onSelect,
  onMouseMove,
  setRef,
}: SearchResultItemProps) {
  const Icon = searchCategoryIconMap[item.category as keyof typeof searchCategoryIconMap];

  return (
    <button
      type="button"
      ref={setRef}
      onMouseMove={onMouseMove}
      onClick={() => onSelect(item)}
      className={`
        flex w-full items-center
        p-3 rounded-md
        text-left
        outline-none
        border-none
        focus:outline-none
        focus:ring-0
        focus:border-none
        ${
          isActive
            ? "bg-surface-subtle"
            : !isKeyboardNavigation
              ? "hover:bg-surface-subtle"
              : ""
        }
        active:bg-surface-subtle
      `}
    >
      {Icon && <Icon className="mr-2 h-6 w-6 shrink-0" />}

      <div className="flex flex-col">
        <span className="text-h3-category-sub text-secondary">
          {highlightText(item.name, keyword)}
        </span>

        <span className="text-h3-onboard text-tertiary">
          {[item.regionLevel1, item.regionLevel2].filter(Boolean).join(" ")}
        </span>
      </div>
    </button>
  );
}