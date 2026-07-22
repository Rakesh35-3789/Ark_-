'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  GraduationCap,
  MapPin,
  Search,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { createBrowserSupabase } from '@/lib/supabase-browser';

type College = {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  description: string | null;
  website: string | null;
  logo_url: string | null;
  created_at?: string | null;
};

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadColleges() {
      try {
        const supabase = createBrowserSupabase();

        const { data, error } = await supabase
          .from('colleges')
          .select('*');

        if (error) {
          throw error;
        }

        if (mounted) {
          setColleges((data || []) as College[]);
        }
      } catch {
        if (mounted) {
          setColleges([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadColleges();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredColleges = colleges.filter((college) => {
    const text = `${college.name} ${college.city || ''} ${
      college.state || ''
    }`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <main className="colleges-page">
      <section className="colleges-hero">
        <div className="shell colleges-hero-grid">
          <div>
            <span className="colleges-eyebrow">College Collaborations</span>

            <h1>Institutions building the next generation of innovation.</h1>

            <p>
              Discover colleges, university communities and academic partners
              connected with ARK Chronicles.
            </p>

            <div className="colleges-actions">
              <a href="#college-directory" className="button">
                Explore colleges
                <ArrowRight size={17} />
              </a>

              <Link href="/submit" className="button secondary">
                Join as a college
              </Link>
            </div>
          </div>

          <div className="colleges-hero-card">
            <GraduationCap size={48} />

            <strong>{colleges.length}</strong>

            <span>Institutions in the ARK network</span>
          </div>
        </div>
      </section>

      <section className="section" id="college-directory">
        <div className="shell">
          <div className="section-head">
            <div>
              <span className="eyebrow">ARK Network</span>
              <h2>College directory</h2>
            </div>
          </div>

          <div className="college-search">
            <Search size={19} />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by college, city or state"
            />
          </div>

          {loading ? (
            <div className="college-empty">
              <GraduationCap size={36} />
              <h3>Loading college collaborations...</h3>
            </div>
          ) : filteredColleges.length > 0 ? (
            <div className="college-grid">
              {filteredColleges.map((college) => (
                <article className="college-card" key={college.id}>
                  <div className="college-logo">
                    {college.logo_url ? (
                      <img src={college.logo_url} alt={college.name} />
                    ) : (
                      <Building2 size={30} />
                    )}
                  </div>

                  <div className="college-card-copy">
                    <span className="college-type">Academic partner</span>

                    <h3>{college.name}</h3>

                    {(college.city || college.state) && (
                      <p className="college-location">
                        <MapPin size={15} />
                        {[college.city, college.state]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}

                    <p>
                      {college.description ||
                        'This institution is part of the ARK academic and innovation network.'}
                    </p>

                    <div className="college-card-footer">
                      <span>
                        <Users size={15} />
                        ARK collaboration
                      </span>

                      {college.website && (
                        <a
                          href={college.website}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Visit website
                          <ArrowRight size={15} />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="college-empty">
              <GraduationCap size={40} />

              <h3>
                {search
                  ? 'No colleges match your search.'
                  : 'No college collaborations have been added yet.'}
              </h3>

              <p>
                Approved institutions and university partners will appear here.
              </p>

              <Link href="/submit" className="button">
                Submit a collaboration
              </Link>
            </div>
          )}
        </div>
      </section>

      <style jsx global>{`
        .colleges-page {
          min-height: 100vh;
          background: #f4f0e6;
        }

        .colleges-hero {
          padding: 100px 0;
          border-bottom: 1px solid #d8d2c6;
          background:
            radial-gradient(
              circle at 82% 20%,
              rgba(40, 63, 145, 0.13),
              transparent 30%
            ),
            #f4f0e6;
        }

        .colleges-hero-grid {
          display: grid;
          grid-template-columns: 1.25fr 0.75fr;
          align-items: center;
          gap: 75px;
        }

        .colleges-eyebrow {
          color: #283f91;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .colleges-hero h1 {
          max-width: 800px;
          margin: 18px 0 23px;
          color: #111;
          font: 500 clamp(47px, 6vw, 76px) / 1
            Georgia, 'Times New Roman', serif;
          letter-spacing: -0.05em;
        }

        .colleges-hero p {
          max-width: 700px;
          color: #68645d;
          font-size: 17px;
          line-height: 1.75;
        }

        .colleges-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 31px;
        }

        .colleges-hero-card {
          min-height: 360px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 35px;
          border: 1px solid #d8d2c6;
          background: #fbf8f2;
          text-align: center;
          box-shadow: 22px 25px 0 rgba(40, 63, 145, 0.09);
        }

        .colleges-hero-card svg {
          color: #283f91;
        }

        .colleges-hero-card strong {
          margin: 30px 0 5px;
          color: #111;
          font: 700 76px Georgia, 'Times New Roman', serif;
        }

        .colleges-hero-card span {
          color: #68645d;
          font-size: 13px;
          font-weight: 750;
        }

        .college-search {
          max-width: 620px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 35px;
          padding: 0 17px;
          border: 1px solid #d8d2c6;
          background: #fbf8f2;
        }

        .college-search svg {
          color: #283f91;
        }

        .college-search input {
          width: 100%;
          min-height: 52px;
          border: 0;
          outline: 0;
          background: transparent;
        }

        .college-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .college-card {
          min-height: 100%;
          overflow: hidden;
          border: 1px solid #d8d2c6;
          background: #fbf8f2;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease;
        }

        .college-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 42px rgba(30, 34, 42, 0.09);
        }

        .college-logo {
          height: 155px;
          display: grid;
          place-items: center;
          border-bottom: 1px solid #d8d2c6;
          background: #eee8dc;
          color: #283f91;
        }

        .college-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .college-card-copy {
          padding: 24px;
        }

        .college-type {
          color: #283f91;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .college-card h3 {
          margin: 11px 0;
          color: #111;
          font: 500 27px/1.15 Georgia, 'Times New Roman', serif;
        }

        .college-location {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #68645d;
          font-size: 12px;
        }

        .college-card-copy > p {
          color: #68645d;
          font-size: 13px;
          line-height: 1.65;
        }

        .college-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #d8d2c6;
        }

        .college-card-footer span,
        .college-card-footer a {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 800;
        }

        .college-card-footer span {
          color: #68645d;
        }

        .college-card-footer a {
          color: #283f91;
        }

        .college-empty {
          min-height: 310px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 42px;
          border-top: 1px solid #111;
          border-bottom: 1px solid #111;
          background: #fbf8f2;
          text-align: center;
        }

        .college-empty svg {
          color: #283f91;
        }

        .college-empty h3 {
          margin: 20px 0 10px;
          font: 500 34px Georgia, 'Times New Roman', serif;
        }

        .college-empty p {
          max-width: 540px;
          margin: 0 0 24px;
          color: #68645d;
          line-height: 1.7;
        }

        @media (max-width: 900px) {
          .colleges-hero-grid {
            grid-template-columns: 1fr;
          }

          .college-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .colleges-hero {
            padding: 72px 0;
          }

          .college-grid {
            grid-template-columns: 1fr;
          }

          .college-card-footer {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}