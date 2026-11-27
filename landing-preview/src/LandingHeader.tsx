import { useEffect, useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    // 아래로 스크롤하면 헤더를 숨기고, 위로 올리면 다시 보여줍니다
    let last = window.scrollY, ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY, delta = y - last;
        if (Math.abs(delta) > 6) { setHidden(delta > 0 && y > 160); last = y; }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const isHidden = hidden && !menuOpen;
  return <header className={'site-header' + (isHidden ? ' is-hidden' : '')} onFocus={() => setHidden(false)} onKeyDown={event => {
    if (event.key === 'Escape' && menuOpen) setMenuOpen(false);
  }}>
    <div className="wrap header-row">
      <a href="#top" className="brand" aria-label="보듬보듬 처음으로"><img src={logo} alt="보듬보듬" /></a>
      <nav aria-label="주 메뉴">
        <a className="story-nav-link" href="#story">우리의 이야기</a>
        <NavGroup id="service" title="서비스 소개" links={guides.map(guide => ({ href: `#/guide/${guide.id}`, label: guide.label }))} />
      </nav>
      <LandingActions compact onSubscribe={onSubscribe} />
      <button type="button" className="menu-toggle" aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={menuOpen}
        aria-controls="mobile-menu" onClick={() => setMenuOpen(value => !value)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {menuOpen ? <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            : <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
        </svg>
      </button>
    </div>
    <div id="mobile-menu" className="mobile-menu" hidden={!menuOpen}>
      <div className="wrap">
        <a href="#story" onClick={close}>우리의 이야기</a>
        <a href="#service" onClick={close}>서비스 소개</a>
        <ul>{guides.map(guide => <li key={guide.id}><a href={`#/guide/${guide.id}`} onClick={close}>{guide.label}</a></li>)}</ul>
        <button className="button secondary" type="button" onClick={() => { close(); onSubscribe(); }}>출시알림받기</button>
      </div>
    </div>
  </header>;
}
