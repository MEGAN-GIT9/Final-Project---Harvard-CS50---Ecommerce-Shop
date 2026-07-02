# TechShop — CS50 Final Project

#### Video Demo: [URL HERE]

#### Description

TechShop is a full-featured e-commerce web application built as the final project for Harvard's CS50 course. It is a digital electronics store that sells smartphones, laptops, smartwatches, headphones, and other consumer electronics. The application is built using Python's Flask web framework on the backend, SQLite for data persistence, and vanilla JavaScript with Tailwind CSS on the frontend. It implements a single-page application (SPA) architecture where all page transitions happen client-side without full page reloads, while the server handles data via a JSON API.

The project was designed to meet all of CS50's requirements: a Flask web application with multiple routes, a relational SQLite database with multiple interconnected tables (users, products, product_specs, orders, order_items), user registration and login with hashed passwords using Werkzeug security, dynamic content served from a database rather than hardcoded values, and a clean, professional user interface.

---

## Project Structure and File Descriptions

### `app.py` — Flask Application

This is the main server-side file that defines all Flask routes and application logic. It configures Flask-Session for server-side session management, connects to the SQLite database, and exposes the following routes:

- **`/`** — Serves the main HTML page (index.html) which contains the entire SPA shell.
- **`/api/products`** — Returns all products as JSON, including their names (in English and Georgian), descriptions, prices, categories, ratings, review counts, badges, dimensions, and specifications. The API joins data from the `products` and `product_specs` tables and structures it into a clean JSON format.
- **`/api/products/<id>`** — Returns a single product by its ID, useful for the product detail view.
- **`/register`** — Accepts POST requests with email and password, validates input, hashes the password using Werkzeug's `generate_password_hash`, and inserts a new user into the database. Returns an error if the email is already registered.
- **`/login`** — Accepts POST requests with email and password, looks up the user in the database, verifies the password hash, and creates a server-side session. Returns the user's email on success.
- **`/logout`** — Clears the session and logs the user out.
- **`/api/session`** — Returns the current session state, indicating whether the user is authenticated and their email address. This is used by the frontend to restore session state on page load.
- **`/api/checkout`** — Accepts a JSON payload with shipping information, cart items, and total pricing. It validates the input, creates an order record in the `orders` table, and inserts each cart item into the `order_items` table with the price at the time of purchase. This ensures historical price accuracy even if product prices change later.

### `helpers.py` — Utility Module

Contains a `login_required` decorator that can be applied to Flask routes requiring authentication. If the user is not logged in, it returns a 401 JSON error. While not currently used on any route (the application allows guest checkout), it exists as a reusable utility for future expansion.

### `database/schema.sql` — Database Schema

Defines the five interrelated SQLite tables:

- **`users`** — Stores registered users with id, email (unique), hashed password, full name, and creation timestamp.
- **`products`** — Stores product catalog data including category, price, image (emoji), star rating, review count, badge/label, physical dimensions (weight, width, height, depth), names and descriptions in both English and Georgian, and brand.
- **`product_specs`** — A normalized table for product specifications. Each product has multiple specifications (like brand, model, display size, battery life, etc.) stored as key-value pairs in this table, keyed by language (English and Georgian). This is a design choice for database normalization — instead of having a fixed number of spec columns in the products table, the EAV (Entity-Attribute-Value) pattern allows each product to have a flexible number of specifications.
- **`orders`** — Stores customer order information including the customer's name, email, phone, shipping address, city, ZIP code, total amount, delivery cost, order status, and a foreign key to the user who placed the order (nullable for guest checkout).
- **`order_items`** — Stores individual line items within each order, linking to the product and recording the quantity and price at the time of purchase.

The database uses foreign key constraints to maintain referential integrity. The schema is intentionally designed to demonstrate CS50 concepts including table relationships, primary/foreign keys, normalization, and data integrity.

### `seed_products.py` — Data Seeding Script

A one-time utility script that populates the database with 19 products across five categories: Phones (4 products), Laptops (4), Smartwatches (3), Headphones (3), and Other Electronics (5). Each product includes full English and Georgian translations for names, descriptions, and specifications. The script also inserts 190 product specification records into the `product_specs` table. Running this script is required only once after creating the database schema.

The product catalog includes well-known consumer electronics such as the iPhone 15 Pro Max, Samsung Galaxy S24 Ultra, MacBook Pro 16", Dell XPS 15, Apple Watch Ultra 2, Sony WH-1000XM5 headphones, iPad Pro, Nintendo Switch OLED, GoPro Hero 12, DJI Mini 4 Pro, and more. Each product has realistic pricing, ratings, review counts, badges (e.g., "Best Seller", "New", "Sale", "Premium"), and detailed specifications.

### `static/javascript.js` — Frontend Application Logic

This is the heart of the client-side application. It implements a hash-based single-page application router that handles navigation between seven views: Home, Product Detail, Cart, Checkout, Authentication, About, Deals & Discounts, and Terms & Conditions. Key features include:

- **Product Catalog** — Fetches products from the `/api/products` endpoint on page load, renders them in a responsive grid with category filtering. Each product card displays the product emoji, category, name, star rating, review count, price, and an "Add to Cart" button.
- **Category Filtering** — A horizontally scrollable category bar allows users to filter products by type (Phones, Laptops, Smartwatches, Headphones, Other, or All).
- **Product Detail View** — Clicking a product card navigates to a dedicated product page showing a large emoji, full description, specifications table, ratings, and both "Add to Cart" and "Buy Now" buttons.
- **Shopping Cart** — Cart data is stored in the browser's localStorage for persistence across sessions. Users can add items, adjust quantities, and remove items. The cart count badge updates in real time on the navigation bar.
- **Checkout Flow** — A multi-field shipping form collects the customer's name, email, phone, address, city, and ZIP code, along with a simulated credit card payment form. On submission, the cart contents are sent to the `/api/checkout` endpoint as JSON. The checkout page also displays an order summary with subtotal, tax (8%), delivery fee (free for orders over $500), and total.
- **User Authentication** — Login and registration forms communicate with the server via POST requests. Session state is checked on page load via the `/api/session` endpoint. The UI updates to show the user's email and a logout button when authenticated.
- **Toast Notifications** — A non-intrusive toast notification system provides feedback for cart actions, authentication events, and order confirmations.
- **Static Pages** — The About, Deals & Discounts, and Terms & Conditions pages are rendered client-side with hardcoded content, providing information about the company, available promotions, and legal terms.

### `static/style.css` — Custom Styles

Provides additional styling that complements the Tailwind CSS framework. Includes animations (fade-in, slide-in, scale-in), color-coded badge styles for different product labels, a custom hero section with gradient backgrounds and radial overlays, the scrollable category bar, product card hover effects with transforms and shadows, the sticky toast notification with slide-up animation, form input focus states, and responsive design adjustments for mobile devices.

### `templates/layout.html` — Base Template

The Jinja2 base template that defines the HTML document structure shared across all views. It includes the navigation bar with the TechShop logo, navigation links (Home, Deals, About, Terms), authentication state indicators (Sign In button, user email display, Logout button), and the shopping cart icon with a dynamic item count badge. The footer contains links and contact information. The template uses the `{% block content %}` pattern for child templates to inject page-specific content.

### `templates/index.html` — Main Content Template

Extends `layout.html` and defines the seven SPA view containers (`#view-home`, `#view-product`, `#view-cart`, `#view-checkout`, `#view-auth`, `#view-about`, `#view-discounts`, `#view-terms`). Each view is a `<div>` that is shown or hidden by the JavaScript router based on the URL hash. The home view includes a hero banner section with a call-to-action, the category filter bar, and the product grid container. The other views are empty containers that are populated dynamically by JavaScript.

---

## Design Decisions

Several design decisions were made during the development of TechShop:

**Why a Single-Page Application?** A SPA architecture provides a smoother, app-like experience where navigating between views does not require full page reloads. This is particularly beneficial for an e-commerce site where users browse products, add items to their cart, and proceed to checkout — all of which feels more fluid without page transitions. The hash-based routing approach (`#cart`, `#product/1`, etc.) is simple to implement without any frontend framework.

**Why Separate `product_specs` Table?** Specifications are stored in a separate table rather than as columns in the `products` table for normalization purposes. Products have different types of specifications — a smartphone has display size, storage, and battery life, while a laptop has CPU, RAM, and GPU. Using a key-value table with a language field allows each product to have exactly the specifications that are relevant to it, and supports bilingual content without schema changes. This EAV (Entity-Attribute-Value) pattern is a deliberate demonstration of database normalization for CS50.

**Why Cart in localStorage?** The shopping cart is stored in the browser's localStorage rather than on the server. This decision prioritizes simplicity and offline resilience — the cart persists even if the server restarts, and it works for both logged-in and guest users without requiring database writes on every cart interaction. The cart is only sent to the server during checkout, which is the appropriate time for server-side validation and persistence. This also reduces server load and simplifies the API surface.

**Why Emoji Instead of Product Images?** Product images are represented using emoji characters (📱, 💻, ⌚, 🎧, etc.) rather than actual product photographs. This is a deliberate design choice that keeps the project self-contained without requiring external image files or CDN-hosted assets. The emoji approach is lightweight, works cross-platform, and avoids copyright concerns with manufacturer product images. The architecture supports replacing emoji with real image URLs by modifying the `image` field in the database and updating the rendering logic in `javascript.js`.

**Why Server-Side Sessions?** Using Flask-Session with filesystem-based sessions allows the server to track authenticated users securely. The session stores the user's ID, which is used when creating orders to link purchases to user accounts. This is more secure than client-side (cookie-based) sessions because session data is stored on the server and only a session ID is sent to the client.

---

## How to Run

1. Ensure Python 3 is installed on your system.
2. Install the required packages: `pip install -r requirements.txt`
3. Create the database: `sqlite3 database/techshop.db < database/schema.sql`
4. Seed the products: `python seed_products.py`
5. Run the application: `flask run` (or `python app.py`)
6. Open your browser to `http://127.0.0.1:5000`

The application will start in debug mode, which provides detailed error messages and auto-reloads when code changes are detected. For production deployment, debug mode should be disabled and a proper production server (like Gunicorn or Waitress) should be used.

---

## Technologies Used

- **Backend:** Python 3, Flask, Flask-Session, Werkzeug (password hashing)
- **Database:** SQLite 3
- **Frontend:** HTML5, CSS3, JavaScript (ES6+), Tailwind CSS (via CDN)
- **Architecture:** Single-Page Application with hash-based routing, RESTful JSON API
