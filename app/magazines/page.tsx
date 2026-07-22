'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BookOpenText,
  Download,
  FileText,
  LibraryBig,
  Sparkles,
} from 'lucide-react';

const futureFeatures = [
  {
    title: 'Digital editions',
    description:
      'Read approved ARK magazine issues clearly from mobile, tablet or desktop.',
    icon: BookOpenText,
  },
  {
    title: 'Issue archive',
    description:
      'Explore monthly editions and important previously published releases.',
    icon: LibraryBig,
  },
  {
    title: 'Downloadable copies',
    description:
      'Download official PDF editions whenever the editorial team publishes them.',
    icon: Download,
  },
];

export default function MagazinesPage() {
  return (
    <main className="magazines-page">
      <section className="magazines-hero">
        <div className="shell magazines-hero-grid">
          <div className="magazines-copy">
            <span className="magazines-eyebrow">ARK Magazine</span>

            <h1>Ideas, research and journeys worth remembering.</h1>

            <p>
              ARK Magazine brings together verified founder stories, student
              achievements, meaningful research and important opportunities in
              one carefully reviewed publication.
            </p>

            <div className="magazines-actions">
              <a href="#magazine-library" className="magazines-primary">
                Explore Magazine
                <ArrowRight size={18} />
              </a>

              <Link
                href="/submit?type=story"
                className="magazines-secondary"
              >
                Submit a story
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="magazines-cover" aria-label="ARK Magazine preview">
            <span>THE ARK EDITION</span>

            <strong>A.R.K</strong>

            <h2>CHRONICLE</h2>

            <div className="magazine-divider" />

            <p>Founders · Research · Students · Innovation</p>

            <small>ISSUE 01 · COMING SOON</small>
          </div>
        </div>
      </section>

      <section
        className="magazines-section"
        id="magazine-library"
      >
        <div className="shell">
          <div className="magazines-heading">
            <span>Magazine library</span>

            <h2>The first verified ARK issue is being prepared.</h2>

            <p>
              No public edition has been released yet. Approved magazine issues
              will appear here automatically after the editorial team publishes
              them.
            </p>
          </div>

          <div className="magazines-empty">
            <FileText size={42} />

            <div>
              <span>Coming soon</span>

              <h3>
                Your next source of credible innovation stories.
              </h3>

              <p>
                The first ARK Magazine issue is currently being prepared. Until
                then, explore approved stories, founders and research from the
                ARK community.
              </p>
            </div>

            <Link href="/explore">
              Explore ARK stories
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="magazines-feature-grid">
            {futureFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <article key={feature.title}>
                  <span className="magazine-feature-icon">
                    <Icon size={27} />
                  </span>

                  <h3>{feature.title}</h3>

                  <p>{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="magazines-cta">
        <div className="shell magazines-cta-inner">
          <Sparkles size={30} />

          <span>Contribute to the first edition</span>

          <h2>A meaningful magazine begins with meaningful stories.</h2>

          <p>
            Share your journey, achievement, research or innovation with the ARK
            editorial team.
          </p>

          <Link href="/submit?type=story">
            Share your work
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <style jsx global>{`
        .magazines-page {
          min-height: 100vh;
          overflow: hidden;
          background: #f4f0e6;
          color: #111111;
        }

        .magazines-hero {
          position: relative;
          padding: 95px 0;
          overflow: hidden;
          border-bottom: 1px solid #d8d2c6;
          background:
            radial-gradient(
              circle at 82% 20%,
              rgba(40, 63, 145, 0.13),
              transparent 32%
            ),
            #f4f0e6;
        }

        .magazines-hero::before {
          width: 340px;
          height: 340px;
          position: absolute;
          right: -140px;
          bottom: -180px;
          border: 1px solid rgba(40, 63, 145, 0.16);
          border-radius: 50%;
          content: '';
        }

        .magazines-hero-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.7fr);
          align-items: center;
          gap: 76px;
        }

        .magazines-eyebrow,
        .magazines-heading > span,
        .magazines-empty > div > span,
        .magazines-cta span {
          color: #283f91;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .magazines-copy h1 {
          max-width: 820px;
          margin: 18px 0 24px;
          color: #111111;
          font: 500 clamp(48px, 6vw, 78px) / 1
            Georgia, 'Times New Roman', serif;
          letter-spacing: -0.05em;
        }

        .magazines-copy > p {
          max-width: 700px;
          margin: 0;
          color: #68645d;
          font-size: 17px;
          line-height: 1.75;
        }

        .magazines-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 13px;
          margin-top: 32px;
        }

        .magazines-primary,
        .magazines-secondary {
          min-height: 50px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 0 20px;
          font-size: 12px;
          font-weight: 850;
          transition:
            transform 180ms ease,
            background 180ms ease,
            color 180ms ease;
        }

        .magazines-primary {
          border: 1px solid #283f91;
          background: #283f91;
          color: #ffffff;
        }

        .magazines-primary:hover {
          background: #192d6d;
          transform: translateY(-3px);
        }

        .magazines-secondary {
          border: 1px solid #bdb6aa;
          background: #fbf8f2;
          color: #111111;
        }

        .magazines-secondary:hover {
          border-color: #283f91;
          color: #283f91;
          transform: translateY(-3px);
        }

        .magazines-cover {
          min-height: 510px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          overflow: hidden;
          padding: 42px 30px;
          border: 1px solid #cfc8bc;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.92),
              rgba(235, 229, 217, 0.94)
            );
          text-align: center;
          box-shadow:
            25px 28px 0 rgba(40, 63, 145, 0.09),
            0 30px 70px rgba(31, 38, 56, 0.08);
          transform: rotate(1deg);
          transition: transform 250ms ease;
        }

        .magazines-cover:hover {
          transform: rotate(0deg) translateY(-5px);
        }

        .magazines-cover::after {
          position: absolute;
          inset: 16px;
          border: 1px solid rgba(17, 17, 17, 0.1);
          content: '';
          pointer-events: none;
        }

        .magazines-cover > span {
          color: #283f91;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.22em;
        }

        .magazines-cover strong {
          margin-top: 66px;
          color: #111111;
          font-size: clamp(72px, 9vw, 126px);
          font-weight: 950;
          letter-spacing: -0.1em;
          line-height: 0.8;
        }

        .magazines-cover h2 {
          margin: 35px 0 0;
          color: #283f91;
          font: 500 clamp(29px, 4vw, 48px)
            Georgia, 'Times New Roman', serif;
          letter-spacing: 0.18em;
        }

        .magazine-divider {
          width: 92px;
          height: 2px;
          margin: 40px auto 25px;
          background: #d4a017;
        }

        .magazines-cover p {
          color: #54504a;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .magazines-cover small {
          position: absolute;
          bottom: 37px;
          color: #68645d;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 0.15em;
        }

        .magazines-section {
          padding: 100px 0;
          background: #f4f0e6;
        }

        .magazines-heading {
          max-width: 850px;
          margin-bottom: 40px;
        }

        .magazines-heading h2 {
          margin: 13px 0 18px;
          font: 500 clamp(38px, 5vw, 62px) / 1.06
            Georgia, 'Times New Roman', serif;
          letter-spacing: -0.035em;
        }

        .magazines-heading p {
          max-width: 700px;
          margin: 0;
          color: #68645d;
          font-size: 15px;
          line-height: 1.75;
        }

        .magazines-empty {
          min-height: 285px;
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 30px;
          padding: 42px;
          border-top: 1px solid #111111;
          border-bottom: 1px solid #111111;
          background: #fbf8f2;
        }

        .magazines-empty > svg {
          color: #283f91;
        }

        .magazines-empty h3 {
          margin: 12px 0 10px;
          font: 500 clamp(28px, 4vw, 43px) / 1.1
            Georgia, 'Times New Roman', serif;
        }

        .magazines-empty p {
          max-width: 660px;
          margin: 0;
          color: #68645d;
          line-height: 1.7;
        }

        .magazines-empty > a {
          min-height: 47px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 18px;
          border: 1px solid #283f91;
          color: #283f91;
          font-size: 11px;
          font-weight: 850;
          white-space: nowrap;
          transition: 180ms ease;
        }

        .magazines-empty > a:hover {
          background: #283f91;
          color: #ffffff;
          transform: translateY(-3px);
        }

        .magazines-feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 42px;
        }

        .magazines-feature-grid article {
          min-height: 240px;
          padding: 30px;
          border: 1px solid #d8d2c6;
          background: #fbf8f2;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease;
        }

        .magazines-feature-grid article:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 42px rgba(30, 34, 42, 0.08);
        }

        .magazine-feature-icon {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(40, 63, 145, 0.18);
          background: rgba(40, 63, 145, 0.06);
          color: #283f91;
        }

        .magazines-feature-grid h3 {
          margin: 26px 0 12px;
          font: 500 26px Georgia, 'Times New Roman', serif;
        }

        .magazines-feature-grid p {
          margin: 0;
          color: #68645d;
          font-size: 13px;
          line-height: 1.7;
        }

        .magazines-cta {
          padding: 95px 0;
          border-top: 1px solid #d8d2c6;
          background: #1f367a;
          color: #ffffff;
          text-align: center;
        }

        .magazines-cta-inner {
          display: flex;
          align-items: center;
          flex-direction: column;
        }

        .magazines-cta svg {
          margin-bottom: 18px;
          color: #f0c34c;
        }

        .magazines-cta span {
          color: #f0c34c;
        }

        .magazines-cta h2 {
          max-width: 850px;
          margin: 17px auto 15px;
          font: 500 clamp(39px, 5vw, 64px) / 1.05
            Georgia, 'Times New Roman', serif;
          letter-spacing: -0.04em;
        }

        .magazines-cta p {
          max-width: 600px;
          margin: 0 auto;
          color: rgba(255, 255, 255, 0.72);
          line-height: 1.7;
        }

        .magazines-cta a {
          min-height: 51px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin-top: 30px;
          padding: 0 21px;
          background: #ffffff;
          color: #1f367a;
          font-size: 12px;
          font-weight: 900;
          transition: transform 180ms ease;
        }

        .magazines-cta a:hover {
          transform: translateY(-4px);
        }

        @media (max-width: 900px) {
          .magazines-hero-grid {
            grid-template-columns: 1fr;
          }

          .magazines-cover {
            width: min(520px, 100%);
            margin-inline: auto;
          }

          .magazines-empty {
            grid-template-columns: auto 1fr;
          }

          .magazines-empty > a {
            grid-column: 1 / -1;
            justify-self: flex-start;
          }

          .magazines-feature-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .magazines-hero {
            padding: 70px 0;
          }

          .magazines-hero-grid {
            gap: 55px;
          }

          .magazines-copy h1 {
            font-size: 46px;
          }

          .magazines-actions {
            align-items: stretch;
            flex-direction: column;
          }

          .magazines-primary,
          .magazines-secondary {
            width: 100%;
          }

          .magazines-cover {
            min-height: 430px;
            padding: 30px 18px;
            box-shadow: 13px 15px 0 rgba(40, 63, 145, 0.09);
          }

          .magazines-cover strong {
            margin-top: 45px;
            font-size: 85px;
          }

          .magazines-cover h2 {
            font-size: 28px;
            letter-spacing: 0.12em;
          }

          .magazines-section {
            padding: 75px 0;
          }

          .magazines-empty {
            display: flex;
            align-items: flex-start;
            flex-direction: column;
            padding: 30px 23px;
          }

          .magazines-empty > a {
            width: 100%;
          }

          .magazines-cta {
            padding: 75px 0;
          }
        }
      `}</style>
    </main>
  );
}