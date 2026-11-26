import { useState } from 'react';
import { guides, serviceUrl } from './content';
import logo from './logo-bodeum.png';

export function LandingActions({ compact = false, onSubscribe }: { compact?: boolean; onSubscribe: () => void }) {
  const size = compact ? ' compact' : '';
  return <div className={compact ? 'header-actions' : 'actions'}>
    <a className={`button btn-primary${size}`} href={serviceUrl}>데모 둘러보기</a>
    <button className={`button secondary${size}`} type="button" onClick={onSubscribe}>출시알림받기</button>
  </div>;
}

function NavGroup({ id, title, links }: { id: string; title: string; links: readonly { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  return <div className="service-menu" onPointerEnter={event => {
          if (event.pointerType === 'mouse') setOpen(true);
        }} onPointerLeave={event => {
          if (event.pointerType === 'mouse' && !event.currentTarget.contains(document.activeElement)) setOpen(false);
        }} onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
        }} onKeyDown={event => {
          if (event.key === 'Escape' && open) {
            event.currentTarget.querySelector('button')?.focus();
            setOpen(false);
          }
        }}>
          <div className="service-menu-trigger">
            <a href={`#${id}`} onClick={() => setOpen(false)}>{title}</a>
            <button type="button" aria-label={`${title} 하위 메뉴`} aria-expanded={open} aria-controls={`${id}-links`} onClick={() => setOpen(value => !value)}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" /></svg>
            </button>
          </div>
          <div className="service-menu-panel" id={`${id}-links`} hidden={!open}>
            <ul>{links.map(link => <li key={link.href}><a href={link.href} onClick={() => setOpen(false)}>{link.label}</a></li>)}</ul>
          </div>
        </div>;
}

export function LandingHeader({ onSubscribe }: { onSubscribe: () => void }) {
  return <header className="site-header">
    <div className="wrap header-row">
      <a href="#top" className="brand" aria-label="보듬보듬 처음으로"><img src={logo} alt="보듬보듬" /></a>
      <nav aria-label="주 메뉴">
        <a className="story-nav-link" href="#story">우리의 이야기</a>
        <NavGroup id="service" title="서비스 소개" links={guides.map(guide => ({ href: `#/guide/${guide.id}`, label: guide.label }))} />
      </nav>
      <LandingActions compact onSubscribe={onSubscribe} />
    </div>
  </header>;
}
