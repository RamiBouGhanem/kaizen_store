// ComingSoon.tsx
import React, { Component, useMemo } from "react";
import homePage1 from "../assets/homePage1.jpg";

/* ===========================
   COUNTDOWN
=========================== */
type CountDownProps = { start: boolean; deadlineMs: number };
type CountDownState = {
  days: string | number;
  hours: string | number;
  minutes: string | number;
  seconds: string | number;
};

class CountDown extends Component<CountDownProps, CountDownState> {
  private timerId?: number;

  constructor(props: CountDownProps) {
    super(props);
    this.state = { days: "00", hours: "00", minutes: "00", seconds: "00" };
  }

  private pad(n: number) {
    return n < 10 ? "0" + n : String(n);
  }

  private tick = () => {
    const diff = this.props.deadlineMs - Date.now();
    if (diff <= 0) {
      clearInterval(this.timerId);
      this.setState({ days: "00", hours: "00", minutes: "00", seconds: "00" });
      return;
    }
    const dd = Math.floor(diff / 86400000);
    const hh = Math.floor((diff % 86400000) / 3600000);
    const mm = Math.floor((diff % 3600000) / 60000);
    const ss = Math.floor((diff % 60000) / 1000);
    this.setState({
      days: this.pad(dd),
      hours: this.pad(hh),
      minutes: this.pad(mm),
      seconds: this.pad(ss),
    });
  };

  componentDidMount() {
    this.tick();
    this.timerId = window.setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  render() {
    const { days, hours, minutes, seconds } = this.state;
    return (
      <div id="countdown" role="timer" aria-label="Countdown to launch">
        {[
          { label: "DAYS", val: days },
          { label: "HOURS", val: hours },
          { label: "MINUTES", val: minutes },
          { label: "SECONDS", val: seconds },
        ].map((item, i) => (
          <div className="box" key={i}>
            <p className="value">{item.val}</p>
            <span className="label">{item.label}</span>
          </div>
        ))}
      </div>
    );
  }
}

/* ===========================
   PRELOADER
=========================== */
class Preloader extends Component {
  componentDidMount() {
    const el = document.querySelector(".preloader") as HTMLElement | null;
    if (!el) return;
    setTimeout(() => {
      el.style.opacity = "0";
      setTimeout(() => {
        el.style.display = "none";
      }, 800);
    }, 600);
  }

