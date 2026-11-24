import type { ReactNode } from "react";
import ChevronDownIcon from "@/assets/icons/ChevronDown.svg?react";
import LocationPinIcon from "@/assets/icons/LocationPin.svg?react";
import { Select, type SelectOption } from "@/components/Select";

/**
 * 소식·정보·커뮤니티 목록 공통 툴바 부품
 * 순서: 검색창 → 카테고리 칩 줄(ChipRow) → 결과 줄(ResultBar: 개수·필터 / 정렬)
 */

/** 카테고리 칩 줄: 모바일은 가로 스크롤(화면 끝까지), PC는 줄바꿈 */
export function ChipRow({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="no-scrollbar -mx-[16px] flex gap-[8px] overflow-x-auto px-[16px] md:mx-0 md:flex-wrap md:px-0 [&>*]:shrink-0"
    >
      {children}
    </div>
  );
}

/** 결과 줄: 왼쪽 개수·필터, 오른쪽 정렬 */
export function ResultBar({
  count,
  unit = "건",
  filters,
  sort,
}: {
  count?: number;
  unit?: string;
  filters?: ReactNode;
  sort?: ReactNode;
}) {
  return (
    <div className="flex min-h-[36px] items-center gap-[8px]">
      <div className="flex min-w-0 flex-1 items-center gap-[8px]">
        {count !== undefined && (
          <p className="shrink-0 text-[14px] font-medium text-background-500">
            총 <span className="font-bold text-background-600">{count.toLocaleString()}</span>
            {unit}
          </p>
        )}
        {filters}
      </div>
      {sort && <div className="shrink-0">{sort}</div>}
    </div>
  );
}

/** 지역·상위 분류처럼 모달을 여는 필터 알약 버튼. active면 민트 */
export function FilterPill({
  children,
  active = false,
  icon = false,
  onClick,
  ariaLabel,
  className = "",
}: {
  children: ReactNode;
  active?: boolean;
  icon?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flex h-[34px] min-w-0 cursor-pointer items-center gap-[4px] rounded-full border pl-[12px] pr-[10px] text-[13px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400 ${
        active
          ? "border-transparent bg-main-150 text-main-500"
          : "border-background-250 bg-background-100 text-background-600 hover:bg-background-200"
      } ${className}`}
    >
      {icon && <LocationPinIcon className="h-[14px] w-[14px] shrink-0 text-main-400" aria-hidden="true" />}
      <span className="min-w-0 truncate">{children}</span>
      <ChevronDownIcon className="h-[14px] w-[14px] shrink-0 opacity-70" aria-hidden="true" />
    </button>
  );
}

/** 정렬: 회색 박스 없이 가벼운 텍스트 버튼 */
export function SortSelect({
  options,
  value,
  onChange,
  placeholder,
  ariaLabel = "정렬 선택",
}: {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}) {
  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      ariaLabel={ariaLabel}
      variant="S"
      className="block"
      triggerClassName="h-[34px]! gap-[2px]! rounded-[10px]! border-transparent! bg-transparent! pl-[8px]! pr-[4px]! text-[13px]! text-background-500! hover:bg-background-200! [&>svg]:h-[14px] [&>svg]:w-[14px]"
      dropdownClassName="right-0 w-[120px]!"
    />
  );
}

/** 제목 문장 속 텍스트 드롭다운 (굿닥식). 예: "보호자님, [서울시 강동구 ▾] [기관 ▾]의 정보를 모았어요" */
export function InlineDropdown({
  children,
  onClick,
  ariaLabel,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-haspopup="dialog"
      className={`group -mx-[4px] inline-flex cursor-pointer items-center gap-[1px] rounded-[10px] px-[4px] transition-colors hover:bg-background-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400 ${className}`}
    >
      <span className="underline decoration-current/25 decoration-2 underline-offset-[6px]">{children}</span>
      <ChevronDownIcon
        className="h-[18px] w-[18px] shrink-0 opacity-60 transition-transform group-hover:translate-y-[1px]"
        aria-hidden="true"
      />
    </button>
  );
}
