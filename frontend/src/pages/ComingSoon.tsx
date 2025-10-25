// ComingSoon.tsx
import React, { Component, useMemo } from "react";
import homePage1 from "../assets/homePage1.jpg"; // ← update extension if different

/* ===========================
    COUNTDOWN
    =========================== */
type CountDownProps = {
  start: boolean;
  deadlineMs: number;
  onTimeUp?: () => void;
  visible?: boolean;
};

type CountDownState = {
  days: string | number;
  hours: string | number;
  minutes: string | number;
  seconds: string | number;
  time_up: string;
};

class CountDown extends Component<CountDownProps, CountDownState> {
  private timerId: number | undefined;

  constructor(props: CountDownProps) {
    super(props);
    this.tick = this.tick.bind(this);
    this.state = {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
      time_up: "",
    };
  }

  private pad(n: number) {
    return n < 10 ? "0" + n : String(n);
  }

  private tick() {
    const { deadlineMs, onTimeUp } = this.props;
    const now = Date.now();
    const t = deadlineMs - now;

    if (t <= 0) {
      if (this.timerId) window.clearInterval(this.timerId);
      this.setState({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
        time_up: "TIME IS UP",
      });
      onTimeUp?.();
      return;
    }

    const dd = Math.floor(t / (1000 * 60 * 60 * 24));
    const hh = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mm = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    const ss = Math.floor((t % (1000 * 60)) / 1000);

    this.setState({
      days: this.pad(dd),
      hours: this.pad(hh),
      minutes: this.pad(mm), // ← fixed (was "cells")
      seconds: this.pad(ss),
      time_up: "",
    });
  }

  private start() {
    if (this.timerId) return;
    this.tick(); // immediate paint
    this.timerId = window.setInterval(this.tick, 1000);
  }

  private stop() {
    if (this.timerId) {
      window.clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }

  componentDidMount() {
    if (this.props.start) this.start();
  }

  componentDidUpdate(prevProps: CountDownProps) {
    if (!prevProps.start && this.props.start) this.start();
    if (prevProps.deadlineMs !== this.props.deadlineMs && this.props.start) {
      this.stop();
      this.start();
    }
  }

  componentWillUnmount() {
    this.stop();
  }

  render() {
    const { visible = true } = this.props;
    const { days, hours, minutes, seconds } = this.state;

    return (
      <div id="countdown" style={{ display: visible ? "inline-block" : "none" }}>
        <div className="col-4">
          <div className="box">
            <p id="day">{days}</p>
            <span className="text">Days</span>
          </div>
        </div>
        <div className="col-4">
          <div className="box">
            <p id="hour">{hours}</p>
            <span className="text">Hours</span>
          </div>
        </div>
        <div className="col-4">
          <div className="box">
            <p id="minute">{minutes}</p>
            <span className="text">Minutes</span>
          </div>
        </div>
        <div className="col-4">
          <div className="box">
            <p id="second">{seconds}</p>
            <span className="text">Seconds</span>
          </div>
        </div>
      </div>
    );
  }
}

/* ===========================
    PRELOADER
    =========================== */
class Preloader extends Component {
  componentDidMount() {
    const preload = document.querySelector(".preloader") as HTMLElement | null;
    if (!preload) return;
    setTimeout(() => {
      preload.style.opacity = "0";
      setTimeout(() => {
        preload.style.display = "none";
      }, 900);
    }, 1200);
  }

