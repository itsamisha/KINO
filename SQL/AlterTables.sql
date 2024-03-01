--in a cart there should be unique products, making cart_id and product_id composite
ALTER TABLE cart_items DROP CONSTRAINT cart_items_pkey;
ALTER TABLE cart_items DROP COLUMN cart_item_id;
ALTER TABLE cart_items ADD PRIMARY KEY (cart_id, product_id);
--15 feb
ALTER TABLE cart_items
ADD CONSTRAINT check_quantity_positive
CHECK (quantity > 0);
--17 feb
ALTER TABLE review
DROP CONSTRAINT review_rating_check;

ALTER TABLE review
ADD CONSTRAINT review_rating_check CHECK (rating>=0);
--19 feb
ALTER TABLE orders DROP CONSTRAINT orders_cart_id_fkey;

ALTER TABLE orders
ADD COLUMN address TEXT;

ALTER TABLE orders
ADD COLUMN order_status VARCHAR(15);
--29feb2024
ALTER TABLE orders
DROP COLUMN order_status;
ALTER TABLE order_items ADD COLUMN order_status VARCHAR(255);
