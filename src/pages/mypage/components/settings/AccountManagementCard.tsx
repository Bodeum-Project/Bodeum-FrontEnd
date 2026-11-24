interface AccountManagementCardProps {
  onWithdraw: () => void;
}

export default function AccountManagementCard({ onWithdraw }: AccountManagementCardProps) {
  return (
    <section className="w-full max-w-[634px] rounded-2xl bg-surface p-[20px]">
      <h2 className="border-b border-strong py-[8px] text-h2-list text-primary">
        보안 및 로그인
      </h2>
      <button
        type="button"
        onClick={onWithdraw}
        className="mt-[16px] cursor-pointer text-h3-category-sub text-danger"
      >
        회원탈퇴
      </button>
    </section>
  );
}
