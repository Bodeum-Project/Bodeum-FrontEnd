/* 데모용 샘플 데이터. 실제 서비스 데이터가 아닙니다. */
import type { InfoDetail, InfoItem, InfoReview, ParentCategory } from "@/types/info";
import type { NewsCategory, NewsDetail, NewsStatus, NewsType } from "@/types/news";
import type { CommunityComment, CommunityPostDetail } from "@/types/community";
import type { CommunityCategoryCode } from "@/constants/communityCategory";
import type { DiagnosisType } from "@/types/diagnosis";
import type { UserProfile } from "@/types/user";
import type { AiMessage } from "@/types/aiChat";

const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();

export const daysAgo = (days: number, hour = 10) => {
  const date = new Date(now - days * DAY);
  date.setHours(hour, (days * 17) % 60, 0, 0);
  return date.toISOString();
};

export const dateAfter = (days: number) =>
  new Date(now + days * DAY).toISOString().slice(0, 10);

export const dateBefore = (days: number) =>
  new Date(now - days * DAY).toISOString().slice(0, 10);

/* ───────────── 사용자 ───────────── */

export const mockUser: UserProfile = {
  userId: 1,
  nickname: "하람맘",
  email: "demo@bodeum.site",
  provider: "kakao",
  profileImageUrl: null,
  point: 1280,
  level: 3,
  badgeName: "든든한 이웃",
  levelDescription: "경험을 나누며 다른 보호자에게 힘이 되어주고 있어요.",
  childProfile: {
    nickname: "하람",
    birth: "2019-04-01",
    disabilityTypes: [
      { code: "AUTISM", label: "자폐스펙트럼" },
      { code: "LANGUAGE_DISORDER", label: "언어장애" },
    ],
  },
  keywordText: "언어치료, 감각통합, 초등 입학 준비",
  interestCategories: [
    { code: "WELFARE_SUBSIDY", label: "복지·지원금" },
    { code: "GROWTH_EDUCATION", label: "성장·교육" },
  ],
  regionId: 1008,
  regionLevel1: "서울특별시",
  regionLevel2: "성북구",
  guardianNickname: "하람맘",
  guardianType: "PARENT",
  communityRoleType: "EXPERIENCE_SHARER",
  joinedAt: daysAgo(120),
  updatedAt: daysAgo(3),
};

export const mockChildAge = 7;

/* ───────────── 정보(INFO) ───────────── */

type InfoSeed = {
  name: string;
  main: ParentCategory;
  subId: number;
  address: string;
  sido: string;
  sigungu: string;
  phone: string;
  intro: string;
  tags: string[];
  hours?: "weekday" | "always" | "weekdaySat";
};

const mainKo: Record<ParentCategory, string> = {
  INSTITUTION: "기관",
  HOSPITAL: "병원",
  WELFARE: "복지",
  EMPLOYMENT: "취업",
  EDUCATION: "교육",
};

const subCategories: Record<number, { value: string; label: string }> = {
  1: { value: "HOSPITAL_ETC", label: "병원 추천" },
  2: { value: "GENERAL_HOSPITAL", label: "병원" },
  3: { value: "PRIMARY_CARE", label: "건강주치의" },
  4: { value: "EMERGENCY_CLINIC", label: "응급의료기관" },
  5: { value: "INSTITUTION_ETC", label: "기관 추천" },
  6: { value: "THERAPY_REHAB", label: "치료·재활기관" },
  7: { value: "WELFARE_CENTER", label: "장애인 복지관" },
  8: { value: "YOUTH_CENTER", label: "청소년 수련관" },
  9: { value: "FAMILY_SUPPORT", label: "장애인가족지원센터" },
  10: { value: "WELFARE_ETC", label: "복지 추천" },
  11: { value: "PRIVATE_WELFARE", label: "민간 복지 서비스" },
  12: { value: "NATIONAL_WELFARE", label: "국가 복지 서비스" },
  13: { value: "LOCAL_WELFARE", label: "지역 복지 서비스" },
  14: { value: "EDUCATION_ETC", label: "교육 추천" },
  15: { value: "SPECIAL_SCHOOL", label: "특수 학교 현황" },
  16: { value: "SPECIAL_EDU_SUPPORT", label: "특수 교육 지원 센터" },
  17: { value: "LIFELONG_EDU", label: "장애인 평생 교육 기관" },
  18: { value: "EMPLOYMENT_ETC", label: "취업 추천" },
  19: { value: "REALTIME_JOB", label: "실시간 구인 정보" },
  20: { value: "KEAD_JOB", label: "KEAD 취업 정보" },
  21: { value: "STANDARD_WORKPLACE", label: "장애인 표준 사업장" },
};

export const recommendSubIds: Record<ParentCategory, number> = {
  HOSPITAL: 1,
  INSTITUTION: 5,
  WELFARE: 10,
  EDUCATION: 14,
  EMPLOYMENT: 18,
};

