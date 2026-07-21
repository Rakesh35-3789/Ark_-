'use client';

import { useEffect, useState } from 'react';

export function ArkLoader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.classList.add('ark-loading');
    document.body.style.overflow = 'hidden';

    const exitTimer = window.setTimeout(() => {
      setLeaving(true);
    }, 3200);

    const removeTimer = window.setTimeout(() => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove('ark-loading');
      setVisible(false);
    }, 4250);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove('ark-loading');
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <>
      <div
        className={`ark-opening-loader ${
          leaving ? 'ark-opening-loader-leaving' : ''
        }`}
        role="status"
        aria-label="Opening ARK Chronicles"
      >
        <div className="ark-opening-panel ark-opening-panel-left" />
        <div className="ark-opening-panel ark-opening-panel-right" />

        <div className="ark-opening-paper-texture" />

        <div className="ark-opening-topbar">
          <span>INDIA</span>
          <span>EST. 2026</span>
          <span>THE INNOVATION CHRONICLE</span>
        </div>

        <div className="ark-opening-rule ark-opening-rule-top" />

        <div className="ark-opening-content">
          <p className="ark-opening-eyebrow">
            Architects of Rising Knowledge
          </p>

          <div className="ark-opening-logo" aria-hidden="true">
            <span className="ark-opening-letter ark-opening-letter-a">A</span>

            <span className="ark-opening-dot ark-opening-dot-one">.</span>

            <span className="ark-opening-letter ark-opening-letter-r">R</span>

            <span className="ark-opening-dot ark-opening-dot-two">.</span>

            <span className="ark-opening-letter ark-opening-letter-k">K</span>
          </div>

          <div className="ark-opening-chronicles-mask">
            <span>CHRONICLES</span>
          </div>

          <div className="ark-opening-center-rule">
            <span />
            <i />
            <span />
          </div>

          <p className="ark-opening-description">
            Stories of founders, researchers and builders shaping India&apos;s
            next chapter.
          </p>

          <div className="ark-opening-progress">
            <span />
          </div>

          <p className="ark-opening-status">Opening today&apos;s edition</p>
        </div>

        <div className="ark-opening-rule ark-opening-rule-bottom" />

        <div className="ark-opening-footer">
          <span>FOUNDERS</span>
          <span>RESEARCH</span>
          <span>INNOVATION</span>
          <span>OPPORTUNITIES</span>
        </div>

        <div className="ark-opening-flash" />
      </div>

      <style jsx global>{`
        .ark-opening-loader {
          position: fixed;
          inset: 0;
          z-index: 999999;
          display: grid;
          place-items: center;
          overflow: hidden;
          background: #f2efe6;
          color: #101010;
          isolation: isolate;
        }

        .ark-opening-paper-texture {
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          opacity: 0.42;
          background-image:
            radial-gradient(
              circle at 20% 30%,
              rgba(30, 30, 30, 0.04) 0 1px,
              transparent 1.5px
            ),
            radial-gradient(
              circle at 80% 70%,
              rgba(30, 30, 30, 0.03) 0 1px,
              transparent 1.5px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.28),
              transparent 35%,
              rgba(0, 0, 0, 0.025) 72%,
              transparent
            );
          background-size:
            8px 8px,
            11px 11px,
            100% 100%;
          mix-blend-mode: multiply;
        }

        .ark-opening-panel {
          width: 50.5%;
          height: 100%;
          position: absolute;
          top: 0;
          z-index: 20;
          background: #f2efe6;
          pointer-events: none;
          transform: translateX(0);
        }

        .ark-opening-panel-left {
          left: 0;
          border-right: 1px solid rgba(16, 16, 16, 0.08);
        }

        .ark-opening-panel-right {
          right: 0;
          border-left: 1px solid rgba(16, 16, 16, 0.08);
        }

        .ark-opening-loader:not(.ark-opening-loader-leaving)
          .ark-opening-panel {
          visibility: hidden;
        }

        .ark-opening-loader-leaving .ark-opening-panel-left {
          visibility: visible;
          animation: arkPanelExitLeft 950ms
            cubic-bezier(0.76, 0, 0.24, 1) forwards;
        }

        .ark-opening-loader-leaving .ark-opening-panel-right {
          visibility: visible;
          animation: arkPanelExitRight 950ms
            cubic-bezier(0.76, 0, 0.24, 1) forwards;
        }

        .ark-opening-topbar {
          width: min(1120px, calc(100% - 64px));
          position: absolute;
          top: 30px;
          left: 50%;
          display: flex;
          justify-content: space-between;
          color: rgba(16, 16, 16, 0.58);
          font-family: Arial, Helvetica, sans-serif;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(-10px);
          animation: arkTopbarReveal 500ms 150ms ease forwards;
        }

        .ark-opening-rule {
          width: min(1120px, calc(100% - 64px));
          height: 1px;
          position: absolute;
          left: 50%;
          overflow: hidden;
          background: rgba(16, 16, 16, 0.17);
          transform: translateX(-50%) scaleX(0);
          animation: arkRuleReveal 850ms 260ms
            cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }

        .ark-opening-rule-top {
          top: 57px;
          transform-origin: left;
        }

        .ark-opening-rule-bottom {
          bottom: 57px;
          transform-origin: right;
        }

        .ark-opening-content {
          width: min(1000px, calc(100% - 40px));
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .ark-opening-eyebrow {
          margin: 0 0 27px;
          color: #263d89;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.33em;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(12px);
          animation: arkFadeUp 600ms 320ms ease forwards;
        }

        .ark-opening-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 0.72;
          white-space: nowrap;
        }

        .ark-opening-letter,
        .ark-opening-dot {
          display: inline-block;
          font-family: Georgia, 'Times New Roman', serif;
          opacity: 0;
        }

        .ark-opening-letter {
          font-size: clamp(100px, 17vw, 224px);
          font-weight: 500;
          letter-spacing: -0.085em;
          transform: translateY(65px);
          clip-path: inset(100% 0 0);
        }

        .ark-opening-dot {
          margin: 0 0.025em;
          color: #263d89;
          font-size: clamp(60px, 9vw, 120px);
          transform: scale(0);
        }

        .ark-opening-letter-a {
          animation: arkLetterRise 720ms 500ms
            cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .ark-opening-dot-one {
          animation: arkDotReveal 330ms 940ms ease forwards;
        }

        .ark-opening-letter-r {
          animation: arkLetterRise 720ms 720ms
            cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .ark-opening-dot-two {
          animation: arkDotReveal 330ms 1160ms ease forwards;
        }

        .ark-opening-letter-k {
          animation: arkLetterRise 720ms 940ms
            cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .ark-opening-chronicles-mask {
          max-width: 100%;
          margin-top: 27px;
          overflow: hidden;
        }

        .ark-opening-chronicles-mask span {
          display: block;
          color: #263d89;
          font-family: Arial, Helvetica, sans-serif;
          font-size: clamp(17px, 2.5vw, 34px);
          font-weight: 900;
          letter-spacing: clamp(0.2em, 1vw, 0.48em);
          text-indent: clamp(0.2em, 1vw, 0.48em);
          transform: translateY(110%);
          animation: arkChroniclesReveal 650ms 1.3s
            cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .ark-opening-center-rule {
          width: min(470px, 72%);
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 13px;
          margin-top: 26px;
          opacity: 0;
          animation: arkSimpleFade 500ms 1.65s ease forwards;
        }

        .ark-opening-center-rule span {
          height: 1px;
          background: rgba(16, 16, 16, 0.27);
          transform: scaleX(0);
          animation: arkSmallRuleReveal 580ms 1.72s ease forwards;
        }

        .ark-opening-center-rule span:first-child {
          transform-origin: right;
        }

        .ark-opening-center-rule span:last-child {
          transform-origin: left;
        }

        .ark-opening-center-rule i {
          width: 6px;
          height: 6px;
          display: block;
          border: 1px solid #263d89;
          transform: rotate(45deg);
        }

        .ark-opening-description {
          max-width: 590px;
          margin: 22px 0 0;
          color: rgba(16, 16, 16, 0.63);
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(13px, 1.5vw, 17px);
          line-height: 1.65;
          opacity: 0;
          transform: translateY(12px);
          animation: arkFadeUp 550ms 1.85s ease forwards;
        }

        .ark-opening-progress {
          width: min(330px, 70%);
          height: 2px;
          margin-top: 30px;
          overflow: hidden;
          background: rgba(16, 16, 16, 0.12);
          opacity: 0;
          animation: arkSimpleFade 300ms 2.05s ease forwards;
        }

        .ark-opening-progress span {
          width: 0;
          height: 100%;
          display: block;
          background: #263d89;
          animation: arkProgressFill 1.05s 2.08s
            cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }

        .ark-opening-status {
          margin: 12px 0 0;
          color: rgba(16, 16, 16, 0.43);
          font-family: Arial, Helvetica, sans-serif;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          opacity: 0;
          animation: arkStatusPulse 950ms 2.12s ease-in-out infinite alternate;
        }

        .ark-opening-footer {
          width: min(1120px, calc(100% - 64px));
          position: absolute;
          bottom: 30px;
          left: 50%;
          display: flex;
          justify-content: space-between;
          color: rgba(16, 16, 16, 0.48);
          font-family: Arial, Helvetica, sans-serif;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0;
          animation: arkSimpleFade 500ms 2.15s ease forwards;
        }

        .ark-opening-flash {
          position: absolute;
          inset: 0;
          z-index: 15;
          background: white;
          opacity: 0;
          pointer-events: none;
        }

        .ark-opening-loader-leaving .ark-opening-flash {
          animation: arkExitFlash 500ms ease forwards;
        }

        .ark-opening-loader-leaving .ark-opening-content,
        .ark-opening-loader-leaving .ark-opening-topbar,
        .ark-opening-loader-leaving .ark-opening-rule,
        .ark-opening-loader-leaving .ark-opening-footer {
          animation: arkContentExit 480ms
            cubic-bezier(0.76, 0, 0.24, 1) forwards;
        }

        @keyframes arkLetterRise {
          0% {
            opacity: 0;
            transform: translateY(65px);
            clip-path: inset(100% 0 0);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
            clip-path: inset(0 0 0);
          }
        }

        @keyframes arkDotReveal {
          0% {
            opacity: 0;
            transform: scale(0) rotate(-45deg);
          }

          75% {
            opacity: 1;
            transform: scale(1.22) rotate(4deg);
          }

          100% {
            opacity: 1;
            transform: scale(1) rotate(0);
          }
        }

        @keyframes arkChroniclesReveal {
          from {
            opacity: 0;
            transform: translateY(110%);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes arkFadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes arkTopbarReveal {
          from {
            opacity: 0;
            transform: translate(-50%, -10px);
          }

          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        @keyframes arkRuleReveal {
          from {
            transform: translateX(-50%) scaleX(0);
          }

          to {
            transform: translateX(-50%) scaleX(1);
          }
        }

        @keyframes arkSmallRuleReveal {
          from {
            transform: scaleX(0);
          }

          to {
            transform: scaleX(1);
          }
        }

        @keyframes arkSimpleFade {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes arkProgressFill {
          0% {
            width: 0;
          }

          72% {
            width: 78%;
          }

          100% {
            width: 100%;
          }
        }

        @keyframes arkStatusPulse {
          from {
            opacity: 0.36;
          }

          to {
            opacity: 0.9;
          }
        }

        @keyframes arkContentExit {
          from {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }

          to {
            opacity: 0;
            transform: scale(0.94);
            filter: blur(8px);
          }
        }

        @keyframes arkExitFlash {
          0% {
            opacity: 0;
          }

          45% {
            opacity: 0.5;
          }

          100% {
            opacity: 0;
          }
        }

        @keyframes arkPanelExitLeft {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-102%);
          }
        }

        @keyframes arkPanelExitRight {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(102%);
          }
        }

        @media (max-width: 650px) {
          .ark-opening-topbar {
            width: calc(100% - 32px);
            top: 21px;
          }

          .ark-opening-topbar span:nth-child(2) {
            display: none;
          }

          .ark-opening-rule {
            width: calc(100% - 32px);
          }

          .ark-opening-rule-top {
            top: 46px;
          }

          .ark-opening-rule-bottom {
            bottom: 46px;
          }

          .ark-opening-content {
            width: calc(100% - 28px);
          }

          .ark-opening-eyebrow {
            margin-bottom: 22px;
            font-size: 7px;
            letter-spacing: 0.24em;
          }

          .ark-opening-letter {
            font-size: clamp(80px, 27vw, 122px);
          }

          .ark-opening-dot {
            font-size: clamp(42px, 13vw, 70px);
          }

          .ark-opening-chronicles-mask {
            margin-top: 20px;
          }

          .ark-opening-chronicles-mask span {
            font-size: 15px;
            letter-spacing: 0.25em;
            text-indent: 0.25em;
          }

          .ark-opening-description {
            max-width: 330px;
            font-size: 13px;
            line-height: 1.55;
          }

          .ark-opening-footer {
            width: calc(100% - 32px);
            bottom: 21px;
          }

          .ark-opening-footer span:nth-child(2),
          .ark-opening-footer span:nth-child(3) {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ark-opening-loader *,
          .ark-opening-loader *::before,
          .ark-opening-loader *::after {
            animation-duration: 0.01ms !important;
            animation-delay: 0ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </>
  );
}