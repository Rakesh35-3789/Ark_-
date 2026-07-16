'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, BriefcaseBusiness, Rocket, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import type { Story } from '@/lib/types';
import { StoryCard } from '@/components/StoryCard';

export default function Home() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const supabase = createBrowserSupabase();
    supabase.from('stories').select('*, profiles(full_name,username,avatar_url)').eq('status','approved').order('published_at',{ascending:false}).limit(6)
      .then(({ data }) => { setStories((data as Story[]) || []); setLoading(false); });
  }, []);
  return <main>
    <section className="hero"><div className="shell hero-grid"><div>
      <div className="pill">India’s trusted innovation network</div>
      <h1>Where ideas become <em>visible, credible and connected.</em></h1>
      <p>ARK brings students, founders, researchers, investors and colleges into one moderated platform for stories, research and real opportunities.</p>
      <div className="actions"><Link className="button" href="/explore">Explore innovation <ArrowRight size={18}/></Link><Link className="button secondary" href="/submit">Publish your work</Link></div>
      <div className="trust"><ShieldCheck size={18}/> Every public submission is reviewed before publication.</div>
    </div><div className="hero-panel">
      <div className="metric"><Rocket/><b>Startup stories</b><span>Discover builders and their journeys</span></div>
      <div className="metric"><BookOpen/><b>Research</b><span>Make meaningful work easier to understand</span></div>
      <div className="metric"><BriefcaseBusiness/><b>Opportunities</b><span>Connect talent with the right next step</span></div>
    </div></div></section>
    <section className="section shell"><div className="section-head"><div><div className="eyebrow">Latest from ARK</div><h2>Approved stories from real builders</h2></div><Link href="/explore">View all →</Link></div>
      {loading ? <div className="empty">Loading trusted content…</div> : stories.length ? <div className="card-grid">{stories.map(s => <StoryCard key={s.id} story={s}/>)}</div> : <div className="empty"><h3>ARK is ready for its first story.</h3><p>Submit a real innovation story and publish it after admin review.</p><Link className="button small" href="/submit">Submit now</Link></div>}
    </section>
    <section className="section shell"><div className="section-head"><div><div className="eyebrow">One trusted network</div><h2>Discover more than articles</h2></div></div><div className="home-links"><Link href="/research"><div className="eyebrow">Research</div><h3>Explore papers</h3><p>Discover approved academic and technical work.</p></Link><Link href="/founders"><div className="eyebrow">People</div><h3>Meet founders</h3><p>Learn from builders and their startup journeys.</p></Link><Link href="/opportunities"><div className="eyebrow">Growth</div><h3>Find opportunities</h3><p>Browse internships, events, grants and jobs.</p></Link></div></section>
    <section className="section dark"><div className="shell split"><div><div className="eyebrow">Built for trust</div><h2>Not an unmoderated content dump.</h2></div><div className="feature-list"><p><b>Verified identity flow</b><span>Email confirmation and protected user accounts.</span></p><p><b>Admin moderation</b><span>Pending content never appears publicly until approved.</span></p><p><b>Transparent status</b><span>Contributors can track pending, approved and rejected work.</span></p></div></div></section>
  </main>;
}