  render() {
    return (
      <div className="preloader" aria-hidden>
        <div className="spinner_wrap">
          <div className="spinner" />
        </div>
      </div>
    );
  }
}

/* ===========================
   MAIN
=========================== */
export default function ComingSoon() {
  const launchDate = useMemo(
    () => new Date("2025-11-01T19:00:00+03:00").getTime(),
    []
  );

  return (
    <div
      className="App"
      style={
        {
          ["--hero-bg" as any]: `url(${homePage1})`,
        } as React.CSSProperties
      }
    >
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');

:root{
  --accent:#24D06C;
  --fg:#E9EDF6;
  --muted:rgba(233,237,246,0.72);
  --card:rgba(255,255,255,0.08);
  --stroke:rgba(255,255,255,0.12);
  --bg:#0B0F19;

  /* vertical rhythm */
  --topband-h: 52px;
  --bottomband-h: 68px;
}

*{ box-sizing:border-box; margin:0; padding:0; }
html, body, #root { height:100%; }
html, body { overflow:hidden; } /* one page only */

body{
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  color:var(--fg);
  background:var(--bg);
}

/* ===== Fullscreen Scene ===== */
.App{
  position:relative;
  width:100vw;
  height:100vh;
  background:
    linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.88)),
    var(--hero-bg) center/cover no-repeat;
  display:grid;
  grid-template-rows: var(--topband-h) 1fr var(--bottomband-h);  /* top ticker / hero / bottom creed */
  align-items:stretch;
  justify-items:center;
  text-align:center;
  isolation:isolate;
}

/* ===== TOP MOVING TICKER (loops in place) ===== */
.topband{
  width:100%;
  height:var(--topband-h);
  background: linear-gradient(180deg, rgba(0,0,0,0.65), rgba(0,0,0,0));
  overflow:hidden;
  display:flex;
  align-items:center;
}
.marquee{
  position:relative;
  width:100%;
  mask-image: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
}
.track{
  display:inline-flex;
  align-items:center;
  gap:28px;
  white-space:nowrap;
  padding-inline:14px;
  font-weight:700;
  letter-spacing:.14em;
  text-transform:uppercase;
  font-size:12px;
  animation: ticker-loop 16s linear infinite;
}
.track + .track{ animation-delay: -8s; } /* interleave for seamless loop */
@keyframes ticker-loop{
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.dot{
  width:8px; height:8px; border-radius:999px; background:var(--accent); box-shadow:0 0 14px var(--accent);
}
@media (max-width:480px){
  .topband{ height:46px; }
  .track{ gap:22px; font-size:11px; }
}
@media (prefers-reduced-motion: reduce){ .track{ animation:none; } }

/* ===== HERO (center + vertical fill) ===== */
.hero{
  place-self:center;
  width:min(92vw, 780px);
  display:grid;
  gap: clamp(18px, 3vh, 28px);
  align-content:center;
  justify-items:center;

  min-height: calc(100vh - var(--topband-h) - var(--bottomband-h));
  padding-block: clamp(24px, 6vh, 72px);

  position:relative;
  isolation:isolate;
}

/* Premium glows to visually fill space */
.hero::before,
.hero::after{
  content:"";
  position:absolute;
  left:50%;
  transform:translateX(-50%);
  width:min(1000px, 96vw);
  pointer-events:none;
  z-index:-1;
}
.hero::before{
  top: -14vh; height: 22vh;
  background: radial-gradient(65% 100% at 50% 100%, rgba(36,208,108,0.28) 0%, rgba(36,208,108,0.05) 55%, transparent 75%);
  filter: blur(10px);
}
.hero::after{
  bottom: -16vh; height: 24vh;
  background:
    radial-gradient(60% 90% at 50% 0%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 55%, transparent 75%),
    radial-gradient(50% 90% at 50% 0%, rgba(36,208,108,0.20) 0%, rgba(36,208,108,0.03) 60%, transparent 80%);
  filter: blur(10px);
}

/* Headline animation: fade-up + sheen + underline */
.headline{
  margin-top: clamp(-38px, -3vh, -30px);
  font-size: clamp(34px, 6.6vw, 62px);
  line-height:1.08;
  font-weight:800;
  text-transform:uppercase;
  position:relative;
  opacity:0;
  transform: translateY(14px) scale(.98);
  letter-spacing:.06em;
  animation:
    headline-in 900ms cubic-bezier(.2,.7,.2,1) forwards,
    headline-sheen 2200ms linear 400ms 1;
}
@keyframes headline-in{
  to{ opacity:1; transform:translateY(0) scale(1); letter-spacing:.01em; }
}
@keyframes headline-sheen{
  0%{ background:none; -webkit-text-fill-color:initial; }
  12%{
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.9) 40%, rgba(255,255,255,0) 80%);
    background-size:200% 100%; background-position:-120% 0;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  }
  65%{ background-position:120% 0; }
  100%{ background:none; -webkit-text-fill-color:inherit; }
}
.headline::after{
  content:"";
  position:absolute; left:50%; transform:translateX(-50%) scaleX(0);
  bottom:-10px; width:68%; height:2px;
  background: linear-gradient(90deg, transparent, rgba(36,208,108,.7), transparent);
  border-radius:999px;
  animation: underline-in 700ms 700ms cubic-bezier(.2,.7,.2,1) forwards;
}
@keyframes underline-in{ to{ transform:translateX(-50%) scaleX(1); } }
@media (prefers-reduced-motion: reduce){
  .headline{ animation:none; opacity:1; transform:none; letter-spacing:.01em; }
  .headline::after{ animation:none; transform:translateX(-50%) scaleX(1); }
}

.k-pill{
  margin-top:6px;
  background: rgba(36,208,108,0.15);
  border:1px solid rgba(36,208,108,0.25);
  border-radius:999px;
  padding:8px 14px;
  font-size:12px;
  letter-spacing:.12em;
  text-transform:uppercase;
}

.subtitle{
  max-width:600px;
  color:var(--muted);
  font-size:15px;
  line-height:1.7;
}

