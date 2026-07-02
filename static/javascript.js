let products = [];
let currentUser = null;
let cart = JSON.parse(localStorage.getItem("techshop_cart") || "[]");
let currentCategory = "All";

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

function showToast(message, type = "success") {
    const t = $("#toast");
    t.textContent = message;
    t.className = "toast " + type + " show";
    clearTimeout(t._hide);
    t._hide = setTimeout(() => t.classList.remove("show"), 3000);
}

function getCartCount() {
    return cart.reduce((s, i) => s + i.qty, 0);
}

function updateCartUI() {
    localStorage.setItem("techshop_cart", JSON.stringify(cart));
    const badge = $("#cartCount");
    const count = getCartCount();
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? "flex" : "none";
    }
}

function addToCart(productId) {
    const existing = cart.find((i) => i.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id: productId, qty: 1 });
    }
    updateCartUI();
    const p = products.find((x) => x.id === productId);
    showToast(`${p ? p.name.en : "Product"} added to cart!`, "success");
}

function removeFromCart(productId) {
    cart = cart.filter((i) => i.id !== productId);
    updateCartUI();
    renderCart();
}

function updateQty(productId, delta) {
    const item = cart.find((i) => i.id === productId);
    if (item) {
        item.qty = Math.max(1, item.qty + delta);
        updateCartUI();
        renderCart();
    }
}

function navigateTo(hash) {
    window.location.hash = hash || "";
}

const views = ["home", "product", "cart", "checkout", "auth", "about", "discounts", "terms"];

function showView(name) {
    views.forEach((v) => {
        const el = $(`#view-${v}`);
        if (el) el.classList.toggle("active", v === name);
    });
    document.title = name === "home" ? "TechShop" : `TechShop - ${name.charAt(0).toUpperCase() + name.slice(1)}`;
}

async function loadProducts() {
    try {
        const res = await fetch("/api/products");
        products = await res.json();
    } catch (e) {
        console.error("Failed to load products", e);
    }
}

async function checkSession() {
    try {
        const res = await fetch("/api/session");
        const data = await res.json();
        if (data.authenticated) {
            currentUser = { email: data.email };
            updateAuthUI();
        }
    } catch (e) {
        console.error("Session check failed", e);
    }
}

function updateAuthUI() {
    const authBtn = $("#authBtn");
    const userDisplay = $("#userDisplay");
    const logoutBtn = $("#logoutBtn");
    if (currentUser) {
        if (authBtn) authBtn.style.display = "none";
        if (userDisplay) { userDisplay.textContent = currentUser.email; userDisplay.style.display = "inline"; }
        if (logoutBtn) logoutBtn.style.display = "inline";
    } else {
        if (authBtn) authBtn.style.display = "inline";
        if (userDisplay) userDisplay.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "none";
    }
}

// ============= RENDER FUNCTIONS =============

function renderHome(category = "All") {
    const container = $("#productGrid");
    if (!container) return;
    currentCategory = category;

    const filtered = category === "All" ? products : products.filter((p) => p.cat === category);
    const cats = ["All", ...new Set(products.map((p) => p.cat))];

    const catBar = $("#categoryBar");
    if (catBar) {
        catBar.innerHTML = cats.map((c) =>
            `<button class="cat-btn ${c === category ? 'active' : ''}" onclick="renderHome('${c}')">${c}</button>`
        ).join("");
    }

    if (filtered.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-12 text-gray-500"><div class="text-5xl mb-4">🔍</div><p class="text-lg font-semibold">No products found in this category</p></div>`;
        return;
    }

    container.innerHTML = filtered.map((p) => {
        const badgeClass = p.badge ? p.badge.toLowerCase().replace(/\s+/g, "-") : "";
        const stars = "★".repeat(p.stars) + "☆".repeat(5 - p.stars);
        return `<div class="product-card fade-in" onclick="showProduct(${p.id})">
            ${p.badge ? `<span class="badge badge-${badgeClass}">${p.badge}</span>` : ""}
            <div class="product-emoji">${p.emoji}</div>
            <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">${p.cat}</div>
            <h3 class="font-bold text-gray-900 text-sm mb-1 leading-tight">${p.name.en}</h3>
            <div class="flex items-center gap-1 mb-2">
                <span class="star">${stars}</span>
                <span class="text-xs text-gray-400">(${p.reviews.toLocaleString()})</span>
            </div>
            <div class="flex items-center justify-between mt-3">
                <span class="text-lg font-bold text-indigo-600">$${p.price.toLocaleString()}</span>
                <button onclick="event.stopPropagation(); addToCart(${p.id})" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:shadow-lg">Add to Cart</button>
            </div>
        </div>`;
    }).join("");
}

