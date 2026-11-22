interface FilterButtonProps {
  children: React.ReactNode;
  variant: "location" | "category";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function FilterButton({
  children,
  variant,
  disabled = false,
  onClick,
  className = "",
}: FilterButtonProps) {
  let style = "";

  if (disabled) {
    style = "bg-main-100 text-background-600";
  } else if (variant === "location") {
    style = "bg-background-200 text-background-600";
  } else {
    style = "";
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex h-[40px] shrink-0 cursor-pointer items-center justify-between gap-[6px] rounded-full px-[14px] text-[14px] font-semibold transition-colors active:brightness-95 ${style} ${className}`}
    >
      {children}
    </button>
  );
}