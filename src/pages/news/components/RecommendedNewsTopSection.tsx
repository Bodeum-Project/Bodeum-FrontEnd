import { useRecommendedNews } from "@/hooks/useHome";
import NewsCard from "@/pages/home/components/NewsCard";
import AsyncState from "@/components/AsyncState";
import SectionHeader from "@/components/ui/SectionHeader";

export default function RecommendedNewsTopSection() {
  const { data: news = [], isPending, isError } = useRecommendedNews();

  if (isPending) {
    return (
      <AsyncState
        type="loading"
        variant="section"
        loadingText="추천 소식을 불러오는 중입니다..."
        className="flex h-[220px] items-center justify-center text-h6 text-background-500"
        textClassName=""
      />
    )
  }

  if (isError) {
    return (
      <AsyncState
        type="error"
        variant="section"
        errorText="추천 소식을 불러오지 못했습니다."
        className="flex h-[220px] items-center justify-center text-h6 text-background-500"
        textClassName=""
      />
    );
  }

  return (
    <section className="flex shrink-0 flex-col">
      <SectionHeader title="추천 소식 TOP 5" description="지역·활동별로 골라봤어요" />

      <div className="no-scrollbar -mx-[16px] flex gap-[12px] overflow-x-auto px-[16px] md:-mx-[24px] md:px-[24px] lg:mx-0 lg:px-0">
        {news.map((item) => (
          <NewsCard key={item.newsId} {...item} />
        ))}
      </div>
    </section>
  );
}
