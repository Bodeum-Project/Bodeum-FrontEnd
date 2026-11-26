interface ReviewTextAreaProps {
  value: string;
  onChange: (value: string) => void;
}

const MAX_LENGTH = 2000;

export default function ReviewTextArea({
  value,
  onChange,
}: ReviewTextAreaProps) {
  return (
    <div>
      <div className="mb-3 mt-4 flex items-center">
        <span className="text-h3-onboard text-secondary">
          후기를 작성해주세요
        </span>
        <span className="text-brand">*</span>
        <span className="ml-[4px] text-h3-onboard text-secondary">
          (최대 2000자)
        </span>
      </div>

      <div
        className={`rounded-md bg-surface-subtle px-[20px] py-[12px] ${value.length > 0
            ? "border border-transparent"
            : "border border-strong"
          }`}
      >
        <textarea
          value={value}
          maxLength={MAX_LENGTH}
          onChange={(e) => onChange(e.target.value)}
          placeholder="근거 없는 비방, 명예훼손성 발언, 특정 업체 홍보나 광고성 후기는 커뮤니티 이용 규정에 따라 예고 없이 삭제 및 제재될 수 있습니다."
          className="h-[158px] w-full resize-none border-none bg-transparent text-h2-onboard outline-none placeholder:text-secondary"
        />

        <div className="mt-1 flex justify-end text-h4-list text-tertiary">
          {value.length}/{MAX_LENGTH}
        </div>
      </div>
    </div>
  );
}