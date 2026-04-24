import { startStories } from '../data';
import { Brand, CTA, StoryGrid } from '../components';

export default function ScreenPage() {
  const approved = startStories.filter((story) => story.status === 'approved');

  return (
    <main className="app screen">
      <div className="background" />
      <div className="glow" />
      <div className="screen-shell">
        <Brand />
        <CTA />
        <StoryGrid stories={approved} />
      </div>
    </main>
  );
}
