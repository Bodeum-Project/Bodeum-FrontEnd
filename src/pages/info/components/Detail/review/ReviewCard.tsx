import { toggleReviewHelpful } from "@/apis/infoApi";
import ProfileIcon from "@/assets/icons/Profile.svg?react";
import StarIcon from "@/assets/icons/Star.svg?react";
import FeedbackButton from "@/components/button/FeedbackButton";
import { showToast } from "@/components/Toast";
import { formatDate } from "@/utils/time";
import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/apis/userApi";
import ModerationMenu from "@/components/moderation/ModerationMenu";
import { useUserBrief } from "@/hooks/useUser";
import { queryKeys } from "@/queries/queryKeys";

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
  /** 영수증 방문 인증 여부 — 서버 필드 확정 전까지는 내려오지 않으면 배지를 숨긴다 */
  isReceiptVerified?: boolean;
}

interface Props {
  infoItemId: number;
  review: Review;
}

export default function ReviewCard({ infoItemId, review }: Props) {
  const [isHelpful, setIsHelpful] = useState(review.isHelpful);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const { data: brief } = useUserBrief();
  const isLoggedIn = brief?.isLoggedIn === true;
  const { data: myProfile } = useQuery({
    queryKey: queryKeys.user.profile,
    queryFn: getMyProfile,
    staleTime: 1000 * 60 * 10,
    enabled: isLoggedIn,
  });
  const isMine = isLoggedIn && myProfile?.userId === review.userId;

  useEffect(() => {
    setIsHelpful(review.isHelpful);
    setHelpfulCount(review.helpfulCount);
  }, [review.isHelpful, review.helpfulCount]);

  const handleHelpful = async () => {
    try {
      const result = await toggleReviewHelpful(
        infoItemId,
        review.infoReviewId,
      );

      setIsHelpful(result.isHelpful);
      setHelpfulCount(result.helpfulCount);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showToast(
          "red",
          error.response?.data?.message ?? "도움돼요 등록에 실패했습니다."
        );
      } else {
        showToast("red", "도움돼요를 남기지 못했어요");
      }
    }
  };

  return (
    <div className="flex gap-[6px] pt-[16px] pb-[10px] border-b border-background-250">
      <ProfileIcon />

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-y-[2px]">
            <StarIcon />

            <span className="text-h5-list text-main-500 ml-[4px] mr-[7px]">
              {review.rating}
            </span>

            <span className="text-h6 text-background-600 mr-[8px]">
              {review.userNickname}
            </span>

            {review.isReceiptVerified && (
              <span className="mr-[8px] inline-flex items-center gap-[2px] rounded-[6px] bg-main-150 px-[6px] py-[1px] text-[11px] font-bold leading-[16px] text-main-500">
                <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
                  <path d="M2.5 6.2l2.2 2.2 4.8-4.8" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                영수증 인증
              </span>
            )}

            <span className="text-body-sub text-background-500">
              {formatDate(review.createdAt)}
            </span>
          </div>

          {!isMine && <ModerationMenu target="review" className="-my-[4px]" />}
        </div>

        <p className="my-[7px] whitespace-pre-wrap text-h6-list text-background-600">
          {review.content}
        </p>

        <FeedbackButton
          feedbackType="Good"
          selected={isHelpful}
          count={helpfulCount}
          className="text-h6-list"
          onClick={handleHelpful}
        />
      </div>
    </div>
  );
}