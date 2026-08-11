import { useDeferredValue, useRef, useState } from 'react';
import { Link } from '../Link';
import { useDialog } from '../../hooks/useDialog';
import { paths } from '../../lib/routes';
import { countMatches, searchProducts } from '../../lib/search';
import { imageSrcSet } from '../../data/collections';
import './search.css';

interface SearchOverlayProps {
  onClose: () => void;
}

export function SearchOverlay({ onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useDialog(onClose, inputRef);
  const results = searchProducts(deferredQuery);
  const trimmed = deferredQuery.trim();
  const countLabel = trimmed
    ? `${countMatches(deferredQuery)} RESULTS FOR “${deferredQuery.toUpperCase()}”`
    : 'GALLERY HIGHLIGHTS';

  return (
    <div
      ref={dialogRef}
      className="search-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-title"
      tabIndex={-1}
    >
      <div className="overlay-scrim" onClick={onClose} aria-hidden="true" />
      <div className="search-panel">
        <div className="search-bar">
          <label id="search-title" className="sr-only" htmlFor="shop-search">
            Search the gallery shop
          </label>
          <input
            ref={inputRef}
            id="shop-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search paintings, prints, jewellery…"
            type="search"
          />
          <button className="overlay-close" onClick={onClose} aria-label="Close search">
            ✕
          </button>
        </div>
        <div className="search-count" aria-live="polite">{countLabel}</div>
        {results.length ? (
          <div className="search-results">
            {results.map(({ item, collectionKey }) => (
              <Link
                key={`${collectionKey}-${item.slug}`}
                className="search-result"
                href={paths.product(collectionKey, item.slug)}
                onClick={onClose}
              >
                <img
                  src={item.img}
                  srcSet={imageSrcSet(item.img, [240, 360, 480])}
                  sizes="(max-width: 560px) 45vw, (max-width: 1024px) 30vw, 18vw"
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <div className="serif search-result-name">{item.name}</div>
                <div className="search-result-price">{item.price}</div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="search-empty">No matching work found. Try a medium, place or collection.</p>
        )}
      </div>
    </div>
  );
}
