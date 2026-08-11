import { WORKSHOPS, WORKSHOP_CART_IMG, workshopHasEnded, type Workshop } from '../../data/events';
import { shopifyWorkshop, singleAvailableVariant } from '../../data/shopify';
import { euro } from '../../lib/format';
import { useCart } from '../../store/CartContext';
import './workshops.css';

interface WorkshopListProps {
  onBooked: () => void;
}

export function WorkshopList({ onBooked }: WorkshopListProps) {
  const cart = useCart();

  const book = (workshop: Workshop) => {
    const product = shopifyWorkshop(workshop.key);
    const variant = product ? singleAvailableVariant(product) : undefined;
    if (!product || !variant || workshopHasEnded(workshop)) return;
    cart.add({
      id: variant.id,
      variantId: variant.id,
      productUrl: product.url,
      name: workshop.name,
      price: euro(variant.price),
      amount: variant.price,
      meta: `WORKSHOP · ${workshop.date.toUpperCase()}`,
      img: WORKSHOP_CART_IMG,
    });
    onBooked();
  };

  return (
    <div className="workshop-list">
      {WORKSHOPS.map((workshop) => {
        const product = shopifyWorkshop(workshop.key);
        const variant = product ? singleAvailableVariant(product) : undefined;
        const ended = workshopHasEnded(workshop);
        const inCart = variant ? cart.has(variant.id) : false;
        const label = ended ? 'EVENT ENDED' : !variant ? 'FULLY BOOKED' : inCart ? 'IN CART ✓' : 'BOOK';

        return (
          <div key={workshop.key} className={`workshop-row${workshop.highlighted ? ' is-highlighted' : ''}`}>
            <div className="serif workshop-date">{workshop.date}</div>
            <div>
              <div className="serif workshop-name">{workshop.name}</div>
              <div className="workshop-desc">{workshop.desc}</div>
            </div>
            <div className="workshop-price">{workshop.price}</div>
            <button className="workshop-book" onClick={() => book(workshop)} disabled={ended || !variant}>
              {label}
            </button>
          </div>
        );
      })}
    </div>
  );
}
