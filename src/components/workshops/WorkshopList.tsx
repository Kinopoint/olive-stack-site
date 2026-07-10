import { WORKSHOPS, WORKSHOP_CART_IMG, type Workshop } from '../../data/events';
import { useCart } from '../../store/CartContext';
import './workshops.css';

interface WorkshopListProps {
  onBooked: () => void;
}

/** Programme table shared by the Arts Week and Workshops pages. */
export function WorkshopList({ onBooked }: WorkshopListProps) {
  const cart = useCart();

  const book = (workshop: Workshop) => {
    cart.add({
      name: workshop.name,
      price: workshop.price,
      amount: workshop.amount,
      meta: `WORKSHOP · ${workshop.date.toUpperCase()}`,
      img: WORKSHOP_CART_IMG,
    });
    onBooked();
  };

  return (
    <div className="workshop-list">
      {WORKSHOPS.map((ws) => (
        <div key={ws.name} className={`workshop-row${ws.highlighted ? ' is-highlighted' : ''}`}>
          <div className="serif workshop-date">{ws.date}</div>
          <div>
            <div className="serif workshop-name">{ws.name}</div>
            <div className="workshop-desc">{ws.desc}</div>
          </div>
          <div className="workshop-price">{ws.price}</div>
          <button className="workshop-book" onClick={() => book(ws)}>
            {cart.has(ws.name) ? 'IN CART ✓' : 'BOOK'}
          </button>
        </div>
      ))}
    </div>
  );
}
