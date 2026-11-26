import RecommendedCommunitySection from "@/components/RecommendedCommunitySection";
import SectionHeader from "@/components/ui/SectionHeader";
import { useNavigate } from "react-router-dom";

interface CommunitySectionProps {
  onWriteClick: () => void;
  onPostClick: (postId: number) => void;
}

export default function CommunitySection({ onWriteClick }: CommunitySectionProps) {
  const navigate = useNavigate();

  return (
    <section className="w-full min-w-0 overflow-hidden">
      <SectionHeader
        title="커뮤니티 이야기"
        description="다른 부모님들의 경험을 나눠요"
        right={
          <button
            type="button"
            onClick={onWriteClick}
            className="flex shrink-0 cursor-pointer items-center gap-[4px] rounded-full btn-dark px-[14px] py-[8px] text-[13px] font-semibold"
          >
            <span className="text-[15px] leading-none">+</span> 글쓰기
          </button>
        }
      />

      <RecommendedCommunitySection
        onPostClick={(postId) => navigate(`/community/${postId}`)}
      />
    </section>
  );
}
