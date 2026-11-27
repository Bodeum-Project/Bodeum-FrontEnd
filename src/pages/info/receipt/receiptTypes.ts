/** 영수증에서 추출한 방문 인증 정보 (서버 OCR API 확정 전까지는 목데이터로 채움) */
export interface ReceiptInfo {
  storeName: string;
  visitedAt: string;
  amount: number;
  /** 촬영한 영수증 이미지 (data URL). 샘플 영수증일 때는 null */
  imageUrl: string | null;
}

/** 후기 작성 화면 ↔ 영수증 촬영 화면 사이에서 작성 중인 내용을 지키기 위한 값 */
export interface ReviewDraft {
  rating: number;
  content: string;
  images: File[];
}

export interface ReceiptRouteState {
  from?: "write" | "detail";
  draft?: ReviewDraft;
  receipt?: ReceiptInfo;
}

export const formatReceiptDate = (iso: string) => {
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const formatWon = (amount: number) => `${amount.toLocaleString("ko-KR")}원`;
