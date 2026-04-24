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

        <div className="qr-floating">
          <img src="/qr.jpg" alt="Scan QR" />
          <span>Scan en upload je story</span>
        </div>

        <StoryGrid stories={approved} />
      </div>
    </main>
  );
}
