import type { ButtonHTMLAttributes, ComponentType, SVGProps } from "react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export type ButtonOutlineSize = "default" | "L";
export type ButtonOutlineTone = "primary" | "black";

type ButtonOutlineBaseProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "disabled"
> & {
  label?: string;
  tone?: ButtonOutlineTone;
  disabled?: boolean;
};

type ButtonOutlineIconProps =
  | {
      size?: "default";
      icon?: undefined;
      iconPosition?: never;
    }
  | {
      size?: "default";
      icon: IconComponent;
      iconPosition: "left" | "right";
    }
  | {
      size: "L";
      icon?: never;
      iconPosition?: never;
    };

export type ButtonOutlineProps =
  ButtonOutlineBaseProps & ButtonOutlineIconProps;

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
  classNames.filter(Boolean).join(" ");

const enabledToneClasses: Record<ButtonOutlineTone, string> = {
  primary:
    "border-brand bg-surface text-brand hover:bg-surface-subtle active:border-brand-strong active:bg-surface active:text-brand-strong",
  black:
    "border-background-500 bg-surface text-primary hover:border-cta hover:bg-surface-subtle active:border-cta active:bg-cta active:text-inverse",
};

export default function ButtonOutline({
  label = "후기 작성하기",
  size = "default",
  tone = "primary",
  disabled = false,
  icon: Icon,
  iconPosition,
  className,
  type = "button",
  ...buttonProps
}: ButtonOutlineProps) {
  if (size === "L" && Icon) {
    throw new Error("ButtonOutline: icon cannot be used when size is L.");
  }

  if (size === "L" && iconPosition !== undefined) {
    throw new Error("ButtonOutline: iconPosition cannot be used when size is L.");
  }

  if (Icon && !iconPosition) {
    throw new Error("ButtonOutline: iconPosition is required when icon is provided.");
  }

  if (!Icon && iconPosition !== undefined) {
    throw new Error("ButtonOutline: iconPosition cannot be used without icon.");
  }

  const IconComponent = size === "default" ? Icon : undefined;

  return (
    <button
      type={type}
      disabled={disabled}
      data-size={size}
      data-tone={tone}
      data-state={disabled ? "disabled" : "기본"}
      data-icon-position={IconComponent ? iconPosition : undefined}
      className={joinClassNames(
        "inline-flex h-[38px] shrink-0 items-center justify-center rounded-md border px-[16px] py-[10px]",
        "text-h4-list transition-[background-color,border-color,color,box-shadow] duration-150 ease-out",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        size === "L" ? "w-full max-w-[632px] gap-[6px]" : "gap-[4px]",
        disabled
          ? "cursor-not-allowed border-background-400 bg-surface text-tertiary"
          : joinClassNames("cursor-pointer", enabledToneClasses[tone]),
        className,
      )}
      {...buttonProps}
    >
      {IconComponent && iconPosition === "left" && (
        <IconComponent
          aria-hidden="true"
          className="bodeum-icon-color h-[14px] w-[14px] shrink-0"
        />
      )}
      <span className="whitespace-nowrap">{label}</span>
      {IconComponent && iconPosition === "right" && (
        <IconComponent
          aria-hidden="true"
          className="bodeum-icon-color h-[14px] w-[14px] shrink-0"
        />
      )}
    </button>
  );
}
