'use client';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

const values = [
  {
    title: 'Discover',
    description:
      'Find meaningful stories, research, founders and opportunities from rising innovators.',
    icon: BookOpen,
  },
  {
    title: 'Publish',
    description:
      'Give students, researchers and builders a credible place to share their work.',
    icon: Sparkles,
  },
  {
    title: 'Connect',
    description:
      'Bring ambitious people, institutions and ideas together inside one trusted network.',
    icon: Users,
  },
];

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-shell about-hero-grid">
          <div>
            <span className="about-eyebrow">About ARK Chronicles</span>

            <h1>
              A public record for India&apos;s rising ideas and the people building
              them.
            </h1>

            <p>
              ARK Chronicles is a platform for founders, researchers, students and
              innovators to publish credible work, discover useful opportunities
              and connect with a growing knowledge community.
            </p>

            <div className="about-actions">
              <Link href="/explore" className="about-primary">
                Explore Chronicles
                <ArrowRight size={18} />
              </Link>

              <Link href="/submit?type=story" className="about-secondary">
                Share your story
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="about-mark" aria-hidden="true">
            <span>A.R.K</span>
            <strong>CHRONICLES</strong>
            <small>Architects of Rising Knowledge</small>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-shell">
          <div className="about-heading">
            <span>What we do</span>
            <h2>Important work should not remain hidden.</h2>
          </div>

          <div className="about-values">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article key={value.title}>
                  <Icon size={28} />
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="about-mission">
        <div className="about-shell about-mission-grid">
          <div>
            <span className="about-eyebrow">Our mission</span>
            <h2>Make meaningful innovation visible, trusted and discoverable.</h2>
          </div>

          <div className="about-mission-copy">
            <p>
              Many valuable projects, achievements and research ideas remain inside
              classrooms, private folders or small communities. ARK gives that work
              a structured public home.
            </p>

            <div className="about-point">
              <ShieldCheck size={21} />
              <div>
                <strong>Reviewed before publication</strong>
                <span>Submissions stay private until editorial approval.</span>
              </div>
            </div>

            <div className="about-point">
              <Lightbulb size={21} />
              <div>
                <strong>Built around useful knowledge</strong>
                <span>
                  Stories, research and opportunities are organised for meaningful
                  discovery.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="about-shell">
          <span>Become part of ARK</span>
          <h2>Your work could become someone else&apos;s starting point.</h2>

          <Link href="/submit?type=story">
            Submit your story
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <style jsx global>{`
        .about-page {
          min-height: 100vh;
          background: #f7f5ef;
          color: #111;
        }

        .about-shell {
          width: min(1180px, calc(100% - 40px));
          margin-inline: auto;
        }

        .about-hero {
          padding: 110px 0 95px;
          border-bottom: 1px solid #d8d8d2;
          background:
            radial-gradient(circle at 82% 22%, rgba(40, 63, 145, 0.12), transparent 28%),
            #fff;
        }

        .about-hero-grid,
        .about-mission-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          align-items: center;
          gap: 80px;
        }

        .about-eyebrow,
        .about-heading > span,
        .about-cta > div > span {
          color: #283f91;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .about-hero h1 {
          max-width: 780px;
          margin: 18px 0 24px;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(48px, 6.5vw, 82px);
          font-weight: 500;
          line-height: 0.98;
          letter-spacing: -0.055em;
        }

        .about-hero p,
        .about-mission-copy > p {
          max-width: 690px;
          color: #666;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 18px;
          line-height: 1.75;
        }

        .about-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-top: 34px;
        }

        .about-primary,
        .about-secondary,
        .about-cta a {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 15px 19px;
          font-size: 12px;
          font-weight: 850;
        }

        .about-primary,
        .about-cta a {
          background: #283f91;
          color: white;
        }

        .about-secondary {
          border: 1px solid #202020;
          background: white;
          color: #111;
        }

        .about-mark {
          min-height: 350px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          border: 1px solid #d6d6d6;
          background: #f3f0e8;
          text-align: center;
          box-shadow: 20px 24px 0 rgba(40, 63, 145, 0.08);
        }

        .about-mark span {
          font-size: clamp(70px, 9vw, 120px);
          font-weight: 950;
          letter-spacing: -0.09em;
        }

        .about-mark strong {
          margin-top: 14px;
          color: #283f91;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(22px, 3vw, 38px);
          letter-spacing: 0.17em;
        }

        .about-mark small {
          margin-top: 12px;
          color: #777;
          font-size: 8px;
          font-weight: 850;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .about-section {
          padding: 100px 0;
        }

        .about-heading {
          max-width: 720px;
          margin-bottom: 45px;
        }

        .about-heading h2,
        .about-mission h2,
        .about-cta h2 {
          margin: 12px 0 0;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(38px, 5vw, 62px);
          font-weight: 500;
          line-height: 1.04;
          letter-spacing: -0.045em;
        }

        .about-values {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid #111;
          border-bottom: 1px solid #111;
        }

        .about-values article {
          min-height: 310px;
          padding: 32px;
          border-right: 1px solid #d1d1ca;
          background: #fff;
        }

        .about-values article:last-child {
          border-right: 0;
        }

        .about-values svg {
          color: #283f91;
        }

        .about-values h3 {
          margin: 52px 0 13px;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 31px;
          font-weight: 500;
        }

        .about-values p {
          color: #707070;
          font-size: 14px;
          line-height: 1.75;
        }

        .about-mission {
          padding: 105px 0;
          background: #101010;
          color: white;
        }

        .about-mission-grid {
          align-items: start;
        }

        .about-mission-copy > p {
          margin-top: 0;
          color: #b9b9b9;
        }

        .about-point {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 14px;
          padding: 22px 0;
          border-top: 1px solid #363636;
        }

        .about-point:last-child {
          border-bottom: 1px solid #363636;
        }

        .about-point svg {
          color: #8ea1eb;
        }

        .about-point div {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .about-point strong {
          font-size: 14px;
        }

        .about-point span {
          color: #aaa;
          font-size: 12px;
          line-height: 1.6;
        }

        .about-cta {
          padding: 100px 0;
          text-align: center;
          background: white;
        }

        .about-cta h2 {
          max-width: 820px;
          margin: 15px auto 30px;
        }

        .about-cta a {
          margin-inline: auto;
        }

        @media (max-width: 900px) {
          .about-hero-grid,
          .about-mission-grid {
            grid-template-columns: 1fr;
          }

          .about-mark {
            min-height: 300px;
          }

          .about-values {
            grid-template-columns: 1fr;
          }

          .about-values article {
            min-height: 240px;
            border-right: 0;
            border-bottom: 1px solid #d1d1ca;
          }

          .about-values article:last-child {
            border-bottom: 0;
          }
        }

        @media (max-width: 600px) {
          .about-shell {
            width: min(100% - 26px, 1180px);
          }

          .about-hero {
            padding: 75px 0 70px;
          }

          .about-hero-grid,
          .about-mission-grid {
            gap: 45px;
          }

          .about-actions {
            flex-direction: column;
          }

          .about-primary,
          .about-secondary {
            justify-content: center;
          }

          .about-section,
          .about-mission,
          .about-cta {
            padding: 72px 0;
          }
        }
      `}</style>
    </main>
  );
}