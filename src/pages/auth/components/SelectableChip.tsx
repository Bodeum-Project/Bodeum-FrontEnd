import Chip from "@/components/Chips";

type SelectableChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
  buttonClassName?: string;
};

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
  classNames.filter(Boolean).join(" ");

export default function SelectableChip({
  label,
  selected,
  onClick,
  className,
  buttonClassName,
}: SelectableChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={joinClassNames(
        "press-sm max-w-full shrink-0 cursor-pointer rounded-[120px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        buttonClassName,
      )}
    >
      <Chip
        className={joinClassNames(
          "h-[40px]! rounded-[120px]! border! px-[18px]! py-[8px]! text-h3-category-sub!",
          selected
            ? "border-brand! bg-brand-tint! text-brand!"
            : "border-strong! bg-surface! text-secondary!",
          className,
        )}
      >
        {label}
      </Chip>
    </button>
  );
}
