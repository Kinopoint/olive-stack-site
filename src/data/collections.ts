import { slugify } from '../lib/slug';

export interface ArtworkDetail {
  label: string;
  value: string;
}

export interface Artwork {
  slug: string;
  name: string;
  price: string;
  amount: number;
  meta: string;
  img: string;
  sold?: boolean;
  details?: ArtworkDetail[];
  description?: string;
}

export type CollectionGroup = 'paintings' | 'jewellery' | 'more';

export interface Collection {
  key: string;
  label: string;
  group: CollectionGroup;
  title: string;
  titleEm: string;
  desc: string;
  kicker: string;
  productDesc: string;
  liveUrl: string;
  square?: boolean;
  items: Artwork[];
}

const FILES = 'https://www.olivestack.com/cdn/shop/files/';
const SHOP_COLLECTIONS = 'https://www.olivestack.com/cdn/shop/collections/';

export const img = (file: string, width = 900): string =>
  `${FILES}${file}&width=${width}`;

export const collectionImg = (file: string, width = 900): string =>
  `${SHOP_COLLECTIONS}${file}&width=${width}`;

type ArtworkInput = Omit<Artwork, 'slug'>;

const works = (items: ArtworkInput[]): Artwork[] =>
  items.map((item) => ({ ...item, slug: slugify(item.name) }));

