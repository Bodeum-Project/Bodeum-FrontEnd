import BrandLogo from "@/components/BrandLogo";

type AuthLoadingStateProps = {
  message: string;
  tone?: "default" | "inverse";
};

export default function AuthLoadingState({
  message,
  tone = "default",
}: AuthLoadingStateProps) {
  const isInverse = tone === "inverse";

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[220px] flex-col items-center justify-center gap-[24px]"
    >
      <BrandLogo className="h-[34px]" />
      <div
        aria-hidden="true"
        className={[
          "size-[32px] animate-spin rounded-full border-[3px]",
          isInverse
            ? "border-strong border-t-brand"
            : "border-brand-tint border-t-brand-strong",
        ].join(" ")}
      />
      <p
        className={[
          "text-center text-h2-onboard",
          isInverse ? "text-inverse" : "text-secondary",
        ].join(" ")}
      >
        {message}
      </p>
    </div>
  );
}
