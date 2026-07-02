import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "database", "techshop.db")

con = sqlite3.connect(DB_PATH)
cur = con.cursor()

products = [
    # ---- Phones ----
    {
        "id": 1, "cat": "Phones", "price": 1199, "image": "📱", "stars": 5,
        "reviews": 3421, "badge": "Best Seller", "weight": 0.221, "width": 7.7, "height": 15.9, "depth": 0.85,
        "name_ka": "iPhone 15 Pro Max - Natural Titanium", "name_en": "iPhone 15 Pro Max - Natural Titanium",
        "desc_ka": "Apple-ის ყველაზე მძლავრი iPhone A17 Pro ჩიპით, 48MP კამერით და ტიტანის კორპუსით.",
        "desc_en": "Apple's most powerful iPhone with A17 Pro chip, 48MP camera, and titanium design.",
        "brand": "Apple",
        "specs_ka": {"ბრენდი": "Apple", "მოდელი": "iPhone 15 Pro Max", "ეკრანი": "6.7\" OLED", "მეხსიერება": "256GB", "ბატარეა": "29 საათი"},
        "specs_en": {"Brand": "Apple", "Model": "iPhone 15 Pro Max", "Display": "6.7\" OLED", "Storage": "256GB", "Battery": "29 hours"}
    },
    {
        "id": 2, "cat": "Phones", "price": 1299, "image": "📱", "stars": 5,
        "reviews": 2105, "badge": "New", "weight": 0.233, "width": 7.9, "height": 16.2, "depth": 0.86,
        "name_ka": "Samsung Galaxy S24 Ultra", "name_en": "Samsung Galaxy S24 Ultra",
        "desc_ka": "Samsung-ის ფლაგმანი Galaxy AI-ით, S Pen-ით და 200MP კამერით.",
        "desc_en": "Samsung's flagship with Galaxy AI, S Pen, and 200MP camera.",
        "brand": "Samsung",
        "specs_ka": {"ბრენდი": "Samsung", "მოდელი": "Galaxy S24 Ultra", "ეკრანი": "6.8\" Dynamic AMOLED", "მეხსიერება": "512GB", "ბატარეა": "30 საათი"},
        "specs_en": {"Brand": "Samsung", "Model": "Galaxy S24 Ultra", "Display": "6.8\" Dynamic AMOLED", "Storage": "512GB", "Battery": "30 hours"}
    },
    {
        "id": 3, "cat": "Phones", "price": 899, "image": "📱", "stars": 4,
        "reviews": 1832, "badge": "Sale", "weight": 0.213, "width": 7.6, "height": 15.8, "depth": 0.84,
        "name_ka": "Google Pixel 8 Pro", "name_en": "Google Pixel 8 Pro",
        "desc_ka": "Google-ის საუკეთესო კამერა Tensor G3 ჩიპით და AI ფუნქციებით.",
        "desc_en": "Google's best camera phone with Tensor G3 chip and AI features.",
        "brand": "Google",
        "specs_ka": {"ბრენდი": "Google", "მოდელი": "Pixel 8 Pro", "ეკრანი": "6.7\" LTPO OLED", "მეხსიერება": "128GB", "ბატარეა": "24 საათი"},
        "specs_en": {"Brand": "Google", "Model": "Pixel 8 Pro", "Display": "6.7\" LTPO OLED", "Storage": "128GB", "Battery": "24 hours"}
    },
    {
        "id": 4, "cat": "Phones", "price": 799, "image": "📱", "stars": 4,
        "reviews": 1567, "badge": "Hot", "weight": 0.22, "width": 7.6, "height": 16.4, "depth": 0.87,
        "name_ka": "OnePlus 12", "name_en": "OnePlus 12",
        "desc_ka": "OnePlus 12 Snapdragon 8 Gen 3-ით, 50W უსადენო დამუხტვით და Hasselblad კამერით.",
        "desc_en": "OnePlus 12 with Snapdragon 8 Gen 3, 50W wireless charging, and Hasselblad camera.",
        "brand": "OnePlus",
        "specs_ka": {"ბრენდი": "OnePlus", "მოდელი": "12", "ეკრანი": "6.82\" AMOLED", "მეხსიერება": "256GB", "ბატარეა": "26 საათი"},
        "specs_en": {"Brand": "OnePlus", "Model": "12", "Display": "6.82\" AMOLED", "Storage": "256GB", "Battery": "26 hours"}
    },
    # ---- Laptops ----
    {
        "id": 5, "cat": "Laptops", "price": 2499, "image": "💻", "stars": 5,
        "reviews": 4123, "badge": "Premium", "weight": 2.14, "width": 35.6, "height": 24.8, "depth": 1.68,
        "name_ka": 'MacBook Pro 16" M3 Pro', "name_en": 'MacBook Pro 16" M3 Pro',
        "desc_ka": "Apple M3 Pro ჩიპი, 18GB მეხსიერება, 18 საათი ბატარეა. Liquid Retina XDR ეკრანი.",
        "desc_en": "Apple M3 Pro chip, 18GB memory, 18-hour battery. Liquid Retina XDR display.",
        "brand": "Apple",
        "specs_ka": {"Brand": "Apple", "Model": 'MacBook Pro 16"', "CPU": "M3 Pro", "RAM": "18GB", "Storage": "512GB SSD"},
        "specs_en": {"Brand": "Apple", "Model": 'MacBook Pro 16"', "CPU": "M3 Pro", "RAM": "18GB", "Storage": "512GB SSD"}
    },
    {
        "id": 6, "cat": "Laptops", "price": 1899, "image": "💻", "stars": 4,
        "reviews": 2890, "badge": "Popular", "weight": 1.86, "width": 34.4, "height": 23.0, "depth": 1.8,
        "name_ka": 'Dell XPS 15"', "name_en": 'Dell XPS 15"',
        "desc_ka": "Dell XPS 15 Intel Core i7-13700H, 16GB RAM, OLED 3.5K ეკრანი.",
        "desc_en": "Dell XPS 15 with Intel Core i7-13700H, 16GB RAM, OLED 3.5K display.",
        "brand": "Dell",
        "specs_ka": {"Brand": "Dell", "Model": "XPS 15 9530", "CPU": "i7-13700H", "RAM": "16GB", "Storage": "512GB SSD"},
        "specs_en": {"Brand": "Dell", "Model": "XPS 15 9530", "CPU": "i7-13700H", "RAM": "16GB", "Storage": "512GB SSD"}
    },
    {
        "id": 7, "cat": "Laptops", "price": 2199, "image": "💻", "stars": 5,
        "reviews": 1789, "badge": "Gaming", "weight": 2.35, "width": 35.4, "height": 25.4, "depth": 2.28,
        "name_ka": "ASUS ROG Zephyrus G14", "name_en": "ASUS ROG Zephyrus G14",
        "desc_ka": "საუკეთესო gaming ლეპტოპი AMD Ryzen 9-ით და RTX 4070-ით.",
        "desc_en": "Premium gaming laptop with AMD Ryzen 9 and RTX 4070.",
        "brand": "ASUS",
        "specs_ka": {"ბრენდი": "ASUS", "მოდელი": "ROG Zephyrus G14", "პროცესორი": "Ryzen 9 7940HS", "მეხსიერება": "16GB", "გრაფიკა": "RTX 4070"},
        "specs_en": {"Brand": "ASUS", "Model": "ROG Zephyrus G14", "CPU": "Ryzen 9 7940HS", "RAM": "16GB", "GPU": "RTX 4070"}
    },
    {
        "id": 8, "cat": "Laptops", "price": 1649, "image": "💻", "stars": 4,
        "reviews": 2134, "badge": "Business", "weight": 1.12, "width": 31.4, "height": 21.9, "depth": 1.58,
        "name_ka": "Lenovo ThinkPad X1 Carbon Gen 11", "name_en": "Lenovo ThinkPad X1 Carbon Gen 11",
        "desc_ka": "მსუბუქი ბიზნეს ლეპტოპი i7-1355U-ით, 16GB RAM, 14\" 2.8K OLED.",
        "desc_en": "Ultralight business laptop with i7-1355U, 16GB RAM, 14\" 2.8K OLED.",
        "brand": "Lenovo",
        "specs_ka": {"ბრენდი": "Lenovo", "მოდელი": "ThinkPad X1 Carbon Gen 11", "პროცესორი": "i7-1355U", "მეხსიერება": "16GB", "ეკრანი": "14\" 2.8K OLED"},
        "specs_en": {"Brand": "Lenovo", "Model": "ThinkPad X1 Carbon Gen 11", "CPU": "i7-1355U", "RAM": "16GB", "Display": "14\" 2.8K OLED"}
    },
    # ---- Smartwatches ----
    {
        "id": 9, "cat": "Smartwatches", "price": 799, "image": "⌚", "stars": 5,
        "reviews": 3456, "badge": "Ultra", "weight": 0.061, "width": 4.9, "height": 4.4, "depth": 1.44,
        "name_ka": "Apple Watch Ultra 2", "name_en": "Apple Watch Ultra 2",
        "desc_ka": "49mm ტიტანის კორპუსი, ორმაგი სიკაშკაშის ეკრანი, 36 საათი ბატარეა.",
        "desc_en": "49mm titanium case, double-brightness display, 36-hour battery.",
        "brand": "Apple",
        "specs_ka": {"ბრენდი": "Apple", "მოდელი": "Watch Ultra 2", "ეკრანი": "49mm", "ბატარეა": "36 საათი", "წყალგამძლეობა": "100m"},
        "specs_en": {"Brand": "Apple", "Model": "Watch Ultra 2", "Display": "49mm", "Battery": "36 hours", "Water Resistance": "100m"}
    },
    {
        "id": 10, "cat": "Smartwatches", "price": 449, "image": "⌚", "stars": 4,
        "reviews": 2891, "badge": "Popular", "weight": 0.059, "width": 4.4, "height": 4.3, "depth": 1.04,
        "name_ka": "Samsung Galaxy Watch 6 Classic", "name_en": "Samsung Galaxy Watch 6 Classic",
        "desc_ka": "Samsung-ის საუკეთესო სმარტ საათი მბრუნავი ბეზელით, Wear OS-ზე.",
        "desc_en": "Samsung's premium smartwatch with rotating bezel, powered by Wear OS.",
        "brand": "Samsung",
        "specs_ka": {"ბრენდი": "Samsung", "მოდელი": "Galaxy Watch 6 Classic", "ეკრანი": "47mm", "ბატარეა": "40 საათი", "OS": "Wear OS 4"},
        "specs_en": {"Brand": "Samsung", "Model": "Galaxy Watch 6 Classic", "Display": "47mm", "Battery": "40 hours", "OS": "Wear OS 4"}
    },
    {
        "id": 11, "cat": "Smartwatches", "price": 599, "image": "⌚", "stars": 5,
        "reviews": 1567, "badge": "Pro", "weight": 0.079, "width": 4.7, "height": 4.7, "depth": 1.45,
        "name_ka": "Garmin Fenix 7X Solar", "name_en": "Garmin Fenix 7X Solar",
        "desc_ka": "მზის ენერგიაზე მომუშავე GPS საათი მთამსვლელებისთვის და სპორტსმენებისთვის.",
        "desc_en": "Solar-powered GPS watch for mountaineers and athletes.",
        "brand": "Garmin",
        "specs_ka": {"ბრენდი": "Garmin", "მოდელი": "Fenix 7X Solar", "ეკრანი": "51mm", "ბატარეა": "37+ დღე", "GPS": "Multi-band"},
        "specs_en": {"Brand": "Garmin", "Model": "Fenix 7X Solar", "Display": "51mm", "Battery": "37+ days", "GPS": "Multi-band"}
    },
    # ---- Headphones ----
    {
        "id": 12, "cat": "Headphones", "price": 349, "image": "🎧", "stars": 5,
        "reviews": 5678, "badge": "Top Rated", "weight": 0.25, "width": 18.5, "height": 19.2, "depth": 7.6,
        "name_ka": "Sony WH-1000XM5", "name_en": "Sony WH-1000XM5",
        "desc_ka": "საუკეთესო ხმაურის დახშობის ტექნოლოგია, 30 საათი ბატარეა, Hi-Res Audio.",
        "desc_en": "Industry-leading noise cancellation, 30-hour battery, Hi-Res Audio.",
        "brand": "Sony",
        "specs_ka": {"ბრენდი": "Sony", "მოდელი": "WH-1000XM5", "ტიპი": "Over-ear", "ANC": "კი", "ბატარეა": "30 საათი"},
        "specs_en": {"Brand": "Sony", "Model": "WH-1000XM5", "Type": "Over-ear", "ANC": "Yes", "Battery": "30 hours"}
    },
    {
        "id": 13, "cat": "Headphones", "price": 429, "image": "🎧", "stars": 5,
        "reviews": 3452, "badge": "Premium", "weight": 0.252, "width": 18.4, "height": 19.1, "depth": 7.8,
        "name_ka": "Bose QuietComfort Ultra", "name_en": "Bose QuietComfort Ultra",
        "desc_ka": "Bose-ის საუკეთესო ყურსასმენები Immersive Audio-თ, CustomTune ტექნოლოგიით.",
        "desc_en": "Bose premium headphones with Immersive Audio and CustomTune technology.",
        "brand": "Bose",
        "specs_ka": {"ბრენდი": "Bose", "მოდელი": "QuietComfort Ultra", "ტიპი": "Over-ear", "ANC": "კი", "აუდიო": "Immersive Audio"},
        "specs_en": {"Brand": "Bose", "Model": "QuietComfort Ultra", "Type": "Over-ear", "ANC": "Yes", "Audio": "Immersive Audio"}
    },
    {
        "id": 14, "cat": "Headphones", "price": 249, "image": "🎧", "stars": 4,
        "reviews": 7890, "badge": "Best Seller", "weight": 0.047, "width": 4.5, "height": 4.0, "depth": 2.1,
        "name_ka": "Apple AirPods Pro 2nd Gen USB-C", "name_en": "Apple AirPods Pro 2nd Gen USB-C",
        "desc_ka": "Apple-ის საუკეთესო TWS ყურსასმენები H2 ჩიპით, ადაპტირებადი ANC-ით.",
        "desc_en": "Apple's best TWS earbuds with H2 chip, adaptive ANC.",
        "brand": "Apple",
        "specs_ka": {"ბრენდი": "Apple", "მოდელი": "AirPods Pro 2", "ტიპი": "In-ear TWS", "ANC": "კი", "ჩიპი": "H2"},
        "specs_en": {"Brand": "Apple", "Model": "AirPods Pro 2", "Type": "In-ear TWS", "ANC": "Yes", "Chip": "H2"}
    },
    # ---- Other Electronics ----
    {
        "id": 15, "cat": "Other", "price": 1099, "image": "📟", "stars": 5,
        "reviews": 4567, "badge": "Popular", "weight": 0.682, "width": 24.9, "height": 17.0, "depth": 0.64,
        "name_ka": "iPad Pro 12.9\" M2", "name_en": "iPad Pro 12.9\" M2",
        "desc_ka": "Apple M2 ჩიპი, Liquid Retina XDR ეკრანი, 12.9\", Thunderbolt პორტი.",
        "desc_en": "Apple M2 chip, Liquid Retina XDR display, 12.9\", Thunderbolt port.",
        "brand": "Apple",
        "specs_ka": {"ბრენდი": "Apple", "მოდელი": "iPad Pro 12.9\"", "ჩიპი": "M2", "მეხსიერება": "256GB", "ეკრანი": "Liquid Retina XDR"},
        "specs_en": {"Brand": "Apple", "Model": "iPad Pro 12.9\"", "Chip": "M2", "Storage": "256GB", "Display": "Liquid Retina XDR"}
    },
    {
        "id": 16, "cat": "Other", "price": 499, "image": "🎮", "stars": 5,
        "reviews": 6789, "badge": "Fun", "weight": 0.42, "width": 24.2, "height": 10.2, "depth": 1.39,
        "name_ka": "Nintendo Switch OLED", "name_en": "Nintendo Switch OLED",
        "desc_ka": "Nintendo Switch OLED 7\" ეკრანით, 64GB მეხსიერება, გაუმჯობესებული აუდიო.",
        "desc_en": "Nintendo Switch OLED with 7\" screen, 64GB storage, enhanced audio.",
        "brand": "Nintendo",
        "specs_ka": {"ბრენდი": "Nintendo", "მოდელი": "Switch OLED", "ეკრანი": "7\" OLED", "მეხსიერება": "64GB", "ბატარეა": "9 საათი"},
        "specs_en": {"Brand": "Nintendo", "Model": "Switch OLED", "Display": "7\" OLED", "Storage": "64GB", "Battery": "9 hours"}
    },
    {
        "id": 17, "cat": "Other", "price": 389, "image": "📷", "stars": 4,
        "reviews": 2345, "badge": "Adventure", "weight": 0.153, "width": 7.12, "height": 5.06, "depth": 3.33,
        "name_ka": "GoPro Hero 12 Black", "name_en": "GoPro Hero 12 Black",
        "desc_ka": "5.3K ვიდეო, 27MP ფოტო, HyperSmooth 6.0 სტაბილიზაცია, წყალგამძლე 10 მ-მდე.",
        "desc_en": "5.3K video, 27MP photo, HyperSmooth 6.0 stabilization, waterproof to 10m.",
        "brand": "GoPro",
        "specs_ka": {"ბრენდი": "GoPro", "მოდელი": "Hero 12 Black", "ვიდეო": "5.3K 60fps", "ფოტო": "27MP", "სტაბილიზაცია": "HyperSmooth 6.0"},
        "specs_en": {"Brand": "GoPro", "Model": "Hero 12 Black", "Video": "5.3K 60fps", "Photo": "27MP", "Stabilization": "HyperSmooth 6.0"}
    },
    {
        "id": 18, "cat": "Other", "price": 299, "image": "📖", "stars": 4,
        "reviews": 4561, "badge": "Eco", "weight": 0.433, "width": 19.6, "height": 23.0, "depth": 0.57,
        "name_ka": "Amazon Kindle Scribe", "name_en": "Amazon Kindle Scribe",
        "desc_ka": "10.2\" E-Ink ეკრანი, Premium Pen ჩანაწერებისთვის, 12 კვირა ბატარეა.",
        "desc_en": "10.2\" E-Ink display, Premium Pen for note-taking, 12-week battery.",
        "brand": "Amazon",
        "specs_ka": {"ბრენდი": "Amazon", "მოდელი": "Kindle Scribe", "ეკრანი": "10.2\" E-Ink", "მეხსიერება": "16GB", "ბატარეა": "12 კვირა"},
        "specs_en": {"Brand": "Amazon", "Model": "Kindle Scribe", "Display": "10.2\" E-Ink", "Storage": "16GB", "Battery": "12 weeks"}
    },
    {
        "id": 19, "cat": "Other", "price": 759, "image": "🛸", "stars": 5,
        "reviews": 1234, "badge": "New", "weight": 0.249, "width": 14.8, "height": 11.6, "depth": 6.4,
        "name_ka": "DJI Mini 4 Pro", "name_en": "DJI Mini 4 Pro",
        "desc_ka": "DJI-ის ყველაზე პატარა 4K დრონი, 3-მხრივი ობიექტების აცილება, 34 წთ ფრენა.",
        "desc_en": "DJI's smallest 4K drone, 3-way obstacle avoidance, 34min flight time.",
        "brand": "DJI",
        "specs_ka": {"ბრენდი": "DJI", "მოდელი": "Mini 4 Pro", "კამერა": "4K HDR", "წონა": "249g", "ფრენა": "34 წთ"},
        "specs_en": {"Brand": "DJI", "Model": "Mini 4 Pro", "Camera": "4K HDR", "Weight": "249g", "Flight": "34 min"}
    },
]

for p in products:
    cur.execute("""
        INSERT INTO products (id, cat, price, image, stars, reviews, badge,
            weight, width, height, depth, name_ka, name_en, desc_ka, desc_en, brand)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, (p["id"], p["cat"], p["price"], p["image"], p["stars"], p["reviews"], p["badge"],
          p["weight"], p["width"], p["height"], p["depth"],
          p["name_ka"], p["name_en"], p["desc_ka"], p["desc_en"], p["brand"]))

    for lang, specs in [("ka", p["specs_ka"]), ("en", p["specs_en"])]:
        for k, v in specs.items():
            cur.execute("""
                INSERT INTO product_specs (product_id, lang, spec_key, spec_value)
                VALUES (?,?,?,?)
            """, (p["id"], lang, k, v))

con.commit()
con.close()
print(f"Seeded {len(products)} products successfully.")