export const COLLECTIONS: Record<string, Collection> = {
  landscapes: {
    key: 'landscapes',
    label: 'Landscapes',
    group: 'paintings',
    title: 'Landscapes of the',
    titleEm: 'Wild Atlantic Way',
    desc: 'Windswept cliffs, rolling waves, coastal flora and native birds: paintings that reflect the ever-changing light of Ireland’s west coast.',
    kicker: 'ORIGINAL PAINTING · ONE OF A KIND',
    productDesc:
      'Original painting of the Wild Atlantic Way, professionally framed and ready to hang.',
    liveUrl: 'https://www.olivestack.com/collections/landscapes',
    items: works([
      {
        name: 'Watching Over Coumeenoole',
        price: '€3,600',
        amount: 3600,
        meta: 'OIL ON CANVAS · 60 × 80 CM',
        img: img('rn-image_picker_lib_temp_2c685b3a-8b8a-43e1-94e1-e4e60134f838.jpg?v=1782478366'),
        details: [
          { label: 'MEDIUM', value: 'Oil on canvas' },
          { label: 'PAINTING SIZE', value: '60 × 80 cm' },
          { label: 'FRAMED SIZE', value: '74 × 93.5 cm' },
          { label: 'FRAME', value: 'Double white Italian moulding' },
        ],
        description:
          'Professionally framed in a double white Italian moulding, ready to hang. Coumeenoole Beach at the tip of the Dingle Peninsula, watched over by wheeling seabirds.',
      },
      {
        name: 'Sea Thrift and Samphire Mingle',
        price: '€3,600',
        amount: 3600,
        meta: 'OIL ON CANVAS · WEST KERRY',
        img: img('rn-image_picker_lib_temp_a0edefce-1a9b-4a0b-8444-2aa06806b972.jpg?v=1781282153'),
      },
      {
        name: 'Side by Side over Clogher Strand',
        price: '€1,050',
        amount: 1050,
        meta: 'OIL ON CANVAS',
        img: img('rn-image_picker_lib_temp_2ba997e8-1576-48f9-ad2b-3bff4ffafb24.jpg?v=1754816182'),
      },
      {
        name: 'Deenish and Scariff, Wild and Free',
        price: '€1,475',
        amount: 1475,
        meta: 'OIL ON CANVAS',
        img: img('rn-image_picker_lib_temp_ec90db78-791e-4353-ad4f-0e036e8f7a5d.jpg?v=1773332141'),
      },
      {
        name: 'Sea Thrift along the Way II',
        price: '€5,000',
        amount: 5000,
        meta: 'OIL ON CANVAS',
        img: img('FB-IMG_1732104159580.jpg?v=1732104622'),
      },
      {
        name: 'West Kerry Seaspray',
        price: '€550',
        amount: 550,
        meta: 'OIL ON CANVAS',
        img: img('rn-image_picker_lib_temp_64762e21-9e67-4717-a4de-89663c830f88.jpg?v=1780415936'),
      },
      {
        name: 'Clogher Pace',
        price: '€1,700',
        amount: 1700,
        meta: 'OIL ON CANVAS',
        img: img('rn-image_picker_lib_temp_c5d121b2-3196-4aa2-a94d-2280c09ba2d1.jpg?v=1763114538'),
      },
      {
        name: 'Out West',
        price: '€3,600',
        amount: 3600,
        meta: 'OIL ON CANVAS',
        img: img('rn-image_picker_lib_temp_da40a6eb-8389-4cf6-919b-a94c978bc1f0.jpg?v=1777194140'),
      },
      {
        name: 'Rattoo from Ladies Walk',
        price: '€2,200',
        amount: 2200,
        meta: 'OIL ON CANVAS',
        img: img('Rattoo-from-Ladies-Walk-107ae16c-c4ff-4612-b1e8-52b2b9191c04.jpg?v=1735992453'),
      },
      {
        name: 'Kerry Ash Grove',
        price: '€1,500',
        amount: 1500,
        meta: 'OIL ON CANVAS',
        img: img('3KerryAshGrove.jpg?v=1735996500'),
      },
      {
        name: 'Keepers of the Estuary II',
        price: '€700',
        amount: 700,
        meta: 'OIL ON CANVAS',
        img: img('Keepers-of-the-Estuary-II.jpg?v=1732105176'),
      },
      {
        name: 'Sunset Sonata I',
        price: '€1,000',
        amount: 1000,
        meta: 'OIL ON CANVAS',
        img: img('Sunset-Sonata.jpg?v=1732102868'),
      },
      {
        name: 'Beenconeen Beckons',
        price: '€3,500',
        amount: 3500,
        meta: 'OIL ON CANVAS',
        img: img('FB_IMG_1698134742830.jpg?v=1773155668'),
      },
      {
        name: 'Clifftop Abundance Meenogahane',
        price: '€3,500',
        amount: 3500,
        meta: 'OIL ON CANVAS',
        img: img('Clifftop-Abundance-Meenogahane.jpg?v=1732103949'),
      },
      {
        name: 'Dimming of the Day',
        price: '€2,900',
        amount: 2900,
        meta: 'OIL ON CANVAS',
        img: img('rn-image_picker_lib_temp_1dd48266-8446-424a-b9b9-2abf701e3eb0.jpg?v=1782132152'),
      },
    ]),
  },
  interiors: {
    key: 'interiors',
    label: 'Spaces & Places',
    group: 'paintings',
    title: 'Spaces &',
    titleEm: 'Places',
    desc: 'This collection celebrates the beauty of designed environments, from quiet interiors to street scenes: the rhythm, texture and atmosphere of the spaces we inhabit.',
    kicker: 'ORIGINAL PAINTING · ONE OF A KIND',
    productDesc:
      'Original painting from the Spaces & Places collection, capturing the atmosphere of the places we inhabit and move through.',
    liveUrl: 'https://www.olivestack.com/collections/interiors',
    items: works([
      {
        name: 'William Street Listowel',
        price: '€500',
        amount: 500,
        meta: 'ORIGINAL PAINTING',
        img: img('rn-image_picker_lib_temp_f031a3e1-2a37-408f-8a34-9b98a6ab0ef5.jpg?v=1762013054'),
      },
      {
        name: 'Lovely Listowel',
        price: '€400',
        amount: 400,
        meta: 'ORIGINAL PAINTING',
        img: img('rn-image_picker_lib_temp_f1e00fcc-78c7-4540-aaca-7e005b5b885c.jpg?v=1762082018'),
      },
      {
        name: 'St John’s and St Mary’s',
        price: '€600',
        amount: 600,
        meta: 'ORIGINAL PAINTING',
        img: img('St_John_s_and_St_Marys_Listowel.jpg?v=1769557709'),
      },
      {
        name: 'Fireside Companions',
        price: '€1,850',
        amount: 1850,
        meta: 'OIL ON PANEL',
        img: img('FiresideCompanions.jpg?v=1732114904'),
      },
      {
        name: 'Dining Room Blue',
        price: '€650',
        amount: 650,
        meta: 'ORIGINAL PAINTING',
        img: img('InteriorDrawing.jpg?v=1732118848'),
      },
      {
        name: 'Powder Room Blues',
        price: '€650',
        amount: 650,
        meta: 'ORIGINAL PAINTING',
        img: img('PowderRoomBlues.jpg?v=1732118548'),
      },
      {
        name: 'The Other Half',
        price: '€1,350',
        amount: 1350,
        meta: 'OIL ON PANEL',
        img: img('FirePlaceII.jpg?v=1732115324'),
      },
      {
        name: 'Tea Time',
        price: '€900',
        amount: 900,
        meta: 'ORIGINAL PAINTING',
        img: img('rn-image_picker_lib_temp_54df4b22-211f-4288-81b0-f1916970fb5b.jpg?v=1732122099'),
      },
      {
        name: 'Light and Life',
        price: '€1,350',
        amount: 1350,
        meta: 'ORIGINAL PAINTING',
        img: img('LightandLife.jpg?v=1732118222'),
      },
      {
        name: 'Fireside Reflection',
        price: '€1,350',
        amount: 1350,
        meta: 'ORIGINAL PAINTING',
        img: img('FirePlace.jpg?v=1732116551'),
      },
      {
        name: 'Come Dine with Me',
        price: '€900',
        amount: 900,
        meta: 'ORIGINAL PAINTING',
        img: img('ComeDineWithMe.jpg?v=1732115908'),
      },
      {
        name: 'The Good Room',
        price: 'Sold',
        amount: 0,
        sold: true,
        meta: 'ORIGINAL PAINTING',
        img: img('TheGoodRoom.jpg?v=1732119396'),
      },
    ]),
  },
  garden: {
    key: 'garden',
    label: 'Olive’s Garden',
    group: 'paintings',
    title: 'Olive’s',
    titleEm: 'Garden',
    desc: 'Paintings of flowers, nature and the garden that feeds Olive’s creative practice.',
    kicker: 'ORIGINAL PAINTING',
    productDesc: '',
    liveUrl: 'https://www.olivestack.com/collections/olives-garden',
    items: [],
  },
  figurative: {
    key: 'figurative',
    label: 'Figurative',
    group: 'paintings',
    title: 'Figurative',
    titleEm: 'work',
    desc: 'Figurative art and the female form, working from life.',
    kicker: 'ORIGINAL PAINTING',
    productDesc: '',
    liveUrl: 'https://www.olivestack.com/collections/figurative',
    items: [],
  },
  stilllife: {
    key: 'stilllife',
    label: 'Still Life',
    group: 'paintings',
    title: 'Still',
    titleEm: 'life',
    desc: 'Still life paintings by Olive Stack.',
    kicker: 'ORIGINAL PAINTING',
    productDesc: '',
    liveUrl: 'https://www.olivestack.com/collections/still-life',
    items: [],
  },
  prints: {
    key: 'prints',
    label: 'Prints',
    group: 'paintings',
    title: 'Limited edition',
    titleEm: 'prints',
    desc: 'Fine art limited edition prints made using the finest archival materials. Each print is hand signed and numbered by Olive and comes mounted, ready to frame.',
    kicker: 'LIMITED EDITION PRINT · SIGNED & NUMBERED',
    productDesc:
      'Fine art limited edition print made using the finest archival materials. Hand signed and numbered by Olive, mounted and ready to frame.',
    liveUrl: 'https://www.olivestack.com/collections/prints',
    items: works([
      {
        name: 'Deenish and Scariff',
        price: '€240',
        amount: 240,
        meta: 'LIMITED EDITION PRINT',
        img: img('rn-image_picker_lib_temp_ec90db78-791e-4353-ad4f-0e036e8f7a5d.jpg?v=1773332141'),
      },
      {
        name: 'Coumeenoole, West Kerry',
        price: '€290',
        amount: 290,
        meta: 'LIMITED EDITION PRINT',
        img: img('rn-image_picker_lib_temp_da40a6eb-8389-4cf6-919b-a94c978bc1f0.jpg?v=1777194140'),
      },
      {
        name: 'Peace and Pace of Clogher',
        price: 'From €300',
        amount: 300,
        meta: 'LIMITED EDITION PRINT',
        img: img('rn-image_picker_lib_temp_c5d121b2-3196-4aa2-a94d-2280c09ba2d1.jpg?v=1763114538'),
      },
      {
        name: 'Kerry Girls, Meet the Three Sisters',
        price: 'From €300',
        amount: 300,
        meta: 'LIMITED EDITION PRINT',
        img: img('rn-image_picker_lib_temp_d5fdb70d-d947-44de-aa7e-cd143bdd6cc7.jpg?v=1766253618'),
      },
      {
        name: 'Sea Thrift Along the Way',
        price: 'From €290',
        amount: 290,
        meta: 'LIMITED EDITION PRINT',
        img: img('FB-IMG_1732104159580.jpg?v=1732104622'),
      },
      {
        name: 'Beenconeen Beckons',
        price: 'From €300',
        amount: 300,
        meta: 'LIMITED EDITION PRINT',
        img: img('Beenconeen-Beckons.jpg?v=1732103660'),
      },
      {
        name: 'An Fear Marbh',
        price: 'From €240',
        amount: 240,
        meta: 'LIMITED EDITION PRINT',
        img: img('AnFearMarbh.jpg?v=1751962151'),
      },
      {
        name: 'Boats of Ross Castle',
        price: 'From €240',
        amount: 240,
        meta: 'LIMITED EDITION PRINT',
        img: img('rn-image_picker_lib_temp_18d8f4ad-d850-4dcc-8eae-5c2232d8fcc8.jpg?v=1752134890'),
      },
      {
        name: 'Hawthorn Harmony',
        price: '€190',
        amount: 190,
        meta: 'LIMITED EDITION PRINT',
        img: img('HawthornHarmony.jpg?v=1731334191'),
      },
      {
        name: 'Ballybunion Reflection',
        price: '€170',
        amount: 170,
        meta: 'LIMITED EDITION PRINT',
        img: img('StrollinBallybunion.jpg?v=1721146093'),
      },
      {
        name: 'Carrigafoyle Castle',
        price: '€200',
        amount: 200,
        meta: 'LIMITED EDITION PRINT',
        img: img('Carrigafolyle.jpg?v=1721143016'),
      },
      {
        name: 'Lislaughtin Abbey at Dusk',
        price: '€200',
        amount: 200,
        meta: 'LIMITED EDITION PRINT',
        img: img('lislaughtinabbeyatdusk.jpg?v=1731155337'),
      },
      {
        name: 'Mount Brandon from Kerry Head',
        price: '€200',
        amount: 200,
        meta: 'LIMITED EDITION PRINT',
        img: img('MountBrandonfromKerryHead.jpg?v=1721147588'),
      },
      {
        name: 'Big Bridge in Blue',
        price: '€255',
        amount: 255,
        meta: 'LIMITED EDITION PRINT',
        img: img('Listowel2.jpg?v=1721143637'),
      },
      {
        name: 'The Cow and Bull from Bunavalla',
        price: '€80',
        amount: 80,
        meta: 'PRINT',
        img: img('rn-image_picker_lib_temp_b41f329a-91d5-45d4-aced-27ffe65b7186.jpg?v=1773153969'),
      },
    ]),
  },
  pendants: {
    key: 'pendants',
    label: 'Pendants',
    group: 'jewellery',
    title: 'Micro mosaic',
    titleEm: 'pendants',
    desc: 'Hand crafted by painter and mosaic artist Olive Stack. Each pendant is a one-of-a-kind piece of wearable art, designed and created with Murano glass filati.',
    kicker: 'MICRO MOSAIC · ONE OF A KIND',
    productDesc:
      'One-of-a-kind micro mosaic, designed and hand-set by Olive with Murano glass filati. No two pieces are ever alike.',
    liveUrl: 'https://www.olivestack.com/collections/pendants',
    square: true,
    items: works([
      {
        name: 'Blue & Lime Green Pendant',
        price: '€115',
        amount: 115,
        meta: 'MICRO MOSAIC',
        img: img('rn-image_picker_lib_temp_caca2230-ceb1-4d34-93ee-1548d1658dc6.jpg?v=1762167313', 700),
      },
      {
        name: 'Oval Mosaic Pendant',
        price: '€145',
        amount: 145,
        meta: 'MICRO MOSAIC',
        img: img('rn-image_picker_lib_temp_e2db3dd6-ac01-417b-a64c-faea59898936.jpg?v=1761411508', 700),
      },
      {
        name: 'Mosaic Pendant',
        price: '€120',
        amount: 120,
        meta: 'MICRO MOSAIC',
        img: img('rn-image_picker_lib_temp_fc4c8142-88ba-4c34-b7d5-7b789eea6d6d.jpg?v=1748454432', 700),
      },
      {
        name: 'Large Mosaic Pendant',
        price: '€180',
        amount: 180,
        meta: 'MICRO MOSAIC',
        img: img('rn-image_picker_lib_temp_3f15ef5c-13cd-45d4-953b-cc4cf755a04e.jpg?v=1729416153', 700),
      },
      {
        name: 'Mosaic Pendant II',
        price: '€140',
        amount: 140,
        meta: 'MICRO MOSAIC',
        img: img('20250105-124107.jpg?v=1736082371', 700),
      },
      {
        name: 'Round Pendant',
        price: '€120',
        amount: 120,
        meta: 'MICRO MOSAIC',
        img: img('rn-image_picker_lib_temp_d63d5b52-e06d-4187-95f3-917364d116a3.jpg?v=1726685220', 700),
      },
      {
        name: 'Large Mandala Pendant',
        price: '€175',
        amount: 175,
        meta: 'MICRO MOSAIC',
        img: img('rn-image_picker_lib_temp_44e96366-8345-4257-8ea0-74393001f762.jpg?v=1729413901', 700),
      },
      {
        name: 'Heart Pendant',
        price: '€125',
        amount: 125,
        meta: 'MICRO MOSAIC',
        img: img('rn-image_picker_lib_temp_35d4e4d7-10c7-481a-bc2d-7167003d12b1.jpg?v=1755621431', 700),
      },
      {
        name: 'Large Mosaic Pendant II',
        price: '€165',
        amount: 165,
        meta: 'MICRO MOSAIC',
        img: img('rn-image_picker_lib_temp_5e8adc66-53ee-45ca-8f60-09066afc9719.jpg?v=1727797094', 700),
      },
    ]),
  },
  rings: {
    key: 'rings',
    label: 'Rings',
    group: 'jewellery',
    title: 'Mosaic',
    titleEm: 'rings',
    desc: 'One-of-a-kind micro mosaic rings, hand-set with Murano glass filati.',
    kicker: 'MICRO MOSAIC',
    productDesc: '',
    liveUrl: 'https://www.olivestack.com/collections/rings',
    items: [],
  },
  bracelets: {
    key: 'bracelets',
    label: 'Bracelets',
    group: 'jewellery',
    title: 'Mosaic',
    titleEm: 'bracelets',
    desc: 'One-of-a-kind micro mosaic bracelets, hand-set with Murano glass filati.',
    kicker: 'MICRO MOSAIC',
    productDesc: '',
    liveUrl: 'https://www.olivestack.com/collections/bracelets',
    items: [],
  },
  earrings: {
    key: 'earrings',
    label: 'Earrings & Brooches',
    group: 'jewellery',
    title: 'Earrings, cufflinks &',
    titleEm: 'brooches',
    desc: 'One-of-a-kind micro mosaic earrings, cufflinks and brooches.',
    kicker: 'MICRO MOSAIC',
    productDesc: '',
    liveUrl: 'https://www.olivestack.com/collections/earrings-cufflinks-brooches',
    items: [],
  },
  sets: {
    key: 'sets',
    label: 'Sets',
    group: 'jewellery',
    title: 'Jewellery',
    titleEm: 'sets',
    desc: 'Matching micro mosaic sets, hand-crafted by Olive.',
    kicker: 'MICRO MOSAIC',
    productDesc: '',
    liveUrl: 'https://www.olivestack.com/collections/sets',
    items: [],
  },
  mosaics: {
    key: 'mosaics',
    label: 'Mosaics',
    group: 'more',
    title: 'Stained glass',
    titleEm: 'mosaics',
    desc: 'Nature-inspired stained glass mosaics and stone art.',
    kicker: 'MOSAIC',
    productDesc: '',
    liveUrl: 'https://www.olivestack.com/collections/mosaics',
    items: [],
  },
  artforliving: {
    key: 'artforliving',
    label: 'Art for Living',
    group: 'more',
    title: 'Art for Living,',
    titleEm: 'Art for Giving',
    desc: 'Napkins, homeware and giftable art from the gallery.',
    kicker: 'ART FOR LIVING',
    productDesc: '',
    liveUrl: 'https://www.olivestack.com/collections/art-for-living-art-for-giving',
    items: [],
  },
};

export const GROUP_LABELS: Record<CollectionGroup, string> = {
  paintings: 'PAINTINGS & PRINTS',
  jewellery: 'MICRO MOSAIC JEWELLERY',
  more: 'SHOP',
};

export const collectionsInGroup = (group: CollectionGroup): Collection[] =>
  Object.values(COLLECTIONS).filter((c) => c.group === group);

export const findArtwork = (
  collectionKey: string,
  slug: string,
): { collection: Collection; item: Artwork } | null => {
  const collection = COLLECTIONS[collectionKey];
  if (!collection) return null;
  const item = collection.items.find((i) => i.slug === slug);
  return item ? { collection, item } : null;
};
