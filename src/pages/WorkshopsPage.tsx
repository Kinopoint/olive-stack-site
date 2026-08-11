import { Link } from '../components/Link';
import { WorkshopList } from '../components/workshops/WorkshopList';
import { artsWeekPhase } from '../data/events';
import { paths } from '../lib/routes';
import './artsweek.css';

interface WorkshopsPageProps {
  onBooked: () => void;
}

export function WorkshopsPage({ onBooked }: WorkshopsPageProps) {
  const ended = artsWeekPhase() === 'past';

  return (
    <div className="workshops-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href={paths.home()}>HOME</Link> / <Link href={paths.artsweek()}>ARTS WEEK</Link> /{' '}
        <span className="crumb-current" aria-current="page">WORKSHOPS</span>
      </nav>
      <div className="workshops-intro">
        <h1 className="serif workshops-title">
          Workshops <em>2026</em>
        </h1>
        <p className="workshops-desc">
          {ended
            ? 'The 2026 programme has concluded. This archive records the workshops held during Listowel Visual Arts Week, July 31st – August 9th.'
            : 'Upcoming workshops with Olive Stack and visiting artists during Listowel Visual Arts Week, July 31st – August 9th.'}
        </p>
      </div>
      <WorkshopList onBooked={onBooked} />
      <div className="workshops-footer">
        <div className="workshops-footer-note">
          {ended ? 'Bookings for the 2026 programme are closed.' : 'Gift cards are available for workshops.'}
        </div>
        {!ended && (
          <Link className="pill pill--deep" href={paths.giftcard()}>
            WORKSHOP GIFT CARDS
          </Link>
        )}
      </div>
    </div>
  );
}
