import { img } from './collections';

export interface Workshop {
  key: string;
  date: string;
  startDate: string;
  endDate: string;
  name: string;
  desc: string;
  price: string;
  amount: number;
  highlighted?: boolean;
}

/** Cart thumbnail shared by every workshop booking. */
export const WORKSHOP_CART_IMG = img(
  'rn-image_picker_lib_temp_4c282c79-f48c-4e0e-afe4-8fe093dd8e72.jpg?v=1772462241',
  400,
);

export const WORKSHOPS: Workshop[] = [
  {
    key: 'cyanotype-nature-printing',
    date: 'Fri 31.07',
    startDate: '2026-07-31T00:00:00+01:00',
    endDate: '2026-08-01T00:00:00+01:00',
    name: 'Cyanotype Nature Printing: Bring Listowel Home',
    desc: 'Sun-printing with gathered flora of the town and riverbank',
    price: '€85',
    amount: 85,
  },
  {
    key: 'explore-creativity-with-glass',
    date: 'Sat–Sun 01–02.08',
    startDate: '2026-08-01T00:00:00+01:00',
    endDate: '2026-08-03T00:00:00+01:00',
    name: 'Explore Creativity with Glass, with Solly',
    desc: 'Two-day fluid double reverse mosaic technique workshop',
    price: '€280',
    amount: 280,
  },
  {
    key: 'micro-mosaic-jewellery',
    date: 'Mon 03.08',
    startDate: '2026-08-03T00:00:00+01:00',
    endDate: '2026-08-04T00:00:00+01:00',
    name: 'Micro Mosaic Jewellery, with Olive Stack',
    desc: 'Make your own wearable art with Murano glass filati',
    price: '€140',
    amount: 140,
    highlighted: true,
  },
  {
    key: 'the-cailleach-within',
    date: 'Tue 04.08',
    startDate: '2026-08-04T00:00:00+01:00',
    endDate: '2026-08-05T00:00:00+01:00',
    name: 'The Cailleach Within: Felted Crone Wisdom Keeper, with Laura Hitchcock',
    desc: 'Needle-felting rooted in Irish myth',
    price: '€150',
    amount: 150,
  },
  {
    key: 'capturing-listowel',
    date: 'Wed 05.08',
    startDate: '2026-08-05T00:00:00+01:00',
    endDate: '2026-08-06T00:00:00+01:00',
    name: 'Capturing Listowel, Oil Painting, with Jean Cauthen',
    desc: 'Plein air oils in the streets of the heritage town',
    price: '€110',
    amount: 110,
  },
  {
    key: 'willow-and-paper-lanterns',
    date: 'Thu 06.08',
    startDate: '2026-08-06T00:00:00+01:00',
    endDate: '2026-08-07T00:00:00+01:00',
    name: 'Willow and Paper Lanterns, with Kathleen Doody',
    desc: 'Traditional willow weaving, light and paper',
    price: '€150',
    amount: 150,
  },
  {
    key: 'tone-and-colour',
    date: 'Fri 07.08',
    startDate: '2026-08-07T00:00:00+01:00',
    endDate: '2026-08-08T00:00:00+01:00',
    name: 'Enhance your use of Tone and Colour, with Brendan Campbell',
    desc: 'A focused day of colour theory in practice',
    price: '€70',
    amount: 70,
  },
];

export type ArtsWeekPhase = 'upcoming' | 'live' | 'past';

const ARTS_WEEK_START = Date.parse('2026-07-31T00:00:00+01:00');
const ARTS_WEEK_END = Date.parse('2026-08-10T00:00:00+01:00');

export function artsWeekPhase(now: Date = new Date()): ArtsWeekPhase {
  if (now.getTime() < ARTS_WEEK_START) return 'upcoming';
  if (now.getTime() < ARTS_WEEK_END) return 'live';
  return 'past';
}

export const workshopHasEnded = (workshop: Workshop, now: Date = new Date()): boolean =>
  now.getTime() >= Date.parse(workshop.endDate);

export interface Testimonial {
  quote: string;
  who: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'I’m dreaming of Ireland. I look forward to hearing your applicant choices!',
    who: 'AMY WILLIAMS · RESIDENCY APPLICANT',
  },
  {
    quote:
      'Olive is so talented and captures those moments so vividly. This is the present that keeps on giving.',
    who: 'LILLIAN MOLONEY · LONDON',
  },
  {
    quote:
      'Fantastic teacher and a really fun workshop. Venturing into Fauvist portraiture in oils was well out of my comfort zone and all the more enjoyable for it!',
    who: 'KAREN DAVISON · WORKSHOP GUEST',
  },
  {
    quote:
      'Very informative! Plus just a whole lot of fun with the high energy, high positivity Emily Andress.',
    who: 'JEAN CAUTHEN · ARTIST & WORKSHOP GUEST',
  },
  {
    quote:
      'Stacey was very welcoming, informative and patient. The time went so fast. I achieved a watercolour robin painting I was very happy with.',
    who: 'MARTINA BARRY · WATERCOLOUR WORKSHOP',
  },
  {
    quote:
      'Loved this and found a new way to do mosaics. Thanks for the opportunity, Olive. Solly was a great teacher.',
    who: 'DAIREEN MᶜMULLIN BROWNE · MOSAIC WORKSHOP',
  },
];

export interface Photo {
  img: string;
  alt: string;
}

export const PHOTOS: Photo[] = [
  { img: img('FB_IMG_1718726304614.jpg?v=1736424652', 900), alt: 'Olive in the gallery' },
  {
    img: 'https://www.olivestack.com/cdn/shop/collections/FB-IMG_1719517815138.jpg?v=1732907808&width=900',
    alt: 'Micro mosaic worn',
  },
  {
    img: 'https://www.olivestack.com/cdn/shop/collections/Virgin-Rock.jpg?v=1763732454&width=900',
    alt: 'Virgin Rock',
  },
  {
    img: img('rn-image_picker_lib_temp_f031a3e1-2a37-408f-8a34-9b98a6ab0ef5.jpg?v=1762013054', 900),
    alt: 'William Street Listowel',
  },
  {
    img: 'https://www.olivestack.com/cdn/shop/collections/Hawthorn_Harmony.jpg?v=1763732386&width=900',
    alt: 'Hawthorn Harmony',
  },
  { img: img('Beenconeen-Beckons.jpg?v=1732103660', 900), alt: 'Beenconeen Beckons' },
];