const infoSeeds: InfoSeed[] = [
  // 기관
  { name: "성북 아이숲 발달센터", main: "INSTITUTION", subId: 6, address: "서울특별시 성북구 보문로 112, 3층", sido: "서울특별시", sigungu: "성북구", phone: "02-921-1004", intro: "언어치료·감각통합·놀이치료를 한 곳에서 받을 수 있는 아동 발달 전문 센터입니다. 발달재활서비스 바우처 사용이 가능하며, 초기 상담 후 아이에게 맞는 치료 계획을 함께 세웁니다.", tags: ["언어치료", "감각통합", "바우처 가능"], hours: "weekdaySat" },
  { name: "한빛 언어심리치료실", main: "INSTITUTION", subId: 6, address: "서울특별시 성북구 동소문로 47, 2층", sido: "서울특별시", sigungu: "성북구", phone: "02-953-2580", intro: "1:1 언어치료와 부모 코칭을 함께 진행합니다. 치료 후 10분 부모 상담으로 가정에서 이어갈 수 있는 활동을 안내합니다.", tags: ["언어치료", "부모상담", "주말 운영"], hours: "weekdaySat" },
  { name: "성북구 장애인종합복지관", main: "INSTITUTION", subId: 7, address: "서울특별시 성북구 화랑로 211", sido: "서울특별시", sigungu: "성북구", phone: "02-909-7100", intro: "장애아동 방과후 활동, 가족 상담, 보조기기 대여 등 지역 장애인과 가족을 위한 종합 서비스를 제공합니다.", tags: ["방과후", "가족상담", "보조기기"], hours: "weekday" },
  { name: "강북 아동발달지원센터", main: "INSTITUTION", subId: 6, address: "서울특별시 강북구 도봉로 89길 15", sido: "서울특별시", sigungu: "강북구", phone: "02-987-3311", intro: "작업치료와 인지학습치료 중심의 소규모 센터입니다. 대기 기간이 짧아 빠른 시작이 필요한 가정에 추천합니다.", tags: ["작업치료", "인지치료", "대기 짧음"], hours: "weekdaySat" },
  { name: "성북구 장애인가족지원센터", main: "INSTITUTION", subId: 9, address: "서울특별시 성북구 삼양로 23", sido: "서울특별시", sigungu: "성북구", phone: "02-6952-0815", intro: "장애인 가족의 돌봄 부담을 덜기 위한 휴식 지원, 자조모임, 형제자매 프로그램을 운영합니다.", tags: ["휴식지원", "자조모임", "형제자매"], hours: "weekday" },
  { name: "노원 장애인복지관", main: "INSTITUTION", subId: 7, address: "서울특별시 노원구 덕릉로 70길 99", sido: "서울특별시", sigungu: "노원구", phone: "02-950-0114", intro: "아동 재활치료실, 사회성 그룹 프로그램, 보호자 교육을 운영하는 지역 복지관입니다.", tags: ["사회성그룹", "보호자교육"], hours: "weekday" },
  // 병원
  { name: "서울 하늘어린이병원 재활의학과", main: "HOSPITAL", subId: 2, address: "서울특별시 성북구 인촌로 73", sido: "서울특별시", sigungu: "성북구", phone: "02-920-5114", intro: "소아 재활의학 전문의 진료와 발달 평가를 제공합니다. 장애 진단서 및 발달재활서비스 의뢰서 발급이 가능합니다.", tags: ["발달평가", "진단서 발급", "소아재활"], hours: "weekdaySat" },
  { name: "마음숲 소아청소년정신건강의학과", main: "HOSPITAL", subId: 2, address: "서울특별시 성북구 성북로 31, 4층", sido: "서울특별시", sigungu: "성북구", phone: "02-747-0275", intro: "ADHD·자폐스펙트럼 평가와 약물 상담, 부모 상담을 진행합니다. 초진은 예약제로 운영됩니다.", tags: ["ADHD", "자폐평가", "예약제"], hours: "weekdaySat" },
  { name: "성북 열린가정의원 (장애인 건강주치의)", main: "HOSPITAL", subId: 3, address: "서울특별시 성북구 정릉로 120", sido: "서울특별시", sigungu: "성북구", phone: "02-914-8275", intro: "장애인 건강주치의 시범사업 참여 의원입니다. 만성질환·장애 관리 상담과 방문 진료를 받을 수 있습니다.", tags: ["건강주치의", "방문진료"], hours: "weekday" },
  { name: "고려 아동 응급진료센터", main: "HOSPITAL", subId: 4, address: "서울특별시 성북구 고려대로 73", sido: "서울특별시", sigungu: "성북구", phone: "02-920-5555", intro: "24시간 소아 응급진료를 운영합니다. 감각 예민 아동을 위한 조용한 대기 공간을 마련했습니다.", tags: ["24시간", "소아응급"], hours: "always" },
  { name: "튼튼 소아치과", main: "HOSPITAL", subId: 2, address: "서울특별시 강북구 솔매로 42", sido: "서울특별시", sigungu: "강북구", phone: "02-984-2875", intro: "장애아동 치과 진료 경험이 많은 소아치과입니다. 진료 전 병원 적응 방문을 할 수 있습니다.", tags: ["장애인치과", "적응방문"], hours: "weekdaySat" },
  // 복지
  { name: "발달재활서비스 바우처", main: "WELFARE", subId: 12, address: "주소지 읍·면·동 행정복지센터 신청", sido: "서울특별시", sigungu: "성북구", phone: "129", intro: "만 18세 미만 장애아동에게 언어·미술·음악·놀이·감각 등 재활치료 비용을 월 14만~25만 원 지원합니다. 소득 기준에 따라 본인부담금이 달라집니다.", tags: ["월 최대 25만원", "만 18세 미만", "바우처"], hours: "weekday" },
  { name: "장애아동수당", main: "WELFARE", subId: 12, address: "주소지 읍·면·동 행정복지센터 신청", sido: "서울특별시", sigungu: "성북구", phone: "129", intro: "기초생활수급자·차상위계층 장애아동에게 장애 정도에 따라 매월 수당을 지급합니다.", tags: ["현금지원", "수급·차상위"], hours: "weekday" },
  { name: "장애인 활동지원서비스", main: "WELFARE", subId: 12, address: "국민연금공단 지사 또는 행정복지센터 신청", sido: "서울특별시", sigungu: "성북구", phone: "1544-1730", intro: "만 6세 이상 장애인에게 활동지원사의 신체·가사·이동 지원을 제공합니다. 서비스 지원 종합조사로 시간이 결정됩니다.", tags: ["만 6세 이상", "활동지원사"], hours: "weekday" },
  { name: "성북구 장애아동 돌봄 휴식지원", main: "WELFARE", subId: 13, address: "성북구청 장애인복지과", sido: "서울특별시", sigungu: "성북구", phone: "02-2241-3700", intro: "장애아동 가정에 단기 돌봄과 가족 휴식 프로그램 비용을 지원하는 성북구 자체 사업입니다.", tags: ["성북구", "돌봄", "휴식"], hours: "weekday" },
  { name: "서울시 장애아동 의료비 지원", main: "WELFARE", subId: 13, address: "주소지 보건소 신청", sido: "서울특별시", sigungu: "성북구", phone: "120", intro: "서울시 거주 장애아동의 재활 관련 의료비 본인부담금 일부를 지원합니다.", tags: ["서울시", "의료비"], hours: "weekday" },
  { name: "희망나눔 보조기기 지원사업", main: "WELFARE", subId: 11, address: "온라인 신청", sido: "서울특별시", sigungu: "성북구", phone: "02-3471-1200", intro: "민간 재단이 운영하는 장애아동 보조기기(자세유지기구, 의사소통 보조기기 등) 구입비 지원 사업입니다.", tags: ["민간지원", "보조기기"], hours: "weekday" },
  // 교육
  { name: "성북강북교육지원청 특수교육지원센터", main: "EDUCATION", subId: 16, address: "서울특별시 성북구 삼선교로 10", sido: "서울특별시", sigungu: "성북구", phone: "02-3394-2560", intro: "특수교육대상자 진단·평가, 순회교육, 치료지원, 통합교육 상담을 담당합니다. 초등 입학 전 상담을 받을 수 있습니다.", tags: ["진단평가", "입학상담", "치료지원"], hours: "weekday" },
  { name: "서울 정인학교", main: "EDUCATION", subId: 15, address: "서울특별시 성북구 아리랑로 19", sido: "서울특별시", sigungu: "성북구", phone: "02-929-0461", intro: "유치부부터 고등부까지 운영하는 지적장애 특수학교입니다. 방과후 돌봄교실을 함께 운영합니다.", tags: ["특수학교", "유치부", "방과후"], hours: "weekday" },
  { name: "성북 늘배움 평생교육센터", main: "EDUCATION", subId: 17, address: "서울특별시 성북구 종암로 25", sido: "서울특별시", sigungu: "성북구", phone: "02-921-7705", intro: "발달장애 청소년·성인을 위한 생활기술, 직업 탐색, 여가 프로그램을 운영합니다.", tags: ["평생교육", "청소년", "여가"], hours: "weekday" },
  { name: "강북 통합교육 부모아카데미", main: "EDUCATION", subId: 14, address: "서울특별시 강북구 한천로 1001", sido: "서울특별시", sigungu: "강북구", phone: "02-985-1350", intro: "통합학급 진학을 준비하는 보호자를 위한 월례 강의와 개별화교육계획(IEP) 작성 워크숍입니다.", tags: ["IEP", "부모교육"], hours: "weekday" },
  // 취업
  { name: "한국장애인고용공단 서울북부지사", main: "EMPLOYMENT", subId: 20, address: "서울특별시 노원구 노해로 437", sido: "서울특별시", sigungu: "노원구", phone: "02-3400-0700", intro: "발달장애인 맞춤훈련, 취업 알선, 직무지도원 지원 서비스를 제공합니다.", tags: ["KEAD", "맞춤훈련", "직무지도"], hours: "weekday" },
  { name: "카페 온새미로 (장애인 표준사업장)", main: "EMPLOYMENT", subId: 21, address: "서울특별시 성북구 보문로 34길 8", sido: "서울특별시", sigungu: "성북구", phone: "02-926-0412", intro: "발달장애 청년 바리스타가 일하는 표준사업장입니다. 매년 상·하반기 바리스타 인턴을 모집합니다.", tags: ["표준사업장", "바리스타", "인턴"], hours: "weekdaySat" },
  { name: "발달장애인 사무보조 채용 (구립도서관)", main: "EMPLOYMENT", subId: 19, address: "서울특별시 성북구 화랑로 18길 6", sido: "서울특별시", sigungu: "성북구", phone: "02-962-5000", intro: "도서 정리·대출 보조 업무, 주 20시간 근무, 직무지도원 동행 가능. 만 18세 이상 발달장애인 대상 채용입니다.", tags: ["채용중", "주 20시간", "만 18세 이상"], hours: "weekday" },
];