function showProduct(id) {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    navigateTo(`product/${id}`);
    showView("product");
    const container = $("#productDetail");
    if (!container) return;
    const stars = "★".repeat(p.stars) + "☆".repeat(5 - p.stars);
    const specsHtml = p.specs && p.specs.en ? Object.entries(p.specs.en).map(([k, v]) =>
        `<div class="flex justify-between py-3 border-b border-gray-100"><span class="text-gray-500">${k}</span><span class="font-semibold text-gray-900">${v}</span></div>`
    ).join("") : "";
    container.innerHTML = `<div class="max-w-6xl mx-auto">
        <button onclick="navigateTo('')" class="mb-6 text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1">&larr; Back to Store</button>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <div class="detail-emoji">${p.emoji}</div>
                ${p.badge ? `<span class="badge badge-${p.badge.toLowerCase().replace(/\s+/g, "-")} inline-block mt-4">${p.badge}</span>` : ""}
            </div>
            <div>
                <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">${p.cat}</div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">${p.name.en}</h1>
                <p class="text-gray-600 mb-4 leading-relaxed">${p.desc.en}</p>
                <div class="flex items-center gap-2 mb-4">
                    <span class="star text-lg">${stars}</span>
                    <span class="text-gray-500">${p.reviews.toLocaleString()} reviews</span>
                </div>
                <div class="text-3xl font-bold text-indigo-600 mb-6">$${p.price.toLocaleString()}</div>
                <div class="flex gap-3 mb-6">
                    <button onclick="addToCart(${p.id})" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all hover:shadow-lg">Add to Cart</button>
                    <button onclick="addToCart(${p.id}); navigateTo('checkout')" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all hover:shadow-lg">Buy Now</button>
                </div>
                ${specsHtml ? `<div class="mt-6"><h3 class="font-bold text-lg mb-3 text-gray-900">Specifications</h3>${specsHtml}</div>` : ""}
            </div>
        </div>
    </div>`;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderCart() {
    const container = $("#cartContent");
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = `<div class="text-center py-16"><div class="text-6xl mb-4">🛒</div><h2 class="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2><p class="text-gray-500 mb-6">Looks like you haven't added anything yet</p><button onclick="navigateTo('')" class="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700">Start Shopping</button></div>`;
        return;
    }
    let subtotal = 0;
    const itemsHtml = cart.map((item) => {
        const p = products.find((x) => x.id === item.id);
        if (!p) return "";
        const total = p.price * item.qty;
        subtotal += total;
        return `<div class="cart-item fade-in">
            <div class="text-3xl w-12 text-center">${p.emoji}</div>
            <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-gray-900 truncate">${p.name.en}</h4>
                <p class="text-sm text-gray-500">$${p.price.toLocaleString()} each</p>
            </div>
            <div class="flex items-center gap-3">
                <button onclick="updateQty(${p.id}, -1)" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 flex items-center justify-center">−</button>
                <span class="font-bold text-lg w-6 text-center">${item.qty}</span>
                <button onclick="updateQty(${p.id}, 1)" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 flex items-center justify-center">+</button>
            </div>
            <div class="text-right min-w-[80px]">
                <div class="font-bold text-indigo-600">$${total.toLocaleString()}</div>
                <button onclick="removeFromCart(${p.id})" class="text-xs text-red-500 hover:text-red-700 mt-1">Remove</button>
            </div>
        </div>`;
    }).join("");
    container.innerHTML = itemsHtml;
    const summary = $("#cartSummary");
    if (summary) {
        const tax = subtotal * 0.08;
        const total = subtotal + tax;
        summary.innerHTML = `<div class="bg-white rounded-2xl p-6 border border-gray-200 sticky top-24">
            <h3 class="font-bold text-lg mb-4 text-gray-900">Order Summary</h3>
            <div class="space-y-2 text-sm">
                <div class="flex justify-between"><span class="text-gray-500">Subtotal</span><span class="font-semibold">$${subtotal.toLocaleString()}</span></div>
                <div class="flex justify-between"><span class="text-gray-500">Tax (8%)</span><span class="font-semibold">$${tax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
                <div class="border-t pt-2 mt-2 flex justify-between text-lg font-bold"><span>Total</span><span class="text-indigo-600">$${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
            </div>
            <button onclick="navigateTo('checkout')" class="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-all hover:shadow-lg">Proceed to Checkout</button>
        </div>`;
    }
}

