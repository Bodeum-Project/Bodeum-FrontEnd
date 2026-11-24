interface OnboardButtonProps {
  variant?: "primary" | "secondary" | "profile";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function OnboardButton({
  variant = "primary",
  children,
  onClick,
  className = "",
  disabled = false,
}: OnboardButtonProps) {
  const baseStyle =
    "w-full py-[8px] rounded-md text-[12px] font-semibold transition-colors duration-200 cursor-pointer";

  const variantStyle =
    variant === "primary"
      ? `
        btn-primary
      `
      : variant === "secondary"
        ? `
        border-1 border-default bg-surface text-secondary
        hover:bg-surface-subtle
      `
        : `
            bg-brand-soft text-brand-strong
            hover:bg-brand-tint
          `;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyle} ${variantStyle} ${className}`}
    >
      {children}
    </button>
  );
}