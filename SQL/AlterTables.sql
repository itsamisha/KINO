ALTER TABLE wishlist_items
ADD CONSTRAINT unique_wishlist_items_product_id UNIQUE (product_id);
