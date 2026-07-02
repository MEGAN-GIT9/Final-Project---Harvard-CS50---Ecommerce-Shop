import sqlite3
import os
from flask import Flask, render_template, jsonify, request, session, redirect
from flask_session import Session
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["SECRET_KEY"] = "techshop-cs50-secret-key-2026"
Session(app)

DB_PATH = os.path.join(os.path.dirname(__file__), "database", "techshop.db")


def get_db():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA foreign_keys = ON")
    return con


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/products")
def api_products():
    db = get_db()
    rows = db.execute("SELECT * FROM products ORDER BY id").fetchall()
    products = []
    for r in rows:
        specs = db.execute(
            "SELECT lang, spec_key, spec_value FROM product_specs WHERE product_id = ?",
            (r["id"],)
        ).fetchall()
        specs_ka = {s["spec_key"]: s["spec_value"] for s in specs if s["lang"] == "ka"}
        specs_en = {s["spec_key"]: s["spec_value"] for s in specs if s["lang"] == "en"}
        products.append({
            "id": r["id"], "cat": r["cat"], "price": r["price"], "emoji": r["image"],
            "stars": r["stars"], "reviews": r["reviews"], "badge": r["badge"],
            "weight": r["weight"], "width": r["width"], "height": r["height"], "depth": r["depth"],
            "name": {"ka": r["name_ka"], "en": r["name_en"]},
            "desc": {"ka": r["desc_ka"], "en": r["desc_en"]},
            "brand": r["brand"],
            "specs": {"ka": specs_ka, "en": specs_en},
        })
    db.close()
    return jsonify(products)


@app.route("/api/products/<int:product_id>")
def api_product(product_id):
    db = get_db()
    r = db.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
    if r is None:
        db.close()
        return jsonify({"error": "not found"}), 404
    specs = db.execute(
        "SELECT lang, spec_key, spec_value FROM product_specs WHERE product_id = ?",
        (r["id"],)
    ).fetchall()
    specs_ka = {s["spec_key"]: s["spec_value"] for s in specs if s["lang"] == "ka"}
    specs_en = {s["spec_key"]: s["spec_value"] for s in specs if s["lang"] == "en"}
    product = {
        "id": r["id"], "cat": r["cat"], "price": r["price"], "emoji": r["image"],
        "stars": r["stars"], "reviews": r["reviews"], "badge": r["badge"],
        "weight": r["weight"], "width": r["width"], "height": r["height"], "depth": r["depth"],
        "name": {"ka": r["name_ka"], "en": r["name_en"]},
        "desc": {"ka": r["desc_ka"], "en": r["desc_en"]},
        "brand": r["brand"],
        "specs": {"ka": specs_ka, "en": specs_en},
    }
    db.close()
    return jsonify(product)


@app.route("/register", methods=["POST"])
def register():
    email = request.form.get("email")
    password = request.form.get("password")
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
    if len(password) < 4:
        return jsonify({"error": "Password must be at least 4 characters"}), 400
    db = get_db()
    try:
        db.execute("INSERT INTO users (email, hash) VALUES (?, ?)",
                   (email, generate_password_hash(password)))
        db.commit()
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already registered"}), 400
    finally:
        db.close()
    return jsonify({"ok": True, "message": "Registration successful! Please log in."})


@app.route("/login", methods=["POST"])
def login():
    email = request.form.get("email")
    password = request.form.get("password")
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
    db = get_db()
    user = db.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    db.close()
    if user is None or not check_password_hash(user["hash"], password):
        return jsonify({"error": "Invalid email or password"}), 401
    session["user_id"] = user["id"]
    return jsonify({"ok": True, "email": user["email"]})


@app.route("/logout")
def logout():
    session.clear()
    return jsonify({"ok": True})


@app.route("/api/session")
def api_session():
    if session.get("user_id"):
        db = get_db()
        user = db.execute("SELECT email FROM users WHERE id = ?", (session["user_id"],)).fetchone()
        db.close()
        if user:
            return jsonify({"authenticated": True, "email": user["email"]})
    return jsonify({"authenticated": False})


@app.route("/api/checkout", methods=["POST"])
def checkout():
    data = request.get_json()
    required = ["full_name", "email", "phone", "address", "city", "zip", "items", "total"]
    for field in required:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400
    if not data["items"]:
        return jsonify({"error": "Cart is empty"}), 400
    db = get_db()
    try:
        cur = db.execute(
            "INSERT INTO orders (user_id, full_name, email, phone, address, city, zip, total, delivery_cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (session.get("user_id"), data["full_name"], data["email"], data["phone"],
             data["address"], data["city"], data["zip"], data["total"], data.get("delivery_cost", 0))
        )
        order_id = cur.lastrowid
        for item in data["items"]:
            product = db.execute("SELECT price FROM products WHERE id = ?", (item["id"],)).fetchone()
            if product is None:
                raise ValueError(f"Product {item['id']} not found")
            db.execute(
                "INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?,?,?,?)",
                (order_id, item["id"], item["qty"], product["price"])
            )
        db.commit()
        return jsonify({"ok": True, "order_id": order_id})
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


if __name__ == "__main__":
    app.run(debug=True)
