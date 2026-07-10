import { navigate } from '../hooks/useHashRoute';
import { paths } from '../lib/routes';
import { WorkshopList } from '../components/workshops/WorkshopList';
import './artsweek.css';

interface ArtsWeekPageProps {
  onBooked: () => void;
}

export function ArtsWeekPage({ onBooked }: ArtsWeekPageProps) {
  return (
    <div>
      <section className="artsweek-hero">
        <div className="artsweek-hero-year serif" aria-hidden="true">
          2026
        </div>
        <div className="artsweek-hero-copy">
          <div className="artsweek-hero-kicker">
            OLIVE BRANCHES: AN ARTIST GATHERING · 11 YEARS OF ARTISTIC CONNECTION
          </div>
          <h1 className="serif artsweek-hero-title">
            Listowel Visual <em>Arts Week</em>
          </h1>
          <div className="serif artsweek-hero-dates">July 31st – August 9th, 2026</div>
          <p className="artsweek-hero-blurb">
            Ten days of creative energy in the heritage town of Listowel, Co. Kerry. Workshops,
            life-drawing sessions, exhibitions and plein air painting, led by past artists in
            residence and friends.
          </p>
          <div className="artsweek-hero-ctas">
            <button className="pill pill--cream" onClick={() => navigate(paths.workshops())}>
              BOOK A WORKSHOP
            </button>
            <button
              className="pill pill--outline-cream"
              onClick={() => navigate(paths.giftcard())}
            >
              GIFT CARDS · FROM €50
            </button>
          </div>
        </div>
      </section>

      <section className="artsweek-programme">
        <div className="artsweek-programme-head">
          <h2 className="serif artsweek-programme-title">
            The <em>programme</em>
          </h2>
          <div className="artsweek-programme-note">PLACES ARE LIMITED · EARLY BOOKING ADVISED</div>
        </div>
        <WorkshopList onBooked={onBooked} />
        <div className="artsweek-programme-footnote">
          Plus exhibitions, life drawing and plein air sessions throughout the ten days. Full daily
          schedule announced closer to the date.
        </div>
      </section>

      <section className="artsweek-sponsors">
        <div className="artsweek-sponsors-copy">
          <div className="kicker">2026 SPONSORS</div>
          <div className="serif artsweek-sponsors-names">
            Community Support Fund Kerry Co. Co. · Listowel Business &amp; Community Alliance · Jim
            and Liz Dunn
          </div>
          <p className="artsweek-sponsors-blurb">
            We’re extremely grateful to the local businesses, sponsors and friends who made the
            2025 gathering so special.
          </p>
        </div>
        <div className="artsweek-sponsor-card">
          <h2 className="serif artsweek-sponsor-title">Become a sponsor of Arts Week 2026</h2>
          <p className="artsweek-sponsor-blurb">
            Support ten days of exhibitions, workshops and community art in Listowel.
          </p>
          <button
            className="pill pill--bronze artsweek-sponsor-cta"
            onClick={() => navigate(paths.sponsors())}
          >
            SPONSOR THE GATHERING
          </button>
        </div>
      </section>
    </div>
  );
}
