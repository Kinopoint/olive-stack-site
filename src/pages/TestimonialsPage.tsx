import { Link } from '../components/Link';
import { paths } from '../lib/routes';
import { TESTIMONIALS } from '../data/events';
import './residency.css';

export function TestimonialsPage() {
  return (
    <div className="testimonials-page">
      <div className="testimonials-intro">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href={paths.home()}>HOME</Link> /{' '}
          <Link href={paths.residency()}>ARTISTS RESIDENCY</Link> /{' '}
          <span className="crumb-current" aria-current="page">TESTIMONIALS</span>
        </nav>
        <h1 className="serif testimonials-title">
          Kind words from <em>artists &amp; guests</em>
        </h1>
      </div>

      <div className="testimonials-grid">
        {TESTIMONIALS.map((t) => (
          <blockquote key={t.who} className="testimonial-card">
            <div className="stars" aria-label="5 out of 5 stars">
              <span aria-hidden="true">★★★★★</span>
            </div>
            <div className="serif testimonial-quote">“{t.quote}”</div>
            <footer className="testimonial-who">{t.who}</footer>
          </blockquote>
        ))}
      </div>

      <div className="residency-live-link">
        From gallery reviews and residency correspondence.{' '}
        <a
          href="https://www.olivestack.com/pages/artists-residency-testimonials"
          target="_blank"
          rel="noreferrer"
        >
          Full testimonials on the live site →
        </a>
      </div>
    </div>
  );
}
