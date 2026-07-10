import { navigate } from '../../hooks/useHashRoute';
import { paths } from '../../lib/routes';

export function Ticker() {
  return (
    <button className="ticker" onClick={() => navigate(paths.artsweek())}>
      LISTOWEL VISUAL ARTS WEEK · JULY 31 – AUGUST 9, 2026 <span className="ticker-star">✳</span>{' '}
      PROGRAMME NOW LIVE
    </button>
  );
}
