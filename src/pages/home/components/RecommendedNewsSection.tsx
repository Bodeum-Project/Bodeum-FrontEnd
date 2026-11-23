import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NewsCard from "./NewsCard";
import PostListItem from "@/components/PostListItem";
import AsyncState from "@/components/AsyncState";
import SectionHeader from "@/components/ui/SectionHeader";
import SegmentedTabs from "@/components/ui/SegmentedTabs";
import { useHomeNewsPreview, useRecommendedNews } from "@/hooks/useHome";
import { useHorizontalWheel } from "@/components/ui/useHorizontalWheel";

type NewsTab = "ACTIVITY" | "LOCAL";

export default function RecommendedNewsSection() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<NewsTab>("ACTIVITY");
  const { data: activityNews = [] } = useHomeNewsPreview("ACTIVITY");
  const { data: localNews = [] } = useHomeNewsPreview("LOCAL");
  const { data: news = [], isPending, isError } = useRecommendedNews();
  const wheelRef = useHorizontalWheel<HTMLDivElement>();
  const list = tab === "ACTIVITY" ? activityNews : localNews;

  return (
    <section className="flex min-w-0 flex-col">
      <SectionHeader
        title="추천 소식 TOP 5"
        description="지역·활동별로 골라봤어요"
        onMoreClick={() => navigate("/news")}
      />

      {isPending ? (
        <AsyncState
          type="loading"
          variant="section"
          loadingText="불러오는 중입니다..."
          className="flex h-[180px] items-center justify-center text-background-400"
          textClassName=""
        />
      ) : isError ? (
        <AsyncState
          type="error"
          variant="section"
          errorText="추천 소식을 불러오지 못했습니다."
          className="flex h-[180px] items-center justify-center text-background-400"
          textClassName=""
        />
      ) : (
        <div ref={wheelRef} className="no-scrollbar -mx-[16px] flex items-start gap-[12px] overflow-x-auto px-[16px] md:-mx-[24px] md:px-[24px] lg:mx-0 lg:px-0">
          {news.map((item) => (
            <NewsCard key={item.newsId} {...item} />
          ))}
        </div>
      )}

      <div className="mt-[28px]">
        <SegmentedTabs
          value={tab}
          onChange={setTab}
          options={[
            { value: "ACTIVITY", label: "활동소식" },
            { value: "LOCAL", label: "지역소식" },
          ]}
        />
        <div className="mt-[6px]">
          {list.map((item) => (
            <PostListItem
              key={item.newsId}
              title={item.title}
              region={`${item.regionLevel1} ${item.regionLevel2}`.trim()}
              views={item.viewCount}
              onClick={() => navigate(`/news/${item.newsId}`)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => navigate(`/news?newsType=${tab}`)}
          className="mt-[4px] h-[44px] w-full cursor-pointer rounded-[12px] bg-background-200 text-[14px] font-medium text-background-500 active:bg-background-250"
        >
          {tab === "ACTIVITY" ? "활동소식" : "지역소식"} 더보기
        </button>
      </div>
    </section>
  );
}
