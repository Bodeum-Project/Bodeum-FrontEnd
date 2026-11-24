import { RowsSkeleton } from "@/components/skeleton/Skeleton";
import { useCallback, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { isUnauthorizedError } from "@/apis/apiError";
import AsyncState from "@/components/AsyncState";
import ButtonOutline from "@/components/button/ButtonOutline";
import {
  communityCategoryMap,
  communityCategoryCodeMap,
  getCommunityCategoryByCode,
  type CommunityCategory,
} from "@/constants/communityCategory";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useCommunityPost, useCommunityPosts } from "@/hooks/useCommunity";
import { useLoginCheck } from "@/hooks/useLoginCheck";
import { formatMonthDay } from "@/utils/time";
import CommunityCommentsSection from "./components/comments/CommunityCommentsSection";
import CommunityPostDetailCard from "./components/detail/CommunityPostDetailCard";
import CommunityRelatedPostCard from "./components/detail/CommunityRelatedPostCard";

export default function CommunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hasHandledLoginRequired = useRef(false);
  const { setBreadcrumb } = useBreadcrumb();
  const { isLoggedIn: hasDetailAccess, isPending: isAuthPending } = useLoginCheck();
  const parsedPostId = id && /^\d+$/.test(id) ? Number(id) : undefined;
  const postId =
    parsedPostId !== undefined && Number.isSafeInteger(parsedPostId) && parsedPostId > 0
      ? parsedPostId
      : undefined;
  const { data: post, isPending, isError, error: postError } = useCommunityPost(
    hasDetailAccess ? postId : undefined,
  );
  const category = post ? getCommunityCategoryByCode(post.boardType) : undefined;
  const categoryLabel = category ? communityCategoryMap[category] : "커뮤니티";

  const handleLoginRequired = useCallback(() => {
    if (hasHandledLoginRequired.current) return;
    hasHandledLoginRequired.current = true;

    navigate("/community", { replace: true, state: { showLoginModal: true } });
  }, [navigate]);

  useEffect(() => {
    if ((!isAuthPending && !hasDetailAccess) || isUnauthorizedError(postError)) {
      handleLoginRequired();
    }
  }, [handleLoginRequired, hasDetailAccess, isAuthPending, postError]);

  useEffect(() => {
    setBreadcrumb([{ label: "커뮤니티" }, { label: categoryLabel }]);

    return () => setBreadcrumb([]);
  }, [categoryLabel, setBreadcrumb]);

  if (postId === undefined) {
    return <AsyncState type="error" />;
  }

  if (isAuthPending) {
    return <AsyncState type="loading" skeleton="detail" />;
  }

  if (!hasDetailAccess || isUnauthorizedError(postError)) {
    return <div className="min-h-[calc(100vh-72px)] bg-surface-subtle" />;
  }

  if (isPending) {
    return <AsyncState type="loading" skeleton="detail" />;
  }

  if (isError || !post || !category) {
    return <AsyncState type="error" />;
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-surface-subtle px-[16px] py-[16px] md:px-[32px] md:py-[20px]">
      <div
        className="motion-fade mx-auto flex w-full flex-col gap-[18px]"
      >
        <CommunityPostDetailCard
          key={post.postId}
          post={post}
          category={category}
          onLoginRequired={handleLoginRequired}
        >
          <CommunityCommentsSection
            key={post.postId}
            postId={post.postId}
            canAdopt={post.isMine && post.boardType === "INFORMATION_QUESTION"}
            onLoginRequired={handleLoginRequired}
          />
        </CommunityPostDetailCard>

        <CommunityRelatedPostsSection
          key={post.boardType}
          currentPostId={post.postId}
          category={category}
        />
      </div>

    </div>
  );
}
interface CommunityRelatedPostsSectionProps {
  currentPostId: number;
  category: CommunityCategory;
}

function CommunityRelatedPostsSection({
  currentPostId,
  category,
}: CommunityRelatedPostsSectionProps) {
  const navigate = useNavigate();
  const { data, isPending, isError } = useCommunityPosts({
    page: 0,
    size: 6,
    sort: "latest",
    categoryCode: communityCategoryCodeMap[category],
  });
  const relatedPosts = Array.from(
    new Map(
      (data?.content ?? [])
        .filter((item) => item.postId !== currentPostId)
        .map((item) => [item.postId, item] as const),
    ).values(),
  ).slice(0, 5);

  return (
    <section className="flex flex-col gap-[14px] rounded-md border border-default bg-surface px-[16px] py-[18px] sm:px-[24px] sm:py-[20px]">
      <p className="text-h2-list text-primary">
        {communityCategoryMap[category]} 게시판의 다른 글
      </p>

      {isPending ? (
        <RowsSkeleton count={3} label="게시글을 불러오는 중입니다." />
      ) : isError ? (
        <p className="py-6 text-center text-secondary">게시글을 불러오지 못했습니다.</p>
      ) : relatedPosts.length === 0 ? (
        <p className="py-6 text-center text-secondary">같은 게시판의 다른 글이 없습니다.</p>
      ) : (
        <div className="space-y-[8px]">
          {relatedPosts.map((item) => (
            <CommunityRelatedPostCard
              key={item.postId}
              title={item.title}
              createdAt={formatMonthDay(item.createdAt)}
              likes={item.likeCount}
              comments={item.commentCount}
              views={item.viewCount}
              onClick={() => navigate(`/community/${item.postId}`)}
            />
          ))}
        </div>
      )}

      <ButtonOutline
        label="더보기"
        onClick={() =>
          navigate(`/community?categoryCode=${communityCategoryCodeMap[category]}`)
        }
        className="h-[40px] w-full"
      />
    </section>
  );
}
