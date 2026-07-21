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
    description: 'Read approved ARK magazine issues from any device.',
    icon: BookOpenText,
  },
  {
    title: 'Issue archive',
    description: 'Browse monthly editions and important past releases.',
    icon: LibraryBig,
  },
  {
    title: 'Downloadable copies',
    description: 'Download published PDF editions when they become available.',
    icon: Download,
  },
];

export default function MagazinesPage() {
  return (
    <main className="magazines-page">
      <section className="magazines-hero">
        <div className="shell magazines-hero-grid">
          <div className="magazines-copy">
            <span className="magazines-eyebrow">ARK Editorial</span>

            <h1>Magazines built around rising ideas.</h1>

            <p>
              ARK magazine editions will bring together verified founder stories,
              research, student achievements and opportunities in one carefully
              reviewed publication.
            </p>

            <div className="magazines-actions">
              <Link href="/explore" className="magazines-primary">
                Explore Chronicles
                <ArrowRight size={18} />
              </Link>

              <Link href="/submit?type=story" className="magazines-secondary">
                Submit a story
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="magazines-cover" aria-hidden="true">
            <span>THE ARK EDITION</span>
            <strong>A.R.K</strong>
            <h2>CHRONICLES</h2>
            <div />
            <p>Founders · Research · Innovation</p>
            <small>ISSUE 01 · COMING SOON</small>
          </div>
        </div>
      </section>

      <section className="magazines-section">
        <div className="shell">
          <div className="magazines-heading">
            <span>Magazine library</span>
            <h2>The first verified issue is being prepared.</h2>
            <p>
              No public edition has been released yet. Approved issues will appear
              here automatically when the editorial team publishes them.
            </p>
          </div>

          <div className="magazines-empty">
            <FileText size={42} />

            <div>
              <span>Coming soon</span>
              <h3>Your next source of credible innovation stories.</h3>
              <p>
                Until the first issue is published, discover approved stories,
                founders and research across ARK Chronicles.
              </p>
            </div>

            <Link href="/explore">
              Browse ARK
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="magazines-feature-grid">
            {futureFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <article key={feature.title}>
                  <Icon size={27} />
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="magazines-cta">
        <div className="shell">
          <Sparkles size={30} />
          <span>Contribute to the first edition</span>
          <h2>A strong magazine begins with meaningful stories.</h2>

          <Link href="/submit?type=story">
            Share your work
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}