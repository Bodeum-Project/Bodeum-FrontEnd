import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@/assets/icons/Close.svg?react";
import { useDelayedClose } from "@/hooks/usePresence";
import { districtNamesByRegion, sidoDisplayNameByRegion, sidoNames } from "@/constants/regions";

export interface RegionPickerValue {
  /** 빈 문자열이면 지역 전체 */
  sido: string;
  /** 빈 문자열이면 시/도 전체 */
  district: string;
}

interface RegionPickerModalProps {
  initialSido?: string | null;
  initialDistrict?: string | null;
  onClose: () => void;
  onSelect: (value: RegionPickerValue) => void;
}

const ALL = "";

/**
 * 지역 선택 (굿닥식 두 칸 목록)
 * - 왼쪽: 시/도, 오른쪽: 시/군/구. 오른쪽 항목을 누르면 바로 적용되고 닫힘
 * - 이미 고른 지역이 선택된 채로 열림
 * - PC는 가운데 모달, 모바일은 아래에서 올라오는 시트
 */
export default function RegionPickerModal({
  initialSido,
  initialDistrict,
  onClose,
  onSelect,
}: RegionPickerModalProps) {
  const titleId = useId();
  const startSido = initialSido && sidoNames.includes(initialSido) ? initialSido : ALL;
  const [activeSido, setActiveSido] = useState(startSido);
  const leftRef = useRef<HTMLUListElement>(null);
  const rightRef = useRef<HTMLUListElement>(null);

  const currentSido = startSido;
  const currentDistrict = startSido ? (initialDistrict ?? "") : "";
  const districts = activeSido ? (districtNamesByRegion[activeSido] ?? []) : [];

  // 닫기(X·배경·Esc)는 시트가 내려가는 모션 뒤에 닫음
  const { isClosing, close } = useDelayedClose(onClose, 200);

  // Esc로 닫기 + 배경 스크롤 막기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [close]);

  // 처음 열 때 선택된 항목이 보이도록 스크롤
  useEffect(() => {
    leftRef.current
      ?.querySelector<HTMLElement>("[data-active='true']")
      ?.scrollIntoView({ block: "center" });
    rightRef.current
      ?.querySelector<HTMLElement>("[data-current='true']")
      ?.scrollIntoView({ block: "center" });
    // 최초 1회만 실행
  }, []);

  // 왼쪽에서 다른 시/도를 고르면 오른쪽 목록은 맨 위부터
  useEffect(() => {
    if (activeSido !== startSido) rightRef.current?.scrollTo({ top: 0 });
  }, [activeSido, startSido]);

  const pick = (sido: string, district: string) => onSelect({ sido, district });

  const rowBase =
    "flex w-full cursor-pointer items-center justify-between text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-main-400";

  return createPortal(
    <div
      data-closing={isClosing}
      className="fixed inset-0 z-[90] flex items-end justify-center modal-backdrop motion-backdrop sm:items-center sm:p-[24px]"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        data-closing={isClosing}
        className="motion-sheet flex h-[82dvh] w-full flex-col overflow-hidden rounded-t-[24px] bg-background-100 pb-[env(safe-area-inset-bottom)] sm:h-[min(620px,86vh)] sm:max-w-[520px] sm:rounded-[24px] sm:pb-0"
      >
        <div className="flex shrink-0 items-center justify-between px-[20px] pb-[14px] pt-[20px] sm:px-[24px] sm:pt-[24px]">
          <h2 id={titleId} className="text-[18px] font-bold text-background-600">
            지역 선택
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="닫기"
            className="-mr-[8px] flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-[10px] text-background-500 hover:bg-background-200"
          >
            <CloseIcon className="bodeum-icon-color h-[18px] w-[18px]" aria-hidden="true" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 border-t border-background-250">
          {/* 시/도 */}
          <ul
            ref={leftRef}
            aria-label="시/도"
            className="no-scrollbar w-[36%] shrink-0 overflow-y-auto bg-background-200 py-[6px] sm:w-[168px]"
          >
            {[ALL, ...sidoNames].map((sido) => {
              const isActive = sido === activeSido;
              const label = sido ? (sidoDisplayNameByRegion[sido] ?? sido) : "지역 전체";

              return (
                <li key={sido || "all"}>
                  <button
                    type="button"
                    data-active={isActive}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => (sido ? setActiveSido(sido) : pick(ALL, ""))}
                    className={`${rowBase} h-[52px] px-[20px] text-[15px] ${
                      isActive
                        ? "bg-background-100 font-semibold text-background-600"
                        : "font-medium text-background-500 hover:text-background-600"
                    }`}
                  >
                    {label}
                    {!sido && currentSido === ALL && (
                      <span className="h-[6px] w-[6px] rounded-full bg-main-400" aria-label="선택됨" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* 시/군/구 */}
          <ul ref={rightRef} aria-label="시/군/구" className="min-w-0 flex-1 overflow-y-auto py-[6px]">
            {activeSido ? (
              [ALL, ...districts].map((district) => {
                const isCurrent = activeSido === currentSido && district === currentDistrict;
                const label = district || `${sidoDisplayNameByRegion[activeSido] ?? activeSido} 전체`;

                return (
                  <li key={district || "all"}>
                    <button
                      type="button"
                      data-current={isCurrent}
                      aria-pressed={isCurrent}
                      onClick={() => pick(activeSido, district)}
                      className={`${rowBase} h-[52px] px-[20px] text-[15px] hover:bg-background-200 ${
                        isCurrent
                          ? "font-semibold text-main-500"
                          : district
                            ? "font-medium text-background-600"
                            : "font-semibold text-background-600"
                      }`}
                    >
                      {label}
                      {isCurrent && (
                        <svg viewBox="0 0 16 16" className="h-[16px] w-[16px]" aria-hidden="true">
                          <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="px-[20px] py-[24px] text-[14px] leading-[22px] text-background-400">
                왼쪽에서 시/도를 고르거나,
                <br />
                '지역 전체'를 눌러 모든 지역을 볼 수 있어요.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>,
    document.body,
  );
}