const businessHoursOf = (type: InfoSeed["hours"]) => {
  const weekdays = ["월요일", "화요일", "수요일", "목요일", "금요일"];
  if (type === "always") {
    return [...weekdays, "토요일", "일요일"].map((dayOfWeek) => ({
      dayOfWeek,
      openTime: "00:00",
      closeTime: "23:59",
    }));
  }
  const hours = weekdays.map((dayOfWeek) => ({
    dayOfWeek,
    openTime: "09:00",
    closeTime: type === "weekdaySat" ? "19:00" : "18:00",
  }));
  if (type === "weekdaySat") {
    hours.push({ dayOfWeek: "토요일", openTime: "09:00", closeTime: "14:00" });
  }
  return hours;
};

export const infoDetails: InfoDetail[] = infoSeeds.map((seed, index) => {
  const id = 101 + index;
  const sub = subCategories[seed.subId];
  return {
    infoItemId: id,
    name: seed.name,
    introduction: seed.intro,
    mainCategory: seed.main,
    mainCategoryKo: mainKo[seed.main],
    subCategoryId: seed.subId,
    subCategory: sub.value,
    subCategoryKo: sub.label,
    address: seed.address,
    sido: seed.sido,
    sigungu: seed.sigungu,
    phone: seed.phone,
    homepageUrl: "https://bodeum.site",
    viewCount: 320 + ((index * 137) % 900),
    scrapCount: 18 + ((index * 29) % 120),
    reviewCount: 0,
    isScrapped: index % 4 === 0,
    tags: seed.tags,
    businessHours: businessHoursOf(seed.hours),
  };
});

