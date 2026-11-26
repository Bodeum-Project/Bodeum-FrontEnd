import { useState } from "react";
import DetailBackButton from "@/components/button/DetailBackButton";
import AccountManagementCard from "./components/settings/AccountManagementCard";
import WithdrawalModal from "./components/settings/WithdrawalModal";
import ProfileManagementCard from "./components/settings/ProfileManagementCard";
import { useProfileSettingsForm } from "./hooks/useProfileSettingsForm";

export default function ProfileSettingsPage() {
  const settings = useProfileSettingsForm();
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

  return (
    <div className="min-h-full bg-surface-subtle px-[16px] py-[16px] md:px-[32px] md:py-[20px]">
      <div className="flex flex-col items-start gap-[12px] lg:grid lg:grid-cols-1 lg:gap-0">
        <DetailBackButton className="lg:sticky lg:top-[20px] lg:z-10 lg:col-start-1 lg:row-start-1 lg:ml-[24px] lg:justify-self-start" />

        <div className="mx-auto flex w-full max-w-[634px] flex-col gap-[16px] lg:col-start-1 lg:row-start-1 lg:gap-[20px]">
          <ProfileManagementCard
            form={settings.displayedProfile}
            joinedAt={settings.joinedAt}
            guardianType={settings.guardianType}
            badgeName={settings.badgeName}
            isEditing={settings.isEditing}
            onChange={settings.setDraftProfile}
            onStartEdit={settings.startEditing}
            onCancel={settings.cancelEditing}
            onApply={settings.applyEditing}
            isApplying={settings.isApplying}
          />
          <AccountManagementCard onWithdraw={() => setIsWithdrawalModalOpen(true)} />
        </div>
      </div>

      {isWithdrawalModalOpen && (
        <WithdrawalModal
          onClose={() => setIsWithdrawalModalOpen(false)}
          onConfirm={() => setIsWithdrawalModalOpen(false)}
        />
      )}
    </div>
  );
}
