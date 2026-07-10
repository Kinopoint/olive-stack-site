import { navigate } from '../hooks/useHashRoute';
import { paths } from '../lib/routes';
import { COLLECTIONS, collectionImg, img } from '../data/collections';
import { WorkCard } from '../components/works/WorkCard';
import './home.css';

const FEATURED_INDEXES = [0, 3, 6, 11, 7, 2];
const OFFSET_POSITIONS = new Set([1, 4]);

const SHOP_CARDS = [
  {
    key: 'landscapes',
    number: '01',
    img: collectionImg('Virgin-Rock.jpg?v=1763732454'),
    alt: 'Original paintings',
    title: 'Original paintings',
    tag: 'FROM €550 →',
    blurb: 'Landscapes, still life and figurative work in oil, watercolour and encaustic.',
  },
  {
    key: 'prints',
    number: '02',
    img: collectionImg('Hawthorn_Harmony.jpg?v=1763732386'),
    alt: 'Limited edition prints',
    title: 'Limited edition prints',
    tag: 'SIGNED & NUMBERED →',
    blurb: 'Fine art prints of Olive’s best-loved paintings, made to archival standards.',
  },
  {
    key: 'pendants',
    number: '03',
    img: collectionImg('FB-IMG_1719517815138.jpg?v=1732907808'),
    alt: 'Micro mosaic jewellery',
    title: 'Micro mosaic jewellery',
    tag: 'ONE OF A KIND →',
    blurb: 'Pendants, rings and brooches hand-set with Murano glass filati.',
  },
];

const JEWELLERY_HIGHLIGHTS = [
  {
    img: img('rn-image_picker_lib_temp_e2db3dd6-ac01-417b-a64c-faea59898936.jpg?v=1761411508', 600),
    alt: 'Oval Mosaic Pendant',
    caption: 'OVAL PENDANT · €145',
  },
  {
    img: img('rn-image_picker_lib_temp_44e96366-8345-4257-8ea0-74393001f762.jpg?v=1729413901', 600),
    alt: 'Large Mandala Pendant',
    caption: 'MANDALA PENDANT · €175',
    offset: true,
  },
  {
    img: img('rn-image_picker_lib_temp_fc4c8142-88ba-4c34-b7d5-7b789eea6d6d.jpg?v=1748454432', 600),
    alt: 'Mosaic Pendant',
    caption: 'MOSAIC PENDANT · €120',
  },
];

const REVIEWS = [
  {
    quote:
      '“Olive is so talented and captures those moments so vividly. This is the present that keeps on giving.”',
    who: 'LILLIAN MOLONEY · “MEMORIES OF SUMMER, BALLYBUNION”',
  },
  {
    quote:
      '“Fantastic teacher and a really fun workshop… well out of my comfort zone and all the more enjoyable for it!”',
    who: 'KAREN DAVISON · FAUVIST PAINTING WORKSHOP',
  },
  {
    quote: '“Another beautiful item from Olive Stack, an angel to protect our home.”',
    who: 'JO SCANLON · STAINED GLASS ANGEL',
  },
];

const STRIP_LINKS = [
  { label: 'Original Paintings', path: paths.collection('landscapes') },
  { label: 'Limited Edition Prints', path: paths.collection('prints') },
  { label: 'Micro Mosaic Jewellery', path: paths.collection('pendants') },
  { label: 'Workshops & Life Drawing', path: paths.workshops() },
  { label: 'Artist Residency', path: paths.residency() },
];

