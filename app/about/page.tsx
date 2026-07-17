import Link from 'next/link';
import { BookOpen, Lightbulb, ShieldCheck, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <main>
      <section className="about-hero">
        <div className="shell about-hero-inner">
          <div className="eyebrow">About ARK Chronicles</div>
          <h1>India&apos;s trusted innovation storytelling network.</h1>
          <p className="lead">
            ARK helps students, researchers, founders and institutions publish meaningful work,
            discover opportunities and build credible visibility.
          </p>
          <div className="actions">
            <Link className="button" href="/submit">Submit your work</Link>
            <Link className="button secondary" href="/explore">Explore stories</Link>
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="about-values-grid">
          <article><BookOpen /><h2>Stories</h2><p>Document important journeys, achievements and ideas.</p></article>
          <article><Lightbulb /><h2>Innovation</h2><p>Give useful research and startup work the attention it deserves.</p></article>
          <article><Users /><h2>Community</h2><p>Connect students, founders, researchers and institutions.</p></article>
          <article><ShieldCheck /><h2>Trust</h2><p>Admin review keeps public content relevant and responsible.</p></article>
        </div>
      </section>
    </main>
  );
}
