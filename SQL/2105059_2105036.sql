CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    password TEXT NOT NULL,
    name VARCHAR(60) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    user_type VARCHAR(8) NOT NULL,
    registration_date DATE NOT NULL,
    preferred_payment_method VARCHAR(9),
    location VARCHAR(255),
    bank_account_number VARCHAR(50), 
    revenue INT CHECK (revenue>=0)
);

CREATE TABLE Product (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INT NOT NULL,
  description TEXT,
  photo_url TEXT,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    product_id INT,
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

CREATE TABLE cart (
    cart_id SERIAL PRIMARY KEY,
    create_date DATE NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id INT,
    product_id INT,
    quantity INT NOT NULL CHECK (quantity>0),
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) 
);

CREATE TABLE wishlist (
    wishlist_id SERIAL PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE wishlist_items (
    wishlist_item_id SERIAL PRIMARY KEY,
    wishlist_id INT,
    product_id INT,
    FOREIGN KEY (wishlist_id) REFERENCES wishlist(wishlist_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

CREATE TABLE review (
    user_id INT,
    product_id INT,
    review_text TEXT,
    reply_text TEXT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT,
    cart_id INT,
    order_date TIMESTAMP NOT NULL,
    estimated_delivery_date TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id)
);

CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT,
    product_id INT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);
CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    order_id INT,
    payment_method VARCHAR(50) NOT NULL,
    payment_date TIMESTAMP NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    card_number VARCHAR(16),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

CREATE TABLE discount (
    discount_id SERIAL PRIMARY KEY,
    product_id INT UNIQUE ;
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    discount_percentage DECIMAL(5, 2) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE gift_card (
    gift_card_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    amount INT NOT NULL,
    user_id INT,
    cart_id INT, 
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id)
);