export const toInfoItem = (detail: InfoDetail): InfoItem => ({
  infoItemId: detail.infoItemId,
  name: detail.name,
  mainCategory: detail.mainCategory,
  mainCategoryKo: detail.mainCategoryKo,
  subCategoryId: detail.subCategoryId,
  subCategory: detail.subCategory,
  subCategoryKo: detail.subCategoryKo,
  address: detail.address,
  sido: detail.sido,
  sigungu: detail.sigungu,
  phone: detail.phone,
  homepageUrl: detail.homepageUrl,
  viewCount: detail.viewCount,
  scrapCount: detail.scrapCount,
  reviewCount: detail.reviewCount,
  tags: detail.tags ?? [],
});

const reviewTexts = [
  { rating: 5, content: "상담 선생님이 아이 상태를 꼼꼼히 물어봐 주시고, 처음 가는 곳이라 긴장했는데 대기실도 조용해서 아이가 편해했어요. 바우처 신청 방법도 자세히 알려주셨습니다." },
  { rating: 5, content: "3개월 다녔는데 발음이 눈에 띄게 좋아졌어요. 수업 끝나고 집에서 할 수 있는 놀이를 알려주셔서 도움이 많이 됩니다." },
  { rating: 4, content: "선생님들은 정말 좋은데 주차가 조금 불편해요. 대중교통 이용하시는 분께는 추천합니다." },
  { rating: 4, content: "대기가 두 달 정도 있었지만 기다린 보람이 있었어요. 아이 성향에 맞춰 수업을 조정해 주십니다." },
  { rating: 5, content: "보듬에서 후기 보고 찾아갔는데 정말 만족해요. 서류 준비할 것도 미리 정리해서 알려주셨어요." },
  { rating: 3, content: "프로그램은 괜찮은데 토요일 예약이 빨리 마감돼요. 평일 오후 시간대가 여유 있습니다." },
];

const reviewerNames = ["봄이엄마", "도윤아빠", "서진맘", "온유네", "지후할머니", "라온맘"];

export const infoReviews: Record<number, InfoReview[]> = {};

infoDetails.forEach((detail, index) => {
  const count = detail.mainCategory === "EMPLOYMENT" ? 1 : 2 + (index % 4);
  infoReviews[detail.infoItemId] = Array.from({ length: count }, (_, i) => {
    const text = reviewTexts[(index + i) % reviewTexts.length];
    return {
      infoReviewId: detail.infoItemId * 10 + i,
      userId: 10 + i,
      userNickname: reviewerNames[(index + i) % reviewerNames.length],
      rating: text.rating,
      content: text.content,
      imageUrls: [],
      helpfulCount: 12 - i * 3 + (index % 3),
      isHelpful: i === 0 && index % 2 === 0,
      createdAt: daysAgo(3 + i * 9 + (index % 5)),
      isReceiptVerified: i === 0 || (i + index) % 3 === 0,
    };
  });
  detail.reviewCount = infoReviews[detail.infoItemId].length;
});

/* ───────────── 소식(NEWS) ───────────── */

type NewsSeed = {
  title: string;
  summary: string;
  type: NewsType;
  category: NewsCategory;
  status: NewsStatus;
  region: string;
  source: string;
  publishedDaysAgo: number;
  applyEndInDays: number | null;
  target: string;
};

const newsCategoryLabel: Record<NewsCategory, string> = {
  LOCAL_NEWS: "지역 소식",
  LOCAL_POLICY: "지역 정책",
  RECRUITMENT_PARTICIPATION: "모집·참여",
  EDUCATION_SEMINAR: "교육·세미나",
  BENEFIT_WELFARE_SERVICE: "혜택·복지 서비스",
  INSTITUTION_NOTICE_NEWS: "기관 공지·소식",
};

