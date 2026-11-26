import type { ButtonHTMLAttributes, ReactNode } from "react";

type AiSuggestChipProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "type"
> & {
  children: ReactNode;
  pressed?: boolean;
};

export default function AiSuggestChip({
  children,
  pressed = false,
  className,
  ...buttonProps
}: AiSuggestChipProps) {
  return (
    <button
      {...buttonProps}
      type="button"
      aria-pressed={pressed}
      className={`press-sm inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-full border border-brand px-[13px] py-[6px] text-h6-list text-brand transition-colors hover:bg-brand-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
        pressed ? "bg-brand-soft" : "bg-surface"
      } ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
