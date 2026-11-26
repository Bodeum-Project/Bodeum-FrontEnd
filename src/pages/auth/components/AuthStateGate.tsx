import { useEffect, useRef, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { getApiErrorMessage, isUnauthorizedError } from "@/apis/apiError";
import { hasStoredAuthSession } from "@/apis/authApi";
import { showToast } from "@/components/Toast";
import { onboardingStatusQueryOptions } from "@/hooks/useOnboarding";

import {
  consumeLoginToast,
  consumeLogoutToast,
  getStoredAuthNextStep,
  storeAuthNextStep,
} from "../authProgressStorage";
import { clearAgreementBrowserSession } from "../agreementBrowserSession";
import {
  clearOnboardingBrowserSession,
  completeInterruptedOnboarding,
  wasOnboardingBrowserSessionInterrupted,
} from "../onboardingBrowserSession";
import AuthLoadErrorState from "./AuthLoadErrorState";
import AuthLoadingState from "./AuthLoadingState";

type AuthStateGateProps = {
  children: ReactNode;
};

function showPendingLoginToast() {
  const pendingToast = consumeLoginToast();

  if (!pendingToast) {
    return;
  }

  showToast(
    "blue",
    pendingToast.nickname
      ? `${pendingToast.nickname}님, 반가워요! 보듬이 곁에서 함께할게요`
      : "로그인했어요. 다시 만나서 반가워요!",
  );
}

function showPendingLogoutToast() {
  const pendingToast = consumeLogoutToast();

  if (!pendingToast) {
    return;
  }

  showToast(pendingToast.color, pendingToast.message);
}

export default function AuthStateGate({ children }: AuthStateGateProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isChecking, setIsChecking] = useState(hasStoredAuthSession);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const trustedHome = useRef(false);

  useEffect(() => {
    if (trustedHome.current) {
      setIsChecking(false);
      return;
    }

    if (!hasStoredAuthSession()) {
      showPendingLogoutToast();
      setIsChecking(false);
      setErrorMessage(null);
      return;
    }

    let cancelled = false;
    setIsChecking(true);
    setErrorMessage(null);

    const resolveAuthState = async () => {
      try {
        const storedNextStep = getStoredAuthNextStep();

        if (storedNextStep === "HOME") {
          trustedHome.current = true;
          clearAgreementBrowserSession();
          clearOnboardingBrowserSession();
          showPendingLoginToast();
          setIsChecking(false);
          return;
        }

        if (storedNextStep === "TERMS") {
          clearOnboardingBrowserSession();
          navigate("/auth?flow=agreement", { replace: true });
          return;
        }

        if (storedNextStep === "ONBOARDING") {
          clearAgreementBrowserSession();

          if (!(await wasOnboardingBrowserSessionInterrupted())) {
            if (cancelled) {
              return;
            }

            navigate("/auth?flow=onboarding", { replace: true });
            return;
          }

          const result = await completeInterruptedOnboarding();

          if (result.nextStep !== "HOME") {
            throw new Error(
              "중단된 온보딩의 건너뛰기 상태를 확인하지 못했습니다.",
            );
          }

          trustedHome.current = true;
          storeAuthNextStep("HOME");
          clearOnboardingBrowserSession();

          if (!cancelled) {
            showToast(
              "blue",
              "가입을 마쳤어요. 보듬에 오신 걸 환영해요!",
            );
            setIsChecking(false);
            navigate("/", { replace: true });
          }
          return;
        }

        const status = await queryClient.fetchQuery(
          onboardingStatusQueryOptions(),
        );

        if (cancelled) {
          return;
        }

        if (status.nextStep === "HOME") {
          trustedHome.current = true;
          clearAgreementBrowserSession();
          storeAuthNextStep("HOME");
          clearOnboardingBrowserSession();
          showPendingLoginToast();
          setIsChecking(false);
          return;
        }

        if (status.nextStep === "ONBOARDING") {
          clearAgreementBrowserSession();
          storeAuthNextStep("ONBOARDING");
          navigate("/auth?flow=onboarding", { replace: true });
          return;
        }

        storeAuthNextStep("TERMS");
        clearOnboardingBrowserSession();
        navigate("/auth?flow=agreement", { replace: true });
        return;
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        if (isUnauthorizedError(error)) {
          setIsChecking(false);
          return;
        }

        setErrorMessage(
          getApiErrorMessage(
            error,
            "로그인 및 회원가입 진행 상태를 확인하지 못했습니다.",
          ),
        );
        setIsChecking(false);
      }
    };

    void resolveAuthState();

    return () => {
      cancelled = true;
    };
  }, [navigate, queryClient, retry]);

  if (isChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-soft px-[20px] py-[40px]">
        <AuthLoadingState message="로그인 상태를 확인하고 있습니다." />
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-soft px-[20px] py-[40px]">
        <AuthLoadErrorState
          message={errorMessage}
          onRetry={() => setRetry((current) => current + 1)}
        />
      </main>
    );
  }

  return children;
}
