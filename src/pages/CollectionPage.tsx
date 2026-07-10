import { navigate } from '../hooks/useHashRoute';
import { paths } from '../lib/routes';
import { COLLECTIONS, GROUP_LABELS, collectionsInGroup } from '../data/collections';
import { WorkCard } from '../components/works/WorkCard';
import './collection.css';

interface CollectionPageProps {
  collectionKey: string;
}

export function CollectionPage({ collectionKey }: CollectionPageProps) {
  const collection = COLLECTIONS[collectionKey] ?? COLLECTIONS.landscapes;
  const tabs = collectionsInGroup(collection.group);
  const hasItems = collection.items.length > 0;

  return (
    <div>
      <div className="collection-header">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <button onClick={() => navigate(paths.home())}>HOME</button> /{' '}
          {GROUP_LABELS[collection.group]} /{' '}
          <span className="crumb-current">{collection.label.toUpperCase()}</span>
        </nav>
        <div className="collection-intro">
          <h1 className="serif collection-title">
            {collection.title} <em>{collection.titleEm}</em>
          </h1>
          <p className="collection-desc">{collection.desc}</p>
        </div>
      </div>

      <div className="collection-toolbar">
        <div className="collection-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`collection-tab${tab.key === collection.key ? ' is-active' : ''}`}
              onClick={() => navigate(paths.collection(tab.key))}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="collection-meta">
          <span>
            {hasItems ? `${collection.items.length} works` : 'full catalogue on the live site'}
          </span>
          <span className="collection-sort">Sort: Newest ↓</span>
        </div>
      </div>

      {hasItems ? (
        <div className="collection-grid">
          {collection.items.map((item) => (
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
            This collection lives on the current site while the redesign is in progress.
          </div>
          <a
            className="pill pill--deep"
            href={collection.liveUrl}
            target="_blank"
            rel="noreferrer"
          >
            VIEW THE LIVE COLLECTION →
          </a>
        </div>
      )}
    </div>
  );
}
