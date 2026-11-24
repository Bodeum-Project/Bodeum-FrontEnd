import Input, { type InputSuggestion } from "@/components/Input";
import type { ReactNode } from "react";
import { ChipRow, ResultBar, SortSelect } from "@/components/list-toolbar/ListToolbar";
import type { CommunityPostSearchSuggestion, CommunityPostSort } from "@/types/community";

const sortOptions = [
  { label: "최신순", value: "latest" },
  { label: "조회순", value: "view" },
  { label: "공감순", value: "like" },
  { label: "댓글순", value: "comment" },
];

function mapCommunitySuggestion(
  suggestion: CommunityPostSearchSuggestion,
): InputSuggestion {
  return {
    text: suggestion.title,
    description: suggestion.content,
    value: suggestion.type === "POST_TITLE" ? suggestion.title : suggestion.content,
    type: suggestion.type,
  };
}

interface CommunityToolbarProps {
  keyword: string;
  suggestions: CommunityPostSearchSuggestion[];
  suggestionsLoading: boolean;
  sort: CommunityPostSort | "";
  isLoggedIn: boolean;
  onKeywordChange: (keyword: string) => void;
  onSearch: (keyword: string) => void;
  onSortChange: (sort: CommunityPostSort) => void;
  /** 카테고리 칩들 */
  categories: ReactNode;
  count?: number;
}

export default function CommunityToolbar({
  keyword,
  suggestions,
  suggestionsLoading,
  sort,
  isLoggedIn,
  onKeywordChange,
  onSearch,
  onSortChange,
  categories,
  count,
}: CommunityToolbarProps) {
  return (
    <div className="flex flex-col gap-[12px]">
      <Input
        search
        searchType="community"
        value={keyword}
        onChange={(event) => onKeywordChange(event.target.value)}
        onClear={() => onSearch("")}
        onEnter={onSearch}
        suggestions={suggestions.map(mapCommunitySuggestion)}
        suggestionsLoading={suggestionsLoading}
        onSuggestionClick={(nextKeyword) => {
          onKeywordChange(nextKeyword);
          onSearch(nextKeyword);
        }}
        placeholder="게시글을 검색해보세요"
        className="w-full"
      />

      <ChipRow label="카테고리">{categories}</ChipRow>

      <ResultBar
        count={count}
        unit="개"
        sort={
          <SortSelect
            options={sortOptions}
            value={sort}
            onChange={(value) => onSortChange(value as CommunityPostSort)}
            placeholder={isLoggedIn ? "최신순" : "조회순"}
            ariaLabel="게시글 정렬"
          />
        }
      />
    </div>
  );
}
