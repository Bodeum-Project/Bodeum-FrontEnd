import { useEffect, useRef, useState } from "react";

import { BlockIcon, ReportIcon } from "./ModerationIcons";
import ModerationModal from "./ModerationModal";
import {
  moderationTargetLabel,
  type ModerationAction,
  type ModerationTarget,
} from "./moderationReasons";

interface ModerationMenuProps {
  target: ModerationTarget;
  /** 트리거 버튼 크기·여백 조정용 */
  className?: string;
}

/**
 * 다른 사용자의 게시글·댓글·후기에 붙는 ⋮ 메뉴 (신고하기 / 차단하기).
 */
export default function ModerationMenu({ target, className = "" }: ModerationMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [action, setAction] = useState<ModerationAction | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const targetLabel = moderationTargetLabel[target];

  useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setIsMenuOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const openModal = (next: ModerationAction) => {
    setIsMenuOpen(false);
    setAction(next);
  };

  const itemClass =
    "flex w-full cursor-pointer items-center gap-[8px] px-[14px] py-[10px] text-left text-[14px] leading-[20px] hover:bg-background-200 focus:bg-background-200 focus:outline-none";

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        aria-label={`${targetLabel} 더보기 메뉴`}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((current) => !current)}
        className={`flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-[8px] text-background-500 hover:bg-background-200 ${
          isMenuOpen ? "bg-background-200" : ""
        } ${className}`}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="12" cy="5.5" r="1.8" fill="currentColor" />
          <circle cx="12" cy="12" r="1.8" fill="currentColor" />
          <circle cx="12" cy="18.5" r="1.8" fill="currentColor" />
        </svg>
      </button>

      {isMenuOpen && (
        <div
          role="menu"
          aria-label={`${targetLabel} 메뉴`}
          className="absolute right-0 top-[34px] z-20 min-w-[156px] overflow-hidden rounded-[12px] border border-background-250 bg-background-100 py-[4px] shadow-[0_8px_24px_rgb(30_40_60_/_0.14)]"
        >
          <button role="menuitem" type="button" onClick={() => openModal("report")} className={`${itemClass} text-sub-red`}>
            <ReportIcon />
            {target === "post" ? "게시글 신고" : "신고하기"}
          </button>
          <button role="menuitem" type="button" onClick={() => openModal("block")} className={`${itemClass} text-background-600`}>
            <BlockIcon className="text-background-500" />
            {target === "post" ? "작성자 차단" : "이 사용자 차단"}
          </button>
        </div>
      )}

      <ModerationModal
        open={action !== null}
        action={action ?? "report"}
        target={target}
        onClose={() => setAction(null)}
      />
    </div>
  );
}
