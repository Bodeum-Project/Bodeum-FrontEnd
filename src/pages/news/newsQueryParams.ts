import { ALL_CATEGORIES_VALUE, type NewsCategoryFilter } from "./components/NewsToolbar";
import { ALL_REGIONS_VALUE } from "./components/RegionOnboardingBox";
import type { NewsCategory, NewsSort, NewsStatus, NewsType } from "@/types/news";
import type { NewsTabValue } from "./components/NewsTabs";

export const newsTypeByTab: Record<NewsTabValue, NewsType> = {
  activity: "ACTIVITY",
  region: "LOCAL",
};

export const getInitialTab = (newsType: string | null): NewsTabValue =>
  newsType === "LOCAL" ? "region" : "activity";

export const isNewsSort = (value: string | null): value is NewsSort =>
  value === "VIEW" || value === "SCRAP";

export const isNewsCategory = (value: string | null): value is NewsCategory =>
  value === "LOCAL_NEWS" ||
  value === "LOCAL_POLICY" ||
  value === "RECRUITMENT_PARTICIPATION" ||
  value === "EDUCATION_SEMINAR" ||
  value === "BENEFIT_WELFARE_SERVICE";

export const isNewsStatus = (value: string | null): value is NewsStatus =>
  value === "RECRUITING" || value === "CLOSED" || value === "ALWAYS_OPEN" || value === "UPCOMING";

export const getQuerySort = (value: string | null): NewsSort | "" =>
  isNewsSort(value) ? value : "";

export const getQueryCategory = (value: string | null): NewsCategoryFilter =>
  value === ALL_CATEGORIES_VALUE || isNewsCategory(value) ? (value as NewsCategoryFilter) : "";

export const getQueryStatus = (value: string | null): NewsStatus | undefined =>
  isNewsStatus(value) ? value : undefined;

export const getQueryPage = (value: string | null) => {
  const page = Number(value);

  return Number.isSafeInteger(page) && page >= 1 ? page : 1;
};

// 소식 탭에서 고른 지역을 세션 동안 기억한다 (정보 탭의 info-region-* 와 같은 방식).
// 다른 탭에 갔다가 쿼리 없이 /news 로 돌아와도 프로필 지역으로 초기화되지 않도록 한다.
const NEWS_REGION_LEVEL1_KEY = "news-region-level1";
const NEWS_REGION_LEVEL2_KEY = "news-region-level2";

export const saveNewsRegion = (regionLevel1: string | null, regionLevel2: string | null) => {
  try {
    if (!regionLevel1) {
      sessionStorage.removeItem(NEWS_REGION_LEVEL1_KEY);
      sessionStorage.removeItem(NEWS_REGION_LEVEL2_KEY);
      return;
    }
    sessionStorage.setItem(NEWS_REGION_LEVEL1_KEY, regionLevel1);
    if (regionLevel2) sessionStorage.setItem(NEWS_REGION_LEVEL2_KEY, regionLevel2);
    else sessionStorage.removeItem(NEWS_REGION_LEVEL2_KEY);
  } catch {
    // sessionStorage 를 쓸 수 없는 환경에서는 URL 쿼리만 사용한다.
  }
};

const getSavedNewsRegion = () => {
  try {
    return {
      regionLevel1: sessionStorage.getItem(NEWS_REGION_LEVEL1_KEY)?.trim() || undefined,
      regionLevel2: sessionStorage.getItem(NEWS_REGION_LEVEL2_KEY)?.trim() || undefined,
    };
  } catch {
    return { regionLevel1: undefined, regionLevel2: undefined };
  }
};

export const parseInitialRegion = (searchParams: URLSearchParams) => {
  const queryRegionLevel1 = searchParams.get("regionLevel1")?.trim() || undefined;
  const saved = queryRegionLevel1 ? undefined : getSavedNewsRegion();
  const regionLevel1 = queryRegionLevel1 ?? saved?.regionLevel1;
  const regionLevel2 =
    regionLevel1 === ALL_REGIONS_VALUE
      ? undefined
      : queryRegionLevel1
        ? searchParams.get("regionLevel2")?.trim() || undefined
        : saved?.regionLevel2;
  const region =
    regionLevel1 === ALL_REGIONS_VALUE
      ? ALL_REGIONS_VALUE
      : [regionLevel1, regionLevel2].filter(Boolean).join(" ");

  return { regionLevel1, regionLevel2, region };
};
