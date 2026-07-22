'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Rocket,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { createBrowserSupabase } from '@/lib/supabase-browser';

type ProfileSummary = {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
};

type ChronicleStory = {
  id: string;
  author_id: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  city: string | null;
  cover_url: string | null;
  published_at: string | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
};


const sections = [
  {
    number: '01',
    title: 'Chronicles',
    description:
      'Important startup journeys, achievements and innovation stories.',
    href: '/explore',
    icon: BookOpen,
  },
  {
    number: '02',
    title: 'Founders',
    description:
      'Meet ambitious builders and understand the missions they are pursuing.',
    href: '/founders',
    icon: Users,
  },
  {
    number: '03',
    title: 'Research',
    description:
      'Discover meaningful academic and technical work from emerging minds.',
    href: '/research',
    icon: Building2,
  },
  {
    number: '04',
    title: 'Opportunities',
    description:
      'Find internships, hackathons, grants, events and career opportunities.',
    href: '/opportunities',
    icon: BriefcaseBusiness,
  },
];


function storyDate(value: string | null | undefined) {
  if (!value) return '';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export default function HomePage() {
  const [stories, setStories] = useState<ChronicleStory[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    let mounted = true;

    async function loadApprovedStories() {
      try {
        const supabase = createBrowserSupabase();

        const { data: storyRows, error: storyError } = await supabase
          .from('stories')
          .select('*')
          .eq('status', 'approved')
          .order('published_at', { ascending: false })
          .limit(9);

        if (storyError) {
          throw storyError;
        }

        const rawStories = (storyRows || []) as ChronicleStory[];

        const authorIds = Array.from(
          new Set(
            rawStories
              .map((story) => story.author_id)
              .filter((id): id is string => Boolean(id)),
          ),
        );

        let profiles: ProfileSummary[] = [];

        if (authorIds.length > 0) {
          const { data: profileRows, error: profileError } = await supabase
            .from('profiles')
            .select('id, full_name, username, avatar_url')
            .in('id', authorIds);

          if (!profileError) {
            profiles = (profileRows || []) as ProfileSummary[];
          }
        }

        const profileMap = new Map(
          profiles.map((profile) => [profile.id, profile]),
        );

        const completedStories = rawStories.map((story) => {
          const profile = story.author_id
            ? profileMap.get(story.author_id)
            : undefined;

          return {
            ...story,
            profiles: profile
              ? {
                  full_name: profile.full_name,
                  username: profile.username,
                  avatar_url: profile.avatar_url,
                }
              : null,
          };
        });

        if (mounted) {
          setStories(completedStories);
        }
      } catch (error) {
        console.error('Unable to load ARK Chronicles:', error);

        if (mounted) {
          setStories([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadApprovedStories();

    return () => {
      mounted = false;
    };
  }, []);

  const featuredStory = stories[0];
  const secondaryStories = stories.slice(1, 4);
  const remainingStories = stories.slice(4);

  return (
    <main className="chronicles-home">
      <section className="chronicles-opening">
        <div className="opening-grid-lines" />

        <div className="chronicles-container opening-content">
          <p className="opening-kicker">
            India&apos;s independent innovation journal
          </p>

          <h1>
            <span>A.R.K</span>
            <strong>CHRONICLES</strong>
          </h1>

          <p className="opening-description">
            Architects of Rising Knowledge for founders, researchers, students
            and builders navigating the next chapter of Indian innovation.
          </p>

          <div className="opening-actions">
            <Link href="/explore" className="chronicle-primary-button">
              Read the Chronicles
              <ArrowRight size={17} />
            </Link>

            <Link href="/submit" className="chronicle-text-link">
              Publish your journey
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="opening-scroll">
            <span />
            Scroll to discover
          </div>
        </div>
      </section>

      <section className="chronicle-search-section">
        <div className="chronicles-container search-panel">
          <div>
            <span>Discover ARK</span>
            <h2>Find stories shaping tomorrow.</h2>
          </div>

          <Link href="/explore" className="chronicle-search-box">
            <Search size={20} />
            <span>
              Search stories, founders, research and opportunities
            </span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="featured-chronicle-section">
        <div className="chronicles-container">
          <div className="chronicle-section-heading">
            <div>
              <span>Featured Chronicle</span>
              <h2>The stories worth stopping for.</h2>
            </div>

            <Link href="/explore">
              View all Chronicles
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="chronicle-loading">
              <div className="chronicle-loading-mark">A.R.K</div>
              <span />
              <p>Loading approved ARK content...</p>
            </div>
          ) : featuredStory ? (
            <div className="featured-chronicle-layout">
              <Link
                href={`/stories/${featuredStory.slug}`}
                className="featured-story"
              >
                <div
                  className="featured-story-image"
                  style={
                    featuredStory.cover_url
                      ? {
                          backgroundImage: `linear-gradient(180deg, transparent 20%, rgba(4, 14, 10, 0.88) 100%), url("${featuredStory.cover_url}")`,
                        }
                      : undefined
                  }
                >
                  <span className="story-category">
                    {featuredStory.category || 'Chronicle'}
                  </span>

                  <div className="featured-story-copy">
                    <p>
                      {featuredStory.city || 'India'}
                      {' · '}
                      {storyDate(
                        featuredStory.published_at ||
                          featuredStory.created_at,
                      )}
                    </p>

                    <h3>{featuredStory.title}</h3>

                    <span>
                      Read full Chronicle
                      <ArrowRight size={17} />
                    </span>
                  </div>
                </div>
              </Link>

              <div className="secondary-story-list">
                {secondaryStories.map((story, index) => (
                  <Link
                    href={`/stories/${story.slug}`}
                    className="secondary-story"
                    key={story.id}
                  >
                    <span className="secondary-story-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div>
                      <p>
                        {story.category || 'Chronicle'}
                        {' · '}
                        {storyDate(story.published_at || story.created_at)}
                      </p>

                      <h3>{story.title}</h3>

                      <span>
                        By{' '}
                        {story.profiles?.full_name ||
                          story.profiles?.username ||
                          'ARK member'}
                      </span>
                    </div>

                    <ArrowRight size={18} />
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="chronicle-empty">
              <ShieldCheck size={34} />

              <div>
                <span>Editorial desk</span>
                <h3>The next great Chronicle begins with your story.</h3>
                <p>
                  Approved contributions from ARK members will appear here.
                </p>
              </div>

              <Link href="/submit">
                Submit your story
                <ArrowRight size={17} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="chronicle-sections">
        <div className="chronicles-container">
          <div className="chronicle-section-heading">
            <div>
              <span>Inside ARK</span>
              <h2>One network. Many rising voices.</h2>
            </div>
          </div>

          <div className="chronicle-section-grid">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <Link
                  href={section.href}
                  className="chronicle-section-card"
                  key={section.title}
                >
                  <span className="section-card-number">
                    {section.number}
                  </span>

                  <Icon size={25} />

                  <div>
                    <h3>{section.title}</h3>
                    <p>{section.description}</p>
                  </div>

                  <span className="section-card-arrow">
                    Explore
                    <ArrowRight size={16} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {remainingStories.length > 0 && (
        <section className="latest-chronicles">
          <div className="chronicles-container">
            <div className="chronicle-section-heading">
              <div>
                <span>Latest dispatches</span>
                <h2>New voices from the ARK community.</h2>
              </div>

              <Link href="/explore">
                Browse everything
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="latest-chronicle-grid">
              {remainingStories.map((story) => (
                <Link
                  href={`/stories/${story.slug}`}
                  className="latest-chronicle-card"
                  key={story.id}
                >
                  <div
                    className="latest-chronicle-image"
                    style={
                      story.cover_url
                        ? {
                            backgroundImage: `url("${story.cover_url}")`,
                          }
                        : undefined
                    }
                  >
                    {!story.cover_url && <Rocket size={35} />}
                  </div>

                  <div className="latest-chronicle-copy">
                    <span>
                      {story.category || 'Chronicle'}
                      {' · '}
                      {story.city || 'India'}
                    </span>

                    <h3>{story.title}</h3>

                    <p>
                      {story.excerpt ||
                        'Discover this approved story from the ARK community.'}
                    </p>

                    <div>
                      <small>
                        {storyDate(story.published_at || story.created_at)}
                      </small>

                      <ArrowRight size={17} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="chronicles-manifesto">
        <div className="chronicles-container manifesto-layout">
          <div>
            <span className="manifesto-label">The ARK belief</span>

            <h2>
              Every rising idea deserves a credible place in the public record.
            </h2>
          </div>

          <div className="manifesto-copy">
            <p>
              ARK combines authenticated contributors, editorial moderation and
              structured discovery so that useful work is not lost inside
              private folders, classrooms or closed communities.
            </p>

            <div className="manifesto-points">
              <span>
                <ShieldCheck size={17} />
                Reviewed before publication
              </span>

              <span>
                <Users size={17} />
                Connected to real contributors
              </span>

              <span>
                <BookOpen size={17} />
                Built for meaningful discovery
              </span>
            </div>

            <Link href="/submit" className="manifesto-button">
              Become part of the Chronicle
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .header {
          display: none !important;
        }

        .chronicles-home {
          --chronicle-blue: #273f94;
          --chronicle-black: #070707;
          --chronicle-grey: #686868;
          --chronicle-line: #d8d8d8;
          --chronicle-paper: #f4f0e6;
          overflow: hidden;
          background: var(--chronicle-paper);
          color: var(--chronicle-black);
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        .chronicles-container {
          width: min(1280px, calc(100% - 48px));
          margin-inline: auto;
        }

        .chronicles-opening {
          min-height: 690px;
          position: relative;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-bottom: 1px solid var(--chronicle-line);
          background:#f4f0e6;
        }

        .opening-grid-lines {
          position: absolute;
          inset: 0;
          opacity: 0.16;
          background-image:
            linear-gradient(#555 1px, transparent 1px),
            linear-gradient(90deg, #555 1px, transparent 1px);
          background-size: 82px 82px;
          mask-image: radial-gradient(circle at center, black, transparent 75%);
        }

        .opening-content {
          position: relative;
          z-index: 2;
          padding: 115px 0 85px;
          text-align: center;
          animation: openingReveal 950ms both;
        }

        .opening-kicker {
          margin: 0 0 27px;
          color: var(--chronicle-blue);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        .opening-content h1 {
          margin: 0;
          line-height: 0.8;
        }

        .opening-content h1 span {
          display: block;
          color: var(--chronicle-black);
          font-family: Arial, Helvetica, sans-serif;
          font-size: clamp(90px, 17vw, 235px);
          font-weight: 950;
          letter-spacing: -0.09em;
        }

        .opening-content h1 strong {
          display: block;
          margin-top: 38px;
          color: var(--chronicle-blue);
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(35px, 5.2vw, 73px);
          font-weight: 500;
          letter-spacing: 0.35em;
        }

        .opening-description {
          max-width: 730px;
          margin: 45px auto 0;
          color: #555;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 18px;
          line-height: 1.7;
        }

        .opening-actions {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-top: 33px;
        }

        .chronicle-primary-button,
        .chronicle-text-link {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          font-size: 12px;
          font-weight: 850;
        }

        .chronicle-primary-button {
          padding: 14px 19px;
          background: var(--chronicle-black);
          color: white;
        }

        .chronicle-text-link {
          padding: 13px 0;
          border-bottom: 1px solid var(--chronicle-black);
        }

        .opening-scroll {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 11px;
          margin-top: 64px;
          color: #777;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .opening-scroll span {
          width: 1px;
          height: 44px;
          background: var(--chronicle-black);
          animation: scrollIndicator 1.7s ease-in-out infinite;
        }

        .chronicle-search-section {
          padding: 66px 0;
          border-bottom: 1px solid var(--chronicle-line);
          background: #f7f7f7;
        }

        .search-panel {
          display: grid;
          grid-template-columns: 0.75fr 1.25fr;
          align-items: center;
          gap: 70px;
        }

        .search-panel > div > span,
        .chronicle-section-heading > div > span {
          color: var(--chronicle-blue);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .search-panel h2,
        .chronicle-section-heading h2 {
          margin: 9px 0 0;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(32px, 4vw, 51px);
          font-weight: 500;
          line-height: 1.04;
          letter-spacing: -0.04em;
        }

        .chronicle-search-box {
          min-height: 66px;
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 0 21px;
          border: 1px solid #cfcfcf;
          background: white;
          transition:
            transform 180ms ease,
            border 180ms ease;
        }

        .chronicle-search-box:hover {
          transform: translateY(-3px);
          border-color: var(--chronicle-blue);
        }

        .chronicle-search-box span {
          flex: 1;
          color: #777;
          font-size: 13px;
        }

        .featured-chronicle-section,
        .chronicle-sections,
        .latest-chronicles {
          padding: 105px 0;
        }

        .chronicle-section-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 35px;
          margin-bottom: 48px;
        }

        .chronicle-section-heading > a {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 5px;
          border-bottom: 1px solid var(--chronicle-black);
          font-size: 11px;
          font-weight: 850;
        }

        .featured-chronicle-layout {
          display: grid;
          grid-template-columns: 1.18fr 0.82fr;
          gap: 0;
          border-top: 1px solid var(--chronicle-black);
          border-bottom: 1px solid var(--chronicle-black);
        }

        .featured-story {
          min-height: 565px;
          padding: 28px 28px 28px 0;
          border-right: 1px solid var(--chronicle-line);
        }

        .featured-story-image {
          height: 100%;
          min-height: 510px;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(180deg, transparent 20%, rgba(4, 14, 10, 0.88)),
            linear-gradient(135deg, #304b3a, #07110c);
          background-position: center;
          background-size: cover;
          transition: transform 300ms ease;
        }

        .featured-story:hover .featured-story-image {
          transform: scale(0.99);
        }

        .story-category {
          position: absolute;
          top: 23px;
          left: 23px;
          padding: 8px 10px;
          background: white;
          color: var(--chronicle-black);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .featured-story-copy {
          position: absolute;
          right: 31px;
          bottom: 31px;
          left: 31px;
          color: white;
        }

        .featured-story-copy p {
          margin: 0 0 13px;
          color: #ccc;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .featured-story-copy h3 {
          max-width: 700px;
          margin: 0;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(36px, 4vw, 58px);
          font-weight: 500;
          line-height: 1.03;
          letter-spacing: -0.04em;
        }

        .featured-story-copy > span {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 25px;
          font-size: 11px;
          font-weight: 800;
        }

        .secondary-story-list {
          display: flex;
          flex-direction: column;
        }

        .secondary-story {
          flex: 1;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: start;
          gap: 21px;
          padding: 29px 0 29px 29px;
          border-bottom: 1px solid var(--chronicle-line);
        }

        .secondary-story:last-child {
          border-bottom: 0;
        }

        .secondary-story:hover h3 {
          color: var(--chronicle-blue);
        }

        .secondary-story-number {
          color: #999;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 12px;
        }

        .secondary-story p {
          margin: 0 0 10px;
          color: var(--chronicle-blue);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .secondary-story h3 {
          margin: 0 0 15px;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 25px;
          font-weight: 500;
          line-height: 1.13;
          transition: color 180ms ease;
        }

        .secondary-story div > span {
          color: #777;
          font-size: 10px;
        }

        .chronicle-loading,
        .chronicle-empty {
          min-height: 330px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-top: 1px solid var(--chronicle-black);
          border-bottom: 1px solid var(--chronicle-black);
        }

        .chronicle-loading {
          flex-direction: column;
        }

        .chronicle-loading-mark {
          font-size: 44px;
          font-weight: 950;
        }

        .chronicle-loading > span {
          width: 45px;
          height: 2px;
          margin: 24px 0;
          overflow: hidden;
          background: #ddd;
        }

        .chronicle-loading > span::after {
          width: 20px;
          height: 100%;
          display: block;
          content: '';
          background: var(--chronicle-blue);
          animation: loadingSlide 1s infinite;
        }

        .chronicle-loading p {
          color: #777;
          font-size: 11px;
          letter-spacing: 0.08em;
        }

        .chronicle-empty {
          gap: 25px;
          padding: 40px;
        }

        .chronicle-empty > svg {
          color: var(--chronicle-blue);
        }

        .chronicle-empty span {
          color: var(--chronicle-blue);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .chronicle-empty h3 {
          margin: 8px 0;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 31px;
          font-weight: 500;
        }

        .chronicle-empty p {
          margin: 0;
          color: #777;
        }

        .chronicle-empty > a {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
          padding-bottom: 5px;
          border-bottom: 1px solid;
          font-size: 11px;
          font-weight: 850;
          white-space: nowrap;
        }

        .chronicle-sections {
          border-top: 1px solid var(--chronicle-line);
          border-bottom: 1px solid var(--chronicle-line);
          background: #f5f5f5;
        }

        .chronicle-section-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid var(--chronicle-black);
          border-bottom: 1px solid var(--chronicle-black);
        }

        .chronicle-section-card {
          min-height: 340px;
          display: flex;
          flex-direction: column;
          padding: 28px;
          border-right: 1px solid var(--chronicle-line);
          transition:
            background 220ms ease,
            color 220ms ease,
            transform 220ms ease;
        }

        .chronicle-section-card:last-child {
          border-right: 0;
        }

        .chronicle-section-card:hover {
          z-index: 2;
          background: var(--chronicle-black);
          color: white;
          transform: translateY(-8px);
        }

        .section-card-number {
          color: #999;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 12px;
        }

        .chronicle-section-card > svg {
          margin: 45px 0 29px;
          color: var(--chronicle-blue);
        }

        .chronicle-section-card h3 {
          margin: 0 0 12px;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 30px;
          font-weight: 500;
        }

        .chronicle-section-card p {
          color: #777;
          font-size: 13px;
          line-height: 1.7;
        }

        .chronicle-section-card:hover p,
        .chronicle-section-card:hover .section-card-number {
          color: #aaa;
        }

        .section-card-arrow {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: auto;
          color: var(--chronicle-blue);
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .chronicle-section-card:hover .section-card-arrow {
          color: white;
        }

        .latest-chronicles {
          background: white;
        }

        .latest-chronicle-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        .latest-chronicle-card {
          border-top: 1px solid var(--chronicle-black);
          transition: transform 200ms ease;
        }

        .latest-chronicle-card:hover {
          transform: translateY(-6px);
        }

        .latest-chronicle-image {
          height: 240px;
          display: grid;
          place-items: center;
          margin-top: 18px;
          background: #ededed;
          background-position: center;
          background-size: cover;
          color: var(--chronicle-blue);
        }

        .latest-chronicle-copy {
          padding-top: 21px;
        }

        .latest-chronicle-copy > span {
          color: var(--chronicle-blue);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .latest-chronicle-copy h3 {
          margin: 11px 0;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 27px;
          font-weight: 500;
          line-height: 1.12;
        }

        .latest-chronicle-copy p {
          color: #777;
          font-size: 13px;
          line-height: 1.65;
        }

        .latest-chronicle-copy > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 23px;
          padding-top: 14px;
          border-top: 1px solid var(--chronicle-line);
          color: #777;
        }

        .chronicles-manifesto {
          padding: 110px 0;
          background: var(--chronicle-black);
          color: white;
        }

        .manifesto-layout {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 100px;
        }

        .manifesto-label {
          color: #879be5;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.17em;
          text-transform: uppercase;
        }

        .manifesto-layout h2 {
          margin: 16px 0 0;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(43px, 6vw, 73px);
          font-weight: 500;
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .manifesto-copy > p {
          margin-top: 0;
          color: #aaa;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 18px;
          line-height: 1.8;
        }

        .manifesto-points {
          display: flex;
          flex-direction: column;
          margin: 30px 0;
          border-top: 1px solid #333;
        }

        .manifesto-points span {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 16px 0;
          border-bottom: 1px solid #333;
          color: #bbb;
          font-size: 11px;
        }

        .manifesto-points svg {
          color: #879be5;
        }

        .manifesto-button {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 14px 17px;
          background: white;
          color: black;
          font-size: 11px;
          font-weight: 850;
        }


        @keyframes openingReveal {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(25px);
          }

          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes scrollIndicator {
          0%,
          100% {
            opacity: 0.25;
            transform: scaleY(0.45);
            transform-origin: top;
          }

          50% {
            opacity: 1;
            transform: scaleY(1);
          }
        }

        @keyframes loadingSlide {
          from {
            transform: translateX(-22px);
          }

          to {
            transform: translateX(47px);
          }
        }

        @media (max-width: 980px) {





          .search-panel,
          .featured-chronicle-layout,
          .manifesto-layout {
            grid-template-columns: 1fr;
          }

          .featured-story {
            padding-right: 0;
            border-right: 0;
            border-bottom: 1px solid var(--chronicle-line);
          }

          .secondary-story {
            padding-left: 0;
          }

          .chronicle-section-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .chronicle-section-card:nth-child(2) {
            border-right: 0;
          }

          .chronicle-section-card:nth-child(-n + 2) {
            border-bottom: 1px solid var(--chronicle-line);
          }

          .latest-chronicle-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 650px) {
          .chronicles-container {
            width: min(100% - 26px, 1280px);
          }





          .chronicles-opening {
            min-height: 620px;
          }

          .opening-content {
            padding: 90px 0 60px;
          }

          .opening-content h1 span {
            font-size: clamp(74px, 25vw, 115px);
          }

          .opening-content h1 strong {
            margin-top: 25px;
            font-size: 28px;
            letter-spacing: 0.2em;
          }

          .opening-description {
            font-size: 16px;
          }

          .opening-actions {
            align-items: center;
            flex-direction: column;
          }

          .chronicle-search-section,
          .featured-chronicle-section,
          .chronicle-sections,
          .latest-chronicles {
            padding: 72px 0;
          }

          .search-panel {
            gap: 30px;
          }

          .chronicle-section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .featured-story {
            min-height: 460px;
          }

          .featured-story-image {
            min-height: 430px;
          }

          .featured-story-copy h3 {
            font-size: 37px;
          }

          .secondary-story {
            grid-template-columns: auto 1fr;
          }

          .secondary-story > svg {
            display: none;
          }

          .chronicle-empty {
            align-items: flex-start;
            flex-direction: column;
          }

          .chronicle-empty > a {
            margin-left: 0;
          }

          .chronicle-section-grid,
          .latest-chronicle-grid {
            grid-template-columns: 1fr;
          }

          .chronicle-section-card {
            min-height: 280px;
            border-right: 0;
            border-bottom: 1px solid var(--chronicle-line);
          }

          .chronicle-section-card:nth-child(2) {
            border-right: 0;
          }

          .chronicle-section-card:last-child {
            border-bottom: 0;
          }

          .manifesto-layout {
            gap: 48px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .opening-content,
          .opening-scroll span,
          .chronicle-loading > span::after {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}