function renderCheckout() {
    const container = $("#checkoutContent");
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = `<div class="text-center py-16"><div class="text-6xl mb-4">🛒</div><h2 class="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2><button onclick="navigateTo('')" class="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 mt-4">Start Shopping</button></div>`;
        return;
    }
    let subtotal = 0;
    const itemsList = cart.map((item) => {
        const p = products.find((x) => x.id === item.id);
        if (!p) return "";
        const total = p.price * item.qty;
        subtotal += total;
        return `<div class="flex items-center gap-3 py-2 border-b border-gray-100"><span class="text-lg">${p.emoji}</span><span class="flex-1 text-sm">${p.name.en} × ${item.qty}</span><span class="font-semibold text-sm">$${total.toLocaleString()}</span></div>`;
    }).join("");
    const tax = subtotal * 0.08;
    const delivery = subtotal > 500 ? 0 : 15;
    const total = subtotal + tax + delivery;
    container.innerHTML = `<div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div class="lg:col-span-3">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
            <form id="checkoutForm" onsubmit="return processPayment(event)" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="sm:col-span-2"><input type="text" id="cf_name" placeholder="Full Name" required class="form-input"></div>
                <div><input type="email" id="cf_email" placeholder="Email Address" value="${currentUser ? currentUser.email : ''}" required class="form-input"></div>
                <div><input type="tel" id="cf_phone" placeholder="Phone Number" required class="form-input"></div>
                <div class="sm:col-span-2"><input type="text" id="cf_address" placeholder="Street Address" required class="form-input"></div>
                <div><input type="text" id="cf_city" placeholder="City" required class="form-input"></div>
                <div><input type="text" id="cf_zip" placeholder="ZIP Code" required class="form-input"></div>
                <div class="sm:col-span-2 mt-4">
                    <h3 class="font-bold text-lg mb-3 text-gray-900">Payment Method</h3>
                    <div class="border-2 border-indigo-600 bg-indigo-50 rounded-xl p-4 flex items-center gap-3">
                        <span class="text-2xl">💳</span>
                        <div><div class="font-semibold text-gray-900">Credit Card</div><div class="text-xs text-gray-500">Visa, Mastercard, Amex accepted</div></div>
                    </div>
                    <div class="mt-3"><input type="text" id="cf_card" placeholder="Card Number (e.g., 4242 4242 4242 4242)" required class="form-input"></div>
                    <div class="grid grid-cols-2 gap-4 mt-3">
                        <div><input type="text" id="cf_expiry" placeholder="MM/YY" required class="form-input"></div>
                        <div><input type="text" id="cf_cvv" placeholder="CVV" required class="form-input"></div>
                    </div>
                </div>
                <div class="sm:col-span-2 mt-4">
                    <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg transition-all hover:shadow-lg flex items-center justify-center gap-2">
                        <span>💳</span> Pay $${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </button>
                </div>
            </form>
        </div>
        <div class="lg:col-span-2">
            <div class="bg-white rounded-2xl p-6 border border-gray-200 sticky top-24">
                <h3 class="font-bold text-lg mb-4 text-gray-900">Order Summary</h3>
                ${itemsList}
                <div class="space-y-2 text-sm mt-4 pt-4 border-t border-gray-200">
                    <div class="flex justify-between"><span class="text-gray-500">Subtotal</span><span class="font-semibold">$${subtotal.toLocaleString()}</span></div>
                    <div class="flex justify-between"><span class="text-gray-500">Tax (8%)</span><span class="font-semibold">$${tax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
                    <div class="flex justify-between"><span class="text-gray-500">Delivery</span><span class="font-semibold">${delivery === 0 ? '<span class="text-emerald-600">FREE</span>' : '$' + delivery}</span></div>
                    <div class="border-t pt-2 mt-2 flex justify-between text-lg font-bold"><span>Total</span><span class="text-indigo-600">$${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
                </div>
                ${subtotal < 500 ? `<div class="mt-4 p-3 bg-amber-50 rounded-xl text-xs text-amber-700">Add $${(500 - subtotal).toLocaleString()} more for <strong>FREE delivery</strong>!</div>` : '<div class="mt-4 p-3 bg-emerald-50 rounded-xl text-xs text-emerald-700">🎉 You qualify for <strong>FREE delivery</strong>!</div>'}
            </div>
        </div>
    </div>`;
}

