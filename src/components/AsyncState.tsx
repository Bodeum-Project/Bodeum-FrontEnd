import {
  CardRowSkeleton,
  DetailPageSkeleton,
  ListPageSkeleton,
  MyPageSkeleton,
  RowsSkeleton,
} from "@/components/skeleton/Skeleton";

type SkeletonKind = "list" | "posts" | "detail" | "cards" | "rows" | "mypage";

interface AsyncStateProps {
  type: "loading" | "error";
  variant?: "page" | "section";
  /** 로딩 중에 보여줄 뼈대 모양. 기본값: page → list, section → rows */
  skeleton?: SkeletonKind;
  loadingText?: string;
  errorText?: string;
  className?: string;
  textClassName?: string;
}

export default function AsyncState({
  type,
  variant = "page",
  skeleton,
  loadingText = "불러오는 중입니다",
  errorText = "오류가 발생했습니다.",
  className = "",
  textClassName = "text-h2-list text-background-400",
}: AsyncStateProps) {
  if (type === "loading") {
    const kind = skeleton ?? (variant === "page" ? "list" : "rows");

    switch (kind) {
      case "detail":
        return <DetailPageSkeleton label={loadingText} />;
      case "cards":
        return <CardRowSkeleton label={loadingText} />;
      case "mypage":
        return <MyPageSkeleton label={loadingText} />;
      case "posts":
        return <ListPageSkeleton label={loadingText} icon={false} />;
      case "rows":
        return <RowsSkeleton label={loadingText} />;
      default:
        return <ListPageSkeleton label={loadingText} />;
    }
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`flex items-center justify-center ${
        variant === "page" ? "min-h-[calc(100vh-80px)]" : ""
      } ${className}`}
    >
      <p className={textClassName}>{errorText}</p>
    </div>
  );
}
