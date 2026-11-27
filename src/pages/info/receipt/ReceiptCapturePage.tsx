import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useInfoDetail } from "@/hooks/useInfoDetail";
import { ReceiptIcon } from "@/components/moderation/ModerationIcons";
import { IS_MOCK_MODE } from "@/mocks/isMockMode";
import SampleReceipt from "./SampleReceipt";
import { parseReceipt, type ParseResult } from "./parseReceipt";
import {
  formatReceiptDate,
  formatWon,
  type ReceiptInfo,
  type ReceiptRouteState,
} from "./receiptTypes";

type Step = "permission" | "camera" | "denied" | "analyzing" | "result";

/**
 * 영수증 리뷰 촬영 흐름 (모바일·태블릿)
 * 카메라 권한 안내 → 촬영 → 정보 추출(취소 가능) → 결과 → 후기 작성 화면
 * 촬영하면 확인 단계 없이 바로 분석하고, 잘못 찍었으면 분석 중 취소하거나 결과 화면에서 다시 찍는다.
 */
export default function ReceiptCapturePage() {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const routeState = (location.state ?? {}) as ReceiptRouteState;
  const { data: detail } = useInfoDetail(Number(id));
  const storeName = detail?.name ?? "방문한 곳";

  const [step, setStep] = useState<Step>("permission");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraUnavailable, setCameraUnavailable] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [result, setResult] = useState<ParseResult | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  /** 분석 요청마다 번호를 매겨, 취소된 요청의 결과는 버린다 */
  const analyzeRunRef = useRef(0);

  const writePath = `/info/${category}/${id}/review/write`;

  const stopStream = useCallback(() => {
    setStream((current) => {
      current?.getTracks().forEach((track) => track.stop());
      return null;
    });
  }, []);

  useEffect(() => () => stopStream(), [stopStream]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      void videoRef.current.play().catch(() => undefined);
    }
  }, [stream, step]);

  const close = () => {
    analyzeRunRef.current += 1;
    stopStream();
    if (routeState.from === "write") {
      navigate(writePath, { replace: true, state: { draft: routeState.draft } });
    } else {
      navigate(-1);
    }
  };

  const goWrite = (receipt?: ReceiptInfo) => {
    stopStream();
    navigate(writePath, {
      replace: true,
      state: { draft: routeState.draft, receipt } satisfies ReceiptRouteState,
    });
  };

  const openCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraUnavailable(true);
      setStep("camera");
      return;
    }
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 } },
        audio: false,
      });
      setCameraUnavailable(false);
      setStream(media);
      setStep("camera");
    } catch (error) {
      const name = error instanceof DOMException ? error.name : "";
      if (name === "NotAllowedError" || name === "SecurityError") {
        setStep("denied");
      } else {
        setCameraUnavailable(true);
        setStep("camera");
      }
    }
  };

  const shoot = () => {
    const video = videoRef.current;
    let captured: string | null = null;
    if (stream && video && video.videoWidth > 0) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);
      captured = canvas.toDataURL("image/jpeg", 0.85);
      setPhoto(captured);
    } else {
      setPhoto(null); // 샘플 영수증
    }
    stopStream();
    void analyze(captured);
  };

  const pickFromAlbum = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      stopStream();
      const picked = typeof reader.result === "string" ? reader.result : null;
      setPhoto(picked);
      void analyze(picked);
    };
    reader.readAsDataURL(file);
  };

  const retake = () => {
    analyzeRunRef.current += 1;
    setPhoto(null);
    setResult(null);
    void openCamera();
  };

  const analyze = async (image: string | null) => {
    const run = ++analyzeRunRef.current;
    setResult(null);
    setStep("analyzing");
    const parsed = await parseReceipt(image, storeName, searchParams.get("result"));
    if (run !== analyzeRunRef.current) return; // 분석 중 취소됨
    setResult(parsed);
    setStep("result");
  };

  const albumInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(event) => {
        pickFromAlbum(event.target.files?.[0]);
        event.target.value = "";
      }}
    />
  );

  const showSample = IS_MOCK_MODE && cameraUnavailable;

  /* ───────── 카메라 · 권한 안내 (어두운 화면) ───────── */
  if (step === "permission" || step === "camera") {
    return (
      <div className="fixed inset-0 z-modal flex flex-col bg-[#0E1116] text-white">
        {albumInput}
        {stream && (
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <TopBar title="영수증 촬영" onClose={close} dark />

        <div className="relative flex flex-1 flex-col items-center justify-center px-[24px]">
          <div className="relative aspect-[3/4] w-[min(76vw,340px)] max-h-[58dvh] rounded-[18px] shadow-[0_0_0_9999px_rgba(14,17,22,0.55)]">
            {showSample && step === "camera" && (
              <div className="absolute inset-[10%_12%] flex items-center drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
                <SampleReceipt storeName={storeName} />
              </div>
            )}
            <FrameCorners />
          </div>
          <p className="relative mt-[18px] text-center text-[15px] font-bold leading-[22px]">
            영수증 전체가 틀 안에 들어오게 맞춰 주세요
          </p>
          <p className="relative mt-[4px] text-center text-[13px] leading-[19px] text-white/70">
            {cameraUnavailable && !showSample
              ? "카메라를 켤 수 없어요. 앨범에서 사진을 골라 주세요"
              : "가게 이름과 날짜가 잘 보이면 돼요"}
          </p>
        </div>

        <div className="relative flex items-center justify-between px-[36px] pb-[calc(28px+env(safe-area-inset-bottom))] pt-[12px]">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-[64px] cursor-pointer flex-col items-center gap-[4px] text-[12px] text-white/85"
          >
            <span className="flex h-[44px] w-[44px] items-center justify-center rounded-lg bg-white/15">
              <AlbumIcon />
            </span>
            앨범
          </button>
          <button
            type="button"
            aria-label="촬영하기"
            onClick={shoot}
            disabled={step !== "camera" || (cameraUnavailable && !showSample)}
            className="flex h-[76px] w-[76px] cursor-pointer items-center justify-center rounded-full border-[4px] border-white/90 transition-transform active:scale-95 disabled:cursor-default disabled:opacity-40"
          >
            <span className="h-[60px] w-[60px] rounded-full bg-white" />
          </button>
          <span className="w-[64px]" />
        </div>

        {step === "permission" && (
          <div className="fixed inset-0 z-modal-top flex items-end justify-center modal-backdrop motion-backdrop sm:items-center sm:px-[20px]">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="receipt-permission-title"
              className="motion-sheet w-full rounded-t-[22px] bg-surface px-[20px] pb-[calc(20px+env(safe-area-inset-bottom))] pt-[24px] text-primary sm:max-w-[420px] sm:rounded-2xl sm:px-[24px] sm:pb-[24px]"
            >
              <span className="flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-brand-soft text-brand">
                <CameraIcon />
              </span>
              <h2 id="receipt-permission-title" className="mt-[16px] text-[20px] font-bold leading-[28px]">
                영수증을 찍어 방문을 인증해요
              </h2>
              <p className="mt-[6px] text-[15px] leading-[23px] text-secondary">
                영수증을 촬영하려면 카메라 권한이 필요해요.
                <br />
                영수증은 방문 확인에만 쓰이고, 후기에는 공개되지 않아요.
              </p>
              <ul className="mt-[16px] space-y-[8px] rounded-lg bg-surface-subtle px-[14px] py-[12px] text-[14px] leading-[20px] text-secondary">
                <li className="flex gap-[8px]"><Dot />방문한 날로부터 90일 안의 영수증만 인증돼요</li>
                <li className="flex gap-[8px]"><Dot />인증한 후기에는 ‘영수증 인증’ 배지가 붙어요</li>
              </ul>
              <button
                type="button"
                onClick={() => void openCamera()}
                className="btn-primary mt-[20px] h-[52px] w-full cursor-pointer rounded-lg text-[16px] font-bold"
              >
                카메라 권한 허용하기
              </button>
              <button
                type="button"
                onClick={close}
                className="mt-[8px] h-[44px] w-full cursor-pointer rounded-lg text-[15px] font-bold text-secondary hover:bg-surface-subtle"
              >
                다음에 할게요
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ───────── 이하 밝은 화면 ───────── */
  return (
    <div className="fixed inset-0 z-modal flex flex-col bg-surface text-primary">
      {albumInput}
      <TopBar title="방문 인증" onClose={close} />

      {step === "analyzing" && (
        <>
          <div className="flex flex-1 flex-col items-center justify-center px-[24px] motion-fade" role="status">
            <div className="relative h-[150px] w-[112px] overflow-hidden rounded-lg bg-surface-subtle shadow-[0_6px_20px_rgba(15,23,42,0.12)]">
              {photo ? (
                <img src={photo} alt="찍은 영수증" className="h-full w-full object-cover" />
              ) : IS_MOCK_MODE ? (
                <div className="absolute inset-0 flex scale-[0.42] items-center justify-center">
                  <div className="w-[260px] shrink-0">
                    <SampleReceipt storeName={storeName} />
                  </div>
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-brand">
                  <ReceiptIcon width={44} height={44} />
                </div>
              )}
              <span className="absolute inset-0 bg-brand/10" aria-hidden="true" />
              <span className="receipt-scan-line absolute left-[8px] right-[8px] top-[12px] [--scan-distance:122px] h-[3px] rounded-full bg-brand shadow-[0_0_10px_var(--color-brand)]" />
            </div>
            <p className="mt-[22px] text-[20px] font-bold leading-[28px]">영수증을 확인하고 있어요</p>
            <p className="mt-[6px] text-[15px] leading-[22px] text-secondary">가게 이름과 방문 날짜를 읽는 중이에요</p>
          </div>
          <div className="mx-auto w-full max-w-[520px] px-[20px] pb-[calc(16px+env(safe-area-inset-bottom))] pt-[12px]">
            <button
              type="button"
              onClick={retake}
              className="h-[52px] w-full cursor-pointer rounded-lg bg-surface-subtle text-[16px] font-bold text-secondary hover:bg-surface-muted"
            >
              취소하고 다시 찍기
            </button>
          </div>
        </>
      )}

      {step === "denied" && (
        <ResultLayout
          icon={<CameraIcon />}
          tone="gray"
          title="카메라 권한이 꺼져 있어요"
          description={"브라우저 설정에서 이 사이트의 카메라 권한을 허용해 주세요.\n앨범에 있는 영수증 사진으로도 인증할 수 있어요."}
          primary={{ label: "앨범에서 선택하기", onClick: () => fileInputRef.current?.click() }}
          secondary={{ label: "다시 시도하기", onClick: () => void openCamera() }}
        />
      )}

      {step === "result" && result?.status === "success" && (
        <ResultLayout
          icon={<CheckIcon />}
          tone="brand"
          title="방문이 확인됐어요"
          description="이제 후기를 남기면 ‘영수증 인증’ 배지가 함께 붙어요"
          primary={{ label: "후기 작성하기", onClick: () => goWrite(result.receipt) }}
          secondary={{ label: "다시 찍기", onClick: retake }}
        >
          <ReceiptSummary receipt={result.receipt} />
        </ResultLayout>
      )}

      {step === "result" && result?.status === "mismatch" && (
        <ResultLayout
          icon={<WarningIcon />}
          tone="yellow"
          title="이곳의 영수증이 맞나요?"
          description={`영수증의 가게 이름이 ‘${storeName}’와 달라요.\n이곳에서 받은 영수증으로 다시 찍어 주세요.`}
          primary={{ label: "다시 찍기", onClick: retake }}
          secondary={{ label: "인증 없이 후기 쓰기", onClick: () => goWrite() }}
        >
          <ReceiptSummary receipt={result.receipt} highlightStore />
        </ResultLayout>
      )}

      {step === "result" && result?.status === "fail" && (
        <ResultLayout
          icon={<WarningIcon />}
          tone="yellow"
          title="영수증을 읽지 못했어요"
          description="아래 내용을 확인하고 다시 찍어 주세요"
          primary={{ label: "다시 찍기", onClick: retake }}
          secondary={{ label: "인증 없이 후기 쓰기", onClick: () => goWrite() }}
        >
          <ul className="space-y-[10px] rounded-lg bg-surface-subtle px-[16px] py-[14px] text-[15px] leading-[22px] text-secondary">
            <li className="flex gap-[8px]"><Dot />빛이 반사되거나 그림자가 지지 않게 해 주세요</li>
            <li className="flex gap-[8px]"><Dot />영수증이 구겨지거나 접히지 않게 펴 주세요</li>
            <li className="flex gap-[8px]"><Dot />가게 이름부터 합계까지 모두 보이게 찍어 주세요</li>
          </ul>
        </ResultLayout>
      )}
    </div>
  );
}

/* ───────── 작은 조각들 ───────── */

function TopBar({ title, onClose, dark = false }: { title: string; onClose: () => void; dark?: boolean }) {
  return (
    <div className="relative z-10 flex h-[56px] shrink-0 items-center justify-center px-[12px] pt-[env(safe-area-inset-top)]">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className={`absolute left-[8px] flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-full ${dark ? "text-white hover:bg-white/10" : "text-primary hover:bg-surface-subtle"}`}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <span className="text-[17px] font-bold">{title}</span>
    </div>
  );
}

function FrameCorners() {
  const base = "absolute h-[28px] w-[28px] border-white";
  return (
    <>
      <span className={`${base} left-[-2px] top-[-2px] rounded-tl-[18px] border-l-[4px] border-t-[4px]`} />
      <span className={`${base} right-[-2px] top-[-2px] rounded-tr-[18px] border-r-[4px] border-t-[4px]`} />
      <span className={`${base} bottom-[-2px] left-[-2px] rounded-bl-[18px] border-b-[4px] border-l-[4px]`} />
      <span className={`${base} bottom-[-2px] right-[-2px] rounded-br-[18px] border-b-[4px] border-r-[4px]`} />
    </>
  );
}

function ReceiptSummary({ receipt, highlightStore = false }: { receipt: ReceiptInfo; highlightStore?: boolean }) {
  const rows = [
    { label: "가게 이름", value: receipt.storeName, warn: highlightStore },
    { label: "방문 일시", value: formatReceiptDate(receipt.visitedAt) },
    { label: "결제 금액", value: formatWon(receipt.amount) },
  ];
  return (
    <div className="flex gap-[14px] rounded-lg border border-default bg-surface px-[16px] py-[14px]">
      <div className="flex h-[76px] w-[58px] shrink-0 items-center justify-center overflow-hidden rounded-sm bg-surface-subtle text-brand">
        {receipt.imageUrl ? (
          <img src={receipt.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <ReceiptIcon width={28} height={28} />
        )}
      </div>
      <dl className="min-w-0 flex-1 space-y-[6px] text-[14px] leading-[20px]">
        {rows.map((row) => (
          <div key={row.label} className="flex gap-[10px]">
            <dt className="w-[60px] shrink-0 text-secondary">{row.label}</dt>
            <dd className={`min-w-0 flex-1 truncate font-bold ${row.warn ? "text-[#E5484D]" : "text-primary"}`}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

interface ActionProps {
  label: string;
  onClick: () => void;
}

function ResultLayout({
  icon,
  tone,
  title,
  description,
  primary,
  secondary,
  children,
}: {
  icon: ReactNode;
  tone: "brand" | "yellow" | "gray";
  title: string;
  description: string;
  primary: ActionProps;
  secondary: ActionProps;
  children?: ReactNode;
}) {
  const toneClass = {
    brand: "bg-brand-soft text-brand",
    yellow: "bg-[#FFF6E0] text-[#E59A00]",
    gray: "bg-surface-subtle text-secondary",
  }[tone];

  return (
    <>
      <div className="flex-1 overflow-y-auto px-[20px] pt-[28px] motion-fade">
        <div className="mx-auto max-w-[480px]">
          <span className={`flex h-[56px] w-[56px] items-center justify-center rounded-full ${toneClass}`}>{icon}</span>
          <h1 className="mt-[18px] text-[22px] font-bold leading-[31px]">{title}</h1>
          <p className="mt-[6px] whitespace-pre-line text-[15px] leading-[23px] text-secondary">{description}</p>
          {children && <div className="mt-[24px]">{children}</div>}
        </div>
      </div>
      <div className="mx-auto w-full max-w-[520px] px-[20px] pb-[calc(16px+env(safe-area-inset-bottom))] pt-[12px]">
        <button type="button" onClick={primary.onClick} className="btn-primary h-[52px] w-full cursor-pointer rounded-lg text-[16px] font-bold">
          {primary.label}
        </button>
        <button type="button" onClick={secondary.onClick} className="mt-[6px] h-[44px] w-full cursor-pointer rounded-lg text-[15px] font-bold text-secondary hover:bg-surface-subtle">
          {secondary.label}
        </button>
      </div>
    </>
  );
}

function Dot() {
  return <span className="mt-[8px] h-[4px] w-[4px] shrink-0 rounded-full bg-current opacity-60" aria-hidden="true" />;
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h2l1.4-2h6.2l1.4 2h2A2.5 2.5 0 0 1 21 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z" fill="currentColor" fillOpacity="0.25" />
      <circle cx="12" cy="13" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.9" />
    </svg>
  );
}

function AlbumIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" fill="currentColor" fillOpacity="0.3" />
      <path d="M6 17l4-4.5 3 3 2-2 3 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="15.5" cy="8.8" r="1.6" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <path d="M5.5 12.5l4.2 4.2 8.8-8.8" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <path d="M12 7.5v6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.4" fill="currentColor" />
    </svg>
  );
}
