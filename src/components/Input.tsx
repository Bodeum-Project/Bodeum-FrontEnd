import { useEffect, useRef, useState } from "react";
import SearchIcon from "@/assets/icons/Search.svg?react";
import CancelIcon from "@/assets/icons/Cancel-rounded.svg?react";
import NewsIcon from "@/assets/icons/searchNews.svg?react";
import CommunityIcon from "@/assets/icons/searchCommunity.svg?react";
import EmptySearchResult from "./search/EmptySearchResult";

export interface InputSuggestion {
  text: string;
  type: string;
  description?: string;
  value?: string;
}

interface InputProps {
  searchType?: "news" | "community";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  placeholder?: string;
  search?: boolean;
  disabled?: boolean;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onEnter?: (keyword: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  suggestions?: InputSuggestion[];
  suggestionsLoading?: boolean;
  onSuggestionClick?: (text: string) => void;
  onClear?: () => void;
}

function renderHighlightedText(text: string, keyword: string) {
  const matchIndex = text.indexOf(keyword);

  if (matchIndex === -1) return text;

  return (
    <>
      {text.slice(0, matchIndex)}
      <span className="font-bold text-primary">
        {text.slice(matchIndex, matchIndex + keyword.length)}
      </span>
      {text.slice(matchIndex + keyword.length)}
    </>
  );
}

export default function Input({
  value,
  onChange,
  id,
  placeholder,
  search = false,
  disabled = false,
  className = "",
  onFocus,
  onBlur,
  onKeyDown,
  onEnter,
  suggestions = [],
  suggestionsLoading = false,
  onSuggestionClick,
  onClear,
  searchType,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(value.trim() !== "");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const wrapperStyle = search
    ? isFilled
      ? "border border-default bg-surface-subtle"
      : "border border-background-200 bg-surface-subtle"
    : isFilled
      ? "border-0 bg-surface-subtle focus-within:border focus-within:border-brand"
      : "border border-strong bg-surface-subtle";

  const filteredSuggestions = suggestions.filter((item) => {
    if (searchType === "news") return item.type === "NEWS_TITLE";
    if (searchType === "community") {
      return item.type === "POST_TITLE" || item.type === "POST_CONTENT";
    }
    return true;
  });
  const SuggestionIcon = searchType === "community" ? CommunityIcon : NewsIcon;
  const suggestionsKey = filteredSuggestions
    .map((item) => `${item.type}:${item.text}:${item.description ?? ""}:${item.value ?? ""}`)
    .join("|");

  // 검색어(value)나 제안 목록이 변경되면 인덱스 초기화
  useEffect(() => {
    setActiveIndex(null);
    setIsKeyboardNavigation(false);
    itemRefs.current = [];
  }, [suggestionsKey, value]);

  // activeIndex 변경 시 해당 위치로 자동 스크롤
  useEffect(() => {
    if (activeIndex === null) return;
    itemRefs.current[activeIndex]?.scrollIntoView({
      block: "nearest",
    });
  }, [activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 외부에서 전달된 onKeyDown 먼저 실행
    onKeyDown?.(e);

    if (e.nativeEvent.isComposing) {
      return;
    }

    // 검색 모드가 아니거나 검색어가 2자 미만, 제안 목록이 없으면 기존 Enter 동작만 처리
    const isDropdownOpen = search && isFocused && value.trim().length >= 2;

    if (!isDropdownOpen) {
      if (search && e.key === "Enter") {
        setIsFilled(value.trim() !== "");
        (e.target as HTMLInputElement).blur();
        onEnter?.(value);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsKeyboardNavigation(true);

      if (filteredSuggestions.length === 0) return;

      setActiveIndex((prev) =>
        prev === null || prev === filteredSuggestions.length - 1 ? 0 : prev + 1,
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setIsKeyboardNavigation(true);

      if (filteredSuggestions.length === 0) return;

      setActiveIndex((prev) =>
        prev === null || prev === 0 ? filteredSuggestions.length - 1 : prev - 1,
      );
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (activeIndex !== null && filteredSuggestions[activeIndex]) {
        const selectedText =
          filteredSuggestions[activeIndex].value ?? filteredSuggestions[activeIndex].text;
        inputRef.current?.blur();
        setIsFilled(selectedText.trim() !== "");
        onSuggestionClick?.(selectedText);
      } else if (search) {
        setIsFilled(value.trim() !== "");
        inputRef.current?.blur();
        onEnter?.(value);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setIsFocused(false);
      setActiveIndex(null);
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          flex ${search ? "h-[40px]" : "h-[48px]"} items-center rounded-lg px-[16px] transition-all ${wrapperStyle}
          focus-within:border-brand
          focus-within:bg-surface
        `}
      >
        {search && (
          <SearchIcon className="text-tertiary mr-[10px] h-[18px] w-[18px] shrink-0" />
        )}

        <input
          ref={inputRef}
          id={id}
          value={value}
          onChange={(e) => {
            onChange(e);
            if (!search) {
              setIsFilled(e.target.value.trim() !== "");
            }
          }}
          disabled={disabled}
          placeholder={isFocused ? "" : placeholder}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          onKeyDown={handleKeyDown}
          className={`
            min-w-0 flex-1 bg-transparent
            ${search ? "text-h3-category-sub" : "text-h2-onboard"}
            text-primary outline-none
            placeholder:text-disabled
          `}
        />

        {search && value.trim() !== "" && (
          <button
            type="button"
            onClick={() => {
              const event = {
                target: { value: "" },
              } as React.ChangeEvent<HTMLInputElement>;

              onChange(event);
              setIsFilled(false);
              onClear?.();
            }}
            className="ml-2 shrink-0"
          >
            <CancelIcon />
          </button>
        )}
      </div>

      {search && isFocused && value.trim().length >= 2 && (
        <div
          className="
            absolute left-0 right-0 top-[40px]
            z-overlay mt-2
            max-h-[300px] overflow-y-auto overscroll-contain
            rounded-md
            border border-background-200
            bg-surface
            shadow-[1px_2px_15px_0px_#00000026]
            px-1 py-2
          "
        >
          {suggestionsLoading ? (
            <div className="py-8 text-center text-h3-category-sub text-secondary">
              검색어 추천 리스트를 불러오는 중입니다.
            </div>
          ) : filteredSuggestions.length === 0 ? (
            <EmptySearchResult />
          ) : (
            filteredSuggestions.map((item, index) => {
              const matchIndex = item.text.indexOf(value);
              const isActive = activeIndex === index;
              const selectedText = item.value ?? item.text;

              return (
                <button
                  key={`${item.type}-${item.text}-${item.description ?? ""}-${index}`}
                  type="button"
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseMove={() => setIsKeyboardNavigation(false)}
                  onClick={() => {
                    if (search) {
                      inputRef.current?.blur();
                    }
                    if (item.value !== undefined) {
                      setIsFilled(selectedText.trim() !== "");
                    }
                    onSuggestionClick?.(selectedText);
                  }}
                  className={`
                    flex w-full items-center
                    p-3
                    text-h3-category
                    rounded-md
                    text-left outline-none
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
                  <SuggestionIcon className="mr-2 shrink-0 text-tertiary" />
                  {item.description !== undefined ? (
                    <span className="min-w-0 flex-1">
                      <span
                        className="block truncate text-h3-category text-secondary"
                        title={item.text}
                      >
                        {renderHighlightedText(item.text, value)}
                      </span>
                      <span
                        className="block truncate text-h3-category-sub text-tertiary"
                        title={item.description}
                      >
                        {renderHighlightedText(item.description, value)}
                      </span>
                    </span>
                  ) : matchIndex === -1 ? (
                    <span>{item.text}</span>
                  ) : (
                    <span className="text-secondary">
                      {renderHighlightedText(item.text, value)}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
