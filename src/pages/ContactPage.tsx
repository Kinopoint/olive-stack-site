import { imageSrcSet, img } from '../data/collections';
import './contact.css';

const CONTACT_FORM_URL = 'https://www.olivestack.com/pages/contact#ContactForm';

const STATS = [
  { value: '28', label: 'YEARS IN LISTOWEL' },
  { value: '6', label: 'MEDIUMS' },
  { value: '2015', label: 'RESIDENCY FOUNDED' },
];

export function ContactPage() {
  return (
    <div>
      <section className="contact-about">
        <div className="contact-portrait">
          <img
            src={img('FB_IMG_1718726304614.jpg?v=1736424652', 1000)}
            srcSet={imageSrcSet(img('FB_IMG_1718726304614.jpg?v=1736424652', 1000))}
            sizes="(max-width: 1024px) calc(100vw - 40px), 46vw"
            alt="Olive Stack"
            fetchPriority="high"
          />
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
                Olive Stack Gallery, 4 Main Street,
                <br />
                Listowel, Co. Kerry, V31 HW30, Ireland
              </span>
            </div>
            <div className="contact-row">
              <span className="contact-row-label">PHONE</span>
              <a className="contact-link" href="tel:+3536823843">
                +353 (0)68 23843
              </a>
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
                <a className="contact-link" href="https://www.instagram.com/olivestackgallery/">
                  Instagram
                </a>
                <a className="contact-link" href="https://www.facebook.com/OliveStackGallery">
                  Facebook
                </a>
              </span>
            </div>
            <div className="contact-row">
              <span className="contact-row-label">HOURS</span>
              <span className="contact-row-value">
                Tuesday – Saturday, 10:30 – 18:00
                <br />
                or by appointment
              </span>
            </div>
          </div>
          <a
            className="contact-map"
            href="https://maps.google.com/?q=Olive+Stack+Gallery+4+Main+Street+Listowel+V31+HW30"
          >
            [ open map: Main Street, Listowel → ]
          </a>
        </div>

        <div className="contact-form-panel">
          <div className="kicker">SECURE CONTACT</div>
          <h2 className="serif contact-form-title">Send a message</h2>
          <p className="contact-form-copy">
            Messages are submitted on Olive Stack Gallery’s secure Shopify storefront, where the
            protected contact form prevents spam and delivers your enquiry to the gallery.
          </p>
          <a className="pill pill--deep contact-send" href={CONTACT_FORM_URL}>
            OPEN SECURE CONTACT FORM →
          </a>
          <div className="contact-form-note">
            We usually reply within a day or two. For urgent enquiries, email the gallery directly.
          </div>
        </div>
      </section>
    </div>
  );
}