export function HomePage() {
  const featured = FEATURED_INDEXES.map((i) => COLLECTIONS.landscapes.items[i]);

  return (
    <div>
      {/* hero */}
      <section className="home-hero" aria-labelledby="hero-heading">
        <div className="home-hero-copy">
          <div className="kicker">GALLERY &amp; STUDIO · LISTOWEL, CO. KERRY · EST. 1998</div>
          <h1 id="hero-heading" className="serif home-hero-title">
            Art from the <em>edge</em> of the Atlantic
          </h1>
          <p className="home-hero-blurb">
            Original paintings, fine art prints and one-of-a-kind micro mosaic jewellery by Irish
            artist Olive Stack, made in a gallery that has been at the heart of Listowel for 28
            years.
          </p>
          <div className="home-hero-ctas">
            <button
              className="pill pill--deep"
              onClick={() => navigate(paths.collection('landscapes'))}
            >
              BROWSE THE COLLECTION
            </button>
            <button className="pill pill--outline" onClick={() => navigate(paths.contact())}>
              VISIT THE GALLERY
            </button>
          </div>
          <div className="home-hero-proof">
            <span>
              <span className="stars">★★★★★</span>&nbsp; from 37 reviews
            </span>
            <span>·</span>
            <span>Worldwide shipping</span>
            <span>·</span>
            <span>Every piece one of a kind</span>
          </div>
        </div>
        <div className="home-hero-visual">
          <img
            src={img('Beenconeen-Beckons.jpg?v=1732103660', 1600)}
            alt="Beenconeen Beckons, painting by Olive Stack"
            className="home-hero-painting"
            fetchPriority="high"
          />
          <button
            className="home-hero-polaroid"
            onClick={() => navigate(paths.collection('pendants'))}
          >
            <img
              src={img(
                'rn-image_picker_lib_temp_caca2230-ceb1-4d34-93ee-1548d1658dc6.jpg?v=1762167313',
                500,
              )}
              alt="Micro mosaic pendant"
            />
            <div>MICRO MOSAIC · €115</div>
          </button>
          <div className="home-hero-caption">“Beenconeen Beckons” · oil · €3,500</div>
        </div>
      </section>

      {/* shop the gallery */}
      <section className="home-shop">
        <div className="home-section-head">
          <h2 className="serif home-section-title">
            Shop the <em>gallery</em>
          </h2>
          <div className="home-section-note">THREE WAYS TO BRING THE WORK HOME</div>
        </div>
        <div className="home-shop-grid">
          {SHOP_CARDS.map((card) => (
            <button
              key={card.key}
              className="home-shop-card"
              onClick={() => navigate(paths.collection(card.key))}
            >
              <div className="home-shop-media">
                <img src={card.img} alt={card.alt} loading="lazy" />
                <div className="home-shop-number">{card.number}</div>
              </div>
              <div className="home-shop-row">
                <div className="serif home-shop-name">{card.title}</div>
                <div className="home-shop-tag">{card.tag}</div>
              </div>
              <div className="home-shop-blurb">{card.blurb}</div>
            </button>
          ))}
        </div>
      </section>

      {/* italic strip */}
      <div className="home-strip serif">
        {STRIP_LINKS.map((link, i) => (
          <span key={link.label} className="home-strip-item">
            {i > 0 && <span className="home-strip-star">✳</span>}
            <button onClick={() => navigate(link.path)}>{link.label}</button>
          </span>
        ))}
      </div>

      {/* recent work */}
      <section className="home-recent">
        <div className="home-section-head">
          <h2 className="serif home-recent-title">
            Recent <em>work</em>
          </h2>
          <button
            className="link-underline home-recent-all"
            onClick={() => navigate(paths.collection('landscapes'))}
          >
            VIEW ALL PAINTINGS →
          </button>
        </div>
        <div className="home-recent-grid">
          {featured.map((item, i) => (
            <WorkCard
              key={item.slug}
              item={item}
              collectionKey="landscapes"
              metaSuffix={` · 0${i + 1}`}
              className={OFFSET_POSITIONS.has(i) ? 'is-offset' : ''}
            />
          ))}
        </div>
      </section>

      {/* jewellery band */}
      <section className="home-jewellery">
        <div className="home-jewellery-copy">
          <div className="kicker home-jewellery-kicker">WEARABLE ART</div>
          <h2 className="serif home-jewellery-title">
            Micro mosaic <em>jewellery</em>
          </h2>
          <p className="home-jewellery-blurb">
            Each piece is one of a kind: designed and hand-set by Olive with Murano glass filati.
            Pendants, rings, bracelets and brooches, no two ever alike.
          </p>
          <button
            className="pill pill--outline-cream"
            onClick={() => navigate(paths.collection('pendants'))}
          >
            EXPLORE JEWELLERY →
          </button>
        </div>
        <div className="home-jewellery-grid">
          {JEWELLERY_HIGHLIGHTS.map((piece) => (
            <button
              key={piece.caption}
              className={`home-jewellery-piece${piece.offset ? ' is-offset' : ''}`}
              onClick={() => navigate(paths.collection('pendants'))}
            >
              <img src={piece.img} alt={piece.alt} loading="lazy" />
              <div>{piece.caption}</div>
            </button>
          ))}
        </div>
      </section>

      {/* reviews */}
      <section className="home-reviews">
        <div className="home-section-head">
          <h2 className="serif home-section-title">
            Kind <em>words</em>
          </h2>
          <div className="home-section-note">
            <span className="stars">★★★★★</span> FROM 37 VERIFIED REVIEWS
          </div>
        </div>
        <div className="home-reviews-grid">
          {REVIEWS.map((review) => (
            <blockquote key={review.who} className="review-card">
              <div className="stars">★★★★★</div>
              <div className="serif review-quote">{review.quote}</div>
              <footer className="review-who">{review.who}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* arts week banner */}
      <section className="home-artsweek">
        <div>
          <div className="serif home-artsweek-dates">
            31.07
            <br />
            <span className="home-artsweek-to">to</span> 09.08
          </div>
          <div className="home-artsweek-where">2026 · LISTOWEL, CO. KERRY</div>
        </div>
        <div className="home-artsweek-copy">
          <h2 className="serif home-artsweek-title">Olive Branches: Listowel Visual Arts Week</h2>
          <p className="home-artsweek-blurb">
            Ten days of creative energy in the heritage town of Listowel: exhibitions, life-drawing
            sessions and workshops led by past artists in residence and friends. Learn, connect and
            create together.
          </p>
          <div className="home-artsweek-ctas">
            <button className="pill pill--bronze" onClick={() => navigate(paths.artsweek())}>
              PROGRAMME OF EVENTS
            </button>
            <button className="pill pill--outline" onClick={() => navigate(paths.sponsors())}>
              BECOME A SPONSOR
            </button>
          </div>
        </div>
      </section>

      {/* artist & residency */}
      <section className="home-duo">
        <div className="home-artist">
          <img
            src={img('FB_IMG_1718726304614.jpg?v=1736424652', 700)}
            alt="Olive Stack in the gallery"
            loading="lazy"
          />
          <div className="home-artist-copy">
            <div className="kicker">THE ARTIST</div>
            <h2 className="serif home-duo-title">28 years at the heart of Listowel</h2>
            <p className="home-duo-blurb">
              Olive has been making art for as long as she can remember. Inspired by flora, fauna
              and the changing Atlantic light, she works in oil, watercolour, encaustic, mosaic and
              micro mosaic.
            </p>
            <button className="link-underline" onClick={() => navigate(paths.contact())}>
              MEET OLIVE →
            </button>
          </div>
        </div>
        <div className="home-residency">
          <div className="kicker">ARTISTS RESIDENCY</div>
          <h2 className="serif home-duo-title">Live &amp; make above the gallery</h2>
          <p className="home-duo-blurb">
            A working residency for visual artists in the centre of a Kerry heritage town: studio
            space, exhibition opportunity and a warm welcome.
          </p>
          <div className="serif home-residency-quote">
            “I’m dreaming of Ireland.” (Amy Williams, applicant)
          </div>
          <button
            className="pill pill--deep home-residency-cta"
            onClick={() => navigate(paths.residency())}
          >
            ABOUT THE RESIDENCY
          </button>
        </div>
      </section>
    </div>
  );
}