const newsSeeds: NewsSeed[] = [
  { title: "2027년 발달재활서비스 바우처 신규 신청 안내", summary: "만 18세 미만 장애아동 대상 발달재활서비스 바우처 2027년 상반기 신규 신청을 받습니다. 월 최대 25만 원까지 지원됩니다.", type: "LOCAL", category: "BENEFIT_WELFARE_SERVICE", status: "RECRUITING", region: "서울특별시 성북구", source: "성북구청", publishedDaysAgo: 2, applyEndInDays: 5, target: "만 18세 미만 장애아동 및 보호자" },
  { title: "겨울방학 장애아동 감각놀이 캠프 참가자 모집", summary: "성북구 장애인종합복지관에서 초등 장애아동 20명을 대상으로 4주간 감각통합 놀이 캠프를 운영합니다.", type: "ACTIVITY", category: "RECRUITMENT_PARTICIPATION", status: "RECRUITING", region: "서울특별시 성북구", source: "성북구 장애인종합복지관", publishedDaysAgo: 3, applyEndInDays: 9, target: "초등학교 1~4학년 장애아동" },
  { title: "보호자 마음쉼 프로그램 '오늘은 나를 위해'", summary: "장애아동 보호자를 위한 6회기 심리 회복 집단 프로그램입니다. 프로그램 시간 동안 아동 돌봄을 지원합니다.", type: "ACTIVITY", category: "RECRUITMENT_PARTICIPATION", status: "RECRUITING", region: "서울특별시 성북구", source: "성북구 장애인가족지원센터", publishedDaysAgo: 5, applyEndInDays: 12, target: "장애아동 주 양육자" },
  { title: "초등 입학 준비 설명회: 특수학급과 통합학급 선택", summary: "특수교육지원센터가 2027학년도 초등 입학 예정 아동 보호자를 위해 배치 절차와 준비 서류를 안내합니다.", type: "ACTIVITY", category: "EDUCATION_SEMINAR", status: "UPCOMING", region: "서울특별시 성북구", source: "성북강북교육지원청", publishedDaysAgo: 1, applyEndInDays: 15, target: "2027학년도 초등 입학 예정 아동 보호자" },
  { title: "서울시 장애아동 의료비 지원 대상 확대", summary: "서울시가 내년부터 장애아동 재활 의료비 지원 소득 기준을 중위소득 120%에서 150%로 확대합니다.", type: "LOCAL", category: "LOCAL_POLICY", status: "ALWAYS_OPEN", region: "서울특별시", source: "서울특별시", publishedDaysAgo: 4, applyEndInDays: null, target: "서울시 거주 장애아동 가구" },
  { title: "성북구 장애인 가족 휴식지원 2차 신청", summary: "가족 여행·문화 체험 비용을 가구당 최대 40만 원 지원합니다. 선착순 마감이니 서둘러 신청하세요.", type: "LOCAL", category: "BENEFIT_WELFARE_SERVICE", status: "RECRUITING", region: "서울특별시 성북구", source: "성북구청", publishedDaysAgo: 6, applyEndInDays: 3, target: "성북구 거주 장애인 가족" },
  { title: "형제자매 마음캠프 '우리도 주인공'", summary: "장애아동의 비장애 형제자매(초등~중등)를 위한 1박 2일 캠프입니다.", type: "ACTIVITY", category: "RECRUITMENT_PARTICIPATION", status: "RECRUITING", region: "서울특별시 노원구", source: "노원 장애인복지관", publishedDaysAgo: 7, applyEndInDays: 18, target: "장애아동의 형제자매" },
  { title: "보조기기 무료 점검·수리의 날", summary: "휠체어, 자세유지기구 등 아동 보조기기를 무료로 점검하고 간단한 수리를 해드립니다.", type: "LOCAL", category: "INSTITUTION_NOTICE_NEWS", status: "UPCOMING", region: "서울특별시 성북구", source: "성북구 장애인종합복지관", publishedDaysAgo: 8, applyEndInDays: 10, target: "보조기기 사용 아동 및 가족" },
  { title: "발달장애 아동 부모 교육: 문제행동 이해와 대처", summary: "응용행동분석(ABA) 전문가가 가정에서 바로 쓸 수 있는 행동 지원 전략을 알려드립니다.", type: "ACTIVITY", category: "EDUCATION_SEMINAR", status: "RECRUITING", region: "서울특별시 강북구", source: "강북 아동발달지원센터", publishedDaysAgo: 9, applyEndInDays: 7, target: "발달장애 아동 보호자" },
  { title: "장애인 활동지원 서비스 단가 인상 안내", summary: "내년 1월부터 활동지원 서비스 시간당 단가가 인상되며 본인부담금 기준도 일부 조정됩니다.", type: "LOCAL", category: "LOCAL_POLICY", status: "ALWAYS_OPEN", region: "서울특별시", source: "보건복지부", publishedDaysAgo: 11, applyEndInDays: null, target: "활동지원 서비스 이용자" },
  { title: "주말 가족 나들이 '함께 걷는 성북천'", summary: "장애아동 가족과 자원봉사자가 함께하는 성북천 산책 및 생태 체험 행사입니다.", type: "ACTIVITY", category: "LOCAL_NEWS", status: "CLOSED", region: "서울특별시 성북구", source: "성북구 자원봉사센터", publishedDaysAgo: 20, applyEndInDays: -6, target: "장애아동 가족 누구나" },
  { title: "발달장애 청년 바리스타 인턴 모집", summary: "장애인 표준사업장 카페에서 근무할 발달장애 청년 바리스타 인턴 4명을 모집합니다.", type: "ACTIVITY", category: "RECRUITMENT_PARTICIPATION", status: "RECRUITING", region: "서울특별시 성북구", source: "카페 온새미로", publishedDaysAgo: 4, applyEndInDays: 14, target: "만 18~34세 발달장애 청년" },
];

