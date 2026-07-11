import { useMemo, useState } from "react";

type Movie = {
  id: number;
  title: string;
  original: string;
  date: string;
  meta: string;
  summary: string;
  status: "new" | "discussion" | "want" | "booked" | "watched" | "skip";
  jonathan: string;
  minz: string;
  poster: string;
};

const initialMovies: Movie[] = [
  { id: 1, title: "奧德賽", original: "THE ODYSSEY", date: "7 月 17 日上映", meta: "冒險 · 2 小時 41 分", summary: "一場跨越海洋、神話與歸途的史詩旅程。", status: "discussion", jonathan: "想看", minz: "尚未回答", poster: "odyssey" },
  { id: 2, title: "蜘蛛人：重生日", original: "SPIDER-MAN: BRAND NEW DAY", date: "7 月 29 日上映", meta: "動作 · 2 小時 18 分", summary: "彼得帕克展開全新的生活，也遇上意想不到的危機。", status: "want", jonathan: "想看", minz: "想看", poster: "spider" },
  { id: 3, title: "名偵探柯南：高速公路的墮天使", original: "DETECTIVE CONAN", date: "現正熱映", meta: "動畫 · 1 小時 50 分", summary: "一場發生於高速公路上的追逐與謎案。", status: "new", jonathan: "尚未回答", minz: "尚未回答", poster: "conan" },
  { id: 4, title: "海洋奇緣", original: "MOANA", date: "現正熱映", meta: "冒險 · 1 小時 56 分", summary: "莫娜再次航向未知的海洋，尋找屬於自己的答案。", status: "skip", jonathan: "還好", minz: "不想看", poster: "moana" },
];

const showtimes = [
  { cinema: "台北信義威秀", date: "7/18（六）", times: ["14:20", "17:40", "19:30", "21:50"], format: "IMAX" },
  { cinema: "美麗華大直影城", date: "7/18（六）", times: ["15:10", "18:30", "20:40"], format: "IMAX" },
  { cinema: "京站威秀", date: "7/19（日）", times: ["13:50", "16:50", "20:10"], format: "數位" },
];

const statusLabel: Record<Movie["status"], string> = {
  new: "近期上映", discussion: "討論中", want: "想看", booked: "已訂票", watched: "看過", skip: "不看",
};

