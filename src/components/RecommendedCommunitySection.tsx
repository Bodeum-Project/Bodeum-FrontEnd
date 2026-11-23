import { CardRowSkeleton } from "@/components/skeleton/Skeleton";
import CommunityCard from "@/components/CommunityCard";
import { useDragScroll } from "@/hooks/useDragScroll";
import { useRecommendedCommunityPosts } from "@/hooks/useHome";
import { useHorizontalWheel } from "@/components/ui/useHorizontalWheel";

interface RecommendedCommunitySectionProps {
  onPostClick?: (postId: number) => void;
}

export default function RecommendedCommunitySection({
  onPostClick,
}: RecommendedCommunitySectionProps) {
  const { data: posts = [], isPending, isError } =
    useRecommendedCommunityPosts();

  const wheelRef = useHorizontalWheel<HTMLDivElement>();

  const {
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleClickCapture,
  } = useDragScroll();

  if (isPending) {
    return (
      <CardRowSkeleton count={4} label="게시글을 불러오는 중입니다." />
    );
  }

  if (isError) {
    return (
      <p className="py-6 text-center text-background-500">
        게시글을 불러오지 못했습니다.
      </p>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="py-6 text-center text-background-500">
        추천 게시글이 없습니다.
      </p>
    );
  }

  return (
    <div
      ref={wheelRef}
      className={`drag-scroll no-scrollbar overflow-x-auto ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClickCapture={handleClickCapture}
    >
      <div className="inline-flex gap-4">
        {posts.map((post) => (
          <CommunityCard
            key={post.postId}
            {...post}
            onClick={() => onPostClick?.(post.postId)}
          />
        ))}
      </div>
    </div>
  );
}