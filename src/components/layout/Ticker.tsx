import { Link } from '../Link';
import { artsWeekPhase } from '../../data/events';
import { paths } from '../../lib/routes';

export function Ticker() {
  const phase = artsWeekPhase();
  const label =
    phase === 'upcoming'
      ? 'LISTOWEL VISUAL ARTS WEEK · JULY 31 – AUGUST 9, 2026 ✳ VIEW PROGRAMME'
      : phase === 'live'
        ? 'LISTOWEL VISUAL ARTS WEEK · NOW LIVE ✳ VIEW TODAY’S PROGRAMME'
        : 'LISTOWEL VISUAL ARTS WEEK 2026 · THANK YOU FOR JOINING US ✳ VIEW THE ARCHIVE';

  return (
    <Link className="ticker" href={paths.artsweek()}>
      {label}
    </Link>
  );
}
