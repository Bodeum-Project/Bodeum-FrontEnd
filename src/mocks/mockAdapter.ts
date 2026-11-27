/* 데모용 axios 어댑터: 서버 대신 샘플 데이터로 응답합니다. */
import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from "axios";

import { districtNamesByRegion, sidoNames } from "@/constants/regions";
import type { CommunityComment, CommunityPostListItem } from "@/types/community";
import type { AiMessage } from "@/types/aiChat";
import type { ParentCategory } from "@/types/info";
import type { NewsDetail, NewsListItem } from "@/types/news";
import {
  aiAnswers,
  aiFallbackAnswer,
  aiSuggestedQuestions,
  communityComments,
  communityPosts,
  daysAgo,
  infoDetails,
  infoReviews,
  mockChildAge,
  mockUser,
  newsDetails,
  recommendSubIds,
  toInfoItem,
} from "./data";

type Params = Record<string, unknown>;
type Handler = (ctx: { match: RegExpMatchArray; params: Params; body: Record<string, unknown> }) => unknown;

const ok = (result: unknown) => ({ isSuccess: true, code: "COMMON200", message: "성공", result });

const num = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const springPage = <T>(items: T[], page: number, size: number) => {
  const content = items.slice(page * size, page * size + size);
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  return {
    totalElements: items.length,
    totalPages,
    size,
    content,
    number: page,
    numberOfElements: content.length,
    first: page === 0,
    last: page >= totalPages - 1,
    empty: content.length === 0,
    sort: { empty: true, sorted: false, unsorted: true },
    pageable: {
      offset: page * size,
      sort: { empty: true, sorted: false, unsorted: true },
      paged: true,
      pageNumber: page,
      pageSize: size,
      unpaged: false,
    },
  };
};

const dDayOf = (date: string | null) => {
  if (!date) return null;
  const diff = Math.ceil((new Date(`${date}T23:59:59`).getTime() - Date.now()) / 86_400_000);
  return diff >= 0 ? diff : null;
};

/* ───────── 정보 ───────── */

const findInfo = (id: number) => infoDetails.find((item) => item.infoItemId === id) ?? infoDetails[0];

const sidoOf = (value: unknown) => (typeof value === "string" && value ? value : null);

const infoList: Handler = ({ params }) => {
  const category = (params.category as ParentCategory) || "INSTITUTION";
  const subCategory = num(params.subCategory, recommendSubIds[category]);
  const regionLevel1 = sidoOf(params.regionLevel1);
  const page = num(params.page, 0);
  const size = num(params.size, 10);

  let items = infoDetails.filter((item) => item.mainCategory === category);
  if (subCategory !== recommendSubIds[category]) {
    items = items.filter((item) => item.subCategoryId === subCategory);
  }
  if (regionLevel1) {
    items = items.filter((item) => item.sido === regionLevel1);
  }
  if (params.sort === "SCRAP" || params.sort === "scrap") {
    items = [...items].sort((a, b) => b.scrapCount - a.scrapCount);
  } else if (params.sort === "REVIEW" || params.sort === "review") {
    items = [...items].sort((a, b) => b.reviewCount - a.reviewCount);
  } else {
    items = [...items].sort((a, b) => b.viewCount - a.viewCount);
  }

  const selected = infoDetails.find((item) => item.subCategoryId === subCategory);
  return {
    selectedMainCategory: category,
    selectedMainCategoryKo: selected?.mainCategoryKo ?? "",
    selectedSubCategoryId: subCategory,
    selectedSubCategory: selected?.subCategory ?? "",
    selectedSubCategoryKo: selected?.subCategoryKo ?? "",
    items: springPage(items.map(toInfoItem), page, size),
  };
};

const infoSearch: Handler = ({ params }) => {
  const keyword = String(params.keyword ?? "").trim();
  const items = infoDetails
    .filter((item) => !keyword || item.name.includes(keyword) || item.tags?.some((tag) => tag.includes(keyword)) || item.introduction.includes(keyword))
    .slice(0, 10)
    .map((item) => ({
      infoItemId: item.infoItemId,
      name: item.name,
      category: item.mainCategory,
      categoryLabel: item.mainCategoryKo,
      regionLevel1: item.sido,
      regionLevel2: item.sigungu,
      tags: item.tags ?? [],
    }));
  return { items };
};

const infoReviewsHandler: Handler = ({ match, params }) => {
  const id = Number(match[1]);
  const reviews = infoReviews[id] ?? [];
  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  return {
    averageRating: Math.round(average * 10) / 10,
    totalElements: reviews.length,
    reviews: springPage(reviews, num(params.page, 0), num(params.size, 5)),
  };
};

