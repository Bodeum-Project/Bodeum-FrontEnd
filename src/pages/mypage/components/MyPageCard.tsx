import CommentIcon from "@/assets/icons/Comment.svg?react";
import PostIcon from "@/assets/icons/Post.svg?react";
import ScrapIcon from "@/assets/icons/Scrap.svg?react";
import Chip from "@/components/Chips";
import DetailActionButton from "@/components/button/DetailActionButton";
import { Link } from "react-router-dom";
import type { MyPageItem } from "@/types/mypage";

interface MyPageCardProps {
  item: MyPageItem;
  onDelete?: () => void;
  deleteDisabled?: boolean;
}

export default function MyPageCard({ item, onDelete, deleteDisabled = false }: MyPageCardProps) {
  const isComment = item.type === "comment";
  const isScrap = item.type === "scrap";
  const content = isComment ? item.comment : item.title;
  const meta = isComment
    ? ["커뮤니티 댓글", `작성일 ${item.date}`].filter(Boolean).join(" · ")
    : `${isScrap ? (item.sourceLabel ?? "저장 정보") : "커뮤니티 게시글"} · ${
        isScrap ? "저장일" : "작성일"
      } ${item.date}`;
  const targetPath = isScrap && item.targetPath ? item.targetPath : `/community/${item.postId}`;

  return (
    <article className="press relative flex w-full items-center rounded-xl border border-default bg-surface px-[14px] py-[14px] transition-colors hover:bg-surface-subtle has-[a:active]:bg-surface-muted sm:px-[18px]">
      <Link
        to={targetPath}
        className="flex min-w-0 flex-1 items-center self-stretch before:pointer-events-none before:absolute before:inset-0 before:rounded-xl focus-visible:outline-none focus-visible:before:outline focus-visible:before:outline-2 focus-visible:before:outline-offset-2"
        aria-label={`${content} 상세 보기`}
      >
        <div className="bodeum-icon-color flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px] bg-brand-soft text-brand-strong">
          {isComment ? (
            <CommentIcon
              className="h-[15px] w-[16px]"
              aria-hidden="true"
            />
          ) : item.type === "post" ? (
            <PostIcon className="h-[15.75px] w-[15.75px]" aria-hidden="true" />
          ) : (
            <ScrapIcon className="h-[18px] w-[18px] [&_path]:stroke-[1.2]" aria-hidden="true" />
          )}
        </div>

        <div className="ml-[12px] min-w-0">
          <h3 className="truncate text-[15px] font-semibold leading-[22px] text-primary">{content}</h3>
          <p className="mt-[2px] text-[12px] text-tertiary">{meta}</p>
        </div>

        {isScrap && item.dDay && (
          <Chip variant="dday" className="ml-auto shrink-0 w-[54px] h-[36px]">
            {item.dDay}
          </Chip>
        )}
      </Link>

      {onDelete && (
        <DetailActionButton
          label="삭제"
          onClick={onDelete}
          disabled={deleteDisabled}
          className="ml-[12px] !h-[34px] shrink-0 !rounded-md !px-[12px] !text-[13px] !font-medium !text-secondary"
        />
      )}
    </article>
  );
}
