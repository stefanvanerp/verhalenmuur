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

.story-card {
  min-width: 220px;
  height: 380px;
  flex-shrink: 0;
}