export default function App() {
  const [tab, setTab] = useState("discover");
  const [movies, setMovies] = useState(initialMovies);
  const [selectedId, setSelectedId] = useState(1);
  const [detailOpen, setDetailOpen] = useState(false);
  const [showtimeOpen, setShowtimeOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    { who: "Jonathan", text: "這部應該要看大銀幕吧，預告的海戰很誇張。", time: "10:24" },
    { who: "Minz", text: "可以，但片長好長 😂 週末下午比較好。", time: "10:31" },
  ]);
  const [toast, setToast] = useState("");

  const selected = movies.find((m) => m.id === selectedId) ?? movies[0];
  const lists = useMemo(() => ({
    discussing: movies.filter((m) => ["discussion", "want"].includes(m.status)),
    skipped: movies.filter((m) => m.status === "skip"),
  }), [movies]);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2300);
  };

  const updateMovie = (patch: Partial<Movie>) => {
    setMovies((all) => all.map((m) => m.id === selected.id ? { ...m, ...patch } : m));
  };

  const openMovie = (id: number) => {
    setSelectedId(id);
    setDetailOpen(true);
    setShowtimeOpen(false);
  };

  const chooseShowtime = (cinema: string, time: string) => {
    updateMovie({ status: "booked", jonathan: "想看", minz: "想看" });
    setShowtimeOpen(false);
    setTicketOpen(true);
    flash(`已保存 ${cinema} ${time} 場次`);
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">J</span><div><b>jonaminz</b><small>our movies</small></div></div>
        <nav>
          <button className={tab === "discover" ? "active" : ""} onClick={() => setTab("discover")}><span>⌂</span>近期電影</button>
          <button className={tab === "list" ? "active" : ""} onClick={() => setTab("list")}><span>♡</span>我們想看</button>
          <button className={tab === "tickets" ? "active" : ""} onClick={() => setTab("tickets")}><span>▣</span>已訂票 <em>1</em></button>
          <button className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}><span>◷</span>看過的電影</button>
        </nav>
        <div className="sidebar-bottom">
          <button><span>⌕</span>搜尋</button><button><span>⚙</span>設定</button>
          <div className="people"><span className="avatar jon">J</span><span className="avatar minz">M</span><p>Jonathan & Minz<small>共同空間</small></p></div>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div><p className="eyebrow">2026 · JULY</p><h1>{tab === "discover" ? "最近有什麼電影？" : tab === "list" ? "我們想看的" : tab === "tickets" ? "下一場電影" : "一起看過的電影"}</h1></div>
          <div className="top-actions"><button className="search">⌕ <span>搜尋電影</span></button><button className="profile">J</button></div>
        </header>

        {tab === "discover" && <Discover movies={movies} openMovie={openMovie} />}
        {tab === "list" && <MovieList lists={lists} openMovie={openMovie} />}
        {tab === "tickets" && <TicketView onOpen={() => setTicketOpen(true)} onCalendar={() => flash("已交給 Jonaminz Calendar 建立行程")} />}
        {tab === "history" && <HistoryView />}
      </section>

      <nav className="mobile-nav">
        {[{id:"discover",icon:"⌂",label:"近期"},{id:"list",icon:"♡",label:"想看"},{id:"tickets",icon:"▣",label:"票券"},{id:"history",icon:"◷",label:"看過"}].map(x => <button key={x.id} className={tab===x.id?"active":""} onClick={()=>setTab(x.id)}><span>{x.icon}</span>{x.label}</button>)}
      </nav>

      {detailOpen && <div className="overlay" onMouseDown={() => setDetailOpen(false)}>
        <section className="movie-panel" onMouseDown={(e) => e.stopPropagation()}>
          <button className="close" onClick={() => setDetailOpen(false)}>×</button>
          {!showtimeOpen ? <>
            <div className={`detail-hero poster-${selected.poster}`}><div className="poster-title"><small>{selected.original}</small><strong>{selected.title}</strong></div><button className="play">▶ <span>播放預告</span></button></div>
            <div className="detail-body">
              <div className="detail-heading"><div><span className={`status status-${selected.status}`}>{statusLabel[selected.status]}</span><h2>{selected.title}</h2><p>{selected.date} · {selected.meta}</p></div><button className="more">•••</button></div>
              <p className="summary">{selected.summary} 這裡保留一段足夠了解電影、但不會蓋過兩人討論的介紹。</p>
              <div className="opinions">
                <Opinion name="Jonathan" avatar="J" value={selected.jonathan} color="jon" />
                <Opinion name="Minz" avatar="M" value={selected.minz} color="minz" />
              </div>
              <div className="action-row">
                <button className="primary" onClick={() => { updateMovie({ jonathan: "想看", status: "want" }); flash("已加入你的想看片單"); }}>♡ 我想看</button>
                <button onClick={() => { updateMovie({ status: "discussion" }); flash("已通知 Minz 回答"); }}>↗ 問 Minz</button>
                <button onClick={() => { updateMovie({ status: "skip" }); flash("已分類到不看"); }}>不看</button>
              </div>
              <section className="discussion">
                <div className="section-title"><h3>我們的討論</h3><span>{comments.length} 則留言</span></div>
                {comments.map((c, i) => <div className="comment" key={i}><span className={`avatar ${c.who === "Jonathan" ? "jon" : "minz"}`}>{c.who[0]}</span><div><b>{c.who}</b><small>{c.time}</small><p>{c.text}</p></div></div>)}
                <form className="composer" onSubmit={(e) => { e.preventDefault(); if (!comment.trim()) return; setComments([...comments, {who:"Jonathan", text:comment, time:"剛剛"}]); setComment(""); }}><span className="avatar jon">J</span><input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="說說你覺得這部怎麼樣…"/><button>↑</button></form>
              </section>
              <button className="showtime-cta" onClick={() => setShowtimeOpen(true)}><span><b>已經想看了？</b><small>看看我們常去影城的場次</small></span><strong>查詢場次 →</strong></button>
            </div>
          </> : <Showtimes title={selected.title} onBack={() => setShowtimeOpen(false)} onChoose={chooseShowtime} />}
        </section>
      </div>}

      {ticketOpen && <div className="overlay ticket-overlay" onMouseDown={() => setTicketOpen(false)}><section className="ticket-modal" onMouseDown={(e)=>e.stopPropagation()}><button className="close" onClick={()=>setTicketOpen(false)}>×</button><p className="eyebrow">OUR NEXT MOVIE</p><h2>蜘蛛人：重生日</h2><p className="ticket-sub">SPIDER-MAN: BRAND NEW DAY</p><div className="ticket-stub"><div><small>日期</small><b>7 月 18 日（六）</b></div><div><small>時間</small><b>19:30</b></div><div><small>影城</small><b>台北信義威秀</b></div><div><small>影廳／座位</small><b>IMAX 8 廳 · G12、G13</b></div></div><div className="booked">✓ 已訂票</div><div className="ticket-actions"><button className="primary" onClick={()=>flash("正在顯示電子票券")}>顯示票券</button><button onClick={()=>flash("已交給 Jonaminz Calendar 建立行程")}>＋ Calendar</button></div><p className="capability-note">Calendar 由 Jonaminz 平台能力處理，Movies 不綁定特定服務。</p></section></div>}
      {toast && <div className="toast">✓ {toast}</div>}
    </main>
  );
}

