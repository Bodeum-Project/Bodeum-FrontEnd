import { DetailPageSkeleton } from "@/components/skeleton/Skeleton";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { infoCategoryMap } from "@/constants/infoCategory";
import type { ParentCategory } from "@/types/info";

import ButtonOutline from "@/components/button/ButtonOutline";
import InfoItem from "./components/InfoItem";
import RatingInput from "./ReviewWrite/RatingInput";
import ReviewTextArea from "./ReviewWrite/ReviewTextArea";
import ReceiptVerifyCard from "./ReviewWrite/ReceiptVerifyCard";
import ImageUploader from "@/components/ImageUploader";
import ButtonFill from "@/components/button/ButtonFill";
import ReviewCancelModal from "./components/modal/ReviewCancelModal";
import { useInfoDetail } from "@/hooks/useInfoDetail";
import { useCreateInfoReviewMutation } from "@/hooks/useCreateInfoReviewMutation";
import { showToast } from "@/components/Toast";
import { uploadReviewImage } from "@/apis/infoApi";

export default function WriteReviewPage() {
  const { category, id } = useParams();
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const { mutate, isPending: isSubmitting } = useCreateInfoReviewMutation();
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();
  const { setBreadcrumb } = useBreadcrumb();
  const { data: detail, isPending, isError } = useInfoDetail(Number(id));

  const infoCategory = category
    ? infoCategoryMap[category as ParentCategory]
    : undefined;

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const isValid = rating > 0 && content.trim().length > 0;

  useEffect(() => {
    if (!category || !detail) return;

    setBreadcrumb([
      {
        label: "정보",
      },
      {
        label: infoCategory?.label ?? "",
        onClick: () => navigate(`/info?category=${category}`),
      },
      {
        label: detail!.name,
        onClick: () => navigate(`/info/${category}/${id}`),
      },
      {
        label: "후기 작성",
      },
    ]);

    return () => setBreadcrumb([]);
  }, [category, detail, id, infoCategory, navigate, setBreadcrumb]);

  const handleSubmit = async () => {
    if (!id || isUploading || isSubmitting) return;

    setIsUploading(true);
    try {
      const imageUrls = await Promise.all(
        images.map((image) => uploadReviewImage(image)),
      );

      mutate(
        {
          infoItemId: Number(id),
          body: {
            rating,
            content,
            imageUrls,
          },
        },
        {
          onSuccess: () => {
            showToast("blue", "후기를 등록했어요. 고마워요!");
            navigate(-1);
          },
          onError: () => {
            showToast("red", "후기를 등록하지 못했어요. 잠시 후 다시 시도해 주세요");
          },
        },
      );
    } catch (error) {
      console.error(error);
      showToast("red", "이미지를 올리지 못했어요");
    } finally {
      setIsUploading(false);
    }
  };

  if (isPending) {
    return <DetailPageSkeleton label="리뷰 작성 화면을 불러오는 중입니다." />;
  }

  if (isError || !detail) {
    return <div>정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="mx-auto flex max-w-[1240px] justify-center px-4 py-4 md:px-8 md:py-[20px]">
      <main className="w-full max-w-[1240px] space-y-[20px]">
        <InfoItem
          mainCategory={detail?.mainCategory}
          name={detail?.name}
          address={detail?.address}
          phone={detail?.phone ?? undefined}
          subCategoryKo={detail?.subCategoryKo}
          viewCount={detail?.viewCount}
          scrapCount={detail.scrapCount}
          isScrapped={detail.isScrapped}
          clickable={false}
        />

        <section className="rounded-md border border-default bg-surface p-[16px] sm:p-[20px]">
          <h2 className="mb-[16px] text-h1-onboard text-primary">
            후기 작성하기
          </h2>

          <RatingInput
            value={rating}
            onChange={setRating}
          />

          <ReceiptVerifyCard />

          <ReviewTextArea
            value={content}
            onChange={setContent}
          />

          <ImageUploader
            images={images}
            onChange={setImages}
          />
        </section>

        <div className="flex justify-center gap-2">
          <ButtonOutline
            label="취소하기"
            tone="black"
            className="flex-1 sm:w-[200px] sm:flex-none"
            onClick={() => setIsCancelOpen(true)}
          />

          <ButtonFill
            label="게시하기"
            disabled={!isValid || isUploading || isSubmitting}
            className="flex-1 sm:w-[200px] sm:flex-none"
            onClick={handleSubmit}
          />
        </div>
      </main>

      <ReviewCancelModal
        open={isCancelOpen}
        onContinue={() => setIsCancelOpen(false)}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
