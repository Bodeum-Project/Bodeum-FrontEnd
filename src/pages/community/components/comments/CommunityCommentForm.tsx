import { useState } from "react";

import ButtonFill from "@/components/button/ButtonFill";
import ProfileAvatar from "@/components/ProfileAvatar";
import { useUserBrief } from "@/hooks/useUser";

interface CommunityCommentFormProps {
  isSubmitting: boolean;
  onSubmit: (content: string, onSuccess: () => void) => void;
}

export default function CommunityCommentForm({
  isSubmitting,
  onSubmit,
}: CommunityCommentFormProps) {
  const [comment, setComment] = useState("");
  const { data: userBrief } = useUserBrief();

  const content = comment.trim();

  return (
    <>
      <form
        className="mt-[16px] flex items-center gap-[10px] sm:gap-[14px]"
        onSubmit={(event) => {
          event.preventDefault();
          if (!content || isSubmitting) return;
          onSubmit(content, () => setComment(""));
        }}
      >
        <ProfileAvatar
          imageUrl={userBrief?.isLoggedIn ? userBrief.profileImageUrl : null}
          alt="내 프로필"
          className="h-[36px] w-[36px] shrink-0 sm:h-[40px] sm:w-[40px]"
        />
        <input
          value={comment}
          disabled={isSubmitting}
          onChange={(event) => setComment(event.target.value)}
          placeholder="따뜻한 댓글을 남겨주세요"
          className={`h-[44px] w-full min-w-0 flex-1 rounded-lg border px-[14px] py-[10px] text-[14px] text-primary outline-none placeholder:text-disabled sm:px-[18px] focus:border-brand focus:bg-surface disabled:cursor-not-allowed disabled:opacity-50 ${
            comment.length > 0
              ? "border-brand bg-surface"
              : "border-transparent bg-surface-subtle"
          }`}
        />
        <ButtonFill
          type="submit"
          label="등록"
          disabled={!content || isSubmitting}
          className="!h-[44px] shrink-0 !rounded-lg !px-[16px]"
        />
      </form>
      <p className="mt-2 pl-[46px] text-body-sub text-tertiary sm:pl-[54px]">
        욕설·비방·광고성 링크가 포함된 댓글은 별도 안내 없이 삭제될 수 있습니다.
      </p>
    </>
  );
}