function Discover({movies, openMovie}:{movies:Movie[];openMovie:(id:number)=>void}) {
  return <>
    <section className="hero-card poster-spider"><div className="hero-copy"><span className="pill">你們都想看</span><p>7 月 29 日上映</p><h2>蜘蛛人：<br/>重生日</h2><p className="hero-summary">兩個人都按下想看，現在可以開始找場次了。</p><button onClick={()=>openMovie(2)}>查看電影 <span>→</span></button></div><div className="couple-choice"><div><span className="avatar jon">J</span><small>Jonathan</small><b>想看</b></div><i>×</i><div><span className="avatar minz">M</span><small>Minz</small><b>想看</b></div></div></section>
    <section className="section-block"><div className="section-title"><div><p className="eyebrow">IN THEATERS</p><h2>近期上映</h2></div><button>查看全部 →</button></div><div className="movie-grid">{movies.slice(0,4).map(m=><MovieCard key={m.id} movie={m} onClick={()=>openMovie(m.id)}/>)}</div></section>
    <section className="decision-banner"><div><span className="mini-icon">?</span><p><b>有 1 部電影等 Minz 回答</b><small>《奧德賽》— Jonathan 問你想不想看</small></p></div><button onClick={()=>openMovie(1)}>去回答</button></section>
  </>;
}

function MovieCard({movie,onClick}:{movie:Movie;onClick:()=>void}) { return <article className="movie-card" onClick={onClick}><div className={`movie-poster poster-${movie.poster}`}><span className={`status status-${movie.status}`}>{statusLabel[movie.status]}</span><div className="poster-title"><small>{movie.original}</small><strong>{movie.title}</strong></div><button aria-label={`查看${movie.title}`}>＋</button></div><div className="movie-info"><h3>{movie.title}</h3><p>{movie.date}</p><div className="choice-dots"><span className="avatar jon">J</span><b>{movie.jonathan}</b><span className="avatar minz">M</span><b>{movie.minz}</b></div></div></article> }

function Opinion({name,avatar,value,color}:{name:string;avatar:string;value:string;color:string}) { return <div className="opinion"><span className={`avatar ${color}`}>{avatar}</span><p><small>{name}</small><b>{value}</b></p><span className={value === "想看" ? "heart on" : "heart"}>♥</span></div> }

