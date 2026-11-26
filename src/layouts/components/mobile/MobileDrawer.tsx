import { useEffect, type ReactNode } from "react";
import { usePresence } from "@/hooks/usePresence";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

// 모바일에서 사이드바(프로필·약관 링크·로그아웃)를 왼쪽에서 여는 서랍
export default function MobileDrawer({ open, onClose, children }: MobileDrawerProps) {
  // 닫히는 동안에도 내용을 유지해 빈 판이 미끄러져 나가지 않도록
  const { isMounted } = usePresence(open, 240);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-overlay lg:hidden ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 modal-backdrop transition-opacity duration-[240ms] ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="메뉴"
        className={`absolute inset-y-0 left-0 flex shadow-xl transition-transform duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {isMounted && children}
      </div>
    </div>
  );
}
