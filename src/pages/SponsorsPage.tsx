import './artsweek.css';

const SPONSORS = [
  { tier: 'CIVIC', name: 'Community Support Fund, Kerry County Council' },
  { tier: 'LOCAL BUSINESS', name: 'Listowel Business & Community Alliance' },
  { tier: 'FRIENDS', name: 'Jim and Liz Dunn' },
];

export function SponsorsPage() {
  return (
    <div className="sponsors-page">
      <div className="sponsors-intro">
        <div className="kicker">LISTOWEL VISUAL ARTS WEEK</div>
        <h1 className="serif sponsors-title">
          Sponsors <em>2026</em>
        </h1>
        <p className="sponsors-blurb">
          We are extremely grateful to the local businesses, sponsors and friends whose support
          made the 2026 gathering possible. Their support helped bring exhibitions, workshops and
          community art to Listowel across ten memorable days.
        </p>
      </div>

      <div className="sponsors-grid">
        {SPONSORS.map((sponsor) => (
          <div key={sponsor.name} className="sponsor-card">
            <div className="menu-kicker">{sponsor.tier}</div>
            <div className="serif sponsor-card-name">{sponsor.name}</div>
          </div>
        ))}
      </div>

      <div className="sponsors-cta">
        <h2 className="serif sponsors-cta-title">
          Support future exhibitions, workshops and community art in Listowel
        </h2>
        <a
          className="pill pill--bronze"
          href="https://www.olivestack.com/collections/donations"
          target="_blank"
          rel="noreferrer"
        >
          SUPPORT ON THE SECURE SHOP →
        </a>
      </div>
    </div>
  );
}