export const newsDetails: NewsDetail[] = newsSeeds.map((seed, index) => {
  const id = 201 + index;
  const applyEnd =
    seed.applyEndInDays === null
      ? null
      : seed.applyEndInDays >= 0
        ? dateAfter(seed.applyEndInDays)
        : dateBefore(-seed.applyEndInDays);
  return {
    newsId: id,
    title: seed.title,
    summary: seed.summary,
    content: `${seed.summary}\n\n■ 대상: ${seed.target}\n■ 신청 방법: 방문 또는 전화 접수 (${seed.source})\n■ 준비 서류: 장애인 등록증 또는 진단서 사본, 신청서 1부\n\n자세한 내용은 기관에 문의해 주세요.`,
    region: seed.region,
    categoryCode: seed.category,
    categoryLabel: newsCategoryLabel[seed.category],
    sourceName: seed.source,
    originalUrl: "https://bodeum.site",
    thumbnailUrl: null,
    newsType: seed.type,
    status: seed.status,
    targetAudience: seed.target,
    contact: "02-2241-3700",
    manager: `${seed.source} 담당자`,
    publishedAt: dateBefore(seed.publishedDaysAgo),
    programStartDate: applyEnd ? dateAfter(Math.max(seed.applyEndInDays ?? 0, 0) + 7) : null,
    programEndDate: applyEnd ? dateAfter(Math.max(seed.applyEndInDays ?? 0, 0) + 35) : null,
    applyStartDate: dateBefore(seed.publishedDaysAgo),
    applyEndDate: applyEnd,
    viewCount: 1480 - index * 97,
    scrapCount: 86 - index * 6,
    scrapped: index === 0 || index === 2,
  };
});

/* ───────────── 커뮤니티 ───────────── */

type PostSeed = {
  boardType: CommunityCategoryCode;
  title: string;
  content: string;
  author: string;
  level: number;
  childAge: number;
  disabilities: DiagnosisType[];
  anonymous?: boolean;
  isQuestion?: boolean;
  hashtags: string[];
  daysAgo: number;
  mine?: boolean;
};

const postSeeds: PostSeed[] = [
  { boardType: "INFORMATION_QUESTION", title: "발달재활 바우처 처음 신청하는데 서류 뭐 챙겨야 하나요?", content: "아이가 이번에 자폐스펙트럼 진단을 받았어요. 동사무소에 바우처 신청하러 가려는데 진단서 말고 더 필요한 게 있을까요? 처음이라 막막하네요.", author: "새싹맘", level: 1, childAge: 4, disabilities: ["AUTISM"], isQuestion: true, hashtags: ["바우처", "첫신청"], daysAgo: 0 },
  { boardType: "TREATMENT_GROWTH_RECORD", title: "언어치료 6개월 기록: 두 단어 문장이 나오기 시작했어요", content: "처음엔 '물'만 하던 아이가 이제 '물 줘', '엄마 가' 처럼 두 단어를 붙여 말해요. 치료실에서 알려준 기다려주기 연습이 제일 효과 있었던 것 같아요. 같은 고민 하시는 분들께 힘이 되었으면 해서 남겨요.", author: "하람맘", level: 3, childAge: 7, disabilities: ["AUTISM", "LANGUAGE_DISORDER"], hashtags: ["언어치료", "성장기록"], daysAgo: 1, mine: true },
  { boardType: "INSTITUTION_CENTER_REVIEW", title: "성북 아이숲 발달센터 3개월 다닌 솔직 후기", content: "감각통합 주 2회 다니고 있어요. 선생님이 매 수업 끝나고 10분씩 피드백 주시는 게 정말 좋아요. 대기는 한 달 정도였고 바우처 사용 가능합니다.", author: "도윤아빠", level: 2, childAge: 6, disabilities: ["DEVELOPMENTAL_DELAY"], hashtags: ["감각통합", "센터후기"], daysAgo: 2 },
  { boardType: "FREE_COMMUNICATION", title: "오늘 처음으로 아이랑 마트에서 끝까지 장 봤어요", content: "소리에 예민해서 마트는 늘 10분을 못 버텼는데, 오늘은 헤드폰 쓰고 장보기 목록 그림카드 들고 갔더니 끝까지 해냈어요. 별거 아닌 것 같아도 너무 기뻐서 자랑하고 싶었어요.", author: "익명의 보호자", level: 2, childAge: 5, disabilities: ["AUTISM"], anonymous: true, hashtags: ["작은성공", "감각예민"], daysAgo: 2 },
  { boardType: "NEIGHBORHOOD_NEWS", title: "성북구 가족 휴식지원 2차 신청 시작했어요 (선착순)", content: "구청 홈페이지에 공고 올라왔어요. 가구당 최대 40만 원이고 선착순이라 빨리 마감될 것 같아요. 보듬 소식 탭에도 올라와 있습니다.", author: "온유네", level: 4, childAge: 9, disabilities: ["INTELLECTUAL_DISABILITY"], hashtags: ["성북구", "휴식지원"], daysAgo: 3 },
  { boardType: "INFORMATION_QUESTION", title: "초등 입학 앞두고 특수학급 vs 통합학급 고민이에요", content: "내년에 초등학교 입학하는데 특수교육대상자 선정 신청을 해야 할지 고민입니다. 먼저 겪으신 선배 부모님들 경험 듣고 싶어요.", author: "서진맘", level: 2, childAge: 7, disabilities: ["ADHD"], isQuestion: true, hashtags: ["초등입학", "특수학급"], daysAgo: 4 },
  { boardType: "TREATMENT_GROWTH_RECORD", title: "감각통합 1년, 그네를 혼자 탈 수 있게 됐어요", content: "처음에는 발이 땅에서 떨어지는 걸 무서워했는데 1년 동안 천천히 단계를 밟았어요. 오늘 놀이터에서 혼자 그네 타는 걸 보고 울컥했네요.", author: "라온맘", level: 3, childAge: 8, disabilities: ["DEVELOPMENTAL_DELAY"], hashtags: ["감각통합", "1년기록"], daysAgo: 5 },
  { boardType: "INSTITUTION_CENTER_REVIEW", title: "튼튼 소아치과 적응 방문 후기", content: "치과를 정말 무서워하는 아이인데 진료 전에 두 번 적응 방문을 하게 해주셨어요. 결국 오늘 스케일링까지 성공! 장애아동 진료 경험이 많으신 게 느껴졌어요.", author: "지후할머니", level: 2, childAge: 10, disabilities: ["INTELLECTUAL_DISABILITY"], hashtags: ["치과", "적응방문"], daysAgo: 6 },
  { boardType: "FREE_COMMUNICATION", title: "지친 날엔 어떻게 마음을 추스르세요?", content: "요즘 치료 일정이랑 직장 병행이 너무 버거워요. 다들 지칠 때 어떻게 버티시는지, 작은 팁이라도 나눠주시면 감사하겠습니다.", author: "익명의 보호자", level: 1, childAge: 6, disabilities: ["AUTISM"], anonymous: true, hashtags: ["보호자마음", "번아웃"], daysAgo: 7 },
  { boardType: "INFORMATION_QUESTION", title: "활동지원 서비스 종합조사 받을 때 팁 있을까요?", content: "다음 주에 국민연금공단에서 방문 조사를 나온다고 해요. 평소 생활 모습을 어떻게 설명해야 하는지 경험 있으신 분 조언 부탁드려요.", author: "봄이엄마", level: 2, childAge: 8, disabilities: ["BRAIN_LESION"], isQuestion: true, hashtags: ["활동지원", "종합조사"], daysAgo: 9 },
  { boardType: "NEIGHBORHOOD_NEWS", title: "보조기기 무료 점검의 날 다녀왔어요", content: "복지관에서 휠체어 바퀴 교체랑 자세유지기구 조절을 무료로 해주셨어요. 다음 달에도 한다고 하니 필요하신 분들 꼭 가보세요.", author: "봄이엄마", level: 2, childAge: 8, disabilities: ["BRAIN_LESION"], hashtags: ["보조기기", "복지관"], daysAgo: 12 },
  { boardType: "TREATMENT_GROWTH_RECORD", title: "그림카드로 하루 일정 알려주기, 3주 해본 결과", content: "아침마다 그림카드로 오늘 일정을 같이 붙여요. 전환할 때 울던 횟수가 확실히 줄었어요. 제가 쓰는 카드 구성 공유합니다.", author: "하람맘", level: 3, childAge: 7, disabilities: ["AUTISM", "LANGUAGE_DISORDER"], hashtags: ["시각일정표", "그림카드"], daysAgo: 14, mine: true },
];

