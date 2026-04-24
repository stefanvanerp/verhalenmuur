export function Brand() {
  return (
    <section className="brand">
      <div className="live"><span />LIVE vanuit Pathé Tuschinski</div>
      <div className="eyebrow">WITNESS HOW HE BECAME HE-MAN</div>
      <img className="logo" src="/motu-logo.png" alt="Masters of the Universe" />
      <div className="date"><span>4 JUNI</span> IN DE BIOSCOOP</div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="cta">
      <h1>ZIE JEZELF OP HET GROTE DOEK</h1>
      <p>Maak je story en tag <span>@sonypicturesnl</span></p>

      <div className="qr-block">
        <img src="/qr.jpg" alt="Scan QR" />
        <span>Scan en upload je story</span>
      </div>
    </section>
  );
}

export function StoryCard({ story }) {
  return (
    <article className="story-card">
      <img src={story.image} alt="" />
      <div className="story-top">
        <div className="avatar" />
        <div>
          <div className="username">{story.user}</div>
          <div className="time">{story.time}</div>
        </div>
        <div className="story-icon">◎</div>
      </div>
      <div className="caption">
        {story.caption}
        <span>@sonypicturesnl</span>
      </div>
    </article>
  );
}

export function StoryGrid({ stories }) {
  return (
    <section className="story-grid">
      {stories.slice(0, 4).map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </section>
  );
}
