import type { ButtonHTMLAttributes } from "react";
import type { ComponentType, SVGProps } from "react";

type CategoryButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "disabled" | "aria-pressed" | "data-state"
> & {
  category?: string;
  label: string;
  selected?: boolean;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
  classNames.filter(Boolean).join(" ");

export default function CategoryButton({
  category,
  label,
  selected = false,
  className,
  type = "button",
  icon: Icon,
  ...buttonProps
}: CategoryButtonProps) {
  return (
    <button
      {...buttonProps}
      type={type}
      aria-pressed={selected}
      data-state={selected ? "selected" : "default"}
      data-category={category}
      className={joinClassNames(
        "press-sm inline-flex h-[37px] shrink-0 items-center justify-center whitespace-nowrap rounded-[100px] px-[12px] py-[8px]",
        "text-h3-category-sub transition-[background-color,color,box-shadow,--tw-ring-color] duration-150 ease-out",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        selected
          ? "bg-cta text-inverse"
          : "bg-surface-subtle text-secondary active:bg-surface-muted",
        "cursor-pointer",
        className,
      )}
    >
      {Icon && <Icon className="mr-[2px]" />}
      {label}
    </button>
  );
}