/* ───────── 소식 ───────── */

const toNewsListItem = (news: NewsDetail): NewsListItem => ({
  newsId: news.newsId,
  title: news.title,
  summary: news.summary ?? "",
  region: news.region,
  categoryCode: news.categoryCode,
  categoryLabel: news.categoryLabel,
  status: news.status,
  contact: news.contact,
  sourceName: news.sourceName,
  publishedAt: news.publishedAt ?? "",
  applyEndDate: news.applyEndDate,
  thumbnailUrl: news.thumbnailUrl,
  viewCount: news.viewCount,
  scrapCount: news.scrapCount,
});

const newsList: Handler = ({ params }) => {
  const keyword = String(params.keyword ?? "").trim();
  let items = newsDetails.filter((news) => {
    if (params.newsType && news.newsType !== params.newsType) return false;
    if (params.category && news.categoryCode !== params.category) return false;
    if (params.status && news.status !== params.status) return false;
    if (keyword && !news.title.includes(keyword) && !(news.summary ?? "").includes(keyword)) return false;
    return true;
  });
  items = [...items].sort((a, b) =>
    params.sort === "SCRAP" ? b.scrapCount - a.scrapCount : params.sort === "VIEW" ? b.viewCount - a.viewCount : (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
  );
  const page = num(params.page, 0);
  const size = num(params.size, 10);
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  return {
    items: items.slice(page * size, page * size + size).map(toNewsListItem),
    page,
    size,
    totalElements: items.length,
    totalPages,
    hasNext: page < totalPages - 1,
  };
};

/* ───────── 커뮤니티 ───────── */

const toPostListItem = (post: (typeof communityPosts)[number]): CommunityPostListItem => ({
  postId: post.postId,
  boardType: post.boardType,
  anonymityType: post.anonymityType,
  title: post.title,
  content: post.content,
  isQuestion: post.isQuestion,
  author: {
    authorId: post.authorId ?? 0,
    nickname: post.authorNickname ?? "익명의 보호자",
    profileImageUrl: "",
    level: post.authorLevel ?? 1,
    badgeName: post.authorLevel && post.authorLevel >= 3 ? "든든한 이웃" : "새싹 보호자",
    isMine: post.isMine,
  },
  thumbnailUrl: post.imageUrls[0] ?? "",
  viewCount: post.viewCount,
  likeCount: post.likeCount,
  commentCount: post.commentCount,
  scrapCount: post.scrapCount,
  isLiked: post.isLiked,
  createdAt: post.createdAt,
});

const communityList: Handler = ({ params }) => {
  const keyword = String(params.keyword ?? "").trim();
  let posts = communityPosts.filter((post) => {
    if (params.categoryCode && post.boardType !== params.categoryCode) return false;
    if (keyword && !post.title.includes(keyword) && !post.content.includes(keyword)) return false;
    return true;
  });
  const sorters: Record<string, (a: (typeof posts)[number], b: (typeof posts)[number]) => number> = {
    view: (a, b) => b.viewCount - a.viewCount,
    like: (a, b) => b.likeCount - a.likeCount,
    comment: (a, b) => b.commentCount - a.commentCount,
  };
  posts = [...posts].sort(sorters[String(params.sort)] ?? ((a, b) => b.createdAt.localeCompare(a.createdAt)));
  return springPage(posts.map(toPostListItem), num(params.page, 0), num(params.size, 14));
};

const disabilityLabels: Record<string, string> = {
  AUTISM: "자폐스펙트럼",
  INTELLECTUAL_DISABILITY: "지적장애",
  BRAIN_LESION: "뇌병변장애",
  ADHD: "ADHD",
  DEVELOPMENTAL_DELAY: "발달지연",
  LANGUAGE_DISORDER: "언어장애",
  ETC: "기타",
};

const boardLabels: Record<string, string> = {
  FREE_COMMUNICATION: "자유소통",
  TREATMENT_GROWTH_RECORD: "치료 · 성장 기록",
  NEIGHBORHOOD_NEWS: "우리 동네 소식",
  INSTITUTION_CENTER_REVIEW: "기관 · 센터 후기",
  INFORMATION_QUESTION: "정보 · 질문 광장",
};

const findPost = (id: number) => communityPosts.find((post) => post.postId === id) ?? communityPosts[0];

const allComments = () => Object.values(communityComments).flat();

let nextId = 9000;

const newComment = (postId: number, content: string, parentCommentId: number | null): CommunityComment => {
  const createdAt = new Date().toISOString();
  const comment: CommunityComment = {
    commentId: (nextId += 1),
    parentCommentId,
    authorId: mockUser.userId,
    authorNickname: mockUser.nickname,
    profileImageUrl: null,
    isMine: true,
    content,
    isAccepted: false,
    likeCount: 0,
    isLiked: false,
    status: "ACTIVE",
    createdAt,
    updatedAt: createdAt,
  };
  (communityComments[postId] ??= []).push(comment);
  findPost(postId).commentCount += 1;
  return comment;
};

/* ───────── 마이페이지 ───────── */

const myPosts = () =>
  communityPosts
    .filter((post) => post.isMine)
    .map((post) => ({
      postId: post.postId,
      boardType: post.boardType,
      anonymityType: post.anonymityType,
      title: post.title,
      content: post.content,
      isQuestion: post.isQuestion,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      scrapCount: post.scrapCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

const myComments = () => {
  const seeds = [
    { postId: 301, content: "저는 진단서랑 장애인 등록 전이라 검사 결과지 같이 냈더니 바로 접수됐어요. 행정복지센터에 미리 전화해보세요!" },
    { postId: 306, content: "저희도 작년에 같은 고민 했는데 특수교육지원센터 상담 먼저 받아보시는 걸 추천드려요." },
    { postId: 309, content: "저는 치료 가는 길에 좋아하는 커피 한 잔이라도 꼭 챙겨요. 오늘도 수고 많으셨어요." },
  ];
  return seeds.map((seed, index) => {
    const post = findPost(seed.postId);
    return {
      commentId: 8000 + index,
      parentCommentId: null,
      content: seed.content,
      isAccepted: index === 0,
      likeCount: 7 - index * 2,
      createdAt: daysAgo(index * 2 + 1),
      updatedAt: daysAgo(index * 2 + 1),
      postId: post.postId,
      postBoardType: post.boardType,
      postTitle: post.title,
    };
  });
};

const myScraps: Handler = ({ params }) => {
  const type = params.type as string | undefined;
  const infoScraps = infoDetails
    .filter((item) => item.isScrapped)
    .map((item, index) => ({
      scrapId: 7000 + index,
      infoItemId: item.infoItemId,
      mainCategory: item.mainCategory,
      mainCategoryKo: item.mainCategoryKo,
      subCategory: item.subCategory,
      subCategoryKo: item.subCategoryKo,
      name: item.name,
      introduction: item.introduction,
      address: item.address,
      sido: item.sido,
      sigungu: item.sigungu,
      phone: item.phone,
      homepageUrl: item.homepageUrl,
      scrappedAt: daysAgo(index + 1),
    }));
  const newsScraps = newsDetails
    .filter((news) => news.scrapped)
    .map((news, index) => ({
      scrapId: 7100 + index,
      newsId: news.newsId,
      title: news.title,
      summary: news.summary ?? "",
      sourceName: news.sourceName ?? "",
      originalUrl: news.originalUrl ?? "",
      thumbnailUrl: news.thumbnailUrl ?? "",
      newsType: news.newsType,
      categoryCode: news.categoryCode,
      categoryLabel: news.categoryLabel,
      recruitmentStatus: news.status ?? "",
      publishedAt: news.publishedAt ?? "",
      scrappedAt: daysAgo(index),
    }));
  const postScraps = communityPosts
    .filter((post) => post.isScrapped)
    .map((post, index) => ({
      ...myPosts()[0],
      postId: post.postId,
      boardType: post.boardType,
      title: post.title,
      content: post.content,
      scrapId: 7200 + index,
      scrappedAt: daysAgo(index + 2),
    }));
  return {
    totalCount: infoScraps.length + newsScraps.length + postScraps.length,
    infoScraps: !type || type === "INFO" ? infoScraps : [],
    newsScraps: !type || type === "NEWS" ? newsScraps : [],
    postScraps: !type || type === "POST" ? postScraps : [],
  };
};

const listPage = <K extends string, T>(key: K, items: T[], params: Params) => {
  const page = num(params.page, 0);
  const size = num(params.size, 10);
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  return {
    totalCount: items.length,
    page,
    size,
    totalPages,
    hasNext: page < totalPages - 1,
    [key]: items.slice(page * size, page * size + size),
  };
};

/* ───────── AI 상담 ───────── */

const aiMessages: AiMessage[] = [];

const aiReply = (question: string): AiMessage => {
  const answer = aiAnswers.find((item) => item.keywords.some((keyword) => question.includes(keyword))) ?? aiFallbackAnswer;
  return {
    aiMessageId: (nextId += 1),
    senderType: "AI",
    answerStatus: "ANSWERED",
    content: answer.content,
    createdAt: new Date().toISOString(),
    sources: answer.sources,
    feedback: null,
    warning: null,
  };
};

const aiHistory = () => {
  const question = "장애아동수당이랑 발달재활 바우처 같이 받을 수 있어?";
  const userMessage: AiMessage = {
    aiMessageId: 5001,
    senderType: "USER",
    answerStatus: null,
    content: question,
    createdAt: daysAgo(2, 21),
    sources: [],
    feedback: null,
  };
  const aiMessage: AiMessage = {
    aiMessageId: 5002,
    senderType: "AI",
    answerStatus: "ANSWERED",
    content:
      "네, **장애아동수당**(현금 지원)과 **발달재활서비스 바우처**(치료비 지원)는 목적이 달라서 **함께 받을 수 있어요.** 다만 장애아동수당은 기초생활수급·차상위 가구가 대상이라 소득 기준을 먼저 확인해 보세요.",
    createdAt: daysAgo(2, 21),
    sources: [
      { sourceType: "INFO", sourceId: 113, sourceTitle: "장애아동수당", updatedAt: daysAgo(4) },
      { sourceType: "INFO", sourceId: 112, sourceTitle: "발달재활서비스 바우처", updatedAt: daysAgo(2) },
    ],
    feedback: { aiFeedbackId: 1, feedbackType: "HELPFUL", reasons: null },
  };
  return {
    messages: [{ date: daysAgo(2).slice(0, 10), items: [userMessage, aiMessage] }],
    nextCursor: null,
    hasNext: false,
  };
};

/* ───────── 라우팅 ───────── */

const tokens = () => ({
  tokenType: "Bearer",
  accessToken: "mock-access-token",
  refreshToken: "mock-refresh-token",
  accessTokenExpiresAt: new Date(Date.now() + 86_400_000).toISOString(),
  refreshTokenExpiresAt: new Date(Date.now() + 30 * 86_400_000).toISOString(),
});

const routes: Array<[string, RegExp, Handler]> = [
  // 인증 · 사용자
  ["POST", /^\/api\/v1\/auth\/exchange$/, () => ({ ...tokens(), userId: 1, provider: "kakao", nickname: mockUser.nickname, isNewUser: false, agreementCompleted: true, onboardingCompleted: true, nextStep: "HOME" })],
  ["POST", /^\/api\/v1\/auth\/refresh$/, () => tokens()],
  ["POST", /^\/api\/v1\/auth\/logout$/, () => null],
  ["GET", /^\/api\/v1\/users\/me\/brief$/, () => ({
    isLoggedIn: Boolean(localStorage.getItem("accessToken")),
    onboardingCompleted: true,
    nickname: mockUser.nickname,
    profileImageUrl: null,
    level: mockUser.level,
    badgeName: mockUser.badgeName,
    childDisabilityTypes: mockUser.childProfile?.disabilityTypes ?? null,
    childAge: mockChildAge,
    region: `${mockUser.regionLevel1} ${mockUser.regionLevel2}`,
  })],
  ["GET", /^\/api\/v1\/users\/me\/profile$/, () => mockUser],
  ["PATCH", /^\/api\/v1\/users\/me\/profile$/, ({ body }) => {
    if (typeof body.nickname === "string") mockUser.nickname = body.nickname;
    return { updated: true };
  }],
  ["POST", /^\/api\/v1\/users\/me\/profile-image$/, () => mockUser],
  ["GET", /^\/api\/v1\/users\/me\/onboarding-status$/, () => ({ childProfileRegistered: true, interestRegionRegistered: true, guardianProfileRegistered: true, onboardingCompleted: true, nextStep: "HOME" })],
  ["POST", /^\/api\/v1\/users\/me\/agreements$/, () => ({ serviceTermsAgreed: true, privacyPolicyAgreed: true, aiTermsAgreed: true, aiTermsAgreedAt: daysAgo(120), agreedAt: daysAgo(120), nextStep: "HOME" })],
  ["GET", /^\/api\/v1\/users\/me\/ai-terms$/, () => ({ aiTermsAgreed: true, agreedAt: daysAgo(120) })],
  ["POST", /^\/api\/v1\/users\/me\/ai-terms$/, () => ({ aiTermsAgreed: true, agreedAt: new Date().toISOString() })],
  ["GET", /^\/api\/v1\/terms\/ai-chat$/, () => ({ type: "AI_CHAT", title: "AI 상담 이용 약관", content: "AI 상담 답변은 참고용이며, 정확한 내용은 해당 기관에 확인해 주세요.", updatedAt: daysAgo(30) })],
  ["GET", /^\/api\/v1\/regions$/, () => {
    let id = 1000;
    return sidoNames.flatMap((sido) =>
      (districtNamesByRegion[sido] ?? []).map((district) => ({
        regionId: (id += 1),
        regionLevel1: sido,
        regionLevel2: district,
        fullName: `${sido} ${district}`,
      })),
    );
  }],
  ["POST", /^\/api\/v1\/onboarding\/.+$/, () => ({ step: 3, completedStep: "GUARDIAN_PROFILE", onboardingCompleted: true, nextStep: "HOME", childProfileRegistered: true, interestRegionRegistered: true, guardianProfileRegistered: true })],

  // 마이페이지
  ["GET", /^\/api\/v1\/users\/me\/dashboard$/, () => ({
    ...mockUser,
    activitySummary: {
      savedInfoCount: infoDetails.filter((item) => item.isScrapped).length + newsDetails.filter((news) => news.scrapped).length,
      myPostCount: myPosts().length,
      myCommentCount: myComments().length,
    },
  })],
  ["GET", /^\/api\/v1\/users\/me\/points$/, () => ({
    totalPoint: mockUser.point,
    activities: [
      { pointType: "POST_CREATE", label: "게시글 작성", pointPerAction: 50, earnedPoint: 400, activityCount: 8 },
      { pointType: "COMMENT_CREATE", label: "댓글 작성", pointPerAction: 10, earnedPoint: 230, activityCount: 23 },
      { pointType: "INFO_REVIEW", label: "기관 후기 작성", pointPerAction: 100, earnedPoint: 500, activityCount: 5 },
      { pointType: "COMMENT_ADOPTED", label: "답변 채택", pointPerAction: 50, earnedPoint: 150, activityCount: 3 },
    ],
  })],
  ["GET", /^\/api\/v1\/users\/me\/posts$/, ({ params }) => listPage("posts", myPosts(), params)],
  ["GET", /^\/api\/v1\/users\/me\/comments$/, ({ params }) => listPage("comments", myComments(), params)],
  ["GET", /^\/api\/v1\/users\/me\/scraps$/, myScraps],
  ["DELETE", /^\/api\/v1\/users\/me\/.+$/, () => ({ success: true })],

  // 홈
  ["GET", /^\/api\/v1\/home\/banner$/, () => {
    const news = newsDetails[0];
    return { newsId: news.newsId, title: news.title, dDay: dDayOf(news.applyEndDate) ?? 0, summary: news.summary, linkUrl: `/news/${news.newsId}` };
  }],
  ["GET", /^\/api\/v1\/info-items\/counts$/, () => {
    const count = (category: ParentCategory) => infoDetails.filter((item) => item.mainCategory === category).length;
    return { institution: count("INSTITUTION") * 214, hospital: count("HOSPITAL") * 187, welfare: count("WELFARE") * 96, employment: count("EMPLOYMENT") * 133, education: count("EDUCATION") * 78 };
  }],
  ["GET", /^\/api\/v1\/news\/recommended$/, () =>
    newsDetails
      .filter((news) => news.status === "RECRUITING")
      .slice(0, 5)
      .map((news) => {
        const [regionLevel1 = "", regionLevel2 = ""] = (news.region ?? "").split(" ");
        const dDay = dDayOf(news.applyEndDate);
        return { newsId: news.newsId, title: news.title, thumbnailUrl: news.thumbnailUrl ?? "", regionLevel1, regionLevel2, dDay: dDay === null ? null : String(dDay), status: news.status ?? "", viewCount: news.viewCount };
      })],
  ["GET", /^\/api\/v1\/home\/news\/preview$/, ({ params }) =>
    newsDetails
      .filter((news) => !params.newsType || news.newsType === params.newsType)
      .slice(0, num(params.limit, 3))
      .map((news) => {
        const [regionLevel1 = "", regionLevel2 = ""] = (news.region ?? "").split(" ");
        return { newsId: news.newsId, regionLevel1, regionLevel2, title: news.title, likeCount: news.scrapCount, viewCount: news.viewCount };
      })],
  ["GET", /^\/api\/v1\/community\/posts\/recommended$/, ({ params }) =>
    communityPosts
      .filter((post) => post.disabilityTypes.some((type) => type === "AUTISM" || type === "LANGUAGE_DISORDER"))
      .slice(0, num(params.limit, 5))
      .map((post) => ({
        postId: post.postId,
        disabilityTags: post.disabilityTypes.map((code) => ({ code, label: disabilityLabels[code] ?? code })),
        categoryName: boardLabels[post.boardType],
        authorDisplay: post.authorNickname ?? "익명의 보호자",
        title: post.title,
        content: post.content,
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        viewCount: post.viewCount,
        createdAt: post.createdAt,
      }))],
  ["GET", /^\/api\/v1\/home\/posts\/preview$/, ({ params }) =>
    [...communityPosts]
      .sort((a, b) => (params.sort === "popular" ? b.likeCount - a.likeCount : b.createdAt.localeCompare(a.createdAt)))
      .slice(0, num(params.limit, 3))
      .map((post) => ({ postId: post.postId, categoryName: boardLabels[post.boardType], regionName: "성북구", title: post.title, likeCount: post.likeCount, commentCount: post.commentCount, viewCount: post.viewCount }))],

  // 정보
  ["GET", /^\/api\/v1\/info-items\/search$/, infoSearch],
  ["GET", /^\/api\/v1\/info-items$/, infoList],
  ["GET", /^\/api\/v1\/info-items\/(\d+)\/reviews$/, infoReviewsHandler],
  ["POST", /^\/api\/v1\/info-items\/(\d+)\/reviews$/, ({ match, body }) => {
    const id = Number(match[1]);
    const review = {
      infoReviewId: (nextId += 1),
      userId: mockUser.userId,
      userNickname: mockUser.nickname,
      rating: num(body.rating, 5),
      content: String(body.content ?? ""),
      imageUrls: (body.imageUrls as string[]) ?? [],
      helpfulCount: 0,
      isHelpful: false,
      createdAt: new Date().toISOString(),
      isReceiptVerified: body.isReceiptVerified === true,
    };
    (infoReviews[id] ??= []).unshift(review);
    findInfo(id).reviewCount += 1;
    return review;
  }],
  ["POST", /^\/api\/v1\/info-items\/(\d+)\/reviews\/(\d+)\/helpful$/, ({ match }) => {
    const review = (infoReviews[Number(match[1])] ?? []).find((item) => item.infoReviewId === Number(match[2]));
    if (review) {
      review.isHelpful = !review.isHelpful;
      review.helpfulCount += review.isHelpful ? 1 : -1;
    }
    return { isHelpful: review?.isHelpful ?? false, helpfulCount: review?.helpfulCount ?? 0 };
  }],
  ["POST", /^\/api\/v1\/info-items\/(\d+)\/scrap$/, ({ match }) => {
    const item = findInfo(Number(match[1]));
    item.isScrapped = !item.isScrapped;
    item.scrapCount += item.isScrapped ? 1 : -1;
    return { isScrapped: item.isScrapped, scrapCount: item.scrapCount };
  }],
  ["POST", /^\/api\/v1\/info-items\/kakaomap-url$/, ({ body }) => ({ kakaoMapUrl: `https://map.kakao.com/link/search/${encodeURIComponent(findInfo(num(body.infoItemId, 101)).address)}` })],
  ["GET", /^\/api\/v1\/info-items\/(\d+)\/share$/, ({ match }) => ({ infoItemId: Number(match[1]), shareUrl: `${window.location.origin}/info/x/${match[1]}` })],
  ["GET", /^\/api\/v1\/info-items\/(\d+)$/, ({ match }) => findInfo(Number(match[1]))],
  ["POST", /^\/api\/v1\/info\/reviews\/images$/, () => ({ imageUrl: "/favicon-mascot.png" })],

  // 소식
  ["GET", /^\/api\/v1\/news\/search\/suggestions$/, ({ params }) => ({
    suggestions: newsDetails.filter((news) => news.title.includes(String(params.keyword ?? ""))).slice(0, 5).map((news) => ({ text: news.title, type: "NEWS_TITLE" })),
  })],
  ["GET", /^\/api\/v1\/news\/search$/, newsList],
  ["GET", /^\/api\/v1\/news$/, newsList],
  ["GET", /^\/api\/v1\/news\/(\d+)$/, ({ match }) => newsDetails.find((news) => news.newsId === Number(match[1])) ?? newsDetails[0]],
  ["POST", /^\/api\/v1\/news\/(\d+)\/scrap$/, ({ match }) => {
    const news = newsDetails.find((item) => item.newsId === Number(match[1])) ?? newsDetails[0];
    news.scrapped = !news.scrapped;
    news.scrapCount += news.scrapped ? 1 : -1;
    return { newsId: news.newsId, scrapped: news.scrapped, scrapCount: news.scrapCount };
  }],

  // 커뮤니티
  ["GET", /^\/api\/v1\/community\/posts\/search\/suggestions$/, ({ params }) => ({
    suggestions: communityPosts.filter((post) => post.title.includes(String(params.keyword ?? ""))).slice(0, 5).map((post) => ({ title: post.title, content: post.content, type: "POST_TITLE" })),
  })],
  ["GET", /^\/api\/v1\/community\/posts$/, communityList],
  ["POST", /^\/api\/v1\/community\/posts\/images$/, () => ({ imageUrl: "/favicon-mascot.png" })],
  ["POST", /^\/api\/v1\/community\/posts$/, ({ body }) => {
    const createdAt = new Date().toISOString();
    const post = {
      postId: (nextId += 1),
      authorId: mockUser.userId,
      authorNickname: body.anonymityType === "FULLY_ANONYMOUS" ? null : mockUser.nickname,
      authorLevel: mockUser.level,
      childAge: mockChildAge,
      isMine: true,
      boardType: body.boardType as (typeof communityPosts)[number]["boardType"],
      anonymityType: body.anonymityType as (typeof communityPosts)[number]["anonymityType"],
      title: String(body.title ?? ""),
      content: String(body.content ?? ""),
      isQuestion: body.boardType === "INFORMATION_QUESTION",
      viewCount: 1,
      likeCount: 0,
      isLiked: false,
      commentCount: 0,
      scrapCount: 0,
      isScrapped: false,
      disabilityTypes: (body.disabilityTypes as (typeof communityPosts)[number]["disabilityTypes"]) ?? ["AUTISM"],
      hashtags: [],
      imageUrls: (body.imageUrls as string[]) ?? [],
      createdAt,
      updatedAt: createdAt,
    };
    communityPosts.unshift(post);
    return post;
  }],
  ["GET", /^\/api\/v1\/community\/posts\/(\d+)$/, ({ match }) => findPost(Number(match[1]))],
  ["PATCH", /^\/api\/v1\/community\/posts\/(\d+)$/, ({ match, body }) => Object.assign(findPost(Number(match[1])), body)],
  ["DELETE", /^\/api\/v1\/community\/posts\/(\d+)$/, ({ match }) => {
    const index = communityPosts.findIndex((post) => post.postId === Number(match[1]));
    if (index >= 0) communityPosts.splice(index, 1);
    return null;
  }],
  ["PUT", /^\/api\/v1\/community\/posts\/(\d+)\/scraps$/, ({ match }) => {
    const post = findPost(Number(match[1]));
    if (!post.isScrapped) post.scrapCount += 1;
    post.isScrapped = true;
    return { isScrapped: true, scrapCount: post.scrapCount };
  }],
  ["DELETE", /^\/api\/v1\/community\/posts\/(\d+)\/scraps$/, ({ match }) => {
    const post = findPost(Number(match[1]));
    if (post.isScrapped) post.scrapCount -= 1;
    post.isScrapped = false;
    return { isScrapped: false, scrapCount: post.scrapCount };
  }],
  ["PUT", /^\/api\/v1\/community\/posts\/(\d+)\/likes$/, ({ match }) => {
    const post = findPost(Number(match[1]));
    if (!post.isLiked) post.likeCount += 1;
    post.isLiked = true;
    return { isLiked: true, likeCount: post.likeCount };
  }],
  ["DELETE", /^\/api\/v1\/community\/posts\/(\d+)\/likes$/, ({ match }) => {
    const post = findPost(Number(match[1]));
    if (post.isLiked) post.likeCount -= 1;
    post.isLiked = false;
    return { isLiked: false, likeCount: post.likeCount };
  }],
  ["GET", /^\/api\/v1\/community\/posts\/(\d+)\/comments$/, ({ match }) => {
    const comments = (communityComments[Number(match[1])] ?? []).map((comment) => ({ ...comment, replies: [] }));
    return { totalCount: comments.length, comments };
  }],
  ["POST", /^\/api\/v1\/community\/posts\/(\d+)\/comments$/, ({ match, body }) => newComment(Number(match[1]), String(body.content ?? ""), null)],
  ["POST", /^\/api\/v1\/community\/comments\/(\d+)\/replies$/, ({ match, body }) => {
    const parentId = Number(match[1]);
    const postId = Number(Object.entries(communityComments).find(([, list]) => list.some((comment) => comment.commentId === parentId))?.[0] ?? communityPosts[0].postId);
    return newComment(postId, String(body.content ?? ""), parentId);
  }],
  ["POST", /^\/api\/v1\/community\/comments\/(\d+)\/adopt$/, ({ match }) => {
    const comment = allComments().find((item) => item.commentId === Number(match[1]));
    if (comment) comment.isAccepted = !comment.isAccepted;
    return comment;
  }],
  ["PUT", /^\/api\/v1\/community\/comments\/(\d+)\/likes$/, ({ match }) => {
    const comment = allComments().find((item) => item.commentId === Number(match[1]));
    if (comment && !comment.isLiked) {
      comment.isLiked = true;
      comment.likeCount += 1;
    }
    return { isLiked: true, likeCount: comment?.likeCount ?? 1 };
  }],
  ["DELETE", /^\/api\/v1\/community\/comments\/(\d+)\/likes$/, ({ match }) => {
    const comment = allComments().find((item) => item.commentId === Number(match[1]));
    if (comment && comment.isLiked) {
      comment.isLiked = false;
      comment.likeCount -= 1;
    }
    return { isLiked: false, likeCount: comment?.likeCount ?? 0 };
  }],
  ["PATCH", /^\/api\/v1\/community\/comments\/(\d+)$/, ({ match, body }) => {
    const comment = allComments().find((item) => item.commentId === Number(match[1]));
    if (comment) comment.content = String(body.content ?? comment.content);
    return comment;
  }],
  ["DELETE", /^\/api\/v1\/community\/comments\/(\d+)$/, ({ match }) => {
    Object.values(communityComments).forEach((list) => {
      const index = list.findIndex((comment) => comment.commentId === Number(match[1]));
      if (index >= 0) list.splice(index, 1);
    });
    return null;
  }],

  // AI 상담
  ["GET", /^\/api\/v1\/ai\/chat-room$/, () => ({ aiChatRoomId: 1, createdAt: daysAgo(30), showGuideModal: false, hasTodayMessages: aiMessages.length > 0, hasPreviousMessages: true })],
  ["POST", /^\/api\/v1\/ai\/chat-room$/, () => ({ aiChatRoomId: 1, createdAt: new Date().toISOString(), showGuideModal: false, hasTodayMessages: false, hasPreviousMessages: true })],
  ["PATCH", /^\/api\/v1\/ai\/chat-room\/guide-confirmation$/, () => ({ lastGuideConfirmedAt: new Date().toISOString() })],
  ["POST", /^\/api\/v1\/ai\/chat-room\/starter$/, () => ({
    greeting: `안녕하세요, ${mockUser.nickname}님! 하람이에게 필요한 복지 정보, 치료 기관, 지역 소식을 찾아드릴게요. 무엇이 궁금하세요?`,
    suggestedQuestions: aiSuggestedQuestions,
  })],
  ["GET", /^\/api\/v1\/ai\/messages\/today$/, () => ({ messages: aiMessages, nextCursor: null, hasNext: false })],
  ["GET", /^\/api\/v1\/ai\/messages\/history$/, aiHistory],
  ["POST", /^\/api\/v1\/ai\/chat-room\/messages$/, ({ body }) => {
    const content = String(body.content ?? "");
    aiMessages.push({ aiMessageId: (nextId += 1), senderType: "USER", answerStatus: null, content, createdAt: new Date().toISOString(), sources: [], feedback: null });
    const aiMessage = aiReply(content);
    aiMessages.push(aiMessage);
    return { aiMessage };
  }],
  ["POST", /^\/api\/v1\/ai\/messages\/(\d+)\/feedback$/, ({ body }) => ({ aiFeedbackId: (nextId += 1), feedbackType: body.feedbackType, reasons: body.reasons ?? null })],
];

const parseBody = (data: unknown): Record<string, unknown> => {
  if (!data || data instanceof FormData) return {};
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return data as Record<string, unknown>;
};

const pathOf = (config: InternalAxiosRequestConfig) => {
  const raw = config.url ?? "";
  try {
    return new URL(raw, "http://mock.local").pathname;
  } catch {
    return raw.split("?")[0];
  }
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockAdapter: AxiosAdapter = async (config) => {
  const method = (config.method ?? "get").toUpperCase();
  const path = pathOf(config);
  const params = (config.params ?? {}) as Params;
  const body = parseBody(config.data);

  const isAiMessage = path === "/api/v1/ai/chat-room/messages";
  await wait(isAiMessage ? 1200 : 150);

  for (const [routeMethod, pattern, handler] of routes) {
    if (routeMethod !== method) continue;
    const match = path.match(pattern);
    if (!match) continue;

    const response: AxiosResponse = {
      data: ok(handler({ match, params, body })),
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
    return response;
  }

  console.warn(`[mock] 처리되지 않은 요청: ${method} ${path}`);
  return { data: ok(null), status: 200, statusText: "OK", headers: {}, config };
};

export default mockAdapter;
