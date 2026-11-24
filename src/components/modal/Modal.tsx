import { useEffect, useRef } from "react";

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

  if (!open) return null;

  return (
    <div
      className={"fixed inset-0 z-[60] flex items-center justify-center px-[20px] modal-backdrop"}
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
        className={className}
      >
        {children}
      </div>
    </div>
  );
}