--insert queries
--1
INSERT INTO users (email, password, name, phone_number, user_type, bank_account_number,registration_date) VALUES ($1, $2, $3, $4, $5,$6, CURRENT_DATE) RETURNING *;
--customer end
--2
INSERT INTO cart (user_id,create_date) 
 VALUES ($1,CURRENT_DATE) RETURNING *;
 --3
 INSERT INTO cart_items 
(cart_id,product_id,quantity) VALUES ($1,$2,$3) RETURNING *;
--4
INSERT INTO wishlist (user_id) 
  VALUES ($1) RETURNING *;
--5
INSERT INTO wishlist_items 
(wishlist_id, product_id) VALUES ($1, $2) RETURNING *;
--6
INSERT INTO review (user_id,product_id,review_text,rating,created_at) VALUES($1,$2,$3,$4,CURRENT_DATE) 
 RETURNING *;

--seller end
--7
INSERT INTO Product (name,price,stock_quantity,description,photo_url,user_id,purchase_count) VALUES($1, $2, $3, $4, $5,$6,$7) RETURNING *;
--8
INSERT INTO discount (product_id, start_date, end_date, discount_percentage) 
VALUES ($1, $2, $3, $4)
--9
INSERT INTO category (category_name, product_id) 
 VALUES ($1, $2)

