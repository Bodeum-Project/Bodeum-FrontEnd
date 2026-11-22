import { useState } from "react";
import HeaderSearchBar from "@/components/search/HeaderSearchBar";
import { useNavigate } from "react-router-dom";
import { useInfoSearch } from "@/hooks/useInfo";
import Logo from "@/assets/icons/Logo_kr.svg?react";

interface SearchTopBarProps {
  onMenuClick?: () => void;
}

export default function SearchTopBar({ onMenuClick }: SearchTopBarProps) {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const { data: results = [] } = useInfoSearch(keyword);

  return (
    <header className="flex h-[56px] shrink-0 items-center gap-[12px] border-b border-background-250 bg-background-100 px-[16px] lg:h-[60px] lg:justify-center lg:px-[20px] lg:py-[10px]">
      <button
        type="button"
        aria-label="메뉴 열기"
        onClick={onMenuClick}
        className="-ml-[6px] flex h-[40px] w-[40px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] text-background-600 active:bg-background-200 lg:hidden"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="홈으로"
        onClick={() => navigate("/")}
        className="shrink-0 cursor-pointer lg:hidden"
      >
        <Logo className="h-[22px] w-[57px]" />
      </button>

      <HeaderSearchBar
        className="min-w-0 flex-1 lg:flex-none"
        value={keyword}
        onChange={setKeyword}
        results={results}
        onSelect={(item) => {
          navigate(`/info/${item.category}/${item.infoItemId}`)
        }}
      />
    </header>
  );
}
