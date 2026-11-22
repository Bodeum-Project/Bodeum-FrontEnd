import { useNavigate } from "react-router-dom";
import type { ParentCategory } from "@/types/info";
import { infoCategoryMap } from "@/constants/infoCategory";
import { useInfoItemCounts } from "@/hooks/useHome";

const categories: ParentCategory[] = [
  "INSTITUTION",
  "HOSPITAL",
  "WELFARE",
  "EMPLOYMENT",
  "EDUCATION",
];

export default function RequiredInfoSection() {
  const navigate = useNavigate();
  const { data: counts } = useInfoItemCounts();

  const countMap: Record<ParentCategory, number> = {
    INSTITUTION: counts?.institution ?? 0,
    HOSPITAL: counts?.hospital ?? 0,
    WELFARE: counts?.welfare ?? 0,
    EMPLOYMENT: counts?.employment ?? 0,
    EDUCATION: counts?.education ?? 0,
  };

  return (
    <section
      className="-mx-[16px] -mt-[16px] px-[20px] pb-[24px] pt-[28px] md:-mx-[24px] md:px-[28px] lg:mx-0 lg:mt-0 lg:rounded-[24px] lg:px-[32px] lg:pt-[32px]"
      style={{ backgroundImage: "var(--gradient-hero)" }}
    >
      <p className="text-[14px] font-semibold text-main-500">우리 아이를 위한 정보</p>
      <h1 className="mt-[6px] text-[24px] font-bold leading-[33px] tracking-[-0.03em] text-background-600">
        필요한 정보를
        <br />
        한 번에 찾아보세요
      </h1>

      <div className="mt-[24px] grid grid-cols-5 gap-[8px] sm:flex sm:gap-[16px]">
        {categories.map((type) => {
          const { label, icon: Icon, textColor } = infoCategoryMap[type];

          return (
            <button
              key={type}
              type="button"
              onClick={() => navigate(`/info?category=${type}`)}
              className="group flex min-w-0 cursor-pointer flex-col items-center gap-[8px] sm:w-[88px]"
            >
              <span
                className={`flex aspect-square w-full max-w-[64px] items-center justify-center rounded-[20px] bg-background-100 shadow-[0_4px_16px_rgb(20_23_31_/_0.06)] transition-transform group-active:scale-95 ${textColor}`}
              >
                <Icon className="h-[30px] w-[30px]" />
              </span>
              <span className="flex flex-col items-center leading-none">
                <span className="text-[14px] font-semibold text-background-600">{label}</span>
                <span className="mt-[4px] text-[11px] text-background-400">
                  {countMap[type].toLocaleString()}곳
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
