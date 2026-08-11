import { Link } from '../components/Link';
import { WorkshopList } from '../components/workshops/WorkshopList';
import { artsWeekPhase } from '../data/events';
import { paths } from '../lib/routes';
import './artsweek.css';

interface ArtsWeekPageProps {
  onBooked: () => void;
}

export function ArtsWeekPage({ onBooked }: ArtsWeekPageProps) {
  const phase = artsWeekPhase();
  const ended = phase === 'past';

  return (
    <div>
      <section className="artsweek-hero">
        <div className="artsweek-hero-year serif" aria-hidden="true">2026</div>
        <div className="artsweek-hero-copy">
          <div className="artsweek-hero-kicker">
            OLIVE BRANCHES: AN ARTIST GATHERING · 11 YEARS OF ARTISTIC CONNECTION
          </div>
          <h1 className="serif artsweek-hero-title">
            Listowel Visual <em>Arts Week</em>
          </h1>
          <div className="serif artsweek-hero-dates">July 31st – August 9th, 2026</div>
          <p className="artsweek-hero-blurb">
            {ended
              ? 'Thank you to every artist, visitor and local supporter who made the 2026 gathering ten memorable days of workshops, exhibitions and shared creative energy.'
              : 'Ten days of creative energy in the heritage town of Listowel, Co. Kerry. Workshops, life-drawing sessions, exhibitions and plein air painting, led by past artists in residence and friends.'}
          </p>
          <div className="artsweek-hero-ctas">
            <Link className="pill pill--cream" href={paths.workshops()}>
              {ended ? 'VIEW PROGRAMME ARCHIVE' : 'BOOK A WORKSHOP'}
            </Link>
            {!ended && (
              <Link className="pill pill--outline-cream" href={paths.giftcard()}>
                GIFT CARDS · FROM €50
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="artsweek-programme">
        <div className="artsweek-programme-head">
          <h2 className="serif artsweek-programme-title">
            The <em>programme</em>
          </h2>
          <div className="artsweek-programme-note">
            {ended ? '2026 PROGRAMME ARCHIVE · BOOKINGS CLOSED' : 'PLACES ARE LIMITED · EARLY BOOKING ADVISED'}
          </div>
        </div>
        <WorkshopList onBooked={onBooked} />
        <div className="artsweek-programme-footnote">
          {ended
            ? 'This archived programme is retained as a record of the 2026 gathering.'
            : 'Plus exhibitions, life drawing and plein air sessions throughout the ten days.'}
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
            We’re extremely grateful to the local businesses, sponsors and friends who supported
            the 2026 gathering.
          </p>
        </div>
        <div className="artsweek-sponsor-card">
          <h2 className="serif artsweek-sponsor-title">Support future Arts Week gatherings</h2>
          <p className="artsweek-sponsor-blurb">
            Help keep exhibitions, workshops and community art thriving in Listowel.
          </p>
          <Link className="pill pill--bronze artsweek-sponsor-cta" href={paths.sponsors()}>
            SPONSOR THE GATHERING
          </Link>
        </div>
      </section>
    </div>
  );
}
