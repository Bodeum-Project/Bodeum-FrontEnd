export type ModerationAction = "report" | "block";

/** 신고·차단 대상 (게시글·댓글·후기) */
export type ModerationTarget = "post" | "comment" | "review";

export const moderationTargetLabel: Record<ModerationTarget, string> = {
  post: "게시글",
  comment: "댓글",
  review: "후기",
};

export interface ModerationReason {
  value: string;
  label: string;
}

export const ETC_REASON = "ETC";

// 사유 목록은 운영정책 확정 전 임시안입니다. API 연동 시 서버 enum 에 맞춰 value 를 교체하세요.
export const reportReasons: ModerationReason[] = [
  { value: "SPAM", label: "스팸·광고·홍보" },
  { value: "ABUSE", label: "욕설·비하·혐오 표현" },
  { value: "PRIVACY", label: "개인정보 노출" },
  { value: "MISINFORMATION", label: "잘못된 의료·복지 정보" },
  { value: "OBSCENE", label: "음란·불쾌한 내용" },
  { value: ETC_REASON, label: "기타 (직접 입력)" },
];

export const blockReasons: ModerationReason[] = [
  { value: "OFFENSIVE", label: "불쾌한 글이나 댓글을 써요" },
  { value: "HARASSMENT", label: "반복적으로 괴롭히거나 따라다녀요" },
  { value: "SPAM", label: "스팸·광고성 활동을 해요" },
  { value: ETC_REASON, label: "기타 (직접 입력)" },
];
