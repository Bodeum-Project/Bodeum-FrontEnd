import { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  /** 배경 처리: dim(기본) 또는 blur(뒤 화면을 흐리게 보여줌) */
  backdrop?: "dim" | "blur";
}

export default function Modal({
  open,
  onClose,
  children,
  className = "",
  backdrop = "dim",
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
      className={`fixed inset-0 z-[60] flex items-center justify-center px-[20px] ${
        backdrop === "blur" ? "bg-[rgb(42_53_70_/_0.18)] backdrop-blur-[6px]" : "bg-black/40"
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
        className={className}
      >
        {children}
      </div>
    </div>
  );
}