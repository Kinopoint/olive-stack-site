import { useState } from 'react';
import { img } from '../data/collections';
import './contact.css';

const STATS = [
  { value: '28', label: 'YEARS IN LISTOWEL' },
  { value: '6', label: 'MEDIUMS' },
  { value: '2015', label: 'RESIDENCY FOUNDED' },
];

export function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div>
      <section className="contact-about">
        <div className="contact-portrait">
          <img src={img('FB_IMG_1718726304614.jpg?v=1736424652', 1000)} alt="Olive Stack" />
          <div className="serif contact-portrait-badge">Est. Listowel, 1998</div>
        </div>
        <div className="contact-about-copy">
          <div className="kicker">ABOUT THE GALLERY</div>
          <h1 className="serif contact-about-title">
            Making art for as long as she can <em>remember</em>
          </h1>
          <p className="contact-about-text">
            The Olive Stack Gallery opened its doors in Listowel, Ireland in 1998 and has been at
            the heart of the community for 28 years. Much of Olive’s work is inspired by nature:
            the flora and fauna, the changing light and seasons all feed her creative practice.
          </p>
          <p className="contact-about-text">
            She works in a diverse range of mediums including oil, watercolour, encaustic, mosaic,
            stone art and, most recently, micro mosaics.
          </p>
          <div className="contact-stats">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="serif contact-stat-value">{stat.value}</div>
                <div className="contact-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-grid">
        <div className="contact-details">
          <h2 className="serif contact-details-title">
            Say <em>hello</em>
          </h2>
          <div className="contact-rows">
            <div className="contact-row">
              <span className="contact-row-label">VISIT</span>
              <span className="contact-row-value">
                Olive Stack Gallery, Main Street,
                <br />
                Listowel, Co. Kerry, Ireland
              </span>
            </div>
            <div className="contact-row">
              <span className="contact-row-label">EMAIL</span>
              <a className="contact-link" href="mailto:olive@olivestack.com">
                olive@olivestack.com
              </a>
            </div>
            <div className="contact-row">
              <span className="contact-row-label">FOLLOW</span>
              <span className="contact-socials">
                <a
                  className="contact-link"
                  href="https://www.instagram.com/olivestackgallery/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
                <a
                  className="contact-link"
                  href="https://www.facebook.com/OliveStackGallery"
                  target="_blank"
                  rel="noreferrer"
                >
                  Facebook
                </a>
              </span>
            </div>
            <div className="contact-row">
              <span className="contact-row-label">HOURS</span>
              <span className="contact-row-value">Tuesday – Saturday, 10:00 – 17:30</span>
            </div>
          </div>
          <a
            className="contact-map"
            href="https://maps.google.com/?q=Olive+Stack+Gallery+Main+Street+Listowel"
            target="_blank"
            rel="noreferrer"
          >
            [ open map: Main Street, Listowel → ]
          </a>
        </div>

        <div className="contact-form-panel">
          <h2 className="serif contact-form-title">Send a message</h2>
          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <div className="contact-form-pair">
              <input placeholder="Name" aria-label="Name" required />
              <input placeholder="Email" type="email" aria-label="Email" required />
            </div>
            <input placeholder="Phone (optional)" type="tel" aria-label="Phone" />
            <textarea
              placeholder="Your message: a painting you love, a commission, a workshop…"
              aria-label="Your message"
              required
            />
            <button type="submit" className="pill pill--deep contact-send">
              {sent ? 'SENT ✓ WE’LL BE IN TOUCH' : 'SEND MESSAGE'}
            </button>
          </form>
          <div className="contact-form-note">
            We usually reply within a day or two. For urgent enquiries, call into the gallery: the
            kettle is never far away.
          </div>
        </div>
      </section>
    </div>
  );
}
