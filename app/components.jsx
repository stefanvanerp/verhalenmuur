import { useEffect, useState } from "react";

export function Brand() {
  return (
    <section className="brand">
      <img src="/motu-logo.png" alt="Masters of the Universe" />
      <p><strong>4 JUNI</strong> IN DE BIOSCOOP</p>
    </section>
  );
}

export function CTA() {
  return (
    <div className="cta">
      <div className="cta-inner">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
          className="cta-icon"
          alt="Instagram"
        />
        <div>
          <h2>ZIE JEZELF OP HET GROTE DOEK</h2>
          <p>MAAK JE STORY EN TAG @SONYPICTURESNl</p>
        </div>
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
import { useEffect, useState } from "react";

export function StoryGrid({ stories }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!stories || stories.length <= 4) return;

    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % stories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [stories]);

  const looped = [...stories, ...stories];

  return (
    <section className="story-grid">
      <div
        className="story-track"
        style={{
          transform: `translateX(-${currentIndex * 244}px)`,
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
