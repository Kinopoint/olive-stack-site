import { navigate } from '../hooks/useHashRoute';
import { paths } from '../lib/routes';
import { img } from '../data/collections';
import './residency.css';

const MAILING_LIST_URL =
  'https://olivestack.us9.list-manage.com/subscribe?u=5e1fb50fc69815743b363fac9&id=70f747799e';

const FACTS = [
  {
    title: '11 years',
    body: 'of welcoming international artists across every medium and genre, a growing family of makers who return to Listowel again and again.',
  },
  {
    title: 'A working gallery',
    body: 'Artists join the daily rhythm of the gallery, with first-hand insight into sustaining a practice alongside visitors, artists and collectors.',
  },
  {
    title: 'Main Street',
    body: 'Steps from shops, cafés and pubs, Childers Park, the River Feale and the Greenway, with the Wild Atlantic Way close by.',
  },
];

export function ResidencyPage() {
  return (
    <div>
      <section className="residency-hero">
        <div className="residency-hero-copy">
          <div className="kicker">SINCE 2015 · TWO ARTISTS EACH MONTH · LISTOWEL, CO. KERRY</div>
          <h1 className="serif residency-hero-title">
            A month of making, above the <em>gallery</em>
          </h1>
          <p className="residency-hero-blurb">
            Since 2015 the residency has welcomed visual artists from around the world to live and
            create in the heritage town of Listowel: private bedrooms and bathrooms, shared studio
            and living spaces above a working gallery.
          </p>
          <div className="residency-notice">
            <strong>The residency is fully booked until January 2028.</strong> Register to be first
            to hear about future opportunities.
          </div>
          <div className="residency-hero-ctas">
            <a className="pill pill--deep" href={MAILING_LIST_URL} target="_blank" rel="noreferrer">
              REGISTER FOR UPDATES
            </a>
            <button
              className="pill pill--outline"
              onClick={() => navigate(paths.residencyInfo())}
            >
              RESIDENCY INFORMATION
            </button>
          </div>
        </div>
        <div className="residency-hero-visual">
          <img
            src={img('FB_IMG_1718726304614.jpg?v=1736424652', 1200)}
            alt="Olive Stack Gallery, Listowel"
          />
        </div>
      </section>

      <section className="residency-facts">
        {FACTS.map((fact) => (
          <div key={fact.title} className="residency-fact">
            <div className="serif residency-fact-title">{fact.title}</div>
            <p className="residency-fact-body">{fact.body}</p>
          </div>
        ))}
      </section>

      <section className="residency-quote-band">
        <div className="residency-quote-kicker">FROM PAST RESIDENTS</div>
        <blockquote className="serif residency-quote">
          “I’m dreaming of Ireland. I look forward to hearing your applicant choices!”
        </blockquote>
        <div className="residency-quote-who">AMY WILLIAMS · RESIDENCY APPLICANT</div>
        <button
          className="pill pill--outline-cream residency-quote-cta"
          onClick={() => navigate(paths.testimonials())}
        >
          READ TESTIMONIALS →
        </button>
      </section>
    </div>
  );
}
