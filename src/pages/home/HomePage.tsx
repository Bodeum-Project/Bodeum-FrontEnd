import AiPromoCard from "./components/AiPromoCard";
import CommunitySection from "./components/CommunitySection";
import NoticeBanner from "./components/NoticeBanner";
import RecommendedNewsSection from "./components/RecommendedNewsSection";
import RequiredInfoSection from "./components/RequiredInfoSection";

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background-100">
      <div className="mx-auto mb-[24px] flex max-w-[960px] flex-col px-[16px] py-[16px] md:px-[24px] lg:mb-[44px] lg:px-[32px] lg:py-[24px]">
        <RequiredInfoSection />

        <div className="mt-[8px] flex flex-col gap-[12px]">
          <NoticeBanner />
          <AiPromoCard />
        </div>

        <div className="my-[28px] h-[8px] -mx-[16px] bg-background-200 md:-mx-[24px] lg:hidden" />
        <div className="hidden lg:block lg:h-[40px]" />

        <RecommendedNewsSection />

        <div className="my-[28px] h-[8px] -mx-[16px] bg-background-200 md:-mx-[24px] lg:hidden" />
        <div className="hidden lg:block lg:h-[40px]" />

        <CommunitySection />
      </div>
    </div>
  );
}
