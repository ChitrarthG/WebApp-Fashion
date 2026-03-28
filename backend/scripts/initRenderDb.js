const db = require('../src/db');

const categories = [
  ['Women', 'women', 1],
  ['Men', 'men', 2],
  ['Kids', 'kids', 3],
  ['Beauty', 'beauty', 4],
  ['Home & Living', 'home-living', 5],
  ['Footwear', 'footwear', 6],
  ['Jewelry', 'jewelry', 7],
  ['Innerwear', 'innerwear', 8],
  ['Character Shop', 'character-shop', 9],
  ['Sale', 'sale', 10],
];

const products = [
  ['Floral Wrap Dress', 'Elegant floral print wrap dress, perfect for all occasions.', 1, 999, 1799, 44, 'Vayu Fashion', ['XS', 'S', 'M', 'L', 'XL'], ['Blue', 'Red', 'Green'], 50, true, true, false, 4.5, 128],
  ['Embroidered Kurta Set', 'Beautiful embroidered kurta with matching palazzo.', 1, 1499, 2499, 40, 'Vayu Fashion', ['S', 'M', 'L', 'XL'], ['Pink', 'Yellow', 'White'], 40, true, true, false, 4.3, 89],
  ['Slim Fit Chinos', 'Premium cotton slim-fit chinos for a smart casual look.', 2, 1299, 1999, 35, 'Vayu Fashion', ['28', '30', '32', '34', '36'], ['Khaki', 'Navy', 'Olive'], 60, false, true, false, 4.4, 72],
  ['Graphic Print T-Shirt', 'Trendy graphic tee made from 100% soft cotton.', 2, 499, 999, 50, 'Vayu Fashion', ['S', 'M', 'L', 'XL', 'XXL'], ['White', 'Black', 'Grey'], 80, true, false, true, 4.2, 45],
  ['Kids Dungaree Set', 'Adorable dungaree set with vibrant prints for active kids.', 3, 799, 1299, 38, 'Vayu Fashion', ['2Y', '4Y', '6Y', '8Y', '10Y'], ['Blue', 'Red'], 35, true, true, false, 4.6, 56],
  ['Maxi Skirt', 'Flowy maxi skirt with elastic waistband, ideal for summer.', 1, 699, 1299, 46, 'Vayu Fashion', ['S', 'M', 'L', 'XL'], ['Floral', 'Striped'], 45, false, false, true, 4.1, 34],
  ['Formal Oxford Shirt', 'Crisp cotton oxford shirt in classic white for formal occasions.', 2, 999, 1499, 33, 'Vayu Fashion', ['S', 'M', 'L', 'XL', 'XXL'], ['White', 'Blue', 'Pink'], 55, false, true, false, 4.5, 91],
  ["Girl's Lehenga Choli", 'Festive lehenga choli set for special occasions.', 3, 1999, 2999, 33, 'Vayu Fashion', ['3Y', '5Y', '7Y', '9Y'], ['Red', 'Purple', 'Pink'], 20, true, true, false, 4.7, 63],
  ['Jogger Track Pants', 'Comfortable jogger pants for everyday wear and workouts.', 2, 799, 1299, 38, 'Vayu Fashion', ['S', 'M', 'L', 'XL', 'XXL'], ['Navy', 'Black', 'Grey'], 70, false, false, true, 4.0, 28],
  ['Anarkali Suit', 'Stunning Anarkali suit with intricate prints for festive wear.', 1, 2499, 3999, 37, 'Vayu Fashion', ['S', 'M', 'L', 'XL'], ['Maroon', 'Teal', 'Blue'], 25, true, true, false, 4.8, 142],
];

const statements = [
  `CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    image_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    price NUMERIC(10,2) NOT NULL,
    mrp NUMERIC(10,2),
    discount_pct INT DEFAULT 0,
    image_url TEXT,
    image_url_2 TEXT,
    brand VARCHAR(100),
    sizes TEXT[],
    colors TEXT[],
    stock INT DEFAULT 0,
    is_new BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_on_sale BOOLEAN DEFAULT FALSE,
    rating NUMERIC(3,1) DEFAULT 4.0,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL DEFAULT '',
    gender VARCHAR(10),
    date_of_birth DATE,
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    postal_code VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size VARCHAR(20),
    color VARCHAR(50),
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(20) NOT NULL UNIQUE,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    shipping_address TEXT NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled')),
    payment_method VARCHAR(50) DEFAULT 'cod',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    size VARCHAR(20),
    color VARCHAR(50),
    quantity INT NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL
  )`,
  'CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)',
  'CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured)',
  'CREATE INDEX IF NOT EXISTS idx_products_new ON products(is_new)',
  'CREATE INDEX IF NOT EXISTS idx_products_sale ON products(is_on_sale)',
  'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
  'CREATE INDEX IF NOT EXISTS idx_cart_session ON cart_items(session_id)',
  'CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number)',
  'CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)',
  'CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email)',
  'CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id)',
  'ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20)',
  "ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) NOT NULL DEFAULT ''",
  'ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(10)',
  'ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE',
  'ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT',
  'ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(50)',
  'ALTER TABLE users ADD COLUMN IF NOT EXISTS state VARCHAR(50)',
  'ALTER TABLE users ADD COLUMN IF NOT EXISTS postal_code VARCHAR(10)',
  'ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE',
  'ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE',
  'ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP',
  'ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url_2 TEXT',
  'ALTER TABLE products ADD COLUMN IF NOT EXISTS brand VARCHAR(100)',
  'ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes TEXT[]',
  'ALTER TABLE products ADD COLUMN IF NOT EXISTS colors TEXT[]',
  'ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INT DEFAULT 0',
  'ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT FALSE',
  'ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE',
  'ALTER TABLE products ADD COLUMN IF NOT EXISTS is_on_sale BOOLEAN DEFAULT FALSE',
  'ALTER TABLE products ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1) DEFAULT 4.0',
  'ALTER TABLE products ADD COLUMN IF NOT EXISTS review_count INT DEFAULT 0',
  'ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id INT REFERENCES users(id) ON DELETE SET NULL',
  'ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(20)',
  "ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'cod'",
  'ALTER TABLE order_items ADD COLUMN IF NOT EXISTS size VARCHAR(20)',
  'ALTER TABLE order_items ADD COLUMN IF NOT EXISTS color VARCHAR(50)'
];

async function seedCategories(client) {
  const result = await client.query('SELECT COUNT(*)::int AS count FROM categories');
  if (result.rows[0].count > 0) {
    return;
  }

  for (const [name, slug, displayOrder] of categories) {
    await client.query(
      'INSERT INTO categories (name, slug, display_order) VALUES ($1, $2, $3) ON CONFLICT (slug) DO NOTHING',
      [name, slug, displayOrder]
    );
  }
}

async function seedProducts(client) {
  const result = await client.query('SELECT COUNT(*)::int AS count FROM products');
  if (result.rows[0].count > 0) {
    return;
  }

  for (const product of products) {
    await client.query(
      `INSERT INTO products (
        name, description, category_id, price, mrp, discount_pct, brand, sizes, colors, stock,
        is_new, is_featured, is_on_sale, rating, review_count
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15
      )`,
      product
    );
  }
}

(async () => {
  const client = await db.connect();

  try {
    await client.query('BEGIN');
    for (const statement of statements) {
      await client.query(statement);
    }
    await seedCategories(client);
    await seedProducts(client);
    await client.query('COMMIT');
    console.log('Render database initialization complete.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Render database initialization failed:', error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await db.end();
  }
})();