/*
 * MakerWood catalog
 * -----------------
 * CATEGORIES: add a new occasion by copying one block and giving it a new `id`.
 * PRODUCTS:   add a product by copying one block. `category` must match a category id.
 *
 * Product fields
 *   id               unique, lowercase, used in the page address (product.html?id=...)
 *   price            base price in the store currency (see config.js)
 *   compareAt        optional old price, shown crossed out
 *   badge            optional label on the card: 'Bestseller', 'New', 'Limited'...
 *   images           first image is the main photo; put your own photos in assets/img/products/
 *   options          optional choices; `price` is added to the base price
 *   personalization  optional text field for engraving; set `required: true` if the piece needs it
 *   featured         true to show the product on the home page
 */
window.MW_CATEGORIES = [
  {
    id: 'steam-kits',
    name: 'STEAM Kits',
    short: 'Build it, then play with it',
    description:
      'Flat-packed build kits that make science, engineering and art hands-on. Every kit is laser-cut from birch plywood and comes with illustrated step-by-step instructions. Classroom packs are available for schools and clubs.',
    image: 'assets/img/products/robot-arm-kit.webp',
    note: 'Class packs available',
  },
  {
    id: 'games-puzzles',
    name: 'Games & Puzzles',
    short: 'Boards, puzzles and family games',
    description:
      'Engraved tawleh boards, name puzzles for little ones, tic-tac-toe and tangram sets. Made to be played with, and to be left out on the table when nobody is playing.',
    image: 'assets/img/products/tawleh-board.webp',
    note: 'Year-round',
  },
  {
    id: 'decoration',
    name: 'Decoration',
    short: 'Signs, wall art and lamps for the home',
    description:
      'Welcome signs with your family name, layered wall art, a Lebanese cedar and LED lamps that glow with a name. Pieces for the entrance, the living room and the bedroom.',
    image: 'assets/img/products/mandala-wall-art.webp',
    note: 'Year-round',
  },
  {
    id: 'christmas',
    name: 'Christmas',
    short: 'Ornaments, trees and advent calendars',
    description:
      'Personalized baubles with the names of everyone at the table, layered tabletop trees and an advent house with 24 drawers to fill. Cut and engraved to order.',
    image: 'assets/img/products/name-bauble.webp',
    note: 'Order by 10 December',
  },
  {
    id: 'christmas-gnomes',
    name: 'Christmas Gnomes',
    short: 'Standing gnomes with names, for shelves, tables and doors',
    description:
      'Laser-cut gnomes with painted hats and chunky beards, standing on a base engraved with a name. Choose one for each child, a whole family on one base, place-card gnomes for the Christmas table or a big one for the front door.',
    image: 'assets/img/products/gnome-family.webp',
    note: 'Order by 10 December',
  },
  {
    id: 'easter',
    name: 'Easter',
    short: 'Tags, egg holders and wreaths',
    description:
      'Name tags for egg-hunt baskets, bunny egg holders for the breakfast table and a door wreath to welcome the family for Easter lunch.',
    image: 'assets/img/products/bunny-egg-holder.webp',
    note: 'Seasonal',
  },
  {
    id: 'mothers-day',
    name: "Mother's Day",
    short: 'Keepsakes she will keep for years',
    description:
      'Engraved hearts, family-tree signs, flower boxes and kitchen boards. Write Mom, Mama, Maman or Teta, whatever she is called at home.',
    image: 'assets/img/products/flower-crate.webp',
    note: 'Seasonal',
  },
  {
    id: 'music',
    name: 'Music',
    short: 'For players, singers and listeners',
    description:
      'Wall art, headphone stands, pick boxes and key holders for the musicians in your life, from first guitar lessons to the studio.',
    image: 'assets/img/products/music-notes-art.webp',
    note: 'Year-round',
  },
  {
    id: 'valentine',
    name: "Valentine's",
    short: 'Names, dates and songs for two',
    description:
      'Your two names, the date you met or the song you danced to, engraved into pieces made for keeping.',
    image: 'assets/img/products/interlocking-hearts.webp',
    note: 'Order by 7 February',
  },
];

const mwImages = (id) => [`assets/img/products/${id}.webp`, `assets/img/products/${id}-detail.webp`];