/* Countdown card */
#countdown{
  margin-top: 8px;
  width:min(520px, 92vw);
  display:grid; grid-template-columns:repeat(4,1fr);
  background:var(--card);
  border:1px solid var(--stroke);
  border-radius:16px;
  padding:18px;
  box-shadow:0 10px 32px rgba(0,0,0,.38);
  backdrop-filter: blur(10px);
}
.box{ padding:10px 4px; position:relative; }
.box:not(:last-child)::after{
  content:""; position:absolute; top:20%; bottom:20%; right:0; width:1px; background:rgba(255,255,255,.15);
}
.value{ font-size: clamp(26px, 5vw, 38px); font-weight:800; }
.label{ display:block; margin-top:6px; font-size:11px; letter-spacing:.16em; color:var(--muted); text-transform:uppercase; }

/* ===== BOTTOM CREED ===== */
.bottomband{
  width:100%;
  height:var(--bottomband-h);
  display:grid; place-items:center;
  padding:0 12px 10px;
  background: linear-gradient(0deg, rgba(0,0,0,0.65), rgba(0,0,0,0));
}
.creed{ font-size:12px; letter-spacing:.18em; text-transform:uppercase; opacity:.92; position:relative; }
.creed::before, .creed::after{ content:""; position:absolute; top:50%; width:68px; height:1px; background:rgba(255,255,255,.16); }
.creed::before{ right:100%; margin-right:10px; } .creed::after{ left:100%; margin-left:10px; }
.pulse{ width:8px; height:8px; border-radius:999px; background:var(--accent); margin:0 8px; animation: creed-glow 2s ease-in-out infinite alternate; }
@keyframes creed-glow{ from{ box-shadow:0 0 0 rgba(36,208,108,0); } to{ box-shadow:0 0 16px rgba(36,208,108,.35); } }
@media (prefers-reduced-motion: reduce){ .pulse{ animation:none; } }

/* ===== Preloader ===== */
.preloader{
  position:fixed; inset:0; background:#0b1020; display:grid; place-items:center; z-index:9999; transition:opacity .9s;
}
.spinner{ width:54px; height:54px; border-radius:10px; background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.92), rgba(255,255,255,.62)); animation: spin 1.2s infinite ease-in-out; }
@keyframes spin{
  0%{ transform: perspective(120px) rotateX(0) rotateY(0); }
  50%{ transform: perspective(120px) rotateX(-180deg) rotateY(0); }
  100%{ transform: perspective(120px) rotateX(-180deg) rotateY(-180deg); }
}
      `}</style>

      {/* TOP BAND: looping ticker in place */}
      <header className="topband" aria-label="Brand Ticker">
        <div className="marquee" aria-hidden>
          <div className="track">
            <span className="dot" />
            KAIZEN • OFFICIAL LAUNCH
            <span className="dot" />
            KAIZEN • OFFICIAL LAUNCH
            <span className="dot" />
            KAIZEN • OFFICIAL LAUNCH
            <span className="dot" />
            KAIZEN • OFFICIAL LAUNCH
          </div>
          <div className="track" aria-hidden>
            <span className="dot" />
            KAIZEN • OFFICIAL LAUNCH
            <span className="dot" />
            KAIZEN • OFFICIAL LAUNCH
            <span className="dot" />
            KAIZEN • OFFICIAL LAUNCH
            <span className="dot" />
            KAIZEN • OFFICIAL LAUNCH
          </div>
        </div>
      </header>

      {/* HERO */}
      <main className="hero" aria-labelledby="headline">
        <h1 id="headline" className="headline">
          Website
          <br />
          Coming&nbsp;Soon
        </h1>

        <div className="k-pill" aria-hidden>
          Official Launch
        </div>

        <p className="subtitle">
          A refined athletic experience is on its way. Craft, performance, and
          design—elevated.
        </p>

        <CountDown start={true} deadlineMs={launchDate} />
      </main>

      {/* BOTTOM CREED */}
      <footer className="bottomband" aria-label="Brand Creed">
        <div className="creed">
          Endure <span className="pulse" /> Adapt <span className="pulse" /> Improve
        </div>
      </footer>

      <Preloader />
    </div>
  );
}
