/*
 * MakerWood store settings
 * ------------------------
 * Edit the values below to match your business. You do not need to touch
 * any other file to change contact details, delivery fees or payment options.
 */
window.MW_CONFIG = {
  storeName: 'MakerWood',
  tagline: 'Cut · Carve · Create',
  motto: 'Ideas into reality',

  // Orders are sent to this WhatsApp number. International format, digits only,
  // no "+" or leading zeros. Example for a Lebanese mobile: '96171123456'.
  // Leave empty ('') to hide WhatsApp checkout and use email only.
  whatsappNumber: '',

  // Orders and custom requests can also be sent by email.
  email: 'hello@makerwood.example',

  // Shown on the contact section and footer. Leave '' to hide a line.
  phoneDisplay: '',
  instagram: 'https://www.instagram.com/',
  instagramHandle: '@makerwood',
  location: 'Lebanon',
  hours: 'Monday to Saturday, 9:00 to 18:00',

  // Money
  currency: 'USD',
  locale: 'en-US',

  // Delivery
  deliveryFee: 4,
  freeDeliveryFrom: 75, // order subtotal that unlocks free delivery; set to 0 to disable
  allowPickup: true,
  pickupLabel: 'Pick up from the workshop (free)',
  deliveryArea: 'Delivery all over Lebanon in 2 to 4 working days after your piece is ready.',

  paymentMethods: ['Cash on delivery', 'Bank or money transfer'],

  // Thin bar at the very top of every page. Set to '' to hide it.
  announcement: 'Christmas orders are open. Order personalized pieces by 10 December for delivery before the holidays.',

  // Seasonal highlight on the home page. Set to null to hide it.
  seasonal: {
    category: 'christmas',
    eyebrow: 'Now taking Christmas orders',
    title: 'Names on the tree this year',
    text: 'Personalized baubles, layered trees and a 24-drawer advent house, cut and engraved to order in our workshop.',
  },

  // 'query' gives links like shop.html?category=music (best for a normal website).
  // 'hash' gives shop.html#category=music (for previews that drop query strings).
  urlMode: 'query',
};
