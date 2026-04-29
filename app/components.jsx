import { useEffect, useState } from "react";

export function Brand() {
  return (
    <section className="brand">
      <img src="/motu-logo.png" alt="Masters of the Universe" />
      <p><strong>4 JUNI</strong> IN DE BIOSCOOP</p>
    </section>
  );
}

export function CTA({ settings }) {
  return (
    <div className="cta-hero">
      <div className="insta-logo-css">
        <span />
      </div>

      <div className="cta-copy">
        <p className="cta-kicker">
          {settings?.cta_kicker || 'ZIE JEZELF OP HET GROTE DOEK'}
        </p>

        <h2>{settings?.cta_title || 'MAAK JE STORY EN TAG'}</h2>

        <p className="cta-tag">
          {settings?.cta_handle || '@SONYPICTURESNL'}
        </p>

        <p className="cta-hashtag">
          {settings?.cta_hashtag || '#MASTERSOFTHEUNIVERSE'}
        </p>
      </div>
    </div>
  );
}

export function QRFloating() {
  return (
    <aside className="qr-floating">
      <img src="/qr.png" alt="Scan QR" />
      <span>Scan en upload je story</span>
    </aside>
  );
}

export function StoryGrid({ stories }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
if (!stories || stories.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % stories.length);
    }, 5000);

    return () => clearInterval(interval);
}, [stories.length]);
  const looped = [...stories, ...stories];

  return (
    <section className="story-grid">
      <div
        className="story-track"
        style={{
          transform: `translateX(-${currentIndex * 284}px)`,
          transition: "transform 0.8s ease-in-out",
        }}
      >
        {looped.map((story, index) => (
          <article className="story-card" key={`${story.id}-${index}`}>
            {story.media_type === "video" ||
            story.image_url?.includes(".mp4") ||
            story.image_url?.includes("video") ? (
              <video src={story.image_url} autoPlay muted loop playsInline />
            ) : (
              <img src={story.image_url} alt="Story" />
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