function Showtimes({title,onBack,onChoose}:{title:string;onBack:()=>void;onChoose:(c:string,t:string)=>void}) { return <div className="showtimes"><button className="back" onClick={onBack}>← 電影詳情</button><p className="eyebrow">SELECT A SHOWTIME</p><h2>{title}</h2><p className="muted">優先顯示你們常去的影城</p><div className="date-strip"><button className="active"><b>18</b><small>週六</small></button><button><b>19</b><small>週日</small></button><button><b>20</b><small>週一</small></button><button><b>21</b><small>週二</small></button></div>{showtimes.map(s=><article className="cinema" key={s.cinema}><header><div><h3>{s.cinema}</h3><p>{s.date} · {s.format}</p></div><span>常用影城</span></header><div className="time-grid">{s.times.map(t=><button key={t} onClick={()=>onChoose(s.cinema,t)}>{t}<small>{s.format}</small></button>)}</div></article>)}<button className="manual">＋ 手動加入其他影城場次</button><p className="source-note">場次由影城來源介面提供；選定後可前往官方訂票網站。</p></div> }

function MovieList({lists,openMovie}:{lists:{discussing:Movie[];skipped:Movie[]};openMovie:(id:number)=>void}) { return <div className="list-page"><section><div className="section-title"><div><p className="eyebrow">TOGETHER</p><h2>討論中與想看</h2></div><span>{lists.discussing.length} 部</span></div><div className="rows">{lists.discussing.map(m=><button key={m.id} onClick={()=>openMovie(m.id)}><div className={`row-poster poster-${m.poster}`}></div><p><b>{m.title}</b><small>{m.date} · {m.meta}</small></p><span>{statusLabel[m.status]} →</span></button>)}</div></section><section><div className="section-title"><div><p className="eyebrow">ARCHIVED</p><h2>這次不看</h2></div></div><div className="rows muted-rows">{lists.skipped.map(m=><button key={m.id} onClick={()=>openMovie(m.id)}><div className={`row-poster poster-${m.poster}`}></div><p><b>{m.title}</b><small>保留紀錄，之後仍可改變決定</small></p><span>重新考慮</span></button>)}</div></section></div> }

function TicketView({onOpen,onCalendar}:{onOpen:()=>void;onCalendar:()=>void}) { return <div className="ticket-page"><section className="next-ticket poster-spider"><div className="ticket-copy"><span className="pill">✓ 已訂票</span><p className="eyebrow light">OUR NEXT MOVIE</p><h2>蜘蛛人：重生日</h2><p>7 月 18 日（六）19:30</p><p>台北信義威秀 · IMAX 8 廳</p><div className="seat">G12 <i>·</i> G13</div><div><button onClick={onOpen}>顯示票券</button><button onClick={onCalendar}>＋ Calendar</button></div></div><div className="countdown"><small>距離開演</small><b>7</b><span>天</span></div></section><div className="integration-card"><span>↗</span><div><b>Calendar 已準備好</b><p>Movies 送出標準事件，由 Jonaminz 選擇 Calendar 服務並管理同步。</p></div><button onClick={onCalendar}>加入</button></div></div> }

function HistoryView() { return <div className="history-page"><div className="history-summary"><div><small>2026 一起看了</small><b>12</b><span>部電影</span></div><p>平均每月 2 部<br/><b>最常去：美麗華大直</b></p></div><section className="timeline"><div className="month"><h2>七月</h2><span>2 部</span></div><HistoryItem title="F1 電影" date="7 月 5 日" place="美麗華大直 · IMAX" score="9.0" color="f1"/><HistoryItem title="馴龍高手" date="7 月 1 日" place="台北信義威秀 · 數位" score="8.5" color="dragon"/><div className="month"><h2>六月</h2><span>3 部</span></div><HistoryItem title="28 年毀滅倒數" date="6 月 21 日" place="MUVIE CINEMAS · TITAN" score="8.0" color="dark"/></section></div> }
function HistoryItem({title,date,place,score,color}:{title:string;date:string;place:string;score:string;color:string}) { return <article className="history-item"><div className={`history-poster ${color}`}></div><div><p>{date}</p><h3>{title}</h3><small>{place}</small></div><div className="score"><span>共同評分</span><b>{score}</b></div><button>→</button></article> }
