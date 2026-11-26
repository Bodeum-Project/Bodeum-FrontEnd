import { useEffect, useRef } from "react";
import { usePresence } from "@/hooks/usePresence";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  /** @deprecated 모든 모달이 같은 배경(modal-backdrop)을 씀. 호출부 호환용 */
  backdrop?: "dim" | "blur";
}

export default function Modal({
  open,
  onClose,
  children,
  className = "",
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const { isMounted, isClosing } = usePresence(open, 160);

  if (!isMounted) return null;

  return (
    <div
      data-closing={isClosing}
      className={`fixed inset-0 z-modal flex items-center justify-center px-[20px] modal-backdrop motion-backdrop ${
        isClosing ? "pointer-events-none" : ""
      }`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        data-closing={isClosing}
        className={`motion-pop ${className}`}
      >
        {children}
      </div>
    </div>
  );
}