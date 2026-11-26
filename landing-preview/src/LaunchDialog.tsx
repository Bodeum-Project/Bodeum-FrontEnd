import { useState, type RefObject } from 'react';
import options from './signup-options.json';

export function LaunchDialog({ dialog }: { dialog: RefObject<HTMLDialogElement | null> }) {
  const previewOnly = location.protocol === 'file:' || import.meta.env.VITE_LAUNCH_SIGNUPS_MODE === 'preview';
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'preview'>('idle');
  return <dialog ref={dialog} className="launch-dialog" aria-labelledby="launch-title" onClose={() => {
    setStatus(value => value === 'preview' || value === 'error' ? 'idle' : value);
  }}>
    <div className="dialog-heading">
      <h2 id="launch-title">보듬보듬이 열리면 알려드릴게요</h2>
      <button type="button" className="dialog-close" aria-label="닫기" onClick={() => dialog.current?.close()}>×</button>
    </div>
    {status === 'saved' ? <p role="status">신청했어요! 보듬보듬이 열리는 날 이메일로 소식을 전할게요</p> :
      <form onSubmit={async event => {
        event.preventDefault();
        if (status === 'saving') return;
        const data = new FormData(event.currentTarget);
        if (previewOnly) {
          setStatus('preview');
          return;
        }
        setStatus('saving');
        try {
          const response = await fetch('/api/launch-signups', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: data.get('email'),
              role: data.get('role'),
              ageGroup: data.get('ageGroup'),
              consent: data.get('consent') === 'on',
            }),
          });
          if (!response.ok || !(await response.json()).accepted) throw new Error('Signup failed');
          setStatus('saved');
        } catch {
          setStatus('error');
        }
      }}>
        <p>{previewOnly ? '미리보기에서는 신청 방법을 체험할 수 있어요. 입력하신 정보는 저장되지 않아요' : '소식을 받을 이메일을 남겨 주세요'}</p>
        <label htmlFor="launch-email">이메일 주소</label>
        <input id="launch-email" name="email" type="email" autoComplete="email" placeholder="name@example.com" maxLength={254} required />
        <div className="signup-profile">
          <label>보호자 역할 <small>(선택)</small>
            <select name="role" defaultValue=""><option value="">역할을 골라 주세요</option>
              {options.roles.map(role => <option key={role}>{role}</option>)}
            </select>
          </label>
          <label>보호자 나이대 <small>(선택)</small>
            <select name="ageGroup" defaultValue=""><option value="">나이대를 골라 주세요</option>
              {options.ageGroups.map(age => <option key={age}>{age}</option>)}
            </select>
          </label>
        </div>
        <label className="consent"><input name="consent" type="checkbox" required /> 출시 알림 신청을 위해 이메일과 선택한 보호자 정보를 수집하고, 알림을 보낸 뒤 삭제하는 데 동의해요</label>
        <button className="button btn-primary" type="submit" disabled={status === 'saving'}>{status === 'saving' ? '신청하는 중이에요' : '출시 알림 받기'}</button>
        {status === 'error' && <p role="alert">아직 신청이 저장되지 않았어요<br />잠시 후 다시 시도해 주세요</p>}
        {status === 'preview' && <p role="status">지금은 미리보기예요<br />입력하신 정보는 저장되지 않아요</p>}
      </form>}
  </dialog>;
}