async function processPayment(e) {
    e.preventDefault();
    const data = {
        full_name: document.getElementById("cf_name").value,
        email: document.getElementById("cf_email").value,
        phone: document.getElementById("cf_phone").value,
        address: document.getElementById("cf_address").value,
        city: document.getElementById("cf_city").value,
        zip: document.getElementById("cf_zip").value,
        items: cart.map((i) => ({ id: i.id, qty: i.qty })),
    };
    let subtotal = 0;
    for (const item of cart) {
        const p = products.find((x) => x.id === item.id);
        if (p) subtotal += p.price * item.qty;
    }
    data.total = subtotal + subtotal * 0.08 + (subtotal > 500 ? 0 : 15);
    data.delivery_cost = subtotal > 500 ? 0 : 15;
    try {
        const res = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        if (result.error) {
            showToast(result.error, "error");
            return;
        }
        cart = [];
        updateCartUI();
        showToast(`Order #${result.order_id} placed successfully! Thank you for your purchase.`, "success");
        navigateTo("");
    } catch (e) {
        showToast("Payment failed. Please try again.", "error");
    }
    return false;
}

function renderAuth() {
    const container = $("#authContent");
    if (!container) return;
    if (currentUser) {
        container.innerHTML = `<div class="max-w-md mx-auto text-center py-12"><div class="text-6xl mb-4">👤</div><h2 class="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2><p class="text-gray-500 mb-6">${currentUser.email}</p><button onclick="logoutUser()" class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold">Logout</button></div>`;
        return;
    }
    container.innerHTML = `<div class="max-w-md mx-auto">
        <div class="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div class="text-center mb-6">
                <div class="text-5xl mb-2">🔐</div>
                <h2 class="text-2xl font-bold text-gray-900" id="authTitle">Welcome Back</h2>
                <p class="text-gray-500 text-sm" id="authSubtitle">Sign in to your account</p>
            </div>
            <form id="authForm" onsubmit="return handleAuthSubmit(event)">
                <div class="mb-4"><input type="email" id="authEmail" placeholder="Email Address" required class="form-input"></div>
                <div class="mb-4"><input type="password" id="authPassword" placeholder="Password" required class="form-input"></div>
                <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-all hover:shadow-lg" id="authSubmitBtn">Sign In</button>
            </form>
            <div class="text-center mt-4 text-sm text-gray-500">
                <span id="authToggleText">Don't have an account?</span>
                <span class="auth-toggle" id="authToggle" onclick="toggleAuthMode()">Sign Up</span>
            </div>
        </div>
    </div>`;
    window._isLoginMode = true;
}

function toggleAuthMode() {
    window._isLoginMode = !window._isLoginMode;
    const title = document.getElementById("authTitle");
    const subtitle = document.getElementById("authSubtitle");
    const btn = document.getElementById("authSubmitBtn");
    const toggle = document.getElementById("authToggle");
    const toggleText = document.getElementById("authToggleText");
    if (window._isLoginMode) {
        title.textContent = "Welcome Back";
        subtitle.textContent = "Sign in to your account";
        btn.textContent = "Sign In";
        toggleText.textContent = "Don't have an account?";
        toggle.textContent = "Sign Up";
    } else {
        title.textContent = "Create Account";
        subtitle.textContent = "Join TechShop today";
        btn.textContent = "Create Account";
        toggleText.textContent = "Already have an account?";
        toggle.textContent = "Sign In";
    }
}

