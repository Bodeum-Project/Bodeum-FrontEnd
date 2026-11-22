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
    "w-full py-[8px] rounded-[10px] text-[12px] font-semibold transition-colors duration-200 cursor-pointer";

  const variantStyle =
    variant === "primary"
      ? `
        btn-primary
      `
      : variant === "secondary"
        ? `
        border-1 border-background-250 bg-background-100 text-background-500
        hover:bg-background-200
      `
        : `
            bg-main-150 text-main-500
            hover:bg-main-200
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