export const communityPosts: CommunityPostDetail[] = postSeeds.map((seed, index) => {
  const id = 301 + index;
  const createdAt = daysAgo(seed.daysAgo, 9 + (index % 10));
  return {
    postId: id,
    authorId: seed.mine ? mockUser.userId : 20 + index,
    authorNickname: seed.anonymous ? null : seed.mine ? mockUser.nickname : seed.author,
    authorLevel: seed.anonymous ? null : seed.level,
    childAge: seed.childAge,
    isMine: Boolean(seed.mine),
    boardType: seed.boardType,
    anonymityType: seed.anonymous ? "FULLY_ANONYMOUS" : "PROFILE_TAG_VISIBLE",
    title: seed.title,
    content: seed.content,
    isQuestion: Boolean(seed.isQuestion),
    viewCount: 640 - index * 41,
    likeCount: 48 - index * 3,
    isLiked: index % 3 === 1,
    commentCount: 0,
    scrapCount: 21 - index,
    isScrapped: index === 2,
    disabilityTypes: seed.disabilities,
    hashtags: seed.hashtags,
    imageUrls: [],
    createdAt,
    updatedAt: createdAt,
  };
});

const commentPool = [
  { author: "온유네", content: "저도 같은 고민 했었어요. 행정복지센터 가기 전에 전화로 필요한 서류 먼저 확인하시면 두 번 걸음 안 하셔도 돼요!" },
  { author: "라온맘", content: "읽으면서 저도 같이 뭉클했어요. 꾸준히 해오신 시간이 보이네요. 응원합니다." },
  { author: "도윤아빠", content: "좋은 정보 감사합니다. 저장해두고 저희 아이한테도 적용해볼게요." },
  { author: "서진맘", content: "혹시 치료 시간대는 언제로 하셨어요? 저희는 하원 후라 아이가 많이 피곤해해서요." },
  { author: "지후할머니", content: "손주 키우면서 이런 정보 찾기가 늘 어려웠는데 여기 와서 많이 배워요." },
];

export const communityComments: Record<number, CommunityComment[]> = {};