async function handleAuthSubmit(e) {
    e.preventDefault();
    const email = document.getElementById("authEmail").value;
    const password = document.getElementById("authPassword").value;
    const endpoint = window._isLoginMode ? "/login" : "/register";
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    try {
        const res = await fetch(endpoint, { method: "POST", body: formData });
        const data = await res.json();
        if (data.error) {
            showToast(data.error, "error");
            return;
        }
        if (window._isLoginMode) {
            currentUser = { email: data.email };
            updateAuthUI();
            showToast("Logged in successfully!", "success");
            navigateTo("");
        } else {
            showToast("Registration successful! Please sign in.", "info");
            toggleAuthMode();
        }
    } catch (e) {
        showToast("An error occurred. Please try again.", "error");
    }
    return false;
}

async function logoutUser() {
    try {
        await fetch("/logout");
        currentUser = null;
        updateAuthUI();
        showToast("Logged out successfully", "info");
        navigateTo("");
    } catch (e) {
        showToast("Logout failed", "error");
    }
}

function renderAbout() {
    const container = $("#aboutContent");
    if (!container) return;
    container.innerHTML = `<div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
            <div class="text-6xl mb-4">🚀</div>
            <h1 class="text-4xl font-bold text-gray-900 mb-4">About TechShop</h1>
            <div class="w-20 h-1 bg-indigo-600 mx-auto rounded-full"></div>
        </div>
        <div class="bg-white rounded-2xl p-8 border border-gray-200 mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p class="text-gray-600 leading-relaxed mb-4">Founded in 2024, TechShop was born from a simple idea: make cutting-edge technology accessible to everyone. We started as a small online store and quickly grew into a trusted destination for digital electronics.</p>
            <p class="text-gray-600 leading-relaxed mb-4">Our team of tech enthusiasts carefully curates every product in our catalog, ensuring that we only offer the best devices at competitive prices. From the latest smartphones to professional-grade laptops, we have everything you need to stay connected, productive, and entertained.</p>
            <p class="text-gray-600 leading-relaxed">We pride ourselves on exceptional customer service, fast shipping, and a hassle-free return policy. Thousands of satisfied customers trust TechShop for their electronics needs.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-2xl p-6 border border-gray-200 text-center">
                <div class="text-4xl mb-3">🌍</div>
                <h3 class="font-bold text-gray-900 mb-2">Global Shipping</h3>
                <p class="text-sm text-gray-500">We deliver to over 50 countries worldwide with fast, tracked shipping.</p>
            </div>
            <div class="bg-white rounded-2xl p-6 border border-gray-200 text-center">
                <div class="text-4xl mb-3">🔒</div>
                <h3 class="font-bold text-gray-900 mb-2">Secure Payments</h3>
                <p class="text-sm text-gray-500">All transactions are encrypted and processed securely.</p>
            </div>
            <div class="bg-white rounded-2xl p-6 border border-gray-200 text-center">
                <div class="text-4xl mb-3">💬</div>
                <h3 class="font-bold text-gray-900 mb-2">24/7 Support</h3>
                <p class="text-sm text-gray-500">Our support team is available around the clock to help you.</p>
            </div>
        </div>
    </div>`;
}

function renderDiscounts() {
    const container = $("#discountsContent");
    if (!container) return;
    const deals = [
        { title: "Summer Sale", desc: "Up to 40% off on selected smartphones and accessories.", emoji: "☀️", color: "from-yellow-400 to-orange-500" },
        { title: "Student Discount", desc: "Students get 15% off on all laptops. Verify with .edu email.", emoji: "🎓", color: "from-blue-400 to-indigo-500" },
        { title: "Bundle & Save", desc: "Buy a laptop and tablet together and save $200!", emoji: "📦", color: "from-emerald-400 to-teal-500" },
        { title: "Free Delivery", desc: "Free standard shipping on orders over $500.", emoji: "🚚", color: "from-purple-400 to-pink-500" },
        { title: "Trade-In Offer", desc: "Trade in your old device and get up to $600 credit.", emoji: "🔄", color: "from-cyan-400 to-blue-500" },
        { title: "Newsletter Signup", desc: "Subscribe to our newsletter and get 10% off your first order.", emoji: "📧", color: "from-rose-400 to-red-500" },
    ];
    container.innerHTML = `<div class="max-w-5xl mx-auto">
        <div class="text-center mb-12">
            <div class="text-6xl mb-4">🏷️</div>
            <h1 class="text-4xl font-bold text-gray-900 mb-4">Deals & Discounts</h1>
            <div class="w-20 h-1 bg-indigo-600 mx-auto rounded-full"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${deals.map((d) => `<div class="rounded-2xl p-6 bg-gradient-to-br ${d.color} text-white shadow-lg hover:shadow-xl transition-all cursor-pointer">
                <div class="text-5xl mb-4">${d.emoji}</div>
                <h3 class="text-xl font-bold mb-2">${d.title}</h3>
                <p class="text-sm opacity-90">${d.desc}</p>
            </div>`).join("")}
        </div>
    </div>`;
}

