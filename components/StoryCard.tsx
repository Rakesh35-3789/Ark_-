import Link from 'next/link';
import type { Story } from '@/lib/types';

export function StoryCard({ story }: { story: Story }) {
  return <article className="story-card">
    <div className="story-image" style={story.cover_url ? { backgroundImage: `url(${story.cover_url})` } : undefined}>
      {!story.cover_url && <span>{story.category}</span>}
    </div>
    <div className="story-body">
      <div className="eyebrow">{story.category}{story.city ? ` · ${story.city}` : ''}</div>
      <h3><Link href={`/stories/${story.slug}`}>{story.title}</Link></h3>
      <p>{story.excerpt}</p>
      <div className="story-meta">By {story.profiles?.full_name || story.profiles?.username || 'ARK member'}</div>
    </div>
  </article>;
}