window.MW_PRODUCTS = [
  /* ---------------- STEAM KITS ---------------- */
  {
    id: 'robot-arm-kit',
    name: 'Hydraulic Robot Arm Kit',
    category: 'steam-kits',
    price: 34,
    badge: 'Bestseller',
    featured: true,
    images: mwImages('robot-arm-kit'),
    summary: 'A working robot arm that lifts, turns and grips, powered by water-filled syringes.',
    description: [
      'Children build the arm piece by piece, then fill the syringes with water and discover how hydraulics move real machines. Four syringes control the base rotation, the two arm joints and the gripper.',
      'Everything slots together, so no glue is needed. The finished arm picks up small objects like bottle caps and sweets.',
    ],
    specs: {
      Material: '4 mm birch plywood',
      'Assembled size': '38 × 12 × 30 cm',
      'In the box': '62 wooden parts, 4 syringes, tubing, instructions',
      Age: '10+ (younger builders with an adult)',
      'Build time': '2 to 3 hours',
    },
    options: [
      {
        name: 'Pack',
        choices: [
          { label: 'Single kit', price: 0 },
          { label: 'Classroom pack (5 kits)', price: 116 },
        ],
      },
    ],
    personalization: { label: 'Name engraved on the base', placeholder: 'e.g. Karim', maxLength: 14 },
    leadTime: '2 to 3 working days',
  },
  {
    id: 'catapult-kit',
    name: 'Mini Catapult Kit',
    category: 'steam-kits',
    price: 18,
    featured: false,
    images: mwImages('catapult-kit'),
    summary: 'A rolling catapult that teaches levers, energy and angles, one soft ball at a time.',
    description: [
      'Build the frame, fit the wheels and tension the arm with rubber bands. Then change the angle and count how far each launch goes.',
      'A good first engineering kit and a favourite for birthday party activities.',
    ],
    specs: {
      Material: '4 mm birch plywood',
      'Assembled size': '22 × 8 × 14 cm',
      'In the box': '24 wooden parts, rubber bands, 3 soft balls, instructions',
      Age: '8+',
      'Build time': 'About 45 minutes',
    },
    options: [
      {
        name: 'Pack',
        choices: [
          { label: 'Single kit', price: 0 },
          { label: 'Classroom pack (5 kits)', price: 62 },
        ],
      },
    ],
    personalization: { label: 'Name engraved on the frame', placeholder: 'e.g. Lea', maxLength: 12 },
    leadTime: '2 to 3 working days',
  },
  {
    id: 'marble-run-kit',
    name: 'Marble Run Tower',
    category: 'steam-kits',
    price: 29,
    badge: 'New',
    featured: false,
    images: mwImages('marble-run-kit'),
    summary: 'A zig-zag marble run to build, test and rebuild. Four ramps, four glass marbles.',
    description: [
      'Slot the ramps into the tower, drop a marble at the top and watch it race to the bottom. Move the ramps to change the speed and the path.',
      'Add the extension set for eight ramps and a longer, faster run.',
    ],
    specs: {
      Material: '4 mm birch plywood with oak-stained ramps',
      'Assembled size': '26 × 12 × 45 cm',
      'In the box': 'Tower, stand, 4 ramps, 4 glass marbles',
      Age: '6+ (contains small marbles)',
      'Build time': 'About 30 minutes',
    },
    options: [
      {
        name: 'Ramps',
        choices: [
          { label: '4 ramps', price: 0 },
          { label: '8 ramps (with extension)', price: 9 },
        ],
      },
    ],
    personalization: { label: 'Name engraved at the top', placeholder: 'e.g. Adam', maxLength: 12 },
    leadTime: '2 to 3 working days',
  },
  {
    id: 'racing-car-kit',
    name: 'Rubber-Band Racer Kit',
    category: 'steam-kits',
    price: 16,
    featured: false,
    images: mwImages('racing-car-kit'),
    summary: 'Wind the rear axle, let go and watch it race across the room.',
    description: [
      'A simple car powered by a twisted rubber band. Builders learn about stored energy and friction, then compete to see whose car goes furthest.',
      'Take the twin pack for two cars and a proper race.',
    ],
    specs: {
      Material: '4 mm birch plywood, wooden axles',
      'Assembled size': '24 × 8 × 10 cm',
      'In the box': '18 wooden parts, 2 rubber bands, instructions',
      Age: '7+',
      'Build time': 'About 40 minutes',
    },
    options: [
      {
        name: 'Pack',
        choices: [
          { label: 'One car', price: 0 },
          { label: 'Twin pack (2 cars)', price: 12 },
        ],
      },
    ],
    personalization: { label: 'Racing number or name', placeholder: 'e.g. 07', maxLength: 8 },
    leadTime: '2 to 3 working days',
  },

  /* ---------------- GAMES & PUZZLES ---------------- */
  {
    id: 'tawleh-board',
    name: 'Engraved Tawleh Board',
    category: 'games-puzzles',
    price: 69,
    badge: 'New',
    featured: true,
    images: mwImages('tawleh-board'),
    summary: 'A full backgammon set with a family name engraved on the frame.',
    description: [
      'CNC-cut frame, laser-engraved points and a hinged case that closes for storage. The name or message goes on the frame, so everyone knows whose board it is.',
      'Comes with 30 wooden checkers and two dice, ready for the first game.',
    ],
    specs: {
      Material: 'Walnut-stained frame, birch playing fields',
      'Open size': '50 × 38 cm',
      'In the box': 'Board, 30 checkers, 2 dice',
      Finish: 'Hinged, closes into a case',
    },
    options: [
      {
        name: 'Wood',
        choices: [
          { label: 'Walnut-stained', price: 0 },
          { label: 'Natural oak', price: 10 },
        ],
      },
    ],
    personalization: { label: 'Name or message on the frame', placeholder: 'e.g. The Khoury Family', maxLength: 26 },
    leadTime: '5 to 7 working days',
  },
  {
    id: 'name-puzzle',
    name: 'Name Puzzle Board',
    category: 'games-puzzles',
    price: 22,
    featured: false,
    images: mwImages('name-puzzle'),
    summary: "A child's name cut as chunky puzzle letters that lift out and slot back in.",
    description: [
      'Each letter is cut from thick wood, painted and fitted into its own place on the board. It helps little ones learn the letters of their name, then hangs on the bedroom wall.',
    ],
    specs: {
      Material: 'Birch board, 9 mm letters, child-safe paint',
      Size: 'About 12 cm tall, width depends on the name',
      Age: '2+ (pieces too large to swallow)',
    },
    options: [
      {
        name: 'Colours',
        choices: [
          { label: 'Rainbow', price: 0 },
          { label: 'Pastel', price: 0 },
          { label: 'Natural wood', price: 0 },
        ],
      },
    ],
    personalization: { label: "Child's name (up to 8 letters)", placeholder: 'e.g. Adam', maxLength: 8, required: true },
    leadTime: '3 to 5 working days',
  },
  {
    id: 'tic-tac-toe',
    name: 'Tic-Tac-Toe Set',
    category: 'games-puzzles',
    price: 15,
    featured: false,
    images: mwImages('tic-tac-toe'),
    summary: 'An engraved board with five X and five O pieces in two woods.',
    description: [
      'A quick game for cafés, car trips and waiting rooms. Add two names along the bottom for a set that belongs to a pair of rivals.',
    ],
    specs: {
      Material: 'Oak-stained board, birch and walnut pieces',
      Size: '20 × 22 cm board, 5 cm pieces',
      'In the box': 'Board and 10 pieces',
    },
    options: [],
    personalization: { label: 'Names along the bottom (optional)', placeholder: 'e.g. Lea vs Adam', maxLength: 20 },
    leadTime: '2 to 3 working days',
  },
  {
    id: 'tangram-set',
    name: 'Tangram Puzzle Set',
    category: 'games-puzzles',
    price: 14,
    featured: false,
    images: mwImages('tangram-set'),
    summary: 'The classic seven-piece puzzle in a wooden tray, with 30 challenge cards.',
    description: [
      'Make a cat, a house or a running man from the same seven shapes. Good for shape and spatial thinking, and for keeping adults busy too.',
    ],
    specs: {
      Material: 'Mixed wood tones, walnut-stained tray',
      Size: '20 × 20 cm tray',
      'In the box': '7 pieces, tray, 30 challenge cards',
      Age: '5+',
    },
    options: [],
    personalization: { label: 'Name on the tray (optional)', placeholder: 'e.g. Maya', maxLength: 12 },
    leadTime: '2 to 3 working days',
  },

  /* ---------------- DECORATION ---------------- */
  {
    id: 'welcome-sign',
    name: 'Family Welcome Sign',
    category: 'decoration',
    price: 32,
    featured: false,
    images: mwImages('welcome-sign'),
    summary: 'A round door sign with your family name, the year and an olive branch.',
    description: [
      'Hang it on the front door or in the entrance. Engraved on birch and finished with a jute rope, ready to hang.',
    ],
    specs: {
      Material: '6 mm birch plywood, jute rope',
      Size: '35 cm diameter (45 cm option)',
      Finish: 'Clear protective coat for indoor or covered doors',
    },
    options: [
      {
        name: 'Size',
        choices: [
          { label: '35 cm', price: 0 },
          { label: '45 cm', price: 10 },
        ],
      },
    ],
    personalization: { label: 'Family name and year', placeholder: 'e.g. The Khoury Family, 2019', maxLength: 30, required: true },
    leadTime: '3 to 5 working days',
  },
  {
    id: 'mandala-wall-art',
    name: 'Layered Mandala Wall Art',
    category: 'decoration',
    price: 45,
    featured: false,
    images: mwImages('mandala-wall-art'),
    summary: 'Three cut layers in walnut, oak and birch tones that cast soft shadows on the wall.',
    description: [
      'Each layer is cut separately and stacked with small spacers, so the pattern gains depth as the light moves through the day.',
    ],
    specs: {
      Material: 'Walnut, oak and birch-toned plywood',
      Size: '40 cm diameter (60 cm option)',
      Finish: 'Keyhole hanger on the back',
    },
    options: [
      {
        name: 'Size',
        choices: [
          { label: '40 cm', price: 0 },
          { label: '60 cm', price: 25 },
        ],
      },
    ],
    personalization: null,
    leadTime: '4 to 6 working days',
  },
  {
    id: 'cedar-wall-art',
    name: 'Lebanese Cedar Wall Art',
    category: 'decoration',
    price: 38,
    featured: true,
    images: mwImages('cedar-wall-art'),
    summary: 'A layered cedar raised on a birch board, with a line of your choice underneath.',
    description: [
      'The cedar is cut in walnut tone and layered onto the board so it stands out in relief. A gift for a new home, or for family abroad.',
    ],
    specs: {
      Material: 'Birch board, walnut-stained cedar',
      Size: '30 × 35 cm',
      Finish: 'Jute hanging cord',
    },
    options: [
      {
        name: 'Cedar',
        choices: [
          { label: 'Walnut tone', price: 0 },
          { label: 'Painted green', price: 5 },
        ],
      },
    ],
    personalization: { label: 'Line under the cedar', placeholder: 'e.g. Lebanon, or your family name', maxLength: 24 },
    leadTime: '3 to 5 working days',
  },
  {
    id: 'led-name-lamp',
    name: 'Personalized LED Name Lamp',
    category: 'decoration',
    price: 30,
    badge: 'New',
    featured: true,
    images: mwImages('led-name-lamp'),
    summary: 'An engraved acrylic panel that glows with a name, the moon and stars.',
    description: [
      'The design is engraved into clear acrylic and lit from the wooden base, so it glows softly in the dark. A night light for a child\'s room, or a gift for anyone.',
      'Powered by USB; a wall plug is not included.',
    ],
    specs: {
      Material: 'Clear acrylic panel, walnut-stained base',
      Size: '18 × 24 cm',
      Power: 'USB cable included',
    },
    options: [
      {
        name: 'Light',
        choices: [
          { label: 'Warm white', price: 0 },
          { label: 'Multicolour with remote', price: 6 },
        ],
      },
    ],
    personalization: { label: 'Name to engrave', placeholder: 'e.g. Maya', maxLength: 12, required: true },
    leadTime: '3 to 5 working days',
  },

  /* ---------------- CHRISTMAS ---------------- */
  {
    id: 'name-bauble',
    name: 'Personalized Name Bauble',
    category: 'christmas',
    price: 9,
    badge: 'Bestseller',
    featured: true,
    images: mwImages('name-bauble'),
    summary: 'A round ornament engraved with a name and the year, hung on red satin ribbon.',
    description: [
      'One for every person at the table, or one for each new baby, new home or first Christmas together. The name is engraved in a flowing script with the year underneath.',
      'Order several: each bauble in your cart can carry a different name.',
    ],
    specs: {
      Material: '3 mm birch plywood',
      Size: '9 cm diameter',
      Finish: 'Natural wood, red satin ribbon',
      Engraving: 'Name in script, year and "Merry Christmas"',
    },
    options: [
      {
        name: 'Wood',
        choices: [
          { label: 'Birch', price: 0 },
          { label: 'Walnut', price: 3 },
        ],
      },
    ],
    personalization: { label: 'Name to engrave', placeholder: 'e.g. Emma', maxLength: 12, required: true },
    leadTime: '2 to 4 working days',
  },
  {
    id: 'tabletop-tree',
    name: 'Layered Tabletop Tree',
    category: 'christmas',
    price: 24,
    featured: false,
    images: mwImages('tabletop-tree'),
    summary: 'Three stacked tiers, a gold star and hand-painted baubles on a walnut stand.',
    description: [
      'A small tree for a shelf, desk or entrance table. The three tiers are cut separately and layered for depth, with engraved garlands and painted baubles.',
      'Add a family name to the front of the stand for a keepsake that comes out every December.',
    ],
    specs: {
      Material: 'Birch and oak-stained plywood, walnut-stained stand',
      Size: '30 cm tall (45 cm option)',
      Finish: 'Hand-painted star and baubles',
    },
    options: [
      {
        name: 'Height',
        choices: [
          { label: '30 cm', price: 0 },
          { label: '45 cm', price: 12 },
        ],
      },
    ],
    personalization: { label: 'Family name on the stand (optional)', placeholder: 'e.g. The Khoury Family', maxLength: 22 },
    leadTime: '3 to 5 working days',
  },
  {
    id: 'advent-house',
    name: 'Advent Calendar House',
    category: 'christmas',
    price: 55,
    badge: 'Limited',
    featured: true,
    images: mwImages('advent-house'),
    summary: 'A house with 24 numbered drawers to fill with sweets, notes or tiny gifts.',
    description: [
      'Each drawer is numbered and slides out on its own, big enough for chocolates, a small toy or a folded note. Fill it again every year.',
      'Made in small batches before the season, so quantities are limited.',
    ],
    specs: {
      Material: '4 mm birch plywood, walnut-stained roof',
      Size: '42 × 12 × 50 cm',
      Drawers: '24, each 7 × 8 × 3 cm inside',
      Assembly: 'Delivered fully assembled',
    },
    options: [
      {
        name: 'Drawers',
        choices: [
          { label: 'Natural wood', price: 0 },
          { label: 'Painted red and green', price: 8 },
        ],
      },
    ],
    personalization: { label: 'Family name on the roof (optional)', placeholder: 'e.g. Haddad', maxLength: 16 },
    leadTime: '5 to 7 working days',
  },
  {
    id: 'snowflake-set',
    name: 'Snowflake Ornaments, Set of 6',
    category: 'christmas',
    price: 15,
    featured: false,
    images: mwImages('snowflake-set'),
    summary: 'Six laser-cut snowflakes in three woods, ready to hang.',
    description: [
      'Two of each design in birch, oak and walnut tones, from 8 to 12 cm across. They look good on the tree, in a window or tied onto wrapped gifts.',
    ],
    specs: {
      Material: '3 mm plywood, three wood tones',
      Size: '8 to 12 cm',
      'In the set': '6 snowflakes with red and white ribbons',
    },
    options: [
      {
        name: 'Set',
        choices: [
          { label: '6 snowflakes', price: 0 },
          { label: '12 snowflakes', price: 12 },
        ],
      },
    ],
    personalization: null,
    leadTime: '2 to 3 working days',
  },

  /* ---------------- CHRISTMAS GNOMES ---------------- */
  {
    id: 'name-gnome',
    name: 'Standing Name Gnome',
    category: 'christmas-gnomes',
    price: 14,
    badge: 'New',
    featured: true,
    images: mwImages('name-gnome'),
    summary: 'A standing gnome with a painted hat and beard, on a base engraved with a name.',
    description: [
      'Layered pieces give the hat, beard and nose real depth. The name is engraved on the walnut base, so every child in the family can have their own.',
      'Order several: each gnome in your cart can carry a different name.',
    ],
    specs: {
      Material: '4 mm plywood, hand-painted hat, beard and body',
      Size: '20 cm tall',
      Finish: 'Stands on its own, no assembly',
    },
    options: [
      {
        name: 'Hat colour',
        choices: [
          { label: 'Red', price: 0 },
          { label: 'Green', price: 0 },
          { label: 'Cream', price: 0 },
        ],
      },
      {
        name: 'Size',
        choices: [
          { label: '20 cm', price: 0 },
          { label: '30 cm', price: 6 },
        ],
      },
    ],
    personalization: { label: 'Name on the base', placeholder: 'e.g. Lea', maxLength: 12, required: true },
    leadTime: '3 to 5 working days',
  },
  {
    id: 'gnome-family',
    name: 'Gnome Family on One Base',
    category: 'christmas-gnomes',
    price: 32,
    featured: false,
    images: mwImages('gnome-family'),
    summary: 'Three gnomes of different heights standing together, with your family name.',
    description: [
      'A red, a green and a cream gnome side by side on a long walnut base. Ask for more gnomes if your family is bigger and we will make the base to fit.',
    ],
    specs: {
      Material: '4 mm plywood, hand-painted, walnut-stained base',
      Size: '38 cm wide, 20 cm tall',
      'In the set': '3 gnomes fixed on one base',
    },
    options: [
      {
        name: 'Gnomes',
        choices: [
          { label: '3 gnomes', price: 0 },
          { label: '4 gnomes', price: 8 },
          { label: '5 gnomes', price: 16 },
        ],
      },
    ],
    personalization: { label: 'Family name on the base', placeholder: 'e.g. The Haddad Family', maxLength: 24, required: true },
    leadTime: '4 to 6 working days',
  },
  {
    id: 'gnome-ornament',
    name: 'Gnome Tree Ornament',
    category: 'christmas-gnomes',
    price: 8,
    featured: false,
    images: mwImages('gnome-ornament'),
    summary: 'A flat hanging gnome with a gold star, a name and the year on the hat.',
    description: [
      'Hangs from the tip of the hat on red ribbon. The name and year are engraved through the red paint, so they show in light wood.',
    ],
    specs: {
      Material: '3 mm plywood, hand-painted',
      Size: '12 cm tall',
      Finish: 'Red satin ribbon',
    },
    options: [],
    personalization: { label: 'Name and year', placeholder: 'e.g. Adam 2026', maxLength: 14, required: true },
    leadTime: '2 to 4 working days',
  },
  {
    id: 'gnome-tree-scene',
    name: 'Gnome and Tree Scene',
    category: 'christmas-gnomes',
    price: 24,
    featured: false,
    images: mwImages('gnome-tree-scene'),
    summary: 'A gnome next to a decorated tree on a Merry Christmas base.',
    description: [
      'A small scene for a shelf, a desk or the entrance table. Change the line on the base to a family name if you prefer.',
    ],
    specs: {
      Material: '4 mm plywood, hand-painted, walnut-stained base',
      Size: '30 cm wide, 25 cm tall',
    },
    options: [],
    personalization: { label: 'Line on the base (optional)', placeholder: 'e.g. Merry Christmas', maxLength: 22 },
    leadTime: '3 to 5 working days',
  },
  {
    id: 'gnome-place-card',
    name: 'Gnome Place Card Holder',
    category: 'christmas-gnomes',
    price: 5,
    featured: false,
    images: mwImages('gnome-place-card'),
    summary: 'A little gnome with a slot for a name card, one for every seat at the Christmas table.',
    description: [
      'Guests take them home afterwards. Tell us the names and we print the cards, or leave them blank and write them yourself.',
    ],
    specs: {
      Material: '4 mm plywood, hand-painted, walnut-stained base',
      Size: '11 cm tall',
      'In the box': 'Gnome holder and a name card',
    },
    options: [
      {
        name: 'Cards',
        choices: [
          { label: 'Printed with names', price: 0 },
          { label: 'Blank cards', price: 0 },
        ],
      },
    ],
    personalization: { label: 'Guest name for this card (optional)', placeholder: 'e.g. Karim', maxLength: 14 },
    leadTime: '3 to 5 working days',
  },
  {
    id: 'porch-gnome',
    name: 'Giant Welcome Gnome',
    category: 'christmas-gnomes',
    price: 48,
    badge: 'Limited',
    featured: false,
    images: mwImages('porch-gnome'),
    summary: 'A 60 cm gnome holding a Welcome sign with your family name, for the front door.',
    description: [
      'Cut from thicker plywood so it stands firmly by the door or at the bottom of the stairs. Sealed for covered outdoor spaces.',
    ],
    specs: {
      Material: '9 mm plywood, hand-painted, sealed',
      Size: '60 cm tall',
      Finish: 'Stands on its own',
    },
    options: [],
    personalization: { label: 'Family name on the sign', placeholder: 'e.g. The Khoury Family', maxLength: 22, required: true },
    leadTime: '5 to 7 working days',
  },

  /* ---------------- EASTER ---------------- */
  {
    id: 'egg-name-tag',
    name: 'Personalized Egg Name Tag',
    category: 'easter',
    price: 6,
    featured: false,
    images: mwImages('egg-name-tag'),
    summary: 'An egg-shaped tag for baskets, place settings and gift bags.',
    description: [
      'Tie one onto every Easter basket so nobody argues about whose eggs are whose, or use them as place cards for Easter lunch.',
      'Each tag in your cart can carry a different name.',
    ],
    specs: {
      Material: '3 mm birch or oak-stained plywood',
      Size: '10 cm tall',
      Finish: 'Pastel ribbon of your choice',
    },
    options: [
      {
        name: 'Ribbon',
        choices: [
          { label: 'Pink', price: 0 },
          { label: 'Mint', price: 0 },
          { label: 'Lilac', price: 0 },
        ],
      },
    ],
    personalization: { label: 'Name to engrave', placeholder: 'e.g. Lea', maxLength: 10, required: true },
    leadTime: '2 to 3 working days',
  },
  {
    id: 'bunny-egg-holder',
    name: 'Bunny Egg Holder',
    category: 'easter',
    price: 12,
    badge: 'Bestseller',
    featured: false,
    images: mwImages('bunny-egg-holder'),
    summary: 'A standing bunny that holds one egg, real, chocolate or wooden.',
    description: [
      'Set one at every place on Easter morning. The name is engraved on the front of the cup.',
      'Choose the painted wooden egg option for a decoration that lasts beyond the holiday.',
    ],
    specs: {
      Material: '4 mm birch plywood',
      Size: '12 × 20 cm',
      Fits: 'Hen eggs and chocolate eggs up to 6 cm',
    },
    options: [
      {
        name: 'Egg',
        choices: [
          { label: 'Holder only', price: 0 },
          { label: 'With painted wooden egg', price: 3 },
        ],
      },
    ],
    personalization: { label: 'Name on the cup', placeholder: 'e.g. Lea', maxLength: 10 },
    leadTime: '2 to 3 working days',
  },
  {
    id: 'happy-easter-wreath',
    name: 'Happy Easter Door Wreath',
    category: 'easter',
    price: 28,
    featured: false,
    images: mwImages('happy-easter-wreath'),
    summary: 'An engraved leaf wreath with a family name plaque and painted spring flowers.',
    description: [
      'Hang it on the front door to welcome the family. The ring is engraved with leaves and finished with hand-painted flowers and a lilac bow.',
    ],
    specs: {
      Material: 'Oak-stained plywood ring, birch plaque',
      Size: '35 cm diameter',
      Finish: 'Hand-painted flowers, satin ribbon hanger',
    },
    options: [],
    personalization: { label: 'Family name on the plaque', placeholder: 'e.g. The Khoury Family', maxLength: 22 },
    leadTime: '3 to 5 working days',
  },
  {
    id: 'hanging-eggs',
    name: 'Hanging Egg Ornaments, Set of 8',
    category: 'easter',
    price: 14,
    badge: 'New',
    featured: false,
    images: mwImages('hanging-eggs'),
    summary: 'Eight engraved eggs in three patterns for an Easter tree or window.',
    description: [
      'Zig-zags, flowers and hearts, each egg threaded with a pastel string. Hang them from a branch in a vase for an easy Easter centrepiece.',
    ],
    specs: {
      Material: '3 mm birch and oak-stained plywood',
      Size: '6 to 9 cm',
      'In the set': '8 eggs, pastel strings (branch not included)',
    },
    options: [],
    personalization: null,
    leadTime: '2 to 3 working days',
  },

  /* ---------------- MOTHER'S DAY ---------------- */
  {
    id: 'mom-heart-plaque',
    name: 'Engraved Mom Heart',
    category: 'mothers-day',
    price: 20,
    featured: false,
    images: mwImages('mom-heart-plaque'),
    summary: 'A hanging heart engraved with the name she answers to at home.',
    description: [
      'Mom, Mama, Maman, Teta or her first name, engraved large in script with a short line underneath and a small vine.',
      'Arrives with a ribbon hanger, ready to give.',
    ],
    specs: {
      Material: '4 mm birch plywood',
      Size: '24 cm wide (32 cm option)',
      Finish: 'Natural wood, pink ribbon',
    },
    options: [
      {
        name: 'Size',
        choices: [
          { label: '24 cm', price: 0 },
          { label: '32 cm', price: 8 },
        ],
      },
    ],
    personalization: { label: 'Name to engrave', placeholder: 'Mom, Mama, Maman, Teta…', maxLength: 10, required: true },
    leadTime: '2 to 4 working days',
  },
  {
    id: 'family-tree-plaque',
    name: 'Personalized Family Tree Sign',
    category: 'mothers-day',
    price: 38,
    badge: 'Bestseller',
    featured: true,
    images: mwImages('family-tree-plaque'),
    summary: 'A raised walnut tree of hearts over your family name and the year it all began.',
    description: [
      'The tree is cut separately and layered onto the birch board, so it stands out in relief. The family name and year are engraved underneath.',
      'Add names to the hearts and we will engrave up to eight of them among the branches.',
    ],
    specs: {
      Material: 'Birch plywood board, walnut-stained tree',
      Size: '30 × 36 cm',
      Finish: 'Jute hanging cord',
    },
    options: [
      {
        name: 'Names on the hearts',
        choices: [
          { label: 'No names', price: 0 },
          { label: 'Up to 8 names', price: 10 },
        ],
      },
    ],
    personalization: { label: 'Family name and year', placeholder: 'e.g. The Haddad Family, 2012', maxLength: 32, required: true },
    leadTime: '3 to 5 working days',
  },
  {
    id: 'flower-crate',
    name: 'Engraved Flower Box',
    category: 'mothers-day',
    price: 32,
    featured: false,
    images: mwImages('flower-crate'),
    summary: 'A wooden box engraved on the front, with an optional handmade paper bouquet.',
    description: [
      'Use it for fresh flowers in a jar, a plant, or the paper bouquet we make to go with it. After the day itself it becomes a box for letters, keys or make-up.',
    ],
    specs: {
      Material: 'Oak-stained plywood',
      Size: '25 × 12 × 14 cm',
      Bouquet: 'Handmade paper flowers (optional)',
    },
    options: [
      {
        name: 'Flowers',
        choices: [
          { label: 'Box only', price: 0 },
          { label: 'With paper bouquet', price: 15 },
        ],
      },
    ],
    personalization: { label: 'Name on the front', placeholder: 'e.g. Mama', maxLength: 12, required: true },
    leadTime: '3 to 5 working days',
  },
  {
    id: 'recipe-board',
    name: 'Personalized Kitchen Board',
    category: 'mothers-day',
    price: 35,
    featured: false,
    images: mwImages('recipe-board'),
    summary: 'A solid hardwood serving board, engraved for the best cook in the family.',
    description: [
      'CNC-cut from a single piece of solid hardwood and finished with food-safe oil. The engraved side is for display and serving; use the back for cutting.',
    ],
    specs: {
      Material: 'Solid beech, food-safe oil finish',
      Size: '40 × 25 × 2 cm (50 × 30 cm option)',
      Care: 'Hand wash, dry upright, re-oil now and then',
    },
    options: [
      {
        name: 'Size',
        choices: [
          { label: '40 × 25 cm', price: 0 },
          { label: '50 × 30 cm', price: 10 },
        ],
      },
    ],
    personalization: { label: 'Top line', placeholder: "e.g. Mama's", maxLength: 16, required: true },
    leadTime: '4 to 6 working days',
  },

  /* ---------------- MUSIC ---------------- */
  {
    id: 'guitar-key-holder',
    name: 'Guitar Key Holder',
    category: 'music',
    price: 22,
    featured: false,
    images: mwImages('guitar-key-holder'),
    summary: 'A wall-mounted guitar with brass hooks, so the keys always land in the same place.',
    description: [
      'Engraved strings, frets and sound hole on an oak-stained guitar, with three hooks along the body. Screws and wall plugs are included.',
    ],
    specs: {
      Material: '6 mm oak-stained plywood, brass hooks',
      Size: '35 cm tall',
      'In the box': 'Key holder, screws and wall plugs',
    },
    options: [
      {
        name: 'Hooks',
        choices: [
          { label: '3 hooks', price: 0 },
          { label: '5 hooks', price: 4 },
        ],
      },
    ],
    personalization: { label: 'Text on the body (optional)', placeholder: 'e.g. Home', maxLength: 14 },
    leadTime: '3 to 4 working days',
  },
  {
    id: 'music-notes-art',
    name: 'Layered Music Notes Wall Art',
    category: 'music',
    price: 26,
    featured: false,
    images: mwImages('music-notes-art'),
    summary: 'Raised birch notes on a walnut-stained board with inlaid staff lines.',
    description: [
      'The notes are cut separately and layered onto the board so they cast a small shadow on the wall. Choose the engraved line along the bottom.',
    ],
    specs: {
      Material: 'Walnut-stained board, birch notes',
      Size: '40 × 30 cm (60 × 45 cm option)',
      Finish: 'Keyhole hangers on the back',
    },
    options: [
      {
        name: 'Size',
        choices: [
          { label: '40 × 30 cm', price: 0 },
          { label: '60 × 45 cm', price: 18 },
        ],
      },
    ],
    personalization: { label: 'Engraved line (optional)', placeholder: 'e.g. Play it loud', maxLength: 20 },
    leadTime: '3 to 5 working days',
  },
  {
    id: 'headphone-stand',
    name: 'Personalized Headphone Stand',
    category: 'music',
    price: 28,
    badge: 'New',
    featured: false,
    images: mwImages('headphone-stand'),
    summary: 'A solid oak stand with a name engraved down the upright.',
    description: [
      'Keeps headphones off the desk and the band in shape. Felt pads under the base protect the desk and stop it sliding.',
    ],
    specs: {
      Material: 'Solid oak upright, walnut-stained base',
      Size: '27 cm tall, 14 cm rest',
      Fits: 'Over-ear and on-ear headphones',
    },
    options: [],
    personalization: { label: 'Name down the upright', placeholder: 'e.g. Karim', maxLength: 10 },
    leadTime: '3 to 5 working days',
  },
  {
    id: 'pick-box',
    name: 'Guitar Pick Box',
    category: 'music',
    price: 18,
    featured: false,
    images: mwImages('pick-box'),
    summary: 'A sliding-lid box engraved with a name and initial, with four picks inside.',
    description: [
      'Small enough for a gig bag, big enough for a good collection of picks. The lid slides out and back in with a snug fit.',
    ],
    specs: {
      Material: 'Walnut-stained base, birch lid',
      Size: '10 × 8 × 3 cm',
      'In the box': '4 picks in mixed colours',
    },
    options: [],
    personalization: { label: 'Name on the lid', placeholder: 'e.g. Karim', maxLength: 12, required: true },
    leadTime: '2 to 3 working days',
  },

  /* ---------------- VALENTINE'S ---------------- */
  {
    id: 'interlocking-hearts',
    name: 'Two Hearts Name Sign',
    category: 'valentine',
    price: 25,
    badge: 'Bestseller',
    featured: false,
    images: mwImages('interlocking-hearts'),
    summary: 'Two overlapping hearts, one name on each, standing on a walnut base.',
    description: [
      'The hearts are cut in two wood tones and layered, then slotted into an engraved base. Add the year you met under the second name.',
    ],
    specs: {
      Material: 'Oak-stained and birch hearts, walnut-stained base',
      Size: '28 cm wide, 22 cm tall',
    },
    options: [],
    personalization: { label: 'Your two names and a year', placeholder: 'e.g. Sarah & Karim, 2024', maxLength: 28, required: true },
    leadTime: '2 to 4 working days',
  },
  {
    id: 'heart-keychains',
    name: 'Matching Heart Keychains',
    category: 'valentine',
    price: 12,
    featured: false,
    images: mwImages('heart-keychains'),
    summary: 'One heart cut in two, an initial on each half. One for you, one for them.',
    description: [
      'The zig-zag edge only fits its other half. Each keychain comes with a steel ring and can carry an initial and a short date.',
    ],
    specs: {
      Material: '4 mm oak-stained and birch plywood, steel rings',
      Size: '6 cm per half',
      'In the set': '2 keychains',
    },
    options: [],
    personalization: { label: 'Initials and date', placeholder: 'e.g. S · K · 14.02', maxLength: 16, required: true },
    leadTime: '2 to 3 working days',
  },
  {
    id: 'song-plaque',
    name: 'Our Song Plaque',
    category: 'valentine',
    price: 30,
    featured: false,
    images: mwImages('song-plaque'),
    summary: 'Your song as a record, a title and a play bar, engraved on a standing plaque.',
    description: [
      'Tell us the song title, your names and the time in the song that matters most, and we will set the play bar to it.',
    ],
    specs: {
      Material: 'Birch plaque, walnut-stained stand',
      Size: '15 × 24 cm',
    },
    options: [],
    personalization: { label: 'Song title and your names', placeholder: 'e.g. Our First Dance, Sarah & Karim', maxLength: 48, required: true },
    leadTime: '2 to 4 working days',
  },
  {
    id: 'heart-keepsake-box',
    name: 'Heart Keepsake Box',
    category: 'valentine',
    price: 35,
    featured: false,
    images: mwImages('heart-keepsake-box'),
    summary: 'A heart-shaped box with an engraved lid for letters, tickets and small treasures.',
    description: [
      'Built up from stacked layers so the walls are solid, with a lift-off engraved lid. Add a red velvet lining for jewellery.',
    ],
    specs: {
      Material: 'Oak-stained plywood',
      Size: '18 × 16 × 7 cm',
    },
    options: [
      {
        name: 'Lining',
        choices: [
          { label: 'No lining', price: 0 },
          { label: 'Red velvet lining', price: 6 },
        ],
      },
    ],
    personalization: { label: 'Text on the lid', placeholder: 'e.g. Forever', maxLength: 14 },
    leadTime: '4 to 6 working days',
  },
];
