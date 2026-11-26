import CommentStat from "@/components/post-stat/CommentStat";
import HeartStat from "@/components/post-stat/HeartStat";
import ViewStat from "@/components/post-stat/ViewStat";

interface CommunityRelatedPostCardProps {
  title: string;
  createdAt: string;
  likes: number;
  comments: number;
  views: number;
  onClick?: () => void;
}

export default function CommunityRelatedPostCard({
  title,
  createdAt,
  likes,
  comments,
  views,
  onClick,
}: CommunityRelatedPostCardProps) {
  return (
    <article
      role="link"
      tabIndex={0}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("button")) return;
        onClick?.();
      }}
      onKeyDown={(event) => {
        if ((event.target as HTMLElement).closest("button")) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }}
      className="grid h-[44px] w-full cursor-pointer items-center gap-x-[8px] rounded-md border border-transparent bg-surface-subtle px-[16px] py-[12px] text-left transition-colors hover:bg-surface-muted active:border-background-500"
      style={{ gridTemplateColumns: "max-content minmax(0, 1fr) max-content" }}
    >
      <time className="text-body-sub text-secondary">{createdAt}</time>
      <span className="min-w-0 flex-1 truncate text-h5-list text-primary">{title}</span>
      <span
        className="grid items-center gap-x-[4px]"
        style={{ gridTemplateColumns: "44px 44px 52px" }}
      >
        <HeartStat count={likes} />
        <CommentStat count={comments} />
        <ViewStat count={views} />
      </span>
    </article>
  );
}
