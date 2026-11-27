import { formatWon } from "./receiptTypes";

interface Props {
  storeName: string;
  className?: string;
}

/** 카메라가 없는 환경(데모 캡처)에서 촬영 화면에 대신 보여주는 샘플 영수증 */
export default function SampleReceipt({ storeName, className = "" }: Props) {
  const now = new Date(Date.now() - 1000 * 60 * 47);
  const pad = (value: number) => String(value).padStart(2, "0");
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const items = [
    { name: "초기 상담", price: 7000 },
    { name: "발달 평가", price: 5000 + (storeName.length % 5) * 1500 },
  ];
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div
      className={`receipt-paper relative mx-auto w-full bg-white px-[16px] pb-[22px] pt-[16px] font-mono text-[10.5px] leading-[16px] text-[#2A3546] ${className}`}
      aria-hidden="true"
    >
      <p className="text-center text-[13px] font-bold leading-[18px]">{storeName}</p>
      <p className="mt-[2px] text-center text-[9.5px] text-[#566173]">사업자번호 123-45-67890</p>
      <div className="my-[8px] border-t border-dashed border-[#9AA3B2]" />
      <p>일시 {date}</p>
      <p>승인 30174822</p>
      <div className="my-[8px] border-t border-dashed border-[#9AA3B2]" />
      {items.map((item) => (
        <p key={item.name} className="flex justify-between">
          <span>{item.name}</span>
          <span>{formatWon(item.price)}</span>
        </p>
      ))}
      <div className="my-[8px] border-t border-dashed border-[#9AA3B2]" />
      <p className="flex justify-between text-[12px] font-bold">
        <span>합계</span>
        <span>{formatWon(total)}</span>
      </p>
      <p className="mt-[10px] text-center text-[9.5px] text-[#566173]">감사합니다</p>
    </div>
  );
}
