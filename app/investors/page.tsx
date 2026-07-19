import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Investor = {
  id: string;
  name: string;
  firm: string | null;
  role_title: string | null;
  city: string | null;
  bio: string | null;
  website: string | null;
  status: string | null;
  created_at: string | null;
};

export const dynamic = 'force-dynamic';

export default async function InvestorsPage() {
  const { data, error } = await supabase
    .from('investors')
    .select(
      'id,name,firm,role_title,city,bio,website,status,created_at',
    )
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  const investors = (data || []) as Investor[];

  return (
    <main className="investors-page">
      <section className="investors-hero">
        <div className="investors-shell hero-grid">
          <div>
            <div className="eyebrow">ARK Investor Network</div>

            <h1>
              Meet the people
              <span> powering innovation.</span>
            </h1>

            <p>
              Discover investors, venture partners, mentors and funding
              organisations supporting founders, researchers and student
              innovators.
            </p>

            <div className="hero-actions">
              <Link href="/submit" className="primary-button">
                Submit Investor Profile
              </Link>

              <Link href="/founders" className="secondary-button">
                Explore Founders
              </Link>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-top">
              <span>ARK Network</span>
              <strong>{investors.length}</strong>
            </div>

            <h2>Approved investors</h2>

            <p>
              Every profile shown here has been reviewed and approved by the
              ARK Chronicles editorial team.
            </p>

            <div className="trust-row">
              <span>Verified profiles</span>
              <span>Startup supporters</span>
              <span>Research partners</span>
            </div>
          </div>
        </div>
      </section>

      <section className="investors-section">
        <div className="investors-shell">
          <div className="section-heading">
            <div>
              <span className="section-label">Investor directory</span>
              <h2>Featured investors</h2>
            </div>

            <p>
              Connect with investors and organisations helping ideas become
              real products, companies and research outcomes.
            </p>
          </div>

          {error ? (
            <div className="empty-state error-state">
              <div className="empty-icon">!</div>
              <h3>Unable to load investors</h3>
              <p>{error.message}</p>
            </div>
          ) : investors.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">I</div>
              <h3>No approved investors yet</h3>
              <p>
                Investor profiles will appear here after they are submitted and
                approved by the ARK admin.
              </p>

              <Link href="/submit" className="primary-button">
                Submit the first investor
              </Link>
            </div>
          ) : (
            <div className="investors-grid">
              {investors.map((investor) => (
                <article className="investor-card" key={investor.id}>
                  <div className="card-top">
                    <div className="avatar">
                      {investor.name?.charAt(0).toUpperCase() || 'I'}
                    </div>

                    <div className="card-heading">
                      <span className="verified-badge">ARK Approved</span>
                      <h3>{investor.name}</h3>

                      <p>
                        {investor.role_title || 'Investor'}
                        {investor.firm ? ` · ${investor.firm}` : ''}
                      </p>
                    </div>
                  </div>

                  {investor.city && (
                    <div className="location">{investor.city}</div>
                  )}

                  <p className="bio">
                    {investor.bio ||
                      'This investor supports founders, researchers and innovation-driven teams.'}
                  </p>

                  <div className="card-footer">
                    <div>
                      <span>Organisation</span>
                      <strong>
                        {investor.firm || 'Independent Investor'}
                      </strong>
                    </div>

                    {investor.website ? (
                      <a
                        href={investor.website}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visit Website
                      </a>
                    ) : (
                      <span className="no-link">Profile verified</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="investor-cta">
        <div className="investors-shell cta-box">
          <div>
            <span className="section-label">Join the network</span>
            <h2>Are you supporting innovation?</h2>

            <p>
              Submit your investor profile and become part of the ARK
              Chronicles innovation ecosystem.
            </p>
          </div>

          <Link href="/submit" className="light-button">
            Submit Investor
          </Link>
        </div>
      </section>

      <style>{`
        .investors-page {
          min-height: 100vh;
          background: #f5f2e9;
          color: #142019;
        }

        .investors-shell {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
        }

        .investors-hero {
          position: relative;
          overflow: hidden;
          padding: 92px 0 82px;
          background:
            radial-gradient(
              circle at 85% 15%,
              rgba(50, 75, 145, 0.2),
              transparent 31%
            ),
            radial-gradient(
              circle at 10% 90%,
              rgba(29, 111, 76, 0.13),
              transparent 29%
            ),
            linear-gradient(135deg, #faf8f1, #edf2ec);
          border-bottom: 1px solid rgba(20, 40, 30, 0.12);
        }

        .hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.65fr);
          align-items: center;
          gap: 70px;
        }

        .eyebrow,
        .section-label {
          color: #1f316f;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .investors-hero h1 {
          max-width: 760px;
          margin: 15px 0 22px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(52px, 7vw, 91px);
          line-height: 0.96;
          letter-spacing: -0.055em;
        }

        .investors-hero h1 span {
          color: #1f316f;
        }

        .investors-hero p {
          max-width: 680px;
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
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .primary-button {
          border: 1px solid #1f316f;
          background: #1f316f;
          color: white;
        }

        .secondary-button {
          border: 1px solid #c3cbc5;
          background: rgba(255, 255, 255, 0.7);
          color: #17231c;
        }

        .primary-button:hover,
        .secondary-button:hover,
        .light-button:hover {
          transform: translateY(-2px);
        }

        .hero-card {
          padding: 31px;
          border: 1px solid rgba(20, 40, 30, 0.11);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.78);
          box-shadow: 0 30px 70px rgba(31, 49, 111, 0.12);
          backdrop-filter: blur(16px);
        }

        .hero-card-top {
          display: flex;
          align-items: end;
          justify-content: space-between;
        }

        .hero-card-top span {
          color: #68736c;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .hero-card-top strong {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 52px;
          color: #1f316f;
        }

        .hero-card h2 {
          margin: 28px 0 10px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 28px;
        }

        .hero-card p {
          font-size: 14px;
          line-height: 1.65;
        }

        .trust-row {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 24px;
        }

        .trust-row span {
          padding: 7px 9px;
          border-radius: 999px;
          background: #e8ece8;
          color: #425047;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .investors-section {
          padding: 78px 0 95px;
        }

        .section-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 50px;
          margin-bottom: 36px;
        }

        .section-heading h2,
        .investor-cta h2 {
          margin: 9px 0 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(36px, 5vw, 58px);
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .section-heading > p {
          max-width: 510px;
          margin: 0;
          color: #69736d;
          line-height: 1.7;
        }

        .investors-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .investor-card {
          position: relative;
          overflow: hidden;
          padding: 25px;
          border: 1px solid rgba(20, 40, 30, 0.1);
          border-radius: 18px;
          background: #fffefa;
          box-shadow: 0 16px 45px rgba(18, 37, 28, 0.05);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .investor-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 24px 60px rgba(18, 37, 28, 0.1);
        }

        .card-top {
          display: flex;
          align-items: flex-start;
          gap: 15px;
        }

        .avatar {
          width: 57px;
          height: 57px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 50%;
          background: linear-gradient(135deg, #1f316f, #4056a3);
          color: white;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 24px;
          font-weight: 800;
        }

        .verified-badge {
          display: inline-block;
          margin-bottom: 6px;
          color: #14704d;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .card-heading h3 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 23px;
        }

        .card-heading p {
          margin: 6px 0 0;
          color: #6f7872;
          font-size: 12px;
          line-height: 1.45;
        }

        .location {
          display: inline-block;
          margin-top: 19px;
          padding: 6px 10px;
          border-radius: 999px;
          background: #edf1ec;
          color: #49574e;
          font-size: 10px;
          font-weight: 800;
        }

        .bio {
          min-height: 105px;
          margin: 18px 0 23px;
          color: #59645d;
          font-size: 14px;
          line-height: 1.7;
        }

        .card-footer {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 15px;
          padding-top: 19px;
          border-top: 1px solid #e8ece8;
        }

        .card-footer div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .card-footer div span {
          color: #88908b;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .card-footer div strong {
          font-size: 12px;
        }

        .card-footer a,
        .no-link {
          color: #1f316f;
          font-size: 10px;
          font-weight: 900;
          text-decoration: none;
        }

        .empty-state {
          min-height: 380px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 14px;
          padding: 45px;
          border: 1px dashed #b7c0ba;
          border-radius: 20px;
          background: #fffefa;
          text-align: center;
        }

        .empty-icon {
          width: 55px;
          height: 55px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #1f316f;
          color: white;
          font-size: 24px;
          font-weight: 900;
        }

        .empty-state h3 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 28px;
        }

        .empty-state p {
          max-width: 590px;
          margin: 0;
          color: #69736d;
          line-height: 1.65;
        }

        .empty-state .primary-button {
          margin-top: 8px;
        }

        .error-state .empty-icon {
          background: #9a3333;
        }

        .investor-cta {
          padding: 0 0 90px;
        }

        .cta-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          padding: 48px;
          border-radius: 24px;
          background:
            radial-gradient(
              circle at 90% 20%,
              rgba(255, 255, 255, 0.15),
              transparent 32%
            ),
            #1f316f;
          color: white;
        }

        .cta-box .section-label {
          color: rgba(255, 255, 255, 0.7);
        }

        .cta-box p {
          max-width: 650px;
          margin: 17px 0 0;
          color: rgba(255, 255, 255, 0.74);
          line-height: 1.7;
        }

        .light-button {
          flex-shrink: 0;
          border: 1px solid white;
          background: white;
          color: #1f316f;
        }

        @media (max-width: 980px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 38px;
          }

          .investors-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 720px) {
          .section-heading,
          .cta-box {
            align-items: flex-start;
            flex-direction: column;
          }

          .investors-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 520px) {
          .investors-shell {
            width: min(100% - 24px, 1180px);
          }

          .investors-hero {
            padding: 68px 0 55px;
          }

          .hero-actions {
            flex-direction: column;
          }

          .primary-button,
          .secondary-button {
            width: 100%;
          }

          .hero-card,
          .investor-card {
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