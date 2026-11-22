// 리뉴얼 프리뷰용 추천 소식 썸네일 (Unsplash, 무료 라이선스).
// 실제 포스터 이미지 대신 분위기를 맞춘 사진을 소식 id 기준으로 고정 배정한다.
const ids = [
  "1503454537195-1dcabb73ffb9",
  "1516627145497-ae6968895b74",
  "1476703993599-0035a21b17a9",
  "1596464716127-f2a82984de30",
  "1607453998774-d533f65dac99",
  "1544776193-352d25ca82cd",
  "1535572290543-960a8046f5af",
  "1471286174890-9c112ffca5b4",
];

export function getNewsThumbnail(newsId: number) {
  const id = ids[Math.abs(newsId) % ids.length];
  return `https://images.unsplash.com/photo-${id}?w=480&h=300&q=70&auto=format&fit=crop`;
}
