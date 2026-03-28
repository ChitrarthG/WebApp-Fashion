-- Enhanced database schema with authentication support
-- This migration adds user authentication fields to the users table

-- Drop and recreate the users table with authentication
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  email           VARCHAR(100) NOT NULL UNIQUE,
  phone           VARCHAR(20),
  password_hash   VARCHAR(255) NOT NULL,
  profile_image   TEXT,
  gender          VARCHAR(10),
  date_of_birth   DATE,
  address         TEXT,
  city            VARCHAR(50),
  state           VARCHAR(50),
  postal_code     VARCHAR(10),
  country         VARCHAR(50) DEFAULT 'India',
  is_verified     BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP,
  last_login      TIMESTAMP,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);

-- Customer accounts table (for wishlist, reviews, order history)
CREATE TABLE IF NOT EXISTS customer_accounts (
  id             SERIAL PRIMARY KEY,
  user_id        INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  loyalty_points INT DEFAULT 0,
  tier           VARCHAR(20) DEFAULT 'silver' CHECK (tier IN ('bronze','silver','gold','platinum')),
  total_spent    NUMERIC(12,2) DEFAULT 0,
  total_orders   INT DEFAULT 0,
  preferred_size VARCHAR(20),
  preferred_color VARCHAR(50),
  newsletter_subscribed BOOLEAN DEFAULT TRUE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customer_accounts_user ON customer_accounts(user_id);

-- Update orders table to link to users
ALTER TABLE orders 
ADD COLUMN user_id INT REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX idx_orders_user ON orders(user_id);
