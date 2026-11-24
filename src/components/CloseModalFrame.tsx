import { useEffect, type MouseEventHandler, type ReactNode } from "react";
import CloseIcon from "@/assets/icons/Close.svg?react";
import MainButton from "@/components/button/MainButton";
import { useDelayedClose } from "@/hooks/usePresence";

interface CloseModalFrameProps {
  children: ReactNode;
  leftButtonText?: ReactNode;
  rightButtonText?: ReactNode;
  onClose: () => void;
  onLeftButtonClick?: MouseEventHandler<HTMLButtonElement>;
  onRightButtonClick?: MouseEventHandler<HTMLButtonElement>;
  rightButtonDisabled?: boolean;
  className?: string;
  overlayClassName?: string;
  showCloseButton?: boolean;
  showFooter?: boolean;
}

export default function CloseModalFrame({
  children,
  leftButtonText,
  rightButtonText,
  onClose,
  onLeftButtonClick,
  onRightButtonClick,
  rightButtonDisabled,
  className,
  overlayClassName,
  showCloseButton = true,
  showFooter = true,
}: CloseModalFrameProps) {
  // 닫기(X·배경·Esc)는 내려가는 모션을 보여준 뒤 닫음
  const { isClosing, close } = useDelayedClose(onClose, 200);

  // Esc로 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [close]);

  return (
    <div
      data-closing={isClosing}
      className={`fixed inset-0 z-50 flex items-end justify-center modal-backdrop motion-backdrop sm:items-center sm:px-[20px] ${overlayClassName ?? ""}`}
      onMouseDown={(event) => {
        // 시트 바깥(배경)을 누르면 닫기
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        data-closing={isClosing}
        className={`motion-sheet relative flex max-h-[90dvh] w-full max-w-[624px] flex-col overflow-y-auto rounded-t-[20px] bg-background-100 px-[20px] pt-[36px] pb-[calc(24px+env(safe-area-inset-bottom))] sm:rounded-[20px] sm:px-[44px] sm:py-[44px] ${className ?? ""}`}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={close}
            aria-label="닫기"
            className="absolute top-[20px] right-[20px] z-10 flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-[10px] text-background-500 hover:bg-background-200"
          >
            <CloseIcon />
          </button>
        )}

        <div className="mt-2 flex-1">{children}</div>

        {showFooter && (
          <div className="mt-[28px] flex gap-[10px] sm:mt-[40px] sm:gap-[16px]">
            <MainButton
              size="L"
              className="flex-1 bg-none! filter-none! bg-background-250! text-background-500! hover:bg-[#DFE3EA]! active:bg-[#D6DBE3]!"
              onClick={onLeftButtonClick}
            >
              {leftButtonText}
            </MainButton>

            <MainButton
              size="L"
              className="flex-1"
              disabled={rightButtonDisabled}
              onClick={onRightButtonClick}
            >
              {rightButtonText}
            </MainButton>
          </div>
        )}
      </div>
    </div>
  );
}
