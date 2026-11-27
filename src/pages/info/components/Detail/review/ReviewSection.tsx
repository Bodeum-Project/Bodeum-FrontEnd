import MessageIcon from "@/assets/icons/Community.svg?react";
import Section from "../Section";
import EmptyReview from "./EmptyReview";
import ReviewSummary from "./ReviewSummary";
import ReviewCard from "./ReviewCard";
import ButtonOutline from "@/components/button/ButtonOutline";
import { useState } from "react";
import { IS_MOCK_MODE } from "@/mocks/isMockMode";
import ReceiptReviewBanner from "./ReceiptReviewBanner";

interface Review {
  infoReviewId: number;
  userId: number;
  userNickname: string;
  rating: number;
  content: string;
  imageUrls: string[];
  isHelpful: boolean;
  helpfulCount: number;
  createdAt: string;
  isReceiptVerified?: boolean;
}

interface ReviewSectionProps {
  infoItemId: number;
  reviews: Review[];
  totalReviewCount: number;
  averageRating: number;
  onWriteReview: () => void;
  onReceiptReview?: () => void;
}

const INITIAL_COUNT = 3;

export default function ReviewSection({
  reviews,
  totalReviewCount,
  averageRating,
  onWriteReview,
  onReceiptReview,
  infoItemId
}: ReviewSectionProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const visibleReviews = reviews.slice(0, visibleCount);
  const remainCount = Math.max(0, totalReviewCount - visibleCount);

  return (
    <Section
      icon={<MessageIcon />}
      title={
        <>
          <span className="text-h2-list text-primary">후기 </span>
          <span className="text-h2-list text-brand">
            {reviews.length}
            <span className="text-h2-list text-primary">개</span>
          </span>
        </>
      }
    >
      {IS_MOCK_MODE && onReceiptReview && (
        <ReceiptReviewBanner onStart={onReceiptReview} />
      )}

      {reviews.length === 0 ? (
        <EmptyReview onWriteReview={onWriteReview} />
      ) : (
        <>
          <ReviewSummary
            averageRating={averageRating}
            totalReviewCount={totalReviewCount}
            onWriteReview={onWriteReview}
          />

          <div className="my-[14px] flex flex-col">
            {visibleReviews.map((review) => (
              <ReviewCard
                key={review.infoReviewId}
                infoItemId={infoItemId}
                review={review}
              />
            ))}
          </div>
            
          {remainCount > 0 && (
            <ButtonOutline
              onClick={() => setVisibleCount((prev) => prev + INITIAL_COUNT)}
              label={`후기 ${Math.min(INITIAL_COUNT, remainCount)}개 더보기`}
              size="L"
            />
          )}
        </>
      )}
    </Section>
  );
}