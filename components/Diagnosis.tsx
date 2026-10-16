"use client";
import { useEffect, useRef } from "react";
import { initDiagnosis } from "@/lib/engine";

export default function Diagnosis() {
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    return initDiagnosis();
  }, []);

  return (
    <>
      {/* ===== LANDING（入場演出を含む） ===== */}
      <section className="screen active" id="s-intro">
        <div className="stage" id="stage">
          <div className="bar"><span className="mini">Interior Style Diagnosis</span><span className="mini">12 Questions</span></div>
          <div className="globe" id="globe"></div>
          <div className="gcap" id="gcap"></div>
          <svg className="leaders" id="leaders" aria-hidden="true"></svg>
          <div className="center">
            <div className="brandname">セラトレーディング</div>
            <div className="tagline">美という言葉だけでは捉えられない<span className="nw">「BEAUTIFUL LIFE」へ。</span></div>
          </div>
          <div className="entry" id="entry">
            <div className="kick">見つけよう！</div>
            <h1>あなたの<br />ヨーロッパインテリア<br />スタイル診断</h1>
            <p className="sub">12の質問で、あなたに似合うデザインがわかる。</p>
            <button className="start" id="startBtn">診断をはじめる <span>→</span></button>
          </div>
          <button className="skip mini" id="skipBtn">Skip</button>
        </div>
      </section>

      {/* ===== QUIZ ===== */}
      <section className="screen" id="s-quiz">
        <div className="topprog" role="progressbar" aria-label="回答の進み具合" aria-valuemin={0} aria-valuemax={12} id="topprog"><i id="bar"></i></div>
        <div className="quiz">
          <div>
            <div className="qimg" id="qimg"></div>
            <div className="qcap mini" id="qcap"></div>
          </div>
          <div className="qwrap">
            <div className="qhead"><span className="qno" id="qNo">01</span><span className="qof mini" id="qOf">/ 12</span></div>
            <div className="qanim" id="qanim">
              <div className="qtext" id="qText"></div>
              <div className="options" id="options"></div>
            </div>
            <div className="qnav"><button className="lb mini" id="backBtn">← Back</button><button className="lb mini" id="restartBtn">↺ はじめから</button></div>
          </div>
        </div>
      </section>

      {/* ===== LOADING ===== */}
      <section className="screen" id="s-loading">
        <div className="loading"><div className="ring" role="progressbar" aria-label="診断の進み具合" aria-valuemin={0} aria-valuemax={100} id="ring"><svg viewBox="0 0 100 100"><circle className="bg" cx="50" cy="50" r="45" /><circle className="fg" id="ringFg" cx="50" cy="50" r="45" /></svg><span className="pct" id="pct">0<small>%</small></span></div><div className="ltext" id="ltext" aria-live="polite"></div></div>
      </section>

      {/* ===== RESULT ===== */}
      <section className="screen" id="s-result"><div id="result"></div></section>

      <div className="toast" id="toast"></div>
    </>
  );
}
