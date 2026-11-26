import { type ReactNode } from "react";

export type ChipVariant = "default" | "dday" | "recruit";

interface ChipProps {
  children: ReactNode;
  variant?: ChipVariant;
  className?: string;
}

const VARIANT_STYLES: Record<ChipVariant, string> = {
  default: "bg-surface-subtle text-primary",
  dday: "bg-tag-dday-soft text-tag-dday",
  recruit: "bg-tag-recruit-soft text-tag-recruit",
};

export default function Chip({ children, variant = "default", className = "" }: ChipProps) {
  return (
    <span
      className={`inline-flex h-[21px] items-center justify-center whitespace-nowrap rounded-sm px-2 py-0.5 text-h4-list ${VARIANT_STYLES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
