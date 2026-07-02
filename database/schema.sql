CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    hash TEXT NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cat TEXT NOT NULL,
    price NUMERIC NOT NULL,
    image TEXT,
    stars INTEGER DEFAULT 5,
    reviews INTEGER DEFAULT 0,
    badge TEXT,
    weight REAL,
    width REAL,
    height REAL,
    depth REAL,
    name_ka TEXT NOT NULL,
    name_en TEXT NOT NULL,
    desc_ka TEXT,
    desc_en TEXT,
    brand TEXT
);

CREATE TABLE product_specs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    lang TEXT NOT NULL,
    spec_key TEXT NOT NULL,
    spec_value TEXT NOT NULL,
    FOREIGN KEY(product_id) REFERENCES products(id)
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    zip TEXT NOT NULL,
    total NUMERIC NOT NULL,
    delivery_cost NUMERIC NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'paid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_purchase NUMERIC NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
);
