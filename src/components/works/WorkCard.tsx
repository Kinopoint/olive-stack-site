import { navigate } from '../../hooks/useHashRoute';
import { paths } from '../../lib/routes';
import type { Artwork } from '../../data/collections';
import './works.css';

interface WorkCardProps {
  item: Artwork;
  collectionKey: string;
  /** Extra meta suffix, e.g. " · 01" on the home page. */
  metaSuffix?: string;
  /** Natural aspect ratio for square jewellery shots instead of the fixed editorial crop. */
  naturalHeight?: boolean;
  className?: string;
}

export function WorkCard({
  item,
  collectionKey,
  metaSuffix = '',
  naturalHeight = false,
  className = '',
}: WorkCardProps) {
  return (
    <button
      className={`work-card${className ? ` ${className}` : ''}`}
      onClick={() => navigate(paths.product(collectionKey, item.slug))}
    >
      <div className="work-card-media">
        <img
          src={item.img}
          alt={item.name}
          loading="lazy"
          className={`${naturalHeight ? 'is-natural' : ''}${item.sold ? ' is-sold' : ''}`}
        />
        {item.sold && <div className="work-card-sold">SOLD</div>}
      </div>
      <div className="work-card-row">
        <div className="serif work-card-name">{item.name}</div>
        <div className="work-card-price">{item.price}</div>
      </div>
      <div className="work-card-meta">
        {item.meta}
        {metaSuffix}
      </div>
    </button>
  );
}
