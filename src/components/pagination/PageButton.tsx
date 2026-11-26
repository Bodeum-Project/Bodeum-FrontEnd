interface PageButtonProps {
  page: number;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export default function PageButton({
  page,
  active,
  disabled,
  onClick,
}: PageButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex h-[28px] w-[28px] items-center justify-center rounded-[4px] text-h3-onboard transition-colors",
        active
          ? "bg-brand text-inverse"
          : disabled
            ? "text-gray-300"
            : "text-gray-700 hover:bg-surface-subtle",
      ].join(" ")}
    >
      {page}
    </button>
  );
}