function renderTerms() {
    const container = $("#termsContent");
    if (!container) return;
    container.innerHTML = `<div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
            <div class="text-6xl mb-4">📋</div>
            <h1 class="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
            <div class="w-20 h-1 bg-indigo-600 mx-auto rounded-full"></div>
        </div>
        <div class="bg-white rounded-2xl p-8 border border-gray-200 space-y-6 text-gray-600 leading-relaxed">
            <section><h2 class="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2><p>Welcome to TechShop. By accessing or using our website, you agree to be bound by these terms and conditions. If you do not agree with any part of these terms, please do not use our services.</p></section>
            <section><h2 class="text-xl font-bold text-gray-900 mb-3">2. Products & Pricing</h2><p>All product descriptions, images, and prices are subject to change without notice. We reserve the right to modify or discontinue any product at any time. Prices are listed in USD and do not include applicable taxes or shipping costs unless stated otherwise.</p></section>
            <section><h2 class="text-xl font-bold text-gray-900 mb-3">3. Orders & Payment</h2><p>By placing an order, you agree to provide accurate and complete information. We accept major credit cards and PayPal. Payment is due at the time of purchase. We reserve the right to cancel any order for any reason, including suspected fraud or unauthorized transactions.</p></section>
            <section><h2 class="text-xl font-bold text-gray-900 mb-3">4. Shipping & Delivery</h2><p>Standard shipping takes 5-7 business days. Express shipping is available for an additional fee. We are not responsible for delays caused by customs, weather, or carrier issues. Risk of loss passes to you upon delivery.</p></section>
            <section><h2 class="text-xl font-bold text-gray-900 mb-3">5. Returns & Refunds</h2><p>You may return most items within 30 days of delivery for a full refund. Items must be in original condition with all accessories. Refunds are processed within 5-7 business days after we receive the returned item.</p></section>
            <section><h2 class="text-xl font-bold text-gray-900 mb-3">6. Privacy</h2><p>We collect and use your personal information in accordance with our Privacy Policy. By using our service, you consent to such collection and use.</p></section>
            <section><h2 class="text-xl font-bold text-gray-900 mb-3">7. Limitation of Liability</h2><p>TechShop shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our products or services.</p></section>
            <section><h2 class="text-xl font-bold text-gray-900 mb-3">8. Contact</h2><p>For any questions regarding these terms, please contact us at support@techshop.com.</p></section>
        </div>
    </div>`;
}

// ============= ROUTING =============

function handleRouting() {
    if (!products.length) return;
    const hash = window.location.hash.slice(1) || "home";
    if (hash === "home" || hash === "") {
        showView("home");
        renderHome(currentCategory);
    } else if (hash.startsWith("product/")) {
        const id = parseInt(hash.split("/")[1], 10);
        showView("product");
        showProduct(id);
    } else if (hash === "cart") {
        showView("cart");
        renderCart();
    } else if (hash === "checkout") {
        showView("checkout");
        renderCheckout();
    } else if (hash === "auth") {
        showView("auth");
        renderAuth();
    } else if (hash === "about") {
        showView("about");
        renderAbout();
    } else if (hash === "discounts") {
        showView("discounts");
        renderDiscounts();
    } else if (hash === "terms") {
        showView("terms");
        renderTerms();
    } else {
        showView("home");
        renderHome(currentCategory);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============= INIT =============

async function init() {
    await Promise.all([loadProducts(), checkSession()]);
    updateCartUI();
    handleRouting();
    window.addEventListener("hashchange", handleRouting);
}

document.addEventListener("DOMContentLoaded", init);
