# MakerWood website

The online shop for **MakerWood**, a laser-cutting and CNC workshop: *Cut · Carve · Create*.

It is a fast static website (plain HTML, CSS and JavaScript, no build step), so it can be hosted for free on GitHub Pages, Netlify or Cloudflare Pages.

## What's included

| Page | File | What it does |
| --- | --- | --- |
| Home | `index.html` | Hero with the logo, services, shop-by-category tiles, bestsellers, seasonal highlight, how it works, custom orders |
| Shop | `shop.html` | All products with category filter, search, sort and a "can be personalized" filter. `shop.html?category=christmas` opens one category |
| Product | `product.html?id=…` | Photos, options (size, wood…), engraving text with live preview, quantity, add to cart, order on WhatsApp |
| Cart & checkout | `cart.html` | Edit quantities, delivery or pick-up, payment method, then send the order on WhatsApp or by email |
| Custom orders | `custom.html` | Request form for signs, logos, events, corporate and school orders |
| About | `about.html` | Story, machines and materials, FAQ (`#faq`) and contact (`#contact`) |

Categories: **STEAM Kits, Games & Puzzles, Decoration, Christmas, Easter, Mother's Day, Music, Valentine's**, with 4 products each (32 in total).

### How orders work

There is no online payment. At checkout the customer fills in their details and chooses how to send the order:

- **WhatsApp** or **email**: the app opens with the full order already written, including the order number, items, engraving text, total, address and payment method.
- **Instagram**: Instagram doesn't allow pre-written messages, so the site copies the order and opens a chat with @makerwoodlb. The customer pastes it and sends.

You reply to confirm, and they pay by cash on delivery or transfer.

The cart is saved in the customer's browser, so it is still there if they come back later.

## Before you go live

Open **`assets/js/config.js`** and fill in:

- [ ] `whatsappNumber`: your WhatsApp number, digits only with country code, for example `96171123456`. Until this is set, WhatsApp checkout stays hidden.
- [ ] `email`: the address that receives orders (replace `hello@makerwood.example`).
- [x] `instagram` and `instagramHandle` are set to [@makerwoodlb](https://www.instagram.com/makerwoodlb/). Customers can already send orders there: the site copies the order and opens a chat with you.
- [ ] `phoneDisplay`, `location`, `hours`.
- [ ] `deliveryFee`, `freeDeliveryFrom`, `deliveryArea`, `allowPickup`, `paymentMethods`.
- [ ] `announcement` (the bar at the top of every page) and `seasonal` (the highlight on the home page). Change these with the seasons.

Then:

- [ ] Replace the placeholder product illustrations with photos of your real pieces (see below).
- [ ] Check every price, size and lead time in `assets/js/products.js`.
- [ ] Read the About page and the FAQ in `about.html`, especially delivery, payment and returns, and adjust them to your policies.

A yellow "Store owner" note appears on the cart and custom-order pages while the WhatsApp number or email are still placeholders. It disappears once they are set.

## Adding or changing products

Everything is in **`assets/js/products.js`**. Copy an existing product block and change it:

```js
{
  id: 'wooden-coasters',            // unique, lowercase, used in the link
  name: 'Engraved Coaster Set',
  category: 'mothers-day',          // must match a category id
  price: 18,
  badge: 'New',                     // optional: 'Bestseller', 'New', 'Limited'…
  featured: true,                   // show on the home page
  images: ['assets/img/products/wooden-coasters.jpg'],
  summary: 'One line shown under the title.',
  description: ['First paragraph.', 'Second paragraph.'],
  specs: { Material: 'Solid oak', Size: '10 cm', 'In the set': '4 coasters' },
  options: [
    { name: 'Wood', choices: [ { label: 'Oak', price: 0 }, { label: 'Walnut', price: 5 } ] },
  ],
  personalization: { label: 'Initials', placeholder: 'e.g. S & K', maxLength: 10, required: false },
  leadTime: '3 to 5 working days',
},
```

- **Options** add their `price` to the base price. Leave `options: []` if there are none.
- **Personalization**: set to `null` if the piece can't be engraved. With `required: true` the customer must type something before adding it to the cart.
- **A new category** (for example *Graduation* or *Ramadan*): add a block to `MW_CATEGORIES` at the top of the same file. It appears in the menu, the home page, the shop filters and the footer automatically.

### Photos

- Put photos in `assets/img/products/`.
- Square photos look best (800 × 800 px or larger). JPG or WebP, ideally under 200 KB each.
- The first image in `images` is the main photo. The second one appears when a customer hovers over the product card and as a thumbnail on the product page.
- The current images are drawn illustrations made for the launch. Replace them with photos as soon as you have them.

Your original logo is kept in `assets/img/brand/makerwood-logo.jpg`.

## Publishing on GitHub Pages (free)

1. Merge this branch into `main`.
2. On GitHub open **Settings → Pages**.
3. Under *Build and deployment* choose **Deploy from a branch**, pick `main` and `/ (root)`, then **Save**.
4. After a minute the site is live at `https://<your-username>.github.io/makerwood/`.
5. Optional: add your own domain (for example `makerwood.com`) in the same settings page.

GitHub Pages on a private repository needs a paid GitHub plan. The alternative is [Netlify Drop](https://app.netlify.com/drop): drag the project folder onto the page and it is online.

## Previewing on your computer

Open `index.html` in a browser, or run a small local server from this folder:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Project structure

```
index.html  shop.html  product.html  cart.html  custom.html  about.html  404.html
assets/
  css/styles.css        all styling (colours and fonts at the top)
  js/config.js          store settings (contact, delivery, payment, announcements)
  js/products.js        categories and products
  js/app.js             header, footer, cart, shop and checkout logic
  img/                  logo, icons, share image
  img/products/         product photos
```
