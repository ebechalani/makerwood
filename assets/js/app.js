/*
 * MakerWood storefront script.
 * Renders the shared header/footer, the cart, and each page from
 * config.js (store settings) and products.js (catalog).
 */
(function () {
  'use strict';

  const C = window.MW_CONFIG || {};
  const CATS = window.MW_CATEGORIES || [];
  const PRODUCTS = window.MW_PRODUCTS || [];
  const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
  const catById = Object.fromEntries(CATS.map((c) => [c.id, c]));

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const esc = (v) =>
    String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  /* ---------------- Formatting ---------------- */
  const money = (n) =>
    new Intl.NumberFormat(C.locale || 'en-US', {
      style: 'currency',
      currency: C.currency || 'USD',
      minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(n);

  /* ---------------- Links & page parameters ---------------- */
  function link(page, params) {
    const q = new URLSearchParams(params || {}).toString();
    if (!q) return page;
    return page + (C.urlMode === 'hash' ? '#' : '?') + q;
  }
  function getParams() {
    if (location.search.length > 1) return new URLSearchParams(location.search);
    const h = location.hash.slice(1);
    return new URLSearchParams(h.includes('=') ? h : '');
  }
  function reflectParams(params) {
    const clean = {};
    Object.entries(params).forEach(([k, v]) => { if (v) clean[k] = v; });
    const q = new URLSearchParams(clean).toString();
    const next = C.urlMode === 'hash'
      ? location.pathname + location.search + (q ? '#' + q : '')
      : location.pathname + (q ? '?' + q : '') + location.hash;
    try { history.replaceState(null, '', next); } catch (e) { /* ignore */ }
  }

  /* ---------------- Storage (never throws) ---------------- */
  const storage = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
    },
  };

  /* ---------------- Icons ---------------- */
  const ICONS = {
    bag: '<path d="M5.5 8h13l-1.1 12.1a1 1 0 0 1-1 .9H7.6a1 1 0 0 1-1-.9L5.5 8Z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    chat: '<path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z"/><path d="M9.2 8.6c.3-.4.9-.4 1.1.1l.6 1.4c.1.3 0 .6-.2.8l-.5.5c.5 1 1.3 1.8 2.3 2.3l.5-.5c.2-.2.5-.3.8-.2l1.4.6c.5.2.5.8.1 1.1-.7.6-1.7.9-2.6.5A7.4 7.4 0 0 1 8.7 11c-.4-.9-.1-1.8.5-2.4Z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
    insta: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    laser: '<path d="M12 2v7M12 15v7M2 12h7M15 12h7M5.6 5.6l3.5 3.5M14.9 14.9l3.5 3.5M18.4 5.6l-3.5 3.5M9.1 14.9l-3.5 3.5"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/>',
    cnc: '<path d="M9 2.5h6v5H9z"/><path d="M10 7.5h4v5.5l-2 3.5-2-3.5z"/><path d="M12 17v4.5M7 21.5h10"/>',
    gift: '<rect x="3.5" y="8" width="17" height="4" rx="1"/><path d="M5.5 12v8.5h13V12M12 8v12.5"/><path d="M12 8S10.2 3.5 7.8 4.5 8.5 8 12 8Zm0 0s1.8-4.5 4.2-3.5S15.5 8 12 8Z"/>',
    leaf: '<path d="M5 19c0-8.5 5.5-14 15-14 0 9.5-5.5 15-15 15Z"/><path d="m5 19 8.5-8.5"/>',
    truck: '<path d="M3 6.5h11v9.5H3zM14 9.5h3.8l3.2 3.3V16H14"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',
    pen: '<path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>',
  };
  const icon = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;

  /* ---------------- Pricing & cart ---------------- */
  function defaultOptions(p) {
    const out = {};
    (p.options || []).forEach((o) => { if (o.choices && o.choices.length) out[o.name] = o.choices[0].label; });
    return out;
  }
  function unitPrice(p, opts) {
    let total = p.price;
    (p.options || []).forEach((o) => {
      const choice = o.choices.find((c) => c.label === (opts || {})[o.name]);
      if (choice) total += choice.price || 0;
    });
    return total;
  }
  function optionText(p, opts) {
    return (p.options || [])
      .filter((o) => o.choices.length > 1 && opts && opts[o.name])
      .map((o) => `${o.name}: ${opts[o.name]}`);
  }

  const CART_KEY = 'makerwood-cart-v1';
  const LAST_ORDER_KEY = 'makerwood-last-order-v1';
  const sanitize = (items) =>
    Array.isArray(items) ? items.filter((i) => i && byId[i.id] && Number(i.qty) > 0) : [];

  const cart = {
    items: sanitize(storage.get(CART_KEY, [])),
    save() { storage.set(CART_KEY, this.items); cartChanged(); },
    add(id, qty, options, text) {
      const p = byId[id];
      if (!p) return;
      const opts = Object.assign(defaultOptions(p), options || {});
      const t = String(text || '').trim();
      const key = `${id}|${JSON.stringify(opts)}|${t}`;
      const found = this.items.find((i) => i.key === key);
      if (found) found.qty = Math.min(99, found.qty + qty);
      else this.items.push({ key, id, qty: Math.min(99, qty), options: opts, text: t });
      this.save();
    },
    setQty(key, qty) {
      const it = this.items.find((i) => i.key === key);
      if (!it) return;
      it.qty = Math.max(1, Math.min(99, Math.round(qty) || 1));
      this.save();
    },
    remove(key) { this.items = this.items.filter((i) => i.key !== key); this.save(); },
    clear() { this.items = []; this.save(); },
    lines() {
      return this.items.filter((i) => byId[i.id]).map((i) => {
        const product = byId[i.id];
        const unit = unitPrice(product, i.options);
        return Object.assign({}, i, { product, unit, total: unit * i.qty });
      });
    },
    count() { return this.lines().reduce((n, l) => n + l.qty, 0); },
    subtotal() { return this.lines().reduce((n, l) => n + l.total, 0); },
  };

  function deliveryFee(subtotal, method) {
    if (method === 'pickup' || subtotal <= 0) return 0;
    if (C.freeDeliveryFrom && subtotal >= C.freeDeliveryFrom) return 0;
    return C.deliveryFee || 0;
  }

  const cartListeners = [];
  function cartChanged() {
    const n = cart.count();
    $$('.cart-count').forEach((el) => {
      el.textContent = n;
      el.hidden = n === 0;
      el.classList.remove('bump');
      void el.offsetWidth;
      el.classList.add('bump');
    });
    $$('[data-open-cart]').forEach((el) => el.setAttribute('aria-label', `Cart, ${n} item${n === 1 ? '' : 's'}`));
    renderMiniCart();
    cartListeners.forEach((fn) => fn());
  }
  window.addEventListener('storage', (e) => {
    if (e.key === CART_KEY) { cart.items = sanitize(storage.get(CART_KEY, [])); cartChanged(); }
  });

  /* ---------------- Contact helpers ---------------- */
  const hasWhatsApp = () => /^\d{8,15}$/.test(String(C.whatsappNumber || ''));
  // placeholder addresses (…@….example) are treated as not set, so no order goes nowhere
  const hasEmail = () => /@/.test(String(C.email || '')) && !/\.example$/i.test(String(C.email));
  const whatsappLink = (text) => `https://wa.me/${C.whatsappNumber}${text ? '?text=' + encodeURIComponent(text) : ''}`;
  const mailLink = (subject, body) =>
    `mailto:${C.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  function configWarning() {
    const issues = [];
    if (!hasWhatsApp()) issues.push('your WhatsApp number');
    if (!hasEmail()) issues.push('your email address');
    if (!issues.length) return '';
    const now = hasInstagram() ? ` Until then, orders arrive by Instagram message to @${esc(igHandle())}.` : '';
    return `<p class="config-warning"><b>Store owner:</b> add ${issues.join(' and ')} in <code>assets/js/config.js</code> so customers can send orders there too.${now}</p>`;
  }
  function openExternal(href) {
    if (href.startsWith('mailto:')) { location.href = href; return true; }
    const w = window.open(href, '_blank', 'noopener');
    return !!w;
  }

  // Instagram: profile link plus a direct-message link (ig.me opens a chat with the shop)
  const igHandle = () => String(C.instagramHandle || '').replace(/^@/, '').trim();
  const hasInstagram = () => /^[A-Za-z0-9._]{2,30}$/.test(igHandle());
  const instagramProfile = () => C.instagram || `https://www.instagram.com/${igHandle()}/`;
  const instagramDM = () => `https://ig.me/m/${igHandle()}`;

  // Ways a customer can send an order or request, in order of preference.
  // WhatsApp and email open with the message already written; Instagram can't be
  // pre-filled, so the text is copied for the customer to paste into the chat.
  const CHANNELS = [
    { id: 'whatsapp', name: 'WhatsApp', icon: 'chat', cls: 'btn-whatsapp', ok: hasWhatsApp, link: (text) => whatsappLink(text), prefilled: true },
    { id: 'instagram', name: 'Instagram', icon: 'insta', cls: 'btn-instagram', ok: hasInstagram, link: () => instagramDM(), prefilled: false },
    { id: 'email', name: 'email', icon: 'mail', cls: '', ok: hasEmail, link: (text, subject) => mailLink(subject, text), prefilled: true },
  ];
  const channels = () => CHANNELS.filter((c) => c.ok());
  const external = (c) => (c.id === 'email' ? '' : 'target="_blank" rel="noopener"');
  function sendButtons(what, block) {
    return channels().map((c, i) => `
      <button type="submit" class="btn ${i === 0 ? c.cls : 'btn-ghost'}${block ? ' btn-block' : ''}" data-via="${c.id}">${icon(c.icon)}
        ${c.id === 'email' ? `Send ${what} by email` : c.prefilled ? `Send ${what} on ${c.name}` : `Copy ${what} &amp; message us on ${c.name}`}</button>`).join('');
  }
  function copyText(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(() => true, () => false);
    } catch (e) { /* clipboard unavailable */ }
    return Promise.resolve(false);
  }
  // Copy first (needs the click's user activation), then open the chat or email app.
  function send(channelId, text, subject) {
    const c = CHANNELS.find((x) => x.id === channelId && x.ok()) || channels()[0];
    const href = c.link(text, subject);
    const copied = c.prefilled ? Promise.resolve(false) : copyText(text);
    openExternal(href);
    return { channel: c, href, copied };
  }

  /* ---------------- Shared layout ---------------- */
  const PAGE = ($('[data-page]') || document.body).dataset.page || '';

  function navCurrent(name) {
    return (PAGE === name) ? ' aria-current="page"' : '';
  }

  function renderChrome() {
    const announce = $('#announce');
    if (announce && C.announcement) {
      announce.className = 'announce';
      announce.textContent = C.announcement;
    }

    const header = $('#site-header');
    if (header) {
      header.innerHTML = `
      <div class="wrap header-inner">
        <a class="brand" href="index.html" aria-label="${esc(C.storeName)} home">
          <img src="assets/img/logo-badge-160.webp" alt="" width="48" height="48">
          <span class="brand-text"><span class="brand-name">${esc(C.storeName)}</span><span class="brand-tag">${esc(C.tagline)}</span></span>
        </a>
        <nav class="main-nav" aria-label="Main">
          <a href="shop.html"${navCurrent('shop')}>Shop all</a>
          <div class="nav-drop">
            <button type="button" aria-expanded="false" aria-controls="mega-menu">Categories ${icon('down')}</button>
            <div class="mega" id="mega-menu" hidden>
              ${CATS.map((c) => `
                <a href="${link('shop.html', { category: c.id })}">
                  <img src="${esc(c.image)}" alt="" width="56" height="56" loading="lazy">
                  <span><strong>${esc(c.name)}</strong><span>${esc(c.short)}</span></span>
                </a>`).join('')}
              <a class="mega-all" href="shop.html">Browse all ${PRODUCTS.length} products ${icon('arrow')}</a>
            </div>
          </div>
          <a href="custom.html"${navCurrent('custom')}>Custom orders</a>
          <a href="about.html"${navCurrent('about')}>About</a>
          <a href="about.html#contact">Contact</a>
        </nav>
        <div class="header-actions">
          ${hasInstagram() ? `<a class="icon-btn ig-link" href="${esc(instagramProfile())}" target="_blank" rel="noopener" aria-label="MakerWood on Instagram">${icon('insta')}</a>` : ''}
          <button type="button" class="icon-btn" data-open-search aria-label="Search products">${icon('search')}</button>
          <a class="icon-btn" href="cart.html" data-open-cart aria-label="Cart">${icon('bag')}<span class="cart-count" hidden>0</span></a>
          <button type="button" class="icon-btn menu-btn" data-open-menu aria-label="Open menu">${icon('menu')}</button>
        </div>
      </div>`;
    }

    const footer = $('#site-footer');
    if (footer) {
      footer.innerHTML = `
      <div class="wrap">
        <div class="footer-grid">
          <div class="footer-brand">
            <a class="brand" href="index.html">
              <img src="assets/img/logo-badge-160.webp" alt="" width="48" height="48" loading="lazy">
              <span class="brand-text"><span class="brand-name">${esc(C.storeName)}</span></span>
            </a>
            <p>Laser-cut and CNC-carved pieces, personalized and made to order in our workshop${C.location ? ' in ' + esc(C.location) : ''}.</p>
          </div>
          <div>
            <h2>Shop</h2>
            <ul>${CATS.map((c) => `<li><a href="${link('shop.html', { category: c.id })}">${esc(c.name)}</a></li>`).join('')}<li><a href="shop.html">All products</a></li></ul>
          </div>
          <div>
            <h2>Help</h2>
            <ul>
              <li><a href="custom.html">Custom orders</a></li>
              <li><a href="about.html#faq">Delivery &amp; FAQ</a></li>
              <li><a href="about.html">About us</a></li>
              <li><a href="cart.html">Your cart</a></li>
            </ul>
          </div>
          <div>
            <h2>Talk to us</h2>
            <ul>
              ${hasWhatsApp() ? `<li><a href="${whatsappLink('')}" target="_blank" rel="noopener">WhatsApp${C.phoneDisplay ? ' · ' + esc(C.phoneDisplay) : ''}</a></li>` : ''}
              ${hasEmail() ? `<li><a href="mailto:${esc(C.email)}">${esc(C.email)}</a></li>` : ''}
              ${hasInstagram() ? `<li><a href="${esc(instagramProfile())}" target="_blank" rel="noopener">Instagram @${esc(igHandle())}</a></li>` : ''}
              ${C.hours ? `<li>${esc(C.hours)}</li>` : ''}
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} ${esc(C.storeName)}. All pieces made to order.</span>
          <span class="footer-motto">${esc(C.motto || '')}</span>
        </div>
      </div>`;
    }

    // Floating layers: overlay, mobile menu, mini cart, search, toast
    const layers = document.createElement('div');
    layers.innerHTML = `
      <div class="overlay" data-close></div>
      <aside class="drawer drawer-left" id="menu-drawer" aria-label="Menu" aria-hidden="true">
        <div class="drawer-head"><h2>Menu</h2><button type="button" class="icon-btn" data-close aria-label="Close menu">${icon('close')}</button></div>
        <div class="drawer-body">
          <nav class="mobile-nav" aria-label="Mobile">
            <a href="shop.html">Shop all products</a>
            <span class="eyebrow group-label">Categories</span>
            ${CATS.map((c) => `<a href="${link('shop.html', { category: c.id })}"><img src="${esc(c.image)}" alt="" loading="lazy">${esc(c.name)}</a>`).join('')}
            <span class="eyebrow group-label">More</span>
            <a href="custom.html">Custom orders</a>
            <a href="about.html">About us</a>
            <a href="about.html#faq">Delivery &amp; FAQ</a>
            <a href="about.html#contact">Contact</a>
            ${hasInstagram() ? `<a href="${esc(instagramProfile())}" target="_blank" rel="noopener">Instagram @${esc(igHandle())}</a>` : ''}
          </nav>
        </div>
      </aside>
      <aside class="drawer drawer-right" id="cart-drawer" aria-label="Cart" aria-hidden="true">
        <div class="drawer-head"><h2>Your cart</h2><button type="button" class="icon-btn" data-close aria-label="Close cart">${icon('close')}</button></div>
        <div class="drawer-body" id="mini-cart-body"></div>
        <div class="drawer-foot" id="mini-cart-foot"></div>
      </aside>
      <div class="search-panel" id="search-panel" role="dialog" aria-label="Search products" aria-hidden="true">
        <div class="wrap">
          <form class="search-row" id="search-form" role="search">
            <label class="visually-hidden" for="search-input">Search products</label>
            <input id="search-input" type="search" placeholder="Search ornaments, kits, names signs…" autocomplete="off">
            <button type="button" class="icon-btn" data-close aria-label="Close search">${icon('close')}</button>
          </form>
          <div class="search-results" id="search-results"></div>
        </div>
      </div>
      <div class="toast" id="toast" role="status" aria-live="polite"></div>`;
    while (layers.firstChild) document.body.appendChild(layers.firstChild);

    wireChrome();
    cartChanged();
  }

  let activeLayer = null;
  function openLayer(el, focusSel) {
    closeLayers();
    activeLayer = el;
    el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');
    $('.overlay').classList.add('show');
    document.body.style.overflow = 'hidden';
    const f = focusSel ? $(focusSel, el) : $('button, a, input', el);
    if (f) setTimeout(() => f.focus(), 60);
  }
  function closeLayers() {
    $$('.drawer.open, .search-panel.open').forEach((el) => { el.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); });
    const ov = $('.overlay');
    if (ov) ov.classList.remove('show');
    document.body.style.overflow = '';
    activeLayer = null;
  }

  function wireChrome() {
    const drop = $('.nav-drop');
    if (drop) {
      const btn = $('button', drop);
      const menu = $('.mega', drop);
      const set = (open) => { drop.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); menu.hidden = !open; };
      btn.addEventListener('click', (e) => { e.stopPropagation(); set(menu.hidden); });
      document.addEventListener('click', (e) => { if (!drop.contains(e.target)) set(false); });
      drop.addEventListener('keydown', (e) => { if (e.key === 'Escape') { set(false); btn.focus(); } });
    }
    $$('[data-open-menu]').forEach((b) => b.addEventListener('click', () => openLayer($('#menu-drawer'))));
    $$('[data-open-search]').forEach((b) => b.addEventListener('click', () => openLayer($('#search-panel'), '#search-input')));
    $$('[data-open-cart]').forEach((a) => a.addEventListener('click', (e) => {
      if (PAGE === 'cart') return;
      e.preventDefault();
      openLayer($('#cart-drawer'));
    }));
    document.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeLayers(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && activeLayer) closeLayers(); });

    const input = $('#search-input');
    const results = $('#search-results');
    input.addEventListener('input', () => {
      const q = input.value.trim();
      const found = q ? searchProducts(q).slice(0, 8) : [];
      results.innerHTML = found.map((p) => `
        <a href="${link('product.html', { id: p.id })}">
          <img src="${esc(p.images[0])}" alt="" loading="lazy">
          <span><strong>${esc(p.name)}</strong><span>${esc(catById[p.category] ? catById[p.category].name : '')} · ${money(p.price)}</span></span>
        </a>`).join('') || (q ? `<p class="muted">No products match “${esc(q)}”. Try another word, or <a href="custom.html">ask us to make it</a>.</p>` : '');
    });
    $('#search-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const q = input.value.trim();
      location.href = link('shop.html', q ? { q } : {});
    });

    // mini cart actions (event delegation)
    $('#cart-drawer').addEventListener('click', (e) => {
      const rm = e.target.closest('[data-remove]');
      if (rm) cart.remove(rm.dataset.remove);
      const step = e.target.closest('[data-step]');
      if (step) {
        const it = cart.items.find((i) => i.key === step.dataset.key);
        if (it) cart.setQty(it.key, it.qty + Number(step.dataset.step));
      }
    });
  }

  function searchProducts(q) {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return PRODUCTS.filter((p) => {
      const cat = catById[p.category];
      const hay = [p.name, p.summary, cat && cat.name, p.badge, Object.values(p.specs || {}).join(' ')].join(' ').toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }

  function renderMiniCart() {
    const body = $('#mini-cart-body');
    const foot = $('#mini-cart-foot');
    if (!body) return;
    const lines = cart.lines();
    if (!lines.length) {
      body.innerHTML = `<div class="empty" style="border:0;padding:40px 8px"><h2>Your cart is empty</h2><p>Pick an occasion and we will cut it to order.</p><a class="btn" href="shop.html">Browse the shop</a></div>`;
      foot.hidden = true;
      return;
    }
    foot.hidden = false;
    body.innerHTML = lines.map((l) => `
      <div class="mini-line">
        <img src="${esc(l.product.images[0])}" alt="" loading="lazy">
        <div>
          <h3>${esc(l.product.name)}</h3>
          <div class="meta">${optionText(l.product, l.options).map(esc).join('<br>')}${l.text ? `${optionText(l.product, l.options).length ? '<br>' : ''}Engraving: “${esc(l.text)}”` : ''}</div>
          <div class="line-actions" style="display:flex;gap:12px;align-items:center;margin-top:8px">
            <div class="qty sm">
              <button type="button" data-step="-1" data-key="${esc(l.key)}" aria-label="Decrease quantity">${icon('minus')}</button>
              <input type="number" value="${l.qty}" aria-label="Quantity" readonly tabindex="-1">
              <button type="button" data-step="1" data-key="${esc(l.key)}" aria-label="Increase quantity">${icon('plus')}</button>
            </div>
            <button type="button" class="link-btn" data-remove="${esc(l.key)}">Remove</button>
          </div>
        </div>
        <div class="price">${money(l.total)}</div>
      </div>`).join('');
    const sub = cart.subtotal();
    const left = C.freeDeliveryFrom ? C.freeDeliveryFrom - sub : 0;
    foot.innerHTML = `
      ${C.freeDeliveryFrom ? `<div class="free-bar">${left > 0 ? `Add <b>${money(left)}</b> more for free delivery` : 'Your order ships free'}<div class="track"><div class="fill" style="width:${Math.min(100, (sub / C.freeDeliveryFrom) * 100)}%"></div></div></div>` : ''}
      <div class="drawer-total"><span>Subtotal</span><span>${money(sub)}</span></div>
      <a class="btn btn-block" href="cart.html">Checkout ${icon('arrow')}</a>
      <button type="button" class="btn btn-ghost btn-block" data-close>Keep shopping</button>`;
  }

  let toastTimer;
  function toast(html) {
    const t = $('#toast');
    t.innerHTML = `${icon('check')}<span>${html}</span>`;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3600);
  }

  /* ---------------- Product card ---------------- */
  function productCard(p) {
    const cat = catById[p.category];
    const needsText = p.personalization && p.personalization.required;
    const kind = (p.badge || '').toLowerCase();
    return `
    <article class="card">
      <a class="card-media" href="${link('product.html', { id: p.id })}" tabindex="-1" aria-hidden="true">
        <img src="${esc(p.images[0])}" alt="" loading="lazy" width="800" height="800">
        ${p.images[1] ? `<img class="alt" src="${esc(p.images[1])}" alt="" loading="lazy" width="800" height="800">` : ''}
      </a>
      ${p.badge ? `<span class="badge" data-kind="${esc(kind)}">${esc(p.badge)}</span>` : ''}
      ${needsText
        ? `<a class="quick-add" href="${link('product.html', { id: p.id })}" aria-label="Personalize ${esc(p.name)}" title="Personalize">${icon('pen')}</a>`
        : `<button type="button" class="quick-add" data-quick-add="${esc(p.id)}" aria-label="Add ${esc(p.name)} to cart" title="Add to cart">${icon('plus')}</button>`}
      <div class="card-body">
        <span class="card-cat">${esc(cat ? cat.name : '')}</span>
        <h3 class="card-title"><a href="${link('product.html', { id: p.id })}">${esc(p.name)}</a></h3>
        <div class="card-foot">
          <span class="price">${p.compareAt ? `<span class="price-old">${money(p.compareAt)}</span> ` : ''}${money(p.price)}</span>
          ${p.personalization ? `<span class="card-perso">${icon('pen')} Personalized</span>` : ''}
        </div>
      </div>
    </article>`;
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-quick-add]');
    if (!b) return;
    const p = byId[b.dataset.quickAdd];
    cart.add(p.id, 1);
    toast(`${esc(p.name)} added. <a href="cart.html">View cart</a>`);
  });

  /* ================= Pages ================= */

  function pageHome() {
    const cats = $('#home-categories');
    if (cats) {
      cats.innerHTML = CATS.map((c) => `
        <a class="cat-tile" href="${link('shop.html', { category: c.id })}">
          <img src="${esc(c.image)}" alt="" loading="lazy" width="800" height="800">
          ${c.note ? `<span class="cat-note">${esc(c.note)}</span>` : ''}
          <span class="cat-info">
            <span><h3>${esc(c.name)}</h3><p>${esc(c.short)}</p></span>
            <span class="arrow">${icon('arrow')}</span>
          </span>
        </a>`).join('');
    }
    const ig = $('#home-instagram');
    if (ig && hasInstagram()) {
      const picks = ['led-name-lamp', 'tawleh-board', 'name-bauble', 'cedar-wall-art', 'family-tree-plaque', 'robot-arm-kit'].map((id) => byId[id]).filter(Boolean);
      ig.innerHTML = `
        <div class="ig-band">
          <div class="ig-copy">
            <span class="eyebrow">Instagram</span>
            <h2 id="ig-title">Follow the workshop <a href="${esc(instagramProfile())}" target="_blank" rel="noopener">@${esc(igHandle())}</a></h2>
            <p class="lead">New pieces, custom orders fresh off the laser and seasonal collections appear there first. You can also message us there to order or ask a question.</p>
            <div class="split-actions">
              <a class="btn btn-instagram" href="${esc(instagramProfile())}" target="_blank" rel="noopener">${icon('insta')} Follow @${esc(igHandle())}</a>
              <a class="btn btn-ghost" href="${esc(instagramDM())}" target="_blank" rel="noopener">${icon('chat')} Send us a message</a>
            </div>
          </div>
          <div class="ig-grid">${picks.map((p) => `<a href="${link('product.html', { id: p.id })}" aria-label="${esc(p.name)}"><img src="${esc(p.images[0])}" alt="" loading="lazy" width="800" height="800"></a>`).join('')}</div>
        </div>`;
    } else if (ig) {
      ig.closest('section').hidden = true;
    }
    const org = document.createElement('script');
    org.type = 'application/ld+json';
    org.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: C.storeName,
      slogan: C.tagline,
      url: location.href.split('#')[0].split('?')[0],
      logo: new URL('assets/img/apple-touch-icon.png', location.href).href,
      image: new URL('assets/img/og-image.jpg', location.href).href,
      email: hasEmail() ? C.email : undefined,
      sameAs: hasInstagram() ? [instagramProfile()] : undefined,
      address: C.location ? { '@type': 'PostalAddress', addressCountry: C.location } : undefined,
    });
    document.head.appendChild(org);

    const feat = $('#home-featured');
    if (feat) feat.innerHTML = PRODUCTS.filter((p) => p.featured).slice(0, 8).map(productCard).join('');

    const seasonal = $('#home-seasonal');
    const s = C.seasonal;
    if (seasonal && s && catById[s.category]) {
      const items = PRODUCTS.filter((p) => p.category === s.category).slice(0, 3);
      seasonal.innerHTML = `
        <div class="seasonal">
          <div class="seasonal-copy on-dark">
            <span class="eyebrow">${esc(s.eyebrow)}</span>
            <h2 id="seasonal-title">${esc(s.title)}</h2>
            <p>${esc(s.text)}</p>
            <div class="split-actions"><a class="btn btn-glow" href="${link('shop.html', { category: s.category })}">Shop ${esc(catById[s.category].name)} ${icon('arrow')}</a></div>
          </div>
          <div class="seasonal-imgs">${items.map((p) => `<a href="${link('product.html', { id: p.id })}"><img src="${esc(p.images[0])}" alt="${esc(p.name)}" loading="lazy"></a>`).join('')}</div>
        </div>`;
    } else if (seasonal) {
      seasonal.closest('section').hidden = true;
    }
  }

  function pageShop() {
    const root = $('#shop');
    const params = getParams();
    const state = {
      category: catById[params.get('category')] ? params.get('category') : '',
      q: params.get('q') || '',
      sort: params.get('sort') || 'featured',
      perso: params.get('perso') === '1',
    };

    root.innerHTML = `
      <div class="shop-layout">
        <aside class="filters" aria-label="Filters">
          <div class="filter-group">
            <h2>Categories</h2>
            <ul class="cat-list">
              <li><button type="button" data-cat="">All products <span class="count">${PRODUCTS.length}</span></button></li>
              ${CATS.map((c) => `<li><button type="button" data-cat="${esc(c.id)}">${esc(c.name)} <span class="count">${PRODUCTS.filter((p) => p.category === c.id).length}</span></button></li>`).join('')}
            </ul>
          </div>
          <div class="filter-group">
            <h2>Refine</h2>
            <label class="filter-check"><input type="checkbox" id="filter-perso"> Can be personalized</label>
          </div>
          <div class="filter-group">
            <h2>Need something else?</h2>
            <p class="muted" style="font-size:.9rem">We cut custom designs, logos and signs to order.</p>
            <p style="margin-top:10px"><a class="text-link" href="custom.html">Request a custom piece ${icon('arrow')}</a></p>
          </div>
        </aside>
        <div>
          <div class="chips" role="group" aria-label="Categories">
            <button type="button" data-cat="">All</button>
            ${CATS.map((c) => `<button type="button" data-cat="${esc(c.id)}">${esc(c.name)}</button>`).join('')}
          </div>
          <div class="toolbar">
            <span class="result-count" id="result-count" aria-live="polite"></span>
            <div class="toolbar-controls">
              <div class="field-inline">${icon('search')}<label class="visually-hidden" for="shop-search">Search</label><input id="shop-search" type="search" placeholder="Search" value="${esc(state.q)}"></div>
              <label class="visually-hidden" for="shop-sort">Sort by</label>
              <select class="select" id="shop-sort">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="name">Name A to Z</option>
              </select>
            </div>
          </div>
          <div class="product-grid cols-3" id="shop-grid"></div>
        </div>
      </div>`;

    const grid = $('#shop-grid');
    $('#shop-sort').value = state.sort;
    $('#filter-perso').checked = state.perso;

    function updateHead() {
      const c = catById[state.category];
      $('#shop-title').textContent = c ? c.name : 'All products';
      $('#shop-lead').textContent = c ? c.description : 'Every piece is laser-cut or CNC-carved to order, and most can be personalized with names, dates or your own words.';
      $('#shop-crumb').innerHTML = c
        ? `<li><a href="index.html">Home</a></li><li><a href="shop.html">Shop</a></li><li aria-current="page">${esc(c.name)}</li>`
        : `<li><a href="index.html">Home</a></li><li aria-current="page">Shop</li>`;
      document.title = `${c ? c.name : 'Shop all products'} · ${C.storeName}`;
    }

    function render() {
      let list = PRODUCTS.slice();
      if (state.category) list = list.filter((p) => p.category === state.category);
      if (state.q) {
        const ids = new Set(searchProducts(state.q).map((p) => p.id));
        list = list.filter((p) => ids.has(p.id));
      }
      if (state.perso) list = list.filter((p) => p.personalization);
      if (state.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
      if (state.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
      if (state.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
      if (state.sort === 'featured') list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

      $$('[data-cat]', root).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === state.category)));
      $('#result-count').textContent = `${list.length} product${list.length === 1 ? '' : 's'}`;
      grid.innerHTML = list.length
        ? list.map(productCard).join('')
        : `<div class="empty" style="grid-column:1/-1"><h2>Nothing matches yet</h2><p>Try a different word or category. If you have something specific in mind, we can make it for you.</p><a class="btn" href="custom.html">Request a custom piece</a></div>`;
      updateHead();
      reflectParams({ category: state.category, q: state.q, sort: state.sort === 'featured' ? '' : state.sort, perso: state.perso ? '1' : '' });
    }

    root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-cat]');
      if (!b) return;
      state.category = b.dataset.cat;
      render();
      if (b.closest('.chips')) b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    });
    $('#shop-sort').addEventListener('change', (e) => { state.sort = e.target.value; render(); });
    $('#filter-perso').addEventListener('change', (e) => { state.perso = e.target.checked; render(); });
    let t;
    $('#shop-search').addEventListener('input', (e) => { clearTimeout(t); t = setTimeout(() => { state.q = e.target.value.trim(); render(); }, 150); });
    render();
  }

  function pageProduct() {
    const root = $('#product');
    const p = byId[getParams().get('id')];
    if (!p) {
      root.innerHTML = `<div class="wrap"><div class="empty" style="margin-block:64px"><h2>We couldn't find that product</h2><p>It may have been renamed or retired. Have a look through the shop instead.</p><a class="btn" href="shop.html">Browse the shop</a></div></div>`;
      return;
    }
    const cat = catById[p.category];
    const perso = p.personalization;
    document.title = `${p.name} · ${C.storeName}`;
    const meta = $('meta[name="description"]');
    if (meta) meta.setAttribute('content', p.summary);

    root.innerHTML = `
      <div class="wrap">
        <ol class="crumbs" style="padding-top:24px">
          <li><a href="index.html">Home</a></li>
          <li><a href="shop.html">Shop</a></li>
          ${cat ? `<li><a href="${link('shop.html', { category: cat.id })}">${esc(cat.name)}</a></li>` : ''}
          <li aria-current="page">${esc(p.name)}</li>
        </ol>
        <div class="product-layout">
          <div class="gallery">
            <div class="gallery-main"><img id="main-img" src="${esc(p.images[0])}" alt="${esc(p.name)}" width="800" height="800"></div>
            ${p.images.length > 1 ? `<div class="thumbs">${p.images.map((src, i) => `<button type="button" data-img="${esc(src)}" aria-current="${i === 0}" aria-label="Show photo ${i + 1}"><img src="${esc(src)}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}
          </div>
          <div class="buy">
            <span class="eyebrow">${esc(cat ? cat.name : '')}${p.badge ? ' · ' + esc(p.badge) : ''}</span>
            <h1>${esc(p.name)}</h1>
            <div class="price-row"><span class="price" id="price">${money(p.price)}</span>${p.compareAt ? `<span class="price-old">${money(p.compareAt)}</span>` : ''}</div>
            <p class="summary">${esc(p.summary)}</p>
            <form id="buy-form" novalidate>
              ${(p.options || []).filter((o) => o.choices.length).map((o, oi) => `
                <fieldset class="opt-group">
                  <legend>${esc(o.name)}: <span class="chosen" data-chosen="${oi}">${esc(o.choices[0].label)}</span></legend>
                  <div class="swatches">
                    ${o.choices.map((ch, ci) => `
                      <label class="swatch">
                        <input type="radio" name="opt-${oi}" id="opt-${oi}-${ci}" value="${esc(ch.label)}" data-opt="${esc(o.name)}" data-idx="${oi}" ${ci === 0 ? 'checked' : ''}>
                        <span>${esc(ch.label)}${ch.price ? ` <small>+${money(ch.price)}</small>` : ''}</span>
                      </label>`).join('')}
                  </div>
                </fieldset>`).join('')}
              ${perso ? `
                <div class="field">
                  <label for="perso-text">${esc(perso.label)}${perso.required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>
                  <input id="perso-text" name="perso" maxlength="${perso.maxLength || 30}" placeholder="${esc(perso.placeholder || '')}" ${perso.required ? 'required' : ''} autocomplete="off">
                  <div class="hint"><span>Check the spelling. We engrave exactly what you type.</span><span class="counter" id="perso-count">0/${perso.maxLength || 30}</span></div>
                  <div class="engrave-preview" id="engrave-preview" data-empty="Your text will appear here" aria-hidden="true"></div>
                </div>` : ''}
              <div class="buy-row">
                <div class="qty">
                  <button type="button" data-q="-1" aria-label="Decrease quantity">${icon('minus')}</button>
                  <input type="number" id="qty" value="1" min="1" max="99" aria-label="Quantity">
                  <button type="button" data-q="1" aria-label="Increase quantity">${icon('plus')}</button>
                </div>
                <button type="submit" class="btn">${icon('bag')} Add to cart</button>
              </div>
              ${hasWhatsApp() ? `<a class="btn btn-whatsapp btn-block" id="wa-direct" href="#" target="_blank" rel="noopener">${icon('chat')} Order this on WhatsApp</a>` : ''}
              ${hasInstagram() ? `<p class="ask-line">${icon('insta')} Questions about this piece? <a href="${esc(instagramDM())}" target="_blank" rel="noopener">Message us on Instagram</a></p>` : ''}
            </form>
            <ul class="assurances">
              <li>${icon('clock')}<span><b>Made to order.</b> Ready in ${esc(p.leadTime || 'a few working days')}.</span></li>
              ${perso ? `<li>${icon('eye')}<span><b>Proof before cutting.</b> For personalized pieces we can send you a preview of the layout first.</span></li>` : ''}
              <li>${icon('truck')}<span><b>Delivery.</b> ${esc(C.deliveryArea || '')}${C.freeDeliveryFrom ? ` Free on orders from ${money(C.freeDeliveryFrom)}.` : ''}</span></li>
            </ul>
            <div class="accordion">
              <details open><summary>Description ${icon('plus')}</summary><div class="acc-body">${[].concat(p.description || []).map((d) => `<p>${esc(d)}</p>`).join('')}</div></details>
              <details><summary>Specifications ${icon('plus')}</summary><div class="acc-body">
                <table class="spec-table"><tbody>${Object.entries(p.specs || {}).map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}<tr><th scope="row">Lead time</th><td>${esc(p.leadTime || '')}</td></tr></tbody></table>
              </div></details>
              <details><summary>Care &amp; delivery ${icon('plus')}</summary><div class="acc-body">
                <p>Wood is a natural material, so grain and colour vary a little from piece to piece. Keep it dry and dust it with a soft cloth.</p>
                <p>${esc(C.deliveryArea || '')} ${C.allowPickup ? 'You can also pick up from the workshop for free.' : ''}</p>
              </div></details>
            </div>
          </div>
        </div>
        <section class="section" style="padding-top:0" aria-labelledby="related-title">
          <div class="section-head"><div><span class="eyebrow">More ${esc(cat ? cat.name : '')}</span><h2 id="related-title">You may also like</h2></div>
          <a class="text-link" href="${link('shop.html', cat ? { category: cat.id } : {})}">See all ${esc(cat ? cat.name : '')} ${icon('arrow')}</a></div>
          <div class="product-grid" id="related"></div>
        </section>
      </div>`;

    const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id);
    const fill = PRODUCTS.filter((x) => x.featured && x.category !== p.category && x.id !== p.id);
    $('#related').innerHTML = related.concat(fill).slice(0, 4).map(productCard).join('');

    // gallery
    root.addEventListener('click', (e) => {
      const t = e.target.closest('[data-img]');
      if (!t) return;
      $('#main-img').src = t.dataset.img;
      $$('[data-img]', root).forEach((b) => b.setAttribute('aria-current', String(b === t)));
    });

    const form = $('#buy-form');
    const qty = $('#qty');
    const textEl = $('#perso-text');
    const chosen = () => {
      const opts = {};
      $$('input[type=radio]:checked', form).forEach((r) => { opts[r.dataset.opt] = r.value; });
      return opts;
    };
    function refresh() {
      const opts = chosen();
      $$('input[type=radio]:checked', form).forEach((r) => { $(`[data-chosen="${r.dataset.idx}"]`).textContent = r.value; });
      const q = Math.max(1, Math.min(99, parseInt(qty.value, 10) || 1));
      $('#price').textContent = money(unitPrice(p, opts) * q);
      if (textEl) {
        $('#perso-count').textContent = `${textEl.value.length}/${perso.maxLength || 30}`;
        $('#engrave-preview').textContent = textEl.value;
      }
      const wa = $('#wa-direct');
      if (wa) {
        const lines = [`Hi ${C.storeName}! I would like to order:`, `${q} × ${p.name} (${money(unitPrice(p, opts))} each)`];
        optionText(p, opts).forEach((o) => lines.push(`- ${o}`));
        if (textEl && textEl.value.trim()) lines.push(`- Engraving: "${textEl.value.trim()}"`);
        lines.push('', 'Is it available?');
        wa.href = whatsappLink(lines.join('\n'));
      }
    }
    form.addEventListener('change', refresh);
    form.addEventListener('input', refresh);
    $$('[data-q]', form).forEach((b) => b.addEventListener('click', () => {
      qty.value = Math.max(1, Math.min(99, (parseInt(qty.value, 10) || 1) + Number(b.dataset.q)));
      refresh();
    }));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (textEl && !textEl.checkValidity()) {
        textEl.reportValidity();
        textEl.focus();
        return;
      }
      cart.add(p.id, Math.max(1, Math.min(99, parseInt(qty.value, 10) || 1)), chosen(), textEl ? textEl.value : '');
      openLayer($('#cart-drawer'));
    });
    const wa = $('#wa-direct');
    if (wa) wa.addEventListener('click', (e) => {
      if (textEl && !textEl.checkValidity()) { e.preventDefault(); textEl.reportValidity(); textEl.focus(); }
    });
    refresh();

    // structured data for search engines
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.name,
      description: p.summary,
      image: p.images.map((src) => new URL(src, location.href).href),
      brand: { '@type': 'Brand', name: C.storeName },
      category: cat ? cat.name : undefined,
      offers: { '@type': 'Offer', price: p.price, priceCurrency: C.currency, availability: 'https://schema.org/InStock', url: location.href },
    });
    document.head.appendChild(ld);
  }

  function orderNumber() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `MW-${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  function pageCart() {
    const root = $('#cart');

    function render() {
      const lines = cart.lines();
      if (!lines.length) {
        const last = storage.get(LAST_ORDER_KEY, null);
        root.innerHTML = `<div class="wrap"><div class="empty" style="margin-block:56px">
          <h2>Your cart is empty</h2>
          <p>Choose a piece from the shop, or tell us about something you'd like us to make.</p>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap"><a class="btn" href="shop.html">Browse the shop</a><a class="btn btn-ghost" href="custom.html">Request a custom piece</a></div>
          ${last && last.items && last.items.length ? `<p style="margin-top:24px"><button type="button" class="link-btn" id="restore-last">Restore the items from order ${esc(last.number)}</button></p>` : ''}
        </div></div>`;
        const r = $('#restore-last');
        if (r) r.addEventListener('click', () => { cart.items = sanitize(last.items); cart.save(); });
        return;
      }
      const draft = storage.get('makerwood-checkout-draft', {});
      root.innerHTML = `
        <div class="wrap cart-layout">
          <section aria-labelledby="items-title">
            <h2 id="items-title" class="visually-hidden">Items</h2>
            <div class="cart-lines">
              ${lines.map((l) => `
                <div class="cart-line">
                  <a href="${link('product.html', { id: l.id })}"><img src="${esc(l.product.images[0])}" alt="${esc(l.product.name)}" loading="lazy"></a>
                  <div>
                    <h3><a href="${link('product.html', { id: l.id })}">${esc(l.product.name)}</a></h3>
                    <div class="meta">
                      ${optionText(l.product, l.options).map((o) => `<span>${esc(o)}</span>`).join('')}
                      ${l.text ? `<span>Engraving: <q>${esc(l.text)}</q></span>` : ''}
                      <span>${money(l.unit)} each</span>
                    </div>
                    <div class="line-actions">
                      <div class="qty sm">
                        <button type="button" data-step="-1" data-key="${esc(l.key)}" aria-label="Decrease quantity">${icon('minus')}</button>
                        <input type="number" value="${l.qty}" min="1" max="99" data-qty="${esc(l.key)}" aria-label="Quantity for ${esc(l.product.name)}">
                        <button type="button" data-step="1" data-key="${esc(l.key)}" aria-label="Increase quantity">${icon('plus')}</button>
                      </div>
                      <button type="button" class="link-btn" data-remove="${esc(l.key)}">Remove</button>
                    </div>
                  </div>
                  <div class="line-total">${money(l.total)}</div>
                </div>`).join('')}
            </div>
            <p style="margin-top:22px"><a class="text-link" href="shop.html">Continue shopping ${icon('arrow')}</a></p>
          </section>

          <aside class="checkout" aria-labelledby="checkout-title">
            <div class="panel">
              <h2 id="checkout-title" style="font-size:1.5rem">Order summary</h2>
              <div class="totals" id="totals" style="margin-top:18px"></div>
            </div>
            <form class="panel" id="checkout-form" style="display:grid;gap:18px">
              <h2 style="font-size:1.25rem">Your details</h2>
              <div class="form-grid">
                <div class="field full"><label for="c-name">Full name <span class="req">*</span></label><input id="c-name" name="name" required autocomplete="name" value="${esc(draft.name || '')}"></div>
                <div class="field"><label for="c-phone">Phone / WhatsApp <span class="req">*</span></label><input id="c-phone" name="phone" type="tel" required autocomplete="tel" inputmode="tel" value="${esc(draft.phone || '')}"></div>
                <div class="field"><label for="c-email">Email</label><input id="c-email" name="email" type="email" autocomplete="email" value="${esc(draft.email || '')}"></div>
              </div>
              <fieldset class="opt-group">
                <legend>Delivery</legend>
                <div class="radio-cards">
                  <label class="radio-card"><input type="radio" name="method" value="delivery" id="m-delivery" ${draft.method !== 'pickup' ? 'checked' : ''}><span>Home delivery<small>${esc(C.deliveryArea || '')}</small></span></label>
                  ${C.allowPickup ? `<label class="radio-card"><input type="radio" name="method" value="pickup" id="m-pickup" ${draft.method === 'pickup' ? 'checked' : ''}><span>${esc(C.pickupLabel || 'Pick up')}<small>We'll message you when it's ready.</small></span></label>` : ''}
                </div>
              </fieldset>
              <div class="form-grid" id="address-fields">
                <div class="field"><label for="c-city">Town / area <span class="req">*</span></label><input id="c-city" name="city" required autocomplete="address-level2" value="${esc(draft.city || '')}"></div>
                <div class="field"><label for="c-address">Street, building, floor <span class="req">*</span></label><input id="c-address" name="address" required autocomplete="street-address" value="${esc(draft.address || '')}"></div>
              </div>
              <fieldset class="opt-group">
                <legend>Payment</legend>
                <div class="radio-cards">
                  ${(C.paymentMethods || []).map((m, i) => `<label class="radio-card"><input type="radio" name="payment" id="pay-${i}" value="${esc(m)}" ${(draft.payment ? draft.payment === m : i === 0) ? 'checked' : ''}><span>${esc(m)}</span></label>`).join('')}
                </div>
              </fieldset>
              <div class="field"><label for="c-notes">Notes, gift message or needed-by date</label><textarea id="c-notes" name="notes" rows="3">${esc(draft.notes || '')}</textarea></div>
              ${configWarning()}
              <div class="send-row">${sendButtons('order', true)}</div>
              <p class="form-note">Nothing is charged online. We reply to confirm your order, the engraving and the delivery date, then you pay by ${esc((C.paymentMethods || []).join(' or ').toLowerCase())}.</p>
            </form>
          </aside>
        </div>`;

      const form = $('#checkout-form');
      const updateTotals = () => {
        const method = (form.querySelector('input[name=method]:checked') || {}).value || 'delivery';
        const sub = cart.subtotal();
        const fee = deliveryFee(sub, method);
        const left = C.freeDeliveryFrom ? C.freeDeliveryFrom - sub : 0;
        $('#totals').innerHTML = `
          <div><span>Subtotal (${cart.count()} item${cart.count() === 1 ? '' : 's'})</span><span>${money(sub)}</span></div>
          <div><span>${method === 'pickup' ? 'Pick-up' : 'Delivery'}</span><span>${fee ? money(fee) : 'Free'}</span></div>
          ${method !== 'pickup' && C.freeDeliveryFrom ? `<div class="free-bar" style="display:block">${left > 0 ? `Add <b>${money(left)}</b> more for free delivery` : 'Free delivery unlocked'}<div class="track"><div class="fill" style="width:${Math.min(100, (sub / C.freeDeliveryFrom) * 100)}%"></div></div></div>` : ''}
          <div class="grand"><span>Total</span><span>${money(sub + fee)}</span></div>`;
        const pickup = method === 'pickup';
        $('#address-fields').hidden = pickup;
        $$('#address-fields input').forEach((i) => { i.required = !pickup; });
      };
      updateTotals();

      const saveDraft = () => {
        const data = Object.fromEntries(new FormData(form).entries());
        storage.set('makerwood-checkout-draft', data);
      };
      form.addEventListener('input', saveDraft);
      form.addEventListener('change', () => { saveDraft(); updateTotals(); });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        const via = (e.submitter && e.submitter.dataset.via) || '';
        const data = Object.fromEntries(new FormData(form).entries());
        placeOrder(data, via);
      });
    }

    root.addEventListener('click', (e) => {
      const rm = e.target.closest('[data-remove]');
      if (rm) { cart.remove(rm.dataset.remove); return; }
      const step = e.target.closest('[data-step]');
      if (step && root.contains(step)) {
        const it = cart.items.find((i) => i.key === step.dataset.key);
        if (it) cart.setQty(it.key, it.qty + Number(step.dataset.step));
      }
    });
    root.addEventListener('change', (e) => {
      const q = e.target.closest('[data-qty]');
      if (q) cart.setQty(q.dataset.qty, parseInt(q.value, 10));
    });

    let confirmed = false;
    cartListeners.push(() => { if (!confirmed) render(); });
    render();

    function placeOrder(data, via) {
      const number = orderNumber();
      const lines = cart.lines();
      const sub = cart.subtotal();
      const fee = deliveryFee(sub, data.method);
      const msg = [];
      msg.push(`New order ${number}`, '');
      lines.forEach((l) => {
        msg.push(`${l.qty} × ${l.product.name} (${money(l.unit)} each) = ${money(l.total)}`);
        optionText(l.product, l.options).forEach((o) => msg.push(`   - ${o}`));
        if (l.text) msg.push(`   - Engraving: "${l.text}"`);
      });
      msg.push('', `Subtotal: ${money(sub)}`, `${data.method === 'pickup' ? 'Pick-up' : 'Delivery'}: ${fee ? money(fee) : 'Free'}`, `Total: ${money(sub + fee)}`, '');
      msg.push(`Name: ${data.name}`, `Phone: ${data.phone}`);
      if (data.email) msg.push(`Email: ${data.email}`);
      msg.push(data.method === 'pickup' ? `Delivery: ${C.pickupLabel || 'Pick up'}` : `Address: ${data.address}, ${data.city}`);
      msg.push(`Payment: ${data.payment || ''}`);
      if (data.notes) msg.push(`Notes: ${data.notes}`);
      const text = msg.join('\n');
      const subject = `Order ${number} · ${C.storeName}`;

      storage.set(LAST_ORDER_KEY, { number, items: cart.items, text });
      const sent = send(via, text, subject);
      const c = sent.channel;
      confirmed = true;
      cart.clear();

      const where = c.id === 'email' ? 'your email app' : c.name;
      const others = channels().filter((x) => x.id !== c.id);
      root.innerHTML = `
        <div class="wrap confirm">
          <div class="seal">${icon('check')}</div>
          <h1 style="font-size:clamp(2rem,1.5rem + 2vw,2.8rem)">One last step</h1>
          <span class="order-no">${esc(number)}</span>
          ${c.prefilled
            ? `<p>Your order is written out in ${where}. <b>Press send</b> there and we'll reply to confirm the details, the engraving and your delivery date.</p>
               <p class="muted">If ${where} didn't open, use the button below, or copy the order and send it to us another way.</p>`
            : `<p>We copied your order. In the Instagram chat with <b>@${esc(igHandle())}</b>, <b>paste it and press send</b>. We'll reply to confirm the details, the engraving and your delivery date.</p>
               <p class="muted">If the chat didn't open, use the button below. If there's nothing to paste, press Copy order first.</p>`}
          <div class="actions">
            <a class="btn ${c.cls}" href="${esc(sent.href)}" ${external(c)} ${c.prefilled ? '' : 'data-copy'}>${icon(c.icon)} Open ${c.id === 'email' ? 'email' : c.name + (c.prefilled ? '' : ' chat')} again</a>
            <button type="button" class="btn btn-ghost" id="copy-order">${icon('copy')} Copy order</button>
            ${others.map((o) => `<a class="btn btn-ghost" href="${esc(o.link(text, subject))}" ${external(o)} ${o.prefilled ? '' : 'data-copy'}>${icon(o.icon)} Send ${o.id === 'email' ? 'by email' : 'on ' + o.name} instead</a>`).join('')}
          </div>
          <details class="accordion" style="text-align:left;margin-top:32px"><summary>Order details ${icon('plus')}</summary><div class="acc-body"><pre style="white-space:pre-wrap;font-family:var(--font-mono);font-size:.85rem;margin:0" id="order-text">${esc(text)}</pre></div></details>
          <p style="margin-top:28px"><button type="button" class="link-btn" id="undo-order">I didn't send it, put the items back in my cart</button></p>
        </div>`;
      $$('[data-copy]', root).forEach((a) => a.addEventListener('click', () => { copyText(text); }));
      window.scrollTo(0, 0);
      $('#copy-order').addEventListener('click', (e) => {
        const btn = e.currentTarget;
        copyText(text).then((ok) => {
          if (ok) btn.innerHTML = `${icon('check')} Copied`;
          else selectText($('#order-text'));
        });
      });
      $('#undo-order').addEventListener('click', () => {
        const last = storage.get(LAST_ORDER_KEY, null);
        confirmed = false;
        cart.items = sanitize(last ? last.items : []);
        cart.save();
      });
    }
  }

  function selectText(el) {
    const d = el.closest('details');
    if (d) d.open = true;
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function pageCustom() {
    const form = $('#custom-form');
    if (!form) return;
    const actions = $('#custom-actions');
    actions.innerHTML = `${configWarning()}${sendButtons('request', false)}`;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const via = (e.submitter && e.submitter.dataset.via) || '';
      const d = Object.fromEntries(new FormData(form).entries());
      const rows = [
        `Custom order request · ${C.storeName}`, '',
        `Name: ${d.name}`, `Phone: ${d.phone}`, d.email ? `Email: ${d.email}` : null,
        `Type: ${d.type}`, d.quantity ? `Quantity: ${d.quantity}` : null, d.size ? `Size: ${d.size}` : null,
        d.material ? `Material: ${d.material}` : null, d.budget ? `Budget: ${d.budget}` : null, d.date ? `Needed by: ${d.date}` : null,
        '', 'Idea:', d.idea, '', 'I can send a sketch, logo or photo in the next message.',
      ].filter((r) => r !== null);
      const text = rows.join('\n');
      const sent = send(via, text, `Custom order request · ${d.name}`);
      const c = sent.channel;
      const done = $('#custom-done');
      done.hidden = false;
      done.innerHTML = `<div class="panel" style="display:grid;gap:10px"><h2 style="font-size:1.3rem">Your request is ready to send</h2>
        <p class="muted">${c.prefilled
          ? `Press send in ${c.id === 'email' ? 'your email app' : c.name}.`
          : `We copied your request. Paste it in the Instagram chat with <b>@${esc(igHandle())}</b> and press send.`}
        If it didn't open, <a href="${esc(sent.href)}" ${external(c)} ${c.prefilled ? '' : 'data-copy'}>open it here</a>. We usually reply within one working day with questions or a quote.</p></div>`;
      $$('[data-copy]', done).forEach((a) => a.addEventListener('click', () => { copyText(text); }));
      done.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  function pageAbout() {
    const cards = $('#contact-cards');
    if (cards) {
      const list = [];
      if (hasWhatsApp()) list.push(`<a class="contact-card" href="${whatsappLink('')}" target="_blank" rel="noopener">${icon('chat')}<strong>WhatsApp</strong><span>${esc(C.phoneDisplay || 'Message us for orders and questions')}</span></a>`);
      if (hasEmail()) list.push(`<a class="contact-card" href="mailto:${esc(C.email)}">${icon('mail')}<strong>Email</strong><span>${esc(C.email)}</span></a>`);
      if (hasInstagram()) list.push(`<a class="contact-card" href="${esc(instagramProfile())}" target="_blank" rel="noopener">${icon('insta')}<strong>Instagram</strong><span>@${esc(igHandle())} · follow our latest pieces or send us a message</span></a>`);
      list.push(`<div class="contact-card">${icon('pin')}<strong>Workshop</strong><span>${esc(C.location || '')}${C.hours ? '<br>' + esc(C.hours) : ''}</span></div>`);
      cards.innerHTML = list.join('');
    }
    const fill = (id, value) => { const el = $(id); if (el) el.textContent = value; };
    fill('#faq-delivery', `${C.deliveryArea || ''} Delivery costs ${money(C.deliveryFee || 0)}${C.freeDeliveryFrom ? ` and is free on orders from ${money(C.freeDeliveryFrom)}` : ''}.${C.allowPickup ? ' You can also pick up from the workshop for free.' : ''}`);
    fill('#faq-payment', `You can pay by ${(C.paymentMethods || []).join(' or ').toLowerCase()}. Nothing is charged on the website: we confirm your order first, then you pay.`);
  }

  /* ---------------- Boot ---------------- */
  renderChrome();
  const pages = { home: pageHome, shop: pageShop, product: pageProduct, cart: pageCart, custom: pageCustom, about: pageAbout };
  if (pages[PAGE]) pages[PAGE]();

  // A floating WhatsApp shortcut once a number is configured
  if ((hasWhatsApp() || hasInstagram()) && PAGE !== 'cart') {
    const wa = hasWhatsApp();
    const fab = document.createElement('a');
    fab.className = wa ? 'wa-float' : 'wa-float ig';
    fab.href = wa ? whatsappLink(`Hi ${C.storeName}!`) : instagramDM();
    fab.target = '_blank';
    fab.rel = 'noopener';
    fab.setAttribute('aria-label', wa ? 'Chat with us on WhatsApp' : 'Message us on Instagram');
    fab.innerHTML = icon(wa ? 'chat' : 'insta');
    document.body.appendChild(fab);
  }

  // Deep links to an accordion (e.g. about.html#faq) open it
  if (location.hash && /^#[\w-]+$/.test(location.hash)) {
    const target = document.getElementById(location.hash.slice(1));
    if (target && target.tagName === 'DETAILS') target.open = true;
  }
})();
