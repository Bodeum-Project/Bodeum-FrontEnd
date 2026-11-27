import type { ReceiptInfo } from "./receiptTypes";

export type ParseResult =
  | { status: "success"; receipt: ReceiptInfo }
  | { status: "mismatch"; receipt: ReceiptInfo }
  | { status: "fail" };

/**
 * 영수증 정보 추출 (목업).
 * 서버에 영수증 인식(OCR) API 가 아직 없어서, 잠깐 분석하는 척한 뒤
 * 현재 기관 이름과 지금 시각으로 성공 결과를 돌려준다.
 * 화면 확인용으로 주소 끝에 ?result=fail 또는 ?result=mismatch 를 붙이면 예외 화면이 나온다.
 */
export async function parseReceipt(
  imageUrl: string | null,
  storeName: string,
  forced: string | null,
): Promise<ParseResult> {
  await new Promise((resolve) => window.setTimeout(resolve, 1800));

  const visitedAt = new Date(Date.now() - 1000 * 60 * 47).toISOString();
  const amount = 12000 + (storeName.length % 5) * 1500;

  if (forced === "fail") return { status: "fail" };
  if (forced === "mismatch") {
    return {
      status: "mismatch",
      receipt: { storeName: "튼튼약국 성북점", visitedAt, amount: 8400, imageUrl },
    };
  }
  return { status: "success", receipt: { storeName, visitedAt, amount, imageUrl } };
}
