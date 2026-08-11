import { useMemo, useState } from 'react';
import { Link } from '../components/Link';
import { paths } from '../lib/routes';
import { COLLECTIONS, GROUP_LABELS, collectionsInGroup } from '../data/collections';
import { availableVariants, shopifyProduct } from '../data/shopify';
import { WorkCard } from '../components/works/WorkCard';
import './collection.css';

interface CollectionPageProps {
  collectionKey: string;
}

type SortOrder = 'featured' | 'price-asc' | 'price-desc' | 'name';

export function CollectionPage({ collectionKey }: CollectionPageProps) {
  const collection = COLLECTIONS[collectionKey] ?? COLLECTIONS.landscapes;
  const tabs = collectionsInGroup(collection.group);
  const hasItems = collection.items.length > 0;
  const [sortOrder, setSortOrder] = useState<SortOrder>('featured');
  const items = useMemo(() => {
    const sorted = [...collection.items];
    const livePrice = (slug: string, fallback: number) => {
      const product = shopifyProduct(collection.key, slug);
      const variants = product ? availableVariants(product) : [];
      return variants.length ? Math.min(...variants.map((variant) => variant.price)) : fallback;
    };
    if (sortOrder === 'price-asc') {
      sorted.sort(
        (left, right) => livePrice(left.slug, left.amount) - livePrice(right.slug, right.amount),
      );
    }
    if (sortOrder === 'price-desc') {
      sorted.sort(
        (left, right) => livePrice(right.slug, right.amount) - livePrice(left.slug, left.amount),
      );
    }
    if (sortOrder === 'name') sorted.sort((left, right) => left.name.localeCompare(right.name));
    return sorted;
  }, [collection, sortOrder]);

  return (
    <div>
      <div className="collection-header">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href={paths.home()}>HOME</Link> / {GROUP_LABELS[collection.group]} /{' '}
          <span className="crumb-current" aria-current="page">
            {collection.label.toUpperCase()}
          </span>
        </nav>
        <div className="collection-intro">
          <h1 className="serif collection-title">
            {collection.title} <em>{collection.titleEm}</em>
          </h1>
          <p className="collection-desc">{collection.desc}</p>
        </div>
      </div>

      <div className="collection-toolbar">
        <nav className="collection-tabs" aria-label={`${GROUP_LABELS[collection.group]} collections`}>
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              className={`collection-tab${tab.key === collection.key ? ' is-active' : ''}`}
              href={paths.collection(tab.key)}
              aria-current={tab.key === collection.key ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
        <div className="collection-meta">
          <span>
            {hasItems ? `${collection.items.length} works` : 'full catalogue on the live site'}
          </span>
          {hasItems && (
            <label className="collection-sort">
              <span className="sr-only">Sort collection</span>
              <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="name">Name</option>
              </select>
            </label>
          )}
        </div>
      </div>

      {hasItems ? (
        <div className="collection-grid">
          {items.map((item) => (
            <WorkCard
              key={item.slug}
              item={item}
              collectionKey={collection.key}
              naturalHeight={collection.square}
            />
          ))}
        </div>
      ) : (
        <div className="collection-empty">
          <div className="serif collection-empty-note">
            Browse the complete, current collection on Olive Stack Gallery’s secure shop.
          </div>
          <a className="pill pill--deep" href={collection.liveUrl}>
            VIEW THE LIVE COLLECTION →
          </a>
        </div>
      )}
    </div>
  );
}
