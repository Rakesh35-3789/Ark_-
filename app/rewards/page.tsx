import { Award } from 'lucide-react';
import { EmptySectionPage } from '@/components/EmptySectionPage';

export default function RewardsPage() {
  return (
    <EmptySectionPage
      eyebrow="ARK Recognition"
      title="Rewards"
      description="Recognition, badges and contribution rewards will appear here after the rewards programme is activated."
      icon={Award}
      features={[
        'Recognition for approved contributions',
        'Badges for founders, researchers and students',
        'Future community milestones and rewards',
      ]}
    />
  );
}
