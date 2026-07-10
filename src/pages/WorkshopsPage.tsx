import { navigate } from '../hooks/useHashRoute';
import { paths } from '../lib/routes';
import { WorkshopList } from '../components/workshops/WorkshopList';
import './artsweek.css';

interface WorkshopsPageProps {
  onBooked: () => void;
}

export function WorkshopsPage({ onBooked }: WorkshopsPageProps) {
  return (
    <div className="workshops-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <button onClick={() => navigate(paths.home())}>HOME</button> /{' '}
        <button onClick={() => navigate(paths.artsweek())}>ARTS WEEK</button> /{' '}
        <span className="crumb-current">WORKSHOPS</span>
      </nav>
      <div className="workshops-intro">
        <h1 className="serif workshops-title">
          Workshops <em>2026</em>
        </h1>
        <p className="workshops-desc">
          Upcoming workshops with Olive Stack and visiting artists in residence at the gallery,
          during Listowel Visual Arts Week, July 31st – August 9th.
        </p>
      </div>
      <WorkshopList onBooked={onBooked} />
      <div className="workshops-footer">
        <div className="workshops-footer-note">
          Gift cards from €50 are available for all 2026 workshops.
        </div>
        <button className="pill pill--deep" onClick={() => navigate(paths.giftcard())}>
          WORKSHOP GIFT CARDS
        </button>
      </div>
    </div>
  );
}
