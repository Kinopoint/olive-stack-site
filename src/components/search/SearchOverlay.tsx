import { useState } from 'react';
import { navigate } from '../../hooks/useHashRoute';
import { paths } from '../../lib/routes';
import { countMatches, searchProducts } from '../../lib/search';
import './search.css';

interface SearchOverlayProps {
  onClose: () => void;
}

export function SearchOverlay({ onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const results = searchProducts(query);
  const trimmed = query.trim();
  const countLabel = trimmed
    ? `${countMatches(query)} RESULTS FOR “${query.toUpperCase()}”`
    : 'POPULAR RIGHT NOW';

  return (
    <div className="search-overlay" role="dialog" aria-label="Search the shop">
      <button className="overlay-scrim" onClick={onClose} aria-label="Close search" />
      <div className="search-panel">
        <div className="search-bar">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
            placeholder="Search paintings, prints, jewellery…"
            autoFocus
          />
          <button className="overlay-close" onClick={onClose} aria-label="Close search">
            ✕
          </button>
        </div>
        <div className="search-count">{countLabel}</div>
        <div className="search-results">
          {results.map(({ item, collectionKey }) => (
            <button
              key={`${collectionKey}-${item.slug}`}
              className="search-result"
              onClick={() => navigate(paths.product(collectionKey, item.slug))}
            >
              <img src={item.img} alt={item.name} loading="lazy" />
              <div className="serif search-result-name">{item.name}</div>
              <div className="search-result-price">{item.price}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