communityPosts.forEach((post, index) => {
  const count = 1 + (index % 4);
  const comments: CommunityComment[] = [];
  for (let i = 0; i < count; i += 1) {
    const pool = commentPool[(index + i) % commentPool.length];
    const commentId = post.postId * 10 + i;
    const createdAt = new Date(new Date(post.createdAt).getTime() + (i + 1) * 3_600_000).toISOString();
    comments.push({
      commentId,
      parentCommentId: null,
      authorId: 40 + i,
      authorNickname: pool.author,
      profileImageUrl: null,
      isMine: false,
      content: pool.content,
      isAccepted: post.isQuestion && i === 0,
      likeCount: 9 - i * 2,
      isLiked: false,
      status: "ACTIVE",
      createdAt,
      updatedAt: createdAt,
    });
  }
  if (index % 3 === 0 && comments[0]) {
    const replyAt = new Date(new Date(comments[0].createdAt).getTime() + 1_800_000).toISOString();
    comments.push({
      commentId: post.postId * 10 + 9,
      parentCommentId: comments[0].commentId,
      authorId: post.authorId ?? 0,
      authorNickname: post.authorNickname ?? "작성자",
      profileImageUrl: null,
      isMine: post.isMine,
      content: "답변 정말 감사해요! 큰 도움이 됐어요 🙏",
      isAccepted: false,
      likeCount: 2,
      isLiked: false,
      status: "ACTIVE",
      createdAt: replyAt,
      updatedAt: replyAt,
    });
  }
  communityComments[post.postId] = comments;
  post.commentCount = comments.length;
});

/* ───────────── AI 상담 ───────────── */

export const aiSuggestedQuestions = [
  "성북구에서 바우처로 언어치료 받을 수 있는 곳 알려줘",
  "발달재활서비스 바우처 신청 서류가 뭐야?",
  "초등 입학 전에 특수교육대상자 신청은 언제 해?",
];

type AiAnswer = {
  keywords: string[];
  content: string;
  sources: AiMessage["sources"];
};

export const aiAnswers: AiAnswer[] = [
  {
    keywords: ["언어치료", "치료실", "센터", "기관"],
    content:
      "성북구에서 **발달재활서비스 바우처**로 언어치료를 받을 수 있는 곳을 정리했어요.\n\n1. **성북 아이숲 발달센터** (보문로)\n   - 언어치료·감각통합·놀이치료, 토요일 오전 운영\n2. **한빛 언어심리치료실** (동소문로)\n   - 1:1 언어치료 + 치료 후 부모 코칭 10분\n\n두 곳 모두 대기가 있을 수 있으니 **전화로 대기 기간을 먼저 확인**해 보시는 걸 추천드려요. 다른 보호자들의 후기는 각 기관 상세 페이지에서 볼 수 있어요.",
    sources: [
      { sourceType: "INFO", sourceId: 101, sourceTitle: "성북 아이숲 발달센터", updatedAt: daysAgo(3) },
      { sourceType: "INFO", sourceId: 102, sourceTitle: "한빛 언어심리치료실", updatedAt: daysAgo(5) },
    ],
  },
  {
    keywords: ["바우처", "서류", "신청", "발달재활"],
    content:
      "**발달재활서비스 바우처** 신청은 주소지 읍·면·동 **행정복지센터**에서 할 수 있어요.\n\n**준비 서류**\n- 사회서비스 이용 신청서 (센터 비치)\n- 장애인 등록증, 또는 만 6세 미만은 **의사 진단서·검사자료**\n- 소득 확인 서류 (건강보험료 납부확인서 등)\n\n지원 금액은 소득 기준에 따라 **월 14만~25만 원**이고, 승인까지 보통 2~4주 걸려요. 지금 2027년 상반기 신규 신청이 진행 중이니 소식 탭의 안내도 함께 확인해 보세요.",
    sources: [
      { sourceType: "INFO", sourceId: 112, sourceTitle: "발달재활서비스 바우처", updatedAt: daysAgo(2) },
      { sourceType: "NEWS", sourceId: 201, sourceTitle: "2027년 발달재활서비스 바우처 신규 신청 안내", updatedAt: daysAgo(2) },
    ],
  },
  {
    keywords: ["입학", "특수교육", "학교", "학급"],
    content:
      "초등 입학 예정이라면 보통 **입학 전년도 가을~겨울**에 특수교육대상자 선정 신청을 해요.\n\n- 신청처: **성북강북교육지원청 특수교육지원센터**\n- 절차: 신청 → 진단·평가 → 선정 및 배치(특수학교 / 특수학급 / 일반학급)\n- 배치 결과에 따라 통합학급에서 지원 인력, 치료지원을 받을 수 있어요\n\n다음 달에 열리는 **초등 입학 준비 설명회**에서 배치 절차와 서류를 자세히 안내한다고 하니 참석을 추천드려요.",
    sources: [
      { sourceType: "INFO", sourceId: 118, sourceTitle: "성북강북교육지원청 특수교육지원센터", updatedAt: daysAgo(6) },
      { sourceType: "NEWS", sourceId: 204, sourceTitle: "초등 입학 준비 설명회: 특수학급과 통합학급 선택", updatedAt: daysAgo(1) },
    ],
  },
];

export const aiFallbackAnswer: AiAnswer = {
  keywords: [],
  content:
    "질문해 주셔서 감사해요. 보듬에 등록된 복지 정보와 지역 소식을 바탕으로 찾아봤어요.\n\n- 아이의 **나이와 거주 지역**을 알려주시면 받을 수 있는 지원을 더 정확히 안내해 드릴 수 있어요.\n- 비슷한 경험을 한 보호자들의 이야기는 **커뮤니티 > 정보·질문 광장**에서 확인할 수 있어요.\n\n궁금한 점을 조금 더 구체적으로 물어봐 주세요!",
  sources: [{ sourceType: "INFO", sourceId: 112, sourceTitle: "발달재활서비스 바우처", updatedAt: daysAgo(2) }],
};
