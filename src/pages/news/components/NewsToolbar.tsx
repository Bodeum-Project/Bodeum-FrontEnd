import Input from "@/components/Input";
import type { SelectOption } from "@/components/Select";
import CategoryButton from "@/components/button/CategoryButton";
import { ChipRow, FilterPill, ResultBar, SortSelect } from "@/components/list-toolbar/ListToolbar";
import type { NewsTabValue } from "./NewsTabs";
import type { NewsCategory, NewsSort } from "@/types/news";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useNewsSearchSuggestions } from "@/hooks/useNews";
import { ALL_REGIONS_LABEL } from "./RegionOnboardingBox";

export const ALL_CATEGORIES_VALUE = "ALL";
export type NewsCategoryFilter = NewsCategory | typeof ALL_CATEGORIES_VALUE | "";

interface NewsToolbarProps {
  tab: NewsTabValue;
  keyword: string;
  onKeywordChange: (value: string) => void;
  selectedRegion: string;
  onSelectedRegionClick: () => void;
  sort: NewsSort | "";
  onSortChange: (value: NewsSort) => void;
  category: NewsCategoryFilter;
  onCategoryChange: (value: NewsCategoryFilter) => void;
  onSearch: (keyword: string) => void;
  count?: number;
}

const sortOptions = [
  { label: "조회순", value: "VIEW" },
  { label: "저장순", value: "SCRAP" },
];

const categoryOptionsByTab: Record<NewsTabValue, SelectOption[]> = {
  activity: [
    { label: "전체", value: ALL_CATEGORIES_VALUE },
    { label: "모집 · 참여", value: "RECRUITMENT_PARTICIPATION" },
    { label: "교육 · 세미나", value: "EDUCATION_SEMINAR" },
    { label: "혜택 · 복지서비스", value: "BENEFIT_WELFARE_SERVICE" },
  ],
  region: [
    { label: "전체", value: ALL_CATEGORIES_VALUE },
    { label: "소식", value: "LOCAL_NEWS" },
    { label: "정책", value: "LOCAL_POLICY" },
  ],
};

export default function NewsToolbar({
  tab,
  keyword,
  onKeywordChange,
  selectedRegion,
  onSelectedRegionClick,
  sort,
  onSortChange,
  category,
  onCategoryChange,
  onSearch,
  count,
}: NewsToolbarProps) {
  const categoryOptions = categoryOptionsByTab[tab];
  const selectedRegionLabel = selectedRegion || ALL_REGIONS_LABEL;
  const selectedCategory = category === "" ? ALL_CATEGORIES_VALUE : category;

  const normalizedKeyword = keyword.trim();
  const debouncedKeyword = useDebouncedValue(normalizedKeyword, 300);
  const { data: suggestions = [], isPending: areSuggestionsPending } =
    useNewsSearchSuggestions(debouncedKeyword);
  const areSuggestionsLoading =
    normalizedKeyword.length >= 2 &&
    (normalizedKeyword !== debouncedKeyword || areSuggestionsPending);

  return (
    <div className="flex flex-col gap-[16px]">
      <Input
        search
        searchType="news"
        value={keyword}
        onChange={(event) => onKeywordChange(event.target.value)}
        onClear={() => onSearch("")}
        suggestions={suggestions}
        suggestionsLoading={areSuggestionsLoading}
        onSuggestionClick={(text) => {
          onKeywordChange(text);
          onSearch(text);
        }}
        onEnter={onSearch}
        placeholder="소식을 검색해보세요"
        className="w-full"
      />

      <ChipRow label="카테고리">
        {categoryOptions.map((option) => (
          <CategoryButton
            key={option.value}
            label={option.label}
            selected={selectedCategory === option.value}
            onClick={() => onCategoryChange(option.value as NewsCategoryFilter)}
          />
        ))}
      </ChipRow>

      <ResultBar
        count={count}
        filters={
          <FilterPill
            icon
            active={selectedRegionLabel !== ALL_REGIONS_LABEL}
            onClick={onSelectedRegionClick}
            ariaLabel={`지역 선택: ${selectedRegionLabel}`}
          >
            {selectedRegionLabel}
          </FilterPill>
        }
        sort={
          <SortSelect
            options={sortOptions}
            value={sort}
            onChange={(value) => onSortChange(value as NewsSort)}
            placeholder="조회순"
          />
        }
      />
    </div>
  );
}
