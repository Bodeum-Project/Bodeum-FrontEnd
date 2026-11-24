import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@/assets/icons/Close.svg?react";
import { infoCategoryMap } from "@/constants/infoCategory";
import type { ParentCategory } from "@/types/info";
import { useInfoItemCounts } from "@/hooks/useHome";

interface CategoryModalProps {
  category: ParentCategory;
  onClose: () => void;
  onSelect: (category: ParentCategory) => void;
}

const categoryTypes: ParentCategory[] = [
  "INSTITUTION",
  "HOSPITAL",
  "WELFARE",
  "EMPLOYMENT",
  "EDUCATION",
];

/**
 * 정보 분류 선택 (지역 선택 모달과 같은 틀)
 * - 항목을 누르면 바로 적용되고 닫힘. 나가기·완료 버튼 없음
 * - 바깥(배경) 클릭·Esc로 닫힘, 현재 분류는 체크 표시
 * - PC는 가운데 모달, 모바일은 아래에서 올라오는 시트
 */
export default function CategoryModal({ category, onClose, onSelect }: CategoryModalProps) {
  const titleId = useId();
  const { data: counts } = useInfoItemCounts();

  const categoryCounts: Record<ParentCategory, number | undefined> = {
    INSTITUTION: counts?.institution,
    HOSPITAL: counts?.hospital,
    WELFARE: counts?.welfare,
    EMPLOYMENT: counts?.employment,
    EDUCATION: counts?.education,
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center modal-backdrop sm:items-center sm:p-[24px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className="flex w-full flex-col overflow-hidden rounded-t-[24px] bg-background-100 pb-[calc(12px+env(safe-area-inset-bottom))] sm:max-w-[440px] sm:rounded-[24px] sm:pb-[12px]"
      >
        <div className="flex shrink-0 items-center justify-between px-[20px] pb-[10px] pt-[20px] sm:px-[24px] sm:pt-[24px]">
          <h2 id={titleId} className="text-[18px] font-bold text-background-600">
            어떤 정보를 찾아볼까요?
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="-mr-[8px] flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-[10px] text-background-500 hover:bg-background-200"
          >
            <CloseIcon className="bodeum-icon-color h-[18px] w-[18px]" aria-hidden="true" />
          </button>
        </div>

        <ul className="px-[8px] sm:px-[12px]">
          {categoryTypes.map((type) => {
            const { label, icon: Icon, bgColor, textColor } = infoCategoryMap[type];
            const isCurrent = type === category;
            const count = categoryCounts[type];

            return (
              <li key={type}>
                <button
                  type="button"
                  aria-pressed={isCurrent}
                  onClick={() => (isCurrent ? onClose() : onSelect(type))}
                  className={`flex w-full cursor-pointer items-center gap-[14px] rounded-[14px] px-[12px] py-[10px] text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-main-400 ${
                    isCurrent ? "bg-background-200" : "hover:bg-background-200"
                  }`}
                >
                  <span
                    className={`flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] ${bgColor} ${textColor}`}
                  >
                    <Icon className="h-[24px] w-[24px]" aria-hidden="true" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span
                      className={`text-[16px] leading-[22px] ${
                        isCurrent ? "font-bold text-background-600" : "font-semibold text-background-600"
                      }`}
                    >
                      {label}
                    </span>
                    {count !== undefined && (
                      <span className="text-[13px] leading-[18px] text-background-400">
                        {count.toLocaleString()}곳
                      </span>
                    )}
                  </span>
                  {isCurrent && (
                    <svg viewBox="0 0 16 16" className="h-[18px] w-[18px] shrink-0 text-main-500" aria-label="선택됨">
                      <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>,
    document.body,
  );
}
