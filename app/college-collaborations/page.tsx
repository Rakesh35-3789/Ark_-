import Link from 'next/link';

const collaborationAreas = [
  {
    number: '01',
    title: 'Research Partnerships',
    description:
      'Connect students, faculty members and researchers to publish meaningful academic and technical work.',
  },
  {
    number: '02',
    title: 'Innovation Ecosystems',
    description:
      'Highlight incubation centres, innovation labs, entrepreneurship cells and student-led startup communities.',
  },
  {
    number: '03',
    title: 'Student Achievements',
    description:
      'Document hackathon wins, research milestones, placements, awards, patents and important campus achievements.',
  },
  {
    number: '04',
    title: 'Founder Development',
    description:
      'Give student founders a platform to share their journeys, products, challenges and growth stories.',
  },
];

const benefits = [
  'Dedicated college profile and collaboration visibility',
  'Student, founder and researcher story publication',
  'Research paper and innovation showcase',
  'Event, hackathon and opportunity promotion',
  'Editorial support from ARK Chronicles',
  'Long-term institutional partnership possibilities',
];

export default function CollegeCollaborationsPage() {
  return (
    <main className="college-page">
      <section className="college-hero">
        <div className="college-shell hero-layout">
          <div>
            <div className="eyebrow">ARK College Network</div>

            <h1>
              Colleges collaborating
              <span> for greater impact.</span>
            </h1>

            <p>
              ARK Chronicles works with colleges, universities, innovation
              cells and research communities to bring student achievements,
              research and founder stories into the spotlight.
            </p>

            <div className="hero-actions">
              <a
                href="mailto:partnerships@arkchronicles.com"
                className="primary-button"
              >
                Become a College Partner
              </a>

              <Link href="/about" className="secondary-button">
                Learn About ARK
              </Link>
            </div>
          </div>

          <div className="partnership-card">
            <span className="card-label">Partnership vision</span>

            <h2>
              Building a stronger bridge between campuses and the innovation
              world.
            </h2>

            <div className="partnership-points">
              <div>
                <strong>Students</strong>
                <span>Recognition and opportunities</span>
              </div>

              <div>
                <strong>Researchers</strong>
                <span>Publication and visibility</span>
              </div>

              <div>
                <strong>Colleges</strong>
                <span>Innovation ecosystem showcase</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mission-section">
        <div className="college-shell mission-grid">
          <div className="mission-heading">
            <span className="section-label">Why collaborate</span>

            <h2>
              Every campus has stories that deserve a larger audience.
            </h2>
          </div>

          <div className="mission-copy">
            <p>
              Students build products, researchers solve important problems,
              founders launch companies and institutions create powerful
              innovation ecosystems.
            </p>

            <p>
              ARK Chronicles creates a trusted platform where these
              achievements can be documented, celebrated and connected with
              the wider technology and innovation community.
            </p>
          </div>
        </div>
      </section>

      <section className="areas-section">
        <div className="college-shell">
          <div className="section-heading">
            <div>
              <span className="section-label">Collaboration areas</span>
              <h2>How ARK works with colleges</h2>
            </div>

            <p>
              Our collaboration model supports students, educators, research
              groups, founder communities and institutional innovation teams.
            </p>
          </div>

          <div className="areas-grid">
            {collaborationAreas.map((area) => (
              <article key={area.number} className="area-card">
                <span className="area-number">{area.number}</span>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="benefits-section">
        <div className="college-shell benefits-layout">
          <div className="benefits-intro">
            <span className="section-label">Partner benefits</span>

            <h2>What colleges receive through collaboration</h2>

            <p>
              Collaboration can begin with a simple content partnership and
              grow into a stronger long-term relationship.
            </p>
          </div>

          <div className="benefits-list">
            {benefits.map((benefit, index) => (
              <div key={benefit} className="benefit-item">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="process-section">
        <div className="college-shell">
          <div className="section-heading">
            <div>
              <span className="section-label">Simple process</span>
              <h2>Start a collaboration</h2>
            </div>
          </div>

          <div className="process-grid">
            <article>
              <span>Step 01</span>
              <h3>Contact ARK</h3>
              <p>
                A college representative, faculty member or innovation cell can
                contact the ARK team.
              </p>
            </article>

            <article>
              <span>Step 02</span>
              <h3>Discuss the partnership</h3>
              <p>
                We understand your institution, achievements, research and
                collaboration goals.
              </p>
            </article>

            <article>
              <span>Step 03</span>
              <h3>Build the showcase</h3>
              <p>
                ARK publishes approved stories, profiles, research and important
                college updates.
              </p>
            </article>

            <article>
              <span>Step 04</span>
              <h3>Grow together</h3>
              <p>
                The partnership can expand through events, opportunities,
                publications and innovation programmes.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="college-cta">
        <div className="college-shell cta-box">
          <div>
            <span className="section-label">Partner with ARK</span>

            <h2>Bring your college innovation stories to the world.</h2>

            <p>
              Contact the ARK Chronicles team to discuss an institutional or
              student-community collaboration.
            </p>
          </div>

          <a
            href="mailto:partnerships@arkchronicles.com"
            className="light-button"
          >
            Contact for Collaboration
          </a>
        </div>
      </section>

      <style>{`
        .college-page {
          min-height: 100vh;
          background: #f5f2e9;
          color: #142019;
        }

        .college-shell {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
        }

        .college-hero {
          padding: 92px 0 82px;
          background:
            radial-gradient(
              circle at 86% 14%,
              rgba(52, 77, 145, 0.18),
              transparent 31%
            ),
            radial-gradient(
              circle at 12% 89%,
              rgba(21, 115, 72, 0.12),
              transparent 28%
            ),
            linear-gradient(135deg, #faf8f1, #edf2ec);
          border-bottom: 1px solid rgba(20, 40, 30, 0.12);
        }

        .hero-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(330px, 0.75fr);
          align-items: center;
          gap: 70px;
        }

        .eyebrow,
        .section-label,
        .card-label {
          color: #1f316f;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .college-hero h1 {
          max-width: 780px;
          margin: 15px 0 22px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(51px, 7vw, 90px);
          line-height: 0.96;
          letter-spacing: -0.055em;
        }

        .college-hero h1 span {
          color: #1f316f;
        }

        .college-hero p {
          max-width: 690px;
          margin: 0;
          color: #68736c;
          font-size: 17px;
          line-height: 1.75;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 31px;
        }

        .primary-button,
        .secondary-button,
        .light-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0 20px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 900;
          text-decoration: none;
          transition: transform 0.2s ease;
        }

        .primary-button {
          background: #1f316f;
          border: 1px solid #1f316f;
          color: white;
        }

        .secondary-button {
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid #c5cdc7;
          color: #17231c;
        }

        .primary-button:hover,
        .secondary-button:hover,
        .light-button:hover {
          transform: translateY(-2px);
        }

        .partnership-card {
          padding: 31px;
          border: 1px solid rgba(20, 40, 30, 0.11);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 30px 70px rgba(31, 49, 111, 0.12);
          backdrop-filter: blur(16px);
        }

        .partnership-card h2 {
          margin: 15px 0 28px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 30px;
          line-height: 1.2;
        }

        .partnership-points {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .partnership-points div {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 14px 0;
          border-top: 1px solid #e1e7e2;
        }

        .partnership-points strong {
          font-size: 13px;
        }

        .partnership-points span {
          color: #6d7770;
          font-size: 11px;
          text-align: right;
        }

        .mission-section {
          padding: 85px 0;
        }

        .mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
        }

        .mission-heading h2,
        .section-heading h2,
        .benefits-intro h2,
        .college-cta h2 {
          margin: 10px 0 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(37px, 5vw, 59px);
          line-height: 1.04;
          letter-spacing: -0.045em;
        }

        .mission-copy p,
        .benefits-intro p {
          margin: 0 0 20px;
          color: #66716a;
          font-size: 16px;
          line-height: 1.8;
        }

        .areas-section {
          padding: 80px 0 95px;
          background: #edf1eb;
        }

        .section-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 50px;
          margin-bottom: 38px;
        }

        .section-heading > p {
          max-width: 500px;
          margin: 0;
          color: #68736c;
          line-height: 1.7;
        }

        .areas-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 17px;
        }

        .area-card {
          min-height: 310px;
          padding: 25px;
          border: 1px solid rgba(20, 40, 30, 0.1);
          border-radius: 18px;
          background: #fffefa;
        }

        .area-number {
          color: #1f316f;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 31px;
        }

        .area-card h3 {
          margin: 47px 0 15px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 24px;
        }

        .area-card p {
          margin: 0;
          color: #68736c;
          font-size: 14px;
          line-height: 1.7;
        }

        .benefits-section {
          padding: 95px 0;
        }

        .benefits-layout {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 80px;
        }

        .benefits-list {
          border-top: 1px solid #cfd7d1;
        }

        .benefit-item {
          display: grid;
          grid-template-columns: 50px 1fr;
          gap: 18px;
          padding: 20px 0;
          border-bottom: 1px solid #cfd7d1;
        }

        .benefit-item span {
          color: #1f316f;
          font-size: 11px;
          font-weight: 900;
        }

        .benefit-item p {
          margin: 0;
          font-size: 15px;
          font-weight: 700;
          line-height: 1.55;
        }

        .process-section {
          padding: 85px 0 95px;
          background: #18251e;
          color: white;
        }

        .process-section .section-label {
          color: #aab7f1;
        }

        .process-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .process-grid article {
          padding: 25px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.05);
        }

        .process-grid span {
          color: #aab7f1;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .process-grid h3 {
          margin: 40px 0 14px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 24px;
        }

        .process-grid p {
          margin: 0;
          color: rgba(255, 255, 255, 0.66);
          font-size: 14px;
          line-height: 1.7;
        }

        .college-cta {
          padding: 90px 0;
        }

        .cta-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 45px;
          padding: 50px;
          border-radius: 24px;
          background: #1f316f;
          color: white;
        }

        .cta-box .section-label {
          color: rgba(255, 255, 255, 0.67);
        }

        .cta-box p {
          max-width: 650px;
          margin: 17px 0 0;
          color: rgba(255, 255, 255, 0.74);
          line-height: 1.7;
        }

        .light-button {
          flex-shrink: 0;
          background: white;
          border: 1px solid white;
          color: #1f316f;
        }

        @media (max-width: 1000px) {
          .hero-layout,
          .mission-grid,
          .benefits-layout {
            grid-template-columns: 1fr;
            gap: 45px;
          }

          .areas-grid,
          .process-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .section-heading,
          .cta-box {
            align-items: flex-start;
            flex-direction: column;
          }

          .areas-grid,
          .process-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 520px) {
          .college-shell {
            width: min(100% - 24px, 1180px);
          }

          .college-hero {
            padding: 68px 0 55px;
          }

          .hero-actions {
            flex-direction: column;
          }

          .primary-button,
          .secondary-button {
            width: 100%;
          }

          .partnership-card,
          .area-card {
            padding: 21px;
          }

          .cta-box {
            padding: 31px 24px;
          }
        }
      `}</style>
    </main>
  );
}