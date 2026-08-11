import { Link } from '../Link';
import { paths } from '../../lib/routes';
import { imageSrcSet, type Artwork } from '../../data/collections';
import { availableVariants, shopifyProduct } from '../../data/shopify';
import { euro } from '../../lib/format';
import './works.css';

interface WorkCardProps {
  item: Artwork;
  collectionKey: string;
  metaSuffix?: string;
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
  const liveProduct = shopifyProduct(collectionKey, item.slug);
  const sold = !liveProduct?.available;
  const variants = liveProduct ? availableVariants(liveProduct) : [];
  const livePrice = variants.length
    ? `${variants.length > 1 ? 'From ' : ''}${euro(Math.min(...variants.map((variant) => variant.price)))}`
    : item.price;

  return (
    <Link
      className={`work-card${className ? ` ${className}` : ''}`}
      href={paths.product(collectionKey, item.slug)}
    >
      <div className="work-card-media">
        <img
          src={item.img}
          srcSet={imageSrcSet(item.img)}
          sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1024px) 46vw, 31vw"
          alt={item.name}
          loading="lazy"
          decoding="async"
          className={`${naturalHeight ? 'is-natural' : ''}${sold ? ' is-sold' : ''}`}
        />
        {sold && <div className="work-card-sold">SOLD</div>}
      </div>
      <div className="work-card-row">
        <div className="serif work-card-name">{item.name}</div>
        <div className="work-card-price">{livePrice}</div>
      </div>
      <div className="work-card-meta">
        {item.meta}
        {metaSuffix}
      </div>
    </Link>
  );
}
