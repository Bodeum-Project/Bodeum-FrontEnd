import { DemoLink } from './ProductPreview';

/* 기능 소개 옆에 전체 화면 캡처 대신, 서비스의 핵심 UI 조각만 HTML로 보여줍니다 (예시 데이터) */

const Building = () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 3 8h18l-9-5Z" fill="currentColor" /><path d="M6 10v7M10 10v7M14 10v7M18 10v7M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
const Megaphone = () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 10v4a1 1 0 0 0 1 1h2l6 4V5L7 9H5a1 1 0 0 0-1 1Z" fill="currentColor" /><path d="M17 9a4 4 0 0 1 0 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
const Eye = () => <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8Z" stroke="currentColor" strokeWidth="1.3" /><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" /></svg>;
const Heart = () => <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 13.5S2 10 2 6a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 4-6 7.5-6 7.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>;
const Comment = () => <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>;
const Spark = () => <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1.5 9.6 6.4 14.5 8 9.6 9.6 8 14.5 6.4 9.6 1.5 8 6.4 6.4Z" fill="currentColor" /></svg>;

const places = [
  { name: '노원 장애인복지관', addr: '덕릉로 70길 99', tags: ['장애인 복지관', '서울시 노원구'] },
  { name: '강북 아동발달지원센터', addr: '도봉로 89길 15', tags: ['치료·재활기관', '서울시 강북구'] },
  { name: '성북구 장애인가족지원센터', addr: '삼양로 23', tags: ['가족지원센터', '서울시 성북구'] },
];

const news = [
  { title: '2027년 발달재활서비스 바우처 신규 신청 안내', org: '성북구청', tags: ['지원사업', '서울시 성북구'], dday: 'D-6', views: '1,480' },
  { title: '겨울방학 장애아동 감각놀이 참가자 모집', org: '성북구 장애인가족지원센터', tags: ['프로그램', '서울시 성북구'], dday: 'D-10', views: '1,383' },
  { title: '웹툰 아카데미 "Dream Toon"', org: '순천시장애인종합복지관', tags: ['교육·세미나', '전남 순천시'], dday: 'D-14', views: '759' },
];

const posts = [
  { tag: '자유 소통', title: '처음 기관에 갈 때 무엇을 챙기면 좋을까요?', body: '처음이라 준비할 것이 궁금해요', when: '2일 전', likes: 143, comments: 46 },
  { tag: '치료·성장 기록', title: '언어치료 6개월, 두 단어 문장이 나왔어요', body: '작은 변화지만 나누고 싶었어요', when: '5일 전', likes: 212, comments: 58 },
  { tag: '정보 공유', title: '바우처 처음 신청할 때 서류 정리했어요', body: '주민센터 방문 전에 확인해 보세요', when: '1주 전', likes: 98, comments: 31 },
  { tag: '자유 소통', title: '주말에 아이와 갈 만한 감각놀이 공간', body: '서울 북부 쪽 추천 부탁드려요', when: '2주 전', likes: 67, comments: 24 },
];

function Info() {
  return <ul className="snip-stack">
    {places.map(p => <li key={p.name} className="snip-card snip-place">
      <span className="snip-icon snip-icon--blue"><Building /></span>
      <span className="snip-text">
        <strong>{p.name}</strong>
        <small>{p.addr}</small>
        <span className="snip-tags">{p.tags.map((t, i) => <em key={t} className={i === 0 ? 'is-key' : undefined}>{t}</em>)}</span>
      </span>
    </li>)}
  </ul>;
}

function Ai() {
  return <div className="snip-chat">
    <p className="snip-bubble">성북구에서 바우처로 언어치료 받을 수 있는 곳 알려줘</p>
    <div className="snip-card snip-answer">
      <span className="snip-bot"><Spark /></span>
      <span className="snip-typing"><i /><i /><i /></span>
      <div className="snip-answer-body">
        <p>성북구에서 <b>발달재활서비스 바우처</b>로 언어치료를 받을 수 있는 곳을 정리했어요.</p>
        <ol>
          <li><b>성북 아이숲 발달센터</b> (보문로)<span>언어치료·감각통합·놀이치료, 토요일 오전 운영</span></li>
          <li><b>한빛 언어심리치료실</b> (동소문로)<span>1:1 언어치료 + 치료 후 부모 코칭 10분</span></li>
        </ol>
        <p className="snip-source">출처 · 사회서비스 전자바우처, 성북구청</p>
      </div>
    </div>
  </div>;
}

function News() {
  return <ul className="snip-stack">
    {news.map(n => <li key={n.title} className="snip-card snip-news">
      <span className="snip-icon snip-icon--mint"><Megaphone /></span>
      <span className="snip-text">
        <strong>{n.title}</strong>
        <small>{n.org}</small>
        <span className="snip-tags">{n.tags.map((t, i) => <em key={t} className={i === 0 ? 'is-key' : undefined}>{t}</em>)}</span>
      </span>
      <span className="snip-meta"><b>{n.dday}</b><span><Eye />{n.views}</span></span>
    </li>)}
  </ul>;
}

function Community() {
  return <ul className="snip-grid">
    {posts.map(p => <li key={p.title} className="snip-card snip-post">
      <span className="snip-post-head"><em>{p.tag}</em><span>익명 보호자</span><time>{p.when}</time></span>
      <strong>{p.title}</strong>
      <small>{p.body}</small>
      <span className="snip-counts"><span><Heart />{p.likes}</span><span><Comment />{p.comments}</span></span>
    </li>)}
  </ul>;
}

const views = { info: Info, ai: Ai, news: News, community: Community } as const;

export function FeatureSnippet({ screen }: { screen: keyof typeof views }) {
  const View = views[screen];
  return <div className={'snippet snippet-' + screen}>
    <div className="snippet-body" aria-hidden="true"><View /></div>
    <div className="product-links"><DemoLink screen={screen} /></div>
  </div>;
}
