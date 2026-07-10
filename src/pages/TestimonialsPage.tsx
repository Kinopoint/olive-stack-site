import { navigate } from '../hooks/useHashRoute';
import { paths } from '../lib/routes';
import { TESTIMONIALS } from '../data/events';
import './residency.css';

export function TestimonialsPage() {
  return (
    <div className="testimonials-page">
      <div className="testimonials-intro">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <button onClick={() => navigate(paths.home())}>HOME</button> /{' '}
          <button onClick={() => navigate(paths.residency())}>ARTISTS RESIDENCY</button> /{' '}
          <span className="crumb-current">TESTIMONIALS</span>
        </nav>
        <h1 className="serif testimonials-title">
          Kind words from <em>artists &amp; guests</em>
        </h1>
      </div>

      <div className="testimonials-grid">
        {TESTIMONIALS.map((t) => (
          <blockquote key={t.who} className="testimonial-card">
            <div className="stars">★★★★★</div>
            <div className="serif testimonial-quote">“{t.quote}”</div>
            <footer className="testimonial-who">{t.who}</footer>
          </blockquote>
        ))}
      </div>

      <div className="residency-live-link">
        From 37 verified reviews and residency correspondence.{' '}
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
