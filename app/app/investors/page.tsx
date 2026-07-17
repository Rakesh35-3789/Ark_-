import { HandCoins } from 'lucide-react';
import { EmptySectionPage } from '@/components/EmptySectionPage';

export default function InvestorsPage() {
  return (
    <EmptySectionPage
      eyebrow="ARK Network"
      title="Investors"
      description="Approved investor profiles and verified investment information will appear here. Until then, users see this clear empty state instead of a broken page."
      icon={HandCoins}
      features={[
        'Discover verified investor profiles',
        'Understand sectors and investment interests',
        'Find future connection opportunities',
      ]}
    />
  );
}
