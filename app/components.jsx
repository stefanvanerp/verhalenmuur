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
    <section className="cta">
      <h1>ZIE JEZELF OP HET GROTE DOEK</h1>
      <p>Maak je story en tag <span>@sonypicturesnl</span></p>
    </section>
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
  const visible = stories.slice(0, 4);

  return (
    <section className="story-grid">
      {visible.map((story) => (
        <article className="story-card" key={story.id}>
          <img src={story.image_url} alt={story.user_name || 'Story'} />
          <div className="story-overlay">
            <strong>{story.user_name || '@gast'}</strong>
            <span>{story.caption || 'Première story'}</span>
          </div>
        </article>
      ))}
    </section>
  );
}
