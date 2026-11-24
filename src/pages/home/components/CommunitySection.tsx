import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostListItem from "@/components/PostListItem";
import SectionHeader from "@/components/ui/SectionHeader";
import SegmentedTabs from "@/components/ui/SegmentedTabs";
import { useHomePostPreview } from "@/hooks/useHome";
import { hasStoredAuthSession } from "@/apis/authStorage";
import RecommendedCommunitySection from "@/components/RecommendedCommunitySection";
import LoginRequiredModal from "@/components/modal/LoginRequiredModal";

type PostTab = "popular" | "latest";

export default function CommunitySection() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<PostTab>("popular");
  const { data: popularPosts = [] } = useHomePostPreview("popular");
  const { data: latestPosts = [] } = useHomePostPreview("latest");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const list = tab === "popular" ? popularPosts : latestPosts;

  const handleWriteClick = () => {
    if (!hasStoredAuthSession()) {
      setIsLoginModalOpen(true);
      return;
    }

    navigate("/community/write");
  };

  return (
    <section className="w-full min-w-0">
      <SectionHeader
        title="커뮤니티 이야기"
        description="다른 부모님들의 경험을 나눠요"
        right={
          <button
            type="button"
            onClick={handleWriteClick}
            className="flex shrink-0 cursor-pointer items-center gap-[4px] rounded-full btn-dark px-[12px] py-[7px] text-[13px] font-semibold"
          >
            <span className="text-[15px] leading-none">+</span> 글쓰기
          </button>
        }
      />

      <div className="-mx-[16px] px-[16px] md:-mx-[24px] md:px-[24px] lg:mx-0 lg:px-0">
        <RecommendedCommunitySection
          onPostClick={(postId) => navigate(`/community/${postId}`)}
        />
      </div>

      <div className="mt-[28px]">
        <SegmentedTabs
          value={tab}
          onChange={setTab}
          options={[
            { value: "popular", label: "인기글" },
            { value: "latest", label: "최신글" },
          ]}
        />
        <div className="motion-stagger mt-[6px]">
          {list.map((post) => (
            <PostListItem
              key={post.postId}
              title={post.title}
              region={post.categoryName}
              likes={post.likeCount}
              talks={post.commentCount}
              views={post.viewCount}
              onClick={() => navigate(`/community/${post.postId}`)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => navigate(`/community?sort=${tab === "popular" ? "view" : "latest"}`)}
          className="mt-[4px] h-[44px] w-full cursor-pointer rounded-[12px] bg-background-200 text-[14px] font-medium text-background-500 active:bg-background-250"
        >
          커뮤니티 전체보기
        </button>
      </div>

      <LoginRequiredModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </section>
  );
}
