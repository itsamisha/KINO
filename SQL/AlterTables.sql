--in a cart there should be unique products, making cart_id and product_id composite
ALTER TABLE cart_items DROP CONSTRAINT cart_items_pkey;
ALTER TABLE cart_items DROP COLUMN cart_item_id;
ALTER TABLE cart_items ADD PRIMARY KEY (cart_id, product_id);