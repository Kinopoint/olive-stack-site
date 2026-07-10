import { navigate } from '../hooks/useHashRoute';
import { paths } from '../lib/routes';
import { img } from '../data/collections';
import './residency.css';

const MAILING_LIST_URL =
  'https://olivestack.us9.list-manage.com/subscribe?u=5e1fb50fc69815743b363fac9&id=70f747799e';

const PARAGRAPHS = [
  'The residency hosts two artists each month and provides private bedrooms and bathrooms, along with shared studio and living spaces above the gallery. The programme is led by Olive Stack, a professional artist and gallerist whose gallery has been a vibrant part of the Listowel community since 1998.',
  'Conceived as a symbiotic exchange, the residency offers visiting artists dedicated time and space for studio practice alongside an immersive cultural experience within a long-established independent gallery. It welcomes international visual artists working across a wide range of mediums and genres.',
  'Artists are gently integrated into the daily rhythm of the gallery, gaining first-hand insight into the realities of sustaining an artistic practice within a professional exhibition space and its ongoing relationship with visitors, artists and collectors.',
  'Over the past decade the residency has forged connections across continents and creative disciplines. Visiting artists have built new bodies of work inspired by Listowel and its people, and formed fast and enduring friendships. Listowel has become a favourite destination for a growing international family of artists.',
];

export function ResidencyInfoPage() {
  return (
    <div className="residency-info">
      <div className="residency-info-main">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <button onClick={() => navigate(paths.home())}>HOME</button> /{' '}
          <button onClick={() => navigate(paths.residency())}>ARTISTS RESIDENCY</button> /{' '}
          <span className="crumb-current">INFORMATION</span>
        </nav>
        <h1 className="serif residency-info-title">
          Residency <em>information</em>
        </h1>
        {PARAGRAPHS.map((text) => (
          <p key={text.slice(0, 24)} className="residency-info-text">
            {text}
          </p>
        ))}
      </div>

      <aside className="residency-info-aside">
        <div className="residency-glance">
          <div className="menu-kicker">AT A GLANCE</div>
          <div className="residency-glance-facts">
            Duration: one month
            <br />
            Artists per month: two
            <br />
            Private bedroom &amp; bathroom
            <br />
            Shared studio &amp; living spaces
            <br />
            Location: Main Street, Listowel
          </div>
          <div className="residency-glance-booked">
            <strong>Fully booked until January 2028.</strong>
          </div>
          <a
            className="pill pill--deep residency-glance-cta"
            href={MAILING_LIST_URL}
            target="_blank"
            rel="noreferrer"
          >
            REGISTER FOR UPDATES
          </a>
        </div>
        <img
          src={img('FB_IMG_1718726304614.jpg?v=1736424652', 800)}
          alt="The gallery in Listowel"
          className="residency-info-photo"
          loading="lazy"
        />
      </aside>
    </div>
  );
}
