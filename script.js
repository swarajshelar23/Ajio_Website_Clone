// Mobile Menu Toggle
document.getElementById('mobile-menu-button').addEventListener('click', () => {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('hidden');
});

// Retrieve cart from local storage or initialize as empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to render products
const renderProducts = () => {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';

  // Sample Products
  const products = [
    { id: 1, name: 'Denim Jacket', price: 1999, image: 'https://via.placeholder.com/200' },
    { id: 2, name: 'Sneakers', price: 2499, image: 'https://via.placeholder.com/200' },
    { id: 3, name: 'Sunglasses', price: 899, image: 'https://via.placeholder.com/200' },
    { id: 4, name: 'T-Shirt', price: 499, image: 'https://via.placeholder.com/200' }
  ];

  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'bg-white p-4 rounded shadow';

    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="w-full h-40 object-cover rounded mb-2">
      <h2 class="text-lg font-semibold">${product.name}</h2>
      <p class="text-gray-600">₹${product.price}</p>
      <button class="mt-2 bg-green-500 text-white px-3 py-1 rounded add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">Add to Cart</button>
    `;

    productList.appendChild(productCard);
  });
};

// Function to update cart count
const updateCartCount = () => {
  document.getElementById('cart-count').innerText = cart.length;
};

// Event listener for adding items to the cart
document.addEventListener('click', e => {
  if (e.target.classList.contains('add-to-cart')) {
    const id = parseInt(e.target.dataset.id);
    const name = e.target.dataset.name;
    const price = parseInt(e.target.dataset.price);
    const image = e.target.dataset.image;

    const product = { id, name, price, image };

    if (product) {
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to local storage
      updateCartCount();
      alert(`${product.name} added to cart!`);
    }
  }
});

// Initial render
renderProducts();
updateCartCount(); // Update cart count on load
