const STORAGE_KEYS = {
  cart: 'cart',
  wishlist: 'wishlist',
  user: 'user'
};

const SHOP_PRODUCTS = [
  { id: 1, name: 'Floral Printed Kurti', brand: 'Sangria', category: 'Women', price: 999, originalPrice: 1399, rating: 4, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80', collection: 'trending' },
  { id: 2, name: 'Slim Fit Jeans', brand: 'DNMX', category: 'Men', price: 1299, originalPrice: 1699, rating: 5, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80', collection: 'trending' },
  { id: 3, name: 'Matte Lipstick', brand: 'Lakme', category: 'Beauty', price: 499, originalPrice: 699, rating: 5, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=80', collection: 'trending' },
  { id: 4, name: 'Cookware Set', brand: 'Wonderchef', category: 'Home & Kitchen', price: 2499, originalPrice: 2999, rating: 4, image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=900&q=80', collection: 'new' },
  { id: 5, name: 'Fit & Flare Dress', brand: 'Kazo', category: 'Women', price: 1499, originalPrice: 1999, rating: 5, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80', collection: 'trending' },
  { id: 6, name: 'Leather Jacket', brand: 'RIO', category: 'Men', price: 2999, originalPrice: 3599, rating: 4, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80', collection: 'best' },
  { id: 7, name: 'Stylish Sneakers', brand: 'Netplay', category: 'Men', price: 1999, originalPrice: 2499, rating: 5, image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80', collection: 'best' },
  { id: 8, name: 'High-Waist Jeans', brand: 'DNMX', category: 'Women', price: 1199, originalPrice: 1599, rating: 3, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80', collection: 'trending' },
  { id: 9, name: 'Hydrating Face Cream', brand: 'Nivea', category: 'Beauty', price: 699, originalPrice: 899, rating: 4, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80', collection: 'new' },
  { id: 10, name: 'Rose Perfume', brand: 'Bella Vita', category: 'Beauty', price: 1299, originalPrice: 1599, rating: 3, image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80', collection: 'best' },
  { id: 11, name: 'Floral Frock', brand: 'Mini Club', category: 'Kids', price: 799, originalPrice: 1099, rating: 3, image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=80', collection: 'new' },
  { id: 12, name: 'Decorative Lamp', brand: 'Home Centre', category: 'Home & Kitchen', price: 799, originalPrice: 1099, rating: 5, image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80', collection: 'new' }
];

const getJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const setJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getCart = () => getJson(STORAGE_KEYS.cart, []);
const getWishlist = () => getJson(STORAGE_KEYS.wishlist, []);

const getQuantityTotal = (items) => items.reduce((total, item) => total + (item.quantity || 1), 0);

const getDiscountPercent = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= price) {
    return 0;
  }

  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

const renderStars = (rating) => {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return '★★★★★'.slice(0, filled) + '☆☆☆☆☆'.slice(0, 5 - filled);
};

const updateCartCount = () => {
  const cartCountElement = document.getElementById('cart-count');
  if (!cartCountElement) {
    return;
  }

  cartCountElement.textContent = getQuantityTotal(getCart());
};

const updateWishlistCount = () => {
  const wishlistCountElement = document.getElementById('wishlist-count');
  if (!wishlistCountElement) {
    return;
  }

  wishlistCountElement.textContent = getWishlist().length;
};

const updateCounters = () => {
  updateCartCount();
  updateWishlistCount();
};

const saveCartItem = (product) => {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  setJson(STORAGE_KEYS.cart, cart);
  updateCounters();
};

const toggleWishlistItem = (product) => {
  const wishlist = getWishlist();
  const index = wishlist.findIndex((item) => item.id === product.id);

  if (index >= 0) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(product);
  }

  setJson(STORAGE_KEYS.wishlist, wishlist);
  updateCounters();
  syncWishlistButtons();
};

const isWishlisted = (productId) => getWishlist().some((item) => item.id === productId);

const createProductCard = (product) => {
  const discountPercent = getDiscountPercent(product.price, product.originalPrice);
  const card = document.createElement('article');
  card.className = 'product-card fade-in';
  card.dataset.brand = product.brand.toLowerCase();
  card.dataset.category = product.category.toLowerCase();
  card.dataset.price = String(product.price);
  card.dataset.originalPrice = String(product.originalPrice);
  card.dataset.rating = String(product.rating);
  card.dataset.name = product.name.toLowerCase();

  card.innerHTML = `
    <div class="product-media relative">
      <button type="button" class="wishlist-button ${isWishlisted(product.id) ? 'is-active' : ''}" data-wishlist data-id="${product.id}" aria-label="Toggle wishlist for ${product.name}">♥</button>
      <img src="${product.image}" alt="${product.name}" class="product-image w-full h-56 object-cover" loading="lazy">
      ${discountPercent > 0 ? `<span class="absolute left-4 top-4 discount-badge">-${discountPercent}%</span>` : ''}
    </div>
    <div class="p-4 space-y-2">
      <p class="text-xs uppercase tracking-[0.2em] text-gray-500">${product.brand}</p>
      <h3 class="text-lg font-semibold text-gray-900 leading-tight">${product.name}</h3>
      <div class="flex items-center gap-2 text-sm">
        <span class="text-amber-500">${renderStars(product.rating)}</span>
        <span class="text-gray-500">${product.rating.toFixed(1)}</span>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <span class="text-lg font-semibold text-gray-900">₹${product.price}</span>
        <span class="price-old">₹${product.originalPrice}</span>
      </div>
      <p class="text-sm text-gray-500">${product.category}</p>
      <button type="button" class="primary-button w-full bg-blue-600 text-white px-4 py-2 rounded-lg add-to-cart" data-id="${product.id}" data-name="${product.name}" data-brand="${product.brand}" data-category="${product.category}" data-price="${product.price}" data-original-price="${product.originalPrice}" data-rating="${product.rating}" data-image="${product.image}">Add to Cart</button>
    </div>
  `;

  return card;
};

const renderProductGrid = (containerId, products) => {
  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }

  container.innerHTML = '';
  products.forEach((product) => container.appendChild(createProductCard(product)));
};

const getFilteredProducts = () => {
  const searchValue = document.getElementById('global-search')?.value.trim().toLowerCase() ?? '';
  const brandValue = document.getElementById('brand-filter')?.value ?? 'all';
  const categoryValue = document.getElementById('category-filter')?.value ?? 'all';
  const priceValue = document.getElementById('price-filter')?.value ?? 'all';
  const sortValue = document.getElementById('sort-filter')?.value ?? 'featured';

  let filteredProducts = SHOP_PRODUCTS.filter((product) => {
    const matchesSearch = !searchValue || product.name.toLowerCase().includes(searchValue) || product.brand.toLowerCase().includes(searchValue);
    const matchesBrand = brandValue === 'all' || product.brand.toLowerCase() === brandValue;
    const matchesCategory = categoryValue === 'all' || product.category.toLowerCase() === categoryValue;
    const matchesPrice =
      priceValue === 'all' ||
      (priceValue === 'under-1000' && product.price < 1000) ||
      (priceValue === '1000-2000' && product.price >= 1000 && product.price <= 2000) ||
      (priceValue === 'above-2000' && product.price > 2000);

    return matchesSearch && matchesBrand && matchesCategory && matchesPrice;
  });

  switch (sortValue) {
    case 'price-low':
      filteredProducts.sort((left, right) => left.price - right.price);
      break;
    case 'price-high':
      filteredProducts.sort((left, right) => right.price - left.price);
      break;
    case 'name-asc':
      filteredProducts.sort((left, right) => left.name.localeCompare(right.name));
      break;
    case 'name-desc':
      filteredProducts.sort((left, right) => right.name.localeCompare(left.name));
      break;
    case 'rating':
      filteredProducts.sort((left, right) => right.rating - left.rating);
      break;
    default:
      break;
  }

  return filteredProducts;
};

const updateNoResultsState = (hasResults) => {
  const emptyState = document.getElementById('products-empty');
  if (!emptyState) {
    return;
  }

  emptyState.style.display = hasResults ? 'none' : 'block';
};

const applyHomepageFilters = () => {
  const trendingContainer = document.getElementById('trending-products');
  if (!trendingContainer) {
    return;
  }

  const filteredProducts = getFilteredProducts();
  trendingContainer.innerHTML = '';

  if (!filteredProducts.length) {
    updateNoResultsState(false);
    return;
  }

  updateNoResultsState(true);
  filteredProducts.forEach((product) => trendingContainer.appendChild(createProductCard(product)));
}

const syncWishlistButtons = () => {
  document.querySelectorAll('[data-wishlist]').forEach((button) => {
    const productId = Number(button.dataset.id);
    button.classList.toggle('is-active', isWishlisted(productId));
  });
};

const highlightActiveNav = () => {
  const currentPath = window.location.pathname.split('/').pop().toLowerCase() || 'onlineshop.html';

  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = (link.getAttribute('href') || '').split('/').pop().toLowerCase();
    const isActive = href === currentPath || (currentPath === '' && href === 'onlineshop.html');
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

const setupMobileMenu = () => {
  const toggleButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!toggleButton || !mobileMenu) {
    return;
  }

  toggleButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
};

const setupSearchAndFilters = () => {
  const filterIds = ['global-search', 'brand-filter', 'category-filter', 'price-filter', 'sort-filter'];
  const hasHomepageFilters = filterIds.some((id) => document.getElementById(id));

  if (!hasHomepageFilters) {
    return;
  }

  filterIds.forEach((id) => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }

    const eventName = element.tagName === 'SELECT' ? 'change' : 'input';
    element.addEventListener(eventName, applyHomepageFilters);
  });

  applyHomepageFilters();
};

const renderHomepageSections = () => {
  if (!document.getElementById('trending-products')) {
    return;
  }

  renderProductGrid('new-arrivals', SHOP_PRODUCTS.filter((product) => product.collection === 'new'));
  renderProductGrid('best-sellers', SHOP_PRODUCTS.filter((product) => product.collection === 'best'));
  applyHomepageFilters();
};

const setupProductActions = () => {
  document.addEventListener('click', (event) => {
    const addToCartButton = event.target.closest('.add-to-cart');
    if (addToCartButton) {
      const product = {
        id: Number(addToCartButton.dataset.id),
        name: addToCartButton.dataset.name,
        brand: addToCartButton.dataset.brand,
        category: addToCartButton.dataset.category,
        price: Number(addToCartButton.dataset.price),
        originalPrice: Number(addToCartButton.dataset.originalPrice),
        rating: Number(addToCartButton.dataset.rating),
        image: addToCartButton.dataset.image
      };

      saveCartItem(product);
      alert(`${product.name} added to cart!`);
      return;
    }

    const wishlistButton = event.target.closest('[data-wishlist]');
    if (wishlistButton) {
      const productId = Number(wishlistButton.dataset.id);
      const product = SHOP_PRODUCTS.find((item) => item.id === productId);

      if (product) {
        toggleWishlistItem(product);
      }
    }
  });
};

const showLoggedInUser = () => {
  const userBanner = document.getElementById('welcome-banner');
  if (!userBanner) {
    return;
  }

  const storedUser = getJson(STORAGE_KEYS.user, null);
  if (!storedUser || !storedUser.name) {
    return;
  }

  userBanner.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 pt-4">
      <div class="section-shell rounded-2xl px-4 py-3 text-sm text-gray-700">
        Welcome back, <strong>${storedUser.name}</strong>.
      </div>
    </div>
  `;
};

const injectLegacyPageEnhancements = () => {
  const pathname = window.location.pathname.split('/').pop().toLowerCase();
  const legacyCategoryPages = ['men.html', 'women.html', 'kids.html', 'beauty.html', 'home_&_kitchen.html'];

  if (!legacyCategoryPages.includes(pathname)) {
    return;
  }

  const pageHeader = document.querySelector('header');
  if (pageHeader) {
    pageHeader.classList.add('site-header', 'bg-white/95', 'shadow-sm');
    const headerInner = pageHeader.firstElementChild;
    if (headerInner) {
      headerInner.classList.add('site-header-inner');
    }

    pageHeader.querySelectorAll('nav a').forEach((link) => {
      link.classList.add('nav-link');
    });
  }

  if (!document.querySelector('.legacy-page-cta') && document.body) {
    const ctaSection = document.createElement('section');
    ctaSection.className = 'legacy-page-cta max-w-7xl mx-auto px-4 py-6';
    ctaSection.innerHTML = `
      <div class="section-shell rounded-3xl p-5 sm:p-6 lg:p-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Call to Action</p>
          <h2 class="mt-2 text-2xl font-bold text-gray-900">Need help choosing products or tracking an order?</h2>
          <p class="mt-2 text-sm text-gray-600">Use the contact page for support, feedback, and shopping questions.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <a href="contact.html" class="primary-button rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white">Contact Us</a>
          <a href="onlineshop.html" class="secondary-button rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700">Back to Home</a>
        </div>
      </div>
    `;

    const firstMain = document.querySelector('main');
    if (firstMain && firstMain.parentElement) {
      firstMain.parentElement.insertBefore(ctaSection, firstMain);
    } else {
      document.body.appendChild(ctaSection);
    }
  }

  if (!document.querySelector('footer') && document.body) {
    const footer = document.createElement('footer');
    footer.className = 'mt-10 bg-gray-900 text-gray-200';
    footer.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 py-12 sm:py-14">
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src="https://assets.ajio.com/static/img/Ajio-Logo.svg" alt="Ajio Logo" class="h-8 brightness-0 invert" loading="lazy">
            <p class="mt-4 text-sm leading-6 text-gray-400">ShopAjio brings fashion, beauty, and home essentials together in a cleaner, faster browsing experience.</p>
          </div>
          <div>
            <h3 class="text-sm font-semibold uppercase tracking-[0.2em] text-white">About</h3>
            <ul class="mt-4 space-y-3 text-sm text-gray-400">
              <li><a class="footer-link" href="#">Who We Are</a></li>
              <li><a class="footer-link" href="#">Careers</a></li>
              <li><a class="footer-link" href="#">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-sm font-semibold uppercase tracking-[0.2em] text-white">Help</h3>
            <ul class="mt-4 space-y-3 text-sm text-gray-400">
              <li><a class="footer-link" href="contact.html">Contact</a></li>
              <li><a class="footer-link" href="#">Terms & Conditions</a></li>
              <li><a class="footer-link" href="#">Shipping & Returns</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-sm font-semibold uppercase tracking-[0.2em] text-white">Social</h3>
            <ul class="mt-4 space-y-3 text-sm text-gray-400">
              <li><a class="footer-link" href="#">Instagram</a></li>
              <li><a class="footer-link" href="#">Facebook</a></li>
              <li><a class="footer-link" href="#">YouTube</a></li>
            </ul>
          </div>
        </div>
        <div class="mt-10 border-t border-white/10 pt-6 text-sm text-gray-500">© 2026 ShopAjio. All rights reserved.</div>
      </div>
    `;
    document.body.appendChild(footer);
  }
};

const initHomepage = () => {
  const hasHomepageLayout = Boolean(document.getElementById('trending-products'));
  if (!hasHomepageLayout) {
    return;
  }

  renderHomepageSections();
  setupSearchAndFilters();
  showLoggedInUser();
};

document.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu();
  injectLegacyPageEnhancements();
  highlightActiveNav();
  initHomepage();
  setupProductActions();
  updateCounters();
});
