/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'ark-clean-loader-seen';

const words = ['Builders', 'Researchers', 'Founders', 'Innovators'];

export function ArkLoader() {
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const alreadySeen =
      window.sessionStorage.getItem(STORAGE_KEY) === 'true';

    if (alreadySeen) {
      setVisible(false);
      return;
    }

    const wordTimer = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % words.length);
    }, 700);

    const closeTimer = window.setTimeout(() => {
      setClosing(true);
    }, 3600);

    const removeTimer = window.setTimeout(() => {
      window.sessionStorage.setItem(STORAGE_KEY, 'true');
      setVisible(false);
    }, 4300);

    return () => {
      window.clearInterval(wordTimer);
      window.clearTimeout(closeTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <>
      <div
        className={`ark-clean-loader ${
          closing ? 'ark-clean-loader-closing' : ''
        }`}
        role="status"
        aria-label="Opening ARK"
      >
        <div className="ark-clean-grid" />

        <div className="ark-clean-line ark-clean-line-top" />
        <div className="ark-clean-line ark-clean-line-bottom" />

        <div className="ark-clean-content">
          <div className="ark-clean-kicker">
            India&apos;s Innovation Chronicle
          </div>

          <div className="ark-clean-logo" aria-hidden="true">
            <span className="ark-letter ark-letter-a">A</span>
            <span className="ark-letter ark-letter-r">R</span>
            <span className="ark-letter ark-letter-k">K</span>
          </div>

          <div className="ark-clean-divider">
            <span />
          </div>

          <h1>Architects of Rising Knowledge</h1>

          <div className="ark-clean-changing">
            <span>Connecting India&apos;s</span>
            <strong key={words[wordIndex]}>{words[wordIndex]}</strong>
          </div>

          <div className="ark-clean-progress">
            <span className="ark-progress-bar" />
          </div>
        </div>

        <div className="ark-clean-corner ark-clean-left">
          ARK / 2026
        </div>

        <div className="ark-clean-corner ark-clean-right">
          Opening Chronicle
        </div>
      </div>

      <style jsx global>{`
        .ark-clean-loader {
          position: fixed;
          inset: 0;
          z-index: 999999;
          display: grid;
          place-items: center;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 50% 42%,
              rgba(58, 72, 112, 0.12),
              transparent 32%
            ),
            #08090b;
          color: #f2efe8;
          opacity: 1;
          transform: scale(1);
          transition:
            opacity 700ms cubic-bezier(0.76, 0, 0.24, 1),
            transform 850ms cubic-bezier(0.76, 0, 0.24, 1),
            filter 700ms ease;
        }

        .ark-clean-loader-closing {
          opacity: 0;
          transform: scale(1.05);
          filter: blur(14px);
          pointer-events: none;
        }

        .ark-clean-grid {
          position: absolute;
          inset: -8%;
          opacity: 0.1;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.11) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.11) 1px,
              transparent 1px
            );
          background-size: 72px 72px;
          transform: perspective(800px) rotateX(59deg) translateY(22%);
          transform-origin: center bottom;
          animation: arkCleanGridMove 8s linear infinite;
          mask-image: radial-gradient(circle at center, black, transparent 70%);
        }

        .ark-clean-line {
          position: absolute;
          left: 50%;
          width: min(88vw, 1180px);
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.14),
            transparent
          );
          transform: translateX(-50%);
        }

        .ark-clean-line-top {
          top: 19%;
        }

        .ark-clean-line-bottom {
          bottom: 19%;
        }

        .ark-clean-content {
          width: min(920px, calc(100% - 40px));
          position: relative;
          z-index: 4;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .ark-clean-kicker {
          margin-bottom: 34px;
          color: rgba(255, 255, 255, 0.47);
          font-family: Arial, Helvetica, sans-serif;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          opacity: 0;
          animation: arkCleanFadeUp 650ms 120ms forwards;
        }

        .ark-clean-logo {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 0;
          line-height: 0.8;
          white-space: nowrap;
        }

        .ark-letter {
          display: inline-block;
          font-family: Arial, Helvetica, sans-serif;
          font-size: clamp(92px, 15vw, 220px);
          font-weight: 950;
          letter-spacing: -0.1em;
          opacity: 0;
          transform: translateY(85px) scale(0.75);
          filter: blur(14px);
        }

        .ark-letter-a {
          color: #eee9df;
          animation: arkCleanLetterReveal 800ms 250ms forwards;
        }

        .ark-letter-r {
          color: #495f91;
          animation: arkCleanLetterReveal 800ms 600ms forwards;
          text-shadow:
            0 0 24px rgba(73, 95, 145, 0.34),
            0 0 60px rgba(73, 95, 145, 0.16);
        }

        .ark-letter-k {
          color: #b8bcc3;
          animation: arkCleanLetterReveal 800ms 950ms forwards;
        }

        .ark-clean-divider {
          width: min(520px, 76%);
          height: 1px;
          margin: 37px 0 24px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.11);
        }

        .ark-clean-divider span {
          width: 100%;
          height: 100%;
          display: block;
          background: linear-gradient(
            90deg,
            transparent,
            #495f91,
            #f1eee8,
            #495f91,
            transparent
          );
          transform: translateX(-100%);
          animation: arkCleanLineDraw 1.3s 1.3s forwards;
        }

        .ark-clean-content h1 {
          margin: 0;
          color: rgba(255, 255, 255, 0.9);
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(18px, 2.4vw, 30px);
          font-weight: 400;
          letter-spacing: 0.06em;
          opacity: 0;
          transform: translateY(14px);
          animation: arkCleanFadeUp 650ms 1.55s forwards;
        }

        .ark-clean-changing {
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 20px;
          color: rgba(255, 255, 255, 0.42);
          font-family: Arial, Helvetica, sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          opacity: 0;
          animation: arkCleanFadeUp 650ms 1.85s forwards;
        }

        .ark-clean-changing strong {
          color: #8292b8;
          font-weight: 900;
          animation: arkCleanWordReveal 520ms ease both;
        }

        .ark-clean-progress {
          width: min(420px, 78%);
          height: 2px;
          margin-top: 30px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.11);
          opacity: 0;
          animation: arkCleanFadeUp 500ms 2.05s forwards;
        }

        .ark-progress-bar {
          width: 0;
          height: 100%;
          display: block;
          background: linear-gradient(90deg, #495f91, #f2efe8);
          animation: arkCleanProgress 1.8s 2.1s
            cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }

        .ark-clean-corner {
          position: absolute;
          bottom: 24px;
          color: rgba(255, 255, 255, 0.27);
          font-family: monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          opacity: 0;
          animation: arkCleanFadeUp 450ms 2.25s forwards;
        }

        .ark-clean-left {
          left: 27px;
        }

        .ark-clean-right {
          right: 27px;
        }

        @keyframes arkCleanLetterReveal {
          0% {
            opacity: 0;
            transform: translateY(85px) scale(0.75);
            filter: blur(14px);
          }

          70% {
            opacity: 1;
            transform: translateY(-7px) scale(1.035);
            filter: blur(0);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes arkCleanFadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes arkCleanLineDraw {
          from {
            transform: translateX(-100%);
          }

          to {
            transform: translateX(100%);
          }
        }

        @keyframes arkCleanWordReveal {
          from {
            opacity: 0;
            transform: translateY(9px);
            filter: blur(4px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes arkCleanProgress {
          0% {
            width: 0;
          }

          50% {
            width: 46%;
          }

          78% {
            width: 76%;
          }

          100% {
            width: 100%;
          }
        }

        @keyframes arkCleanGridMove {
          from {
            background-position: 0 0;
          }

          to {
            background-position: 72px 72px;
          }
        }

        @media (max-width: 650px) {
          .ark-clean-content {
            width: min(100% - 28px, 920px);
          }

          .ark-clean-kicker {
            margin-bottom: 25px;
            font-size: 8px;
            letter-spacing: 0.22em;
          }

          .ark-letter {
            font-size: clamp(78px, 24vw, 118px);
          }

          .ark-clean-content h1 {
            font-size: 17px;
            line-height: 1.45;
          }

          .ark-clean-changing {
            flex-direction: column;
            gap: 5px;
          }

          .ark-clean-line {
            width: calc(100% - 28px);
          }

          .ark-clean-corner {
            bottom: 17px;
            font-size: 7px;
          }

          .ark-clean-left {
            left: 16px;
          }

          .ark-clean-right {
            right: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ark-clean-loader *,
          .ark-clean-loader *::before,
          .ark-clean-loader *::after {
            animation-duration: 0.01ms !important;
            animation-delay: 0ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </>
  );
}