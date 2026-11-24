import { useState } from "react";
import StarFilledIcon from "@/assets/icons/Star.svg?react";
import StarOutlineIcon from "@/assets/icons/StarOutline.svg?react";

interface RatingInputProps {
  value: number;
  onChange: (rating: number) => void;
}

export default function RatingInput({
  value,
  onChange,
}: RatingInputProps) {
  const [hover, setHover] = useState<number | null>(null);

  const current = hover ?? value;

  return (
    <div>
      <div className="mb-[12px] flex items-center">
        <span className="text-h3-onboard text-secondary">
          별점을 남겨주세요
        </span>
        <span className="text-brand">*</span>
      </div>

      <div
        className="flex items-center"
        onMouseLeave={() => setHover(null)}
      >
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const Icon =
              star <= current ? StarFilledIcon : StarOutlineIcon;

            return (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHover(star)}
                onClick={() => onChange(star)}
                className="transition-transform hover:scale-110"
              >
                <Icon className="h-6 w-6" />
              </button>
            );
          })}
        </div>

        <span className="ml-[12px] text-h2-onboard text-brand">
          {current}
        </span>
      </div>
    </div>
  );
}