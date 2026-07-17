import { BookOpenText } from 'lucide-react';
import { EmptySectionPage } from '@/components/EmptySectionPage';

export default function MagazinesPage() {
  return (
    <EmptySectionPage
      eyebrow="ARK Editorial"
      title="Magazines"
      description="Published ARK magazine issues will appear here after they are reviewed and approved. The page stays clean when no issue has been published."
      icon={BookOpenText}
      features={[
        'Read verified magazine issues',
        'Discover featured founders and researchers',
        'Browse future monthly editions and archives',
      ]}
      submitLabel="Submit a story"
    />
  );
}