  render() {
    return (
      <div className="preloader">
        <div className="spinner_wrap">
          <div className="spinner" />
        </div>
      </div>
    );
  }
}

/* ===========================
    MAIN (App)
    =========================== */
export default function ComingSoon() {
  // Beirut is UTC+03 in late 2025; pin offset to avoid client TZ drift
  const launchDate = useMemo(
    () => new Date("2025-11-01T19:00:00+03:00").getTime(),
    []
  );

  return (
    <div
      className="App"
      style={
        {
          // supply the local background via CSS var
          ["--hero-bg" as any]: `url(${homePage1})`,
        } as React.CSSProperties
      }
    >
      <style>{`
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap");

/* ===== Base / Global ===== */
body {
  color: #E6E8EE;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
  background: #0A0F1E;
  margin: 0;
}

/* App wrapper with subtle vignette and local football background */
.App {
  position: fixed;
  inset: 0;
  text-align: center;
  overflow: auto;
  background:
    linear-gradient(rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%), /* overlay for readability */
    var(--hero-bg) no-repeat center center / cover,             /* ← local asset */
    radial-gradient(1200px 600px at 80% -10%, rgba(39,71,125,0.25) 0%, transparent 60%),
    radial-gradient(1200px 600px at 10% 110%, rgba(24,33,66,0.35) 0%, transparent 60%);
}

/* ===== Animated Vertical Lines Overlay ===== */
.bg-lines {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image:
    repeating-linear-gradient(
      to right,
      rgba(255,255,255,0.07) 0px,
      rgba(255,255,255,0.07) 1px,
      transparent 1px,
      transparent 120px
    );
  mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
  animation: linesScroll 8s linear infinite;
}
@keyframes linesScroll {
  0% { transform: translateY(-40px); }
  100% { transform: translateY(40px); }
}

/* Hero container */
.container {
  position: relative;
  z-index: 1; /* above lines */
  width: 100%;
  margin: 12% auto 10%;
  padding-inline: 16px;
}

h1 {
  font-size: clamp(30px, 6vw, 56px);
  text-transform: uppercase;
  line-height: 1.05;
  letter-spacing: 0.5px;
  color: #F7F8FB;
  margin-bottom: 28px;
  text-shadow: 0 6px 28px rgba(0,0,0,0.45);
}

/* ===== Countdown (Glass card) ===== */
#countdown {
  width: min(420px, 92vw);
  padding: 18px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  display: inline-block;
  text-align: center;
  margin: 18px auto 0;
  box-shadow:
    0 8px 24px rgba(0,0,0,0.25),
    inset 0 0 0 1px rgba(255,255,255,0.04);
  backdrop-filter: blur(8px);
}

#countdown .box {
  padding: 12px 8px;
  border-right: 1px solid rgba(255, 255, 255, 0.12);
}
#countdown .col-4:last-child .box {
  border-right-color: transparent;
}
#countdown .box p {
  font-size: clamp(22px, 4vw, 28px);
  font-weight: 700;
  margin: 0 0 6px;
  color: #F4F6FB;
}
#countdown .box .text {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.8;
}

/* Columns */
.col-4 { width: 25%; float: left; }

/* ===== Modal (kept for potential future use) ===== */
#modal {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: min(520px, 92vw);
  background: #0E1627;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  transition: opacity .25s ease, transform .25s ease;
  box-shadow: 0 18px 40px rgba(0,0,0,0.45);
  z-index: 40;
  opacity: 0;
  pointer-events: none;
}
#modal.is_open {
  opacity: 1;
  pointer-events: auto;
}
#modal .wrapper {
  color: #DEE1EA;
  text-align: center;
  padding: 28px;
}

/* ===== Preloader ===== */
.preloader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: linear-gradient(180deg, #0B1020 0%, #0E1426 100%);
  opacity: 1;
  transition: 0.9s opacity;
}
.preloader .spinner_wrap {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}
.preloader .spinner {
  width: 52px;
  height: 52px;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.6));
  border-radius: 8px;
  animation: sk-rotateplane 1.2s infinite ease-in-out;
}

@keyframes sk-rotateplane {
  0% { transform: perspective(120px) rotateX(0) rotateY(0); }
  50% { transform: perspective(120px) rotateX(-180deg) rotateY(0); }
  100% { transform: perspective(120px) rotateX(-180deg) rotateY(-180deg); }
}

/* ===== Utilities ===== */
.clearfix::after { content: ""; display: table; clear: both; }

/* Responsive tweaks */
@media (min-width: 768px) {
  .container { width: 1100px; }
}
      `}</style>

      {/* Animated vertical lines background */}
      <div className="bg-lines" />

      <div className="container">
        <h1>
          Website
          <br />
          Coming Soon
        </h1>

        {/* Countdown: starts & shows immediately */}
        <CountDown start={true} deadlineMs={launchDate} visible={true} />

        {/* Preloader (kept) */}
        <Preloader />
      </div>
    </div>
  );
}
