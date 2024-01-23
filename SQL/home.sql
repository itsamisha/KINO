--signin and registration
SELECT * FROM users WHERE email = $1;

---category dropdown
SELECT DISTINCT(category_name) FROM category ORDER BY category_name;

--search
--by product
SELECT * FROM product WHERE LOWER(name) LIKE LOWER($1) ORDER BY purchase_count DESC;


--category
SELECT * FROM product p JOIN category c  ON (p.product_id=c.product_id)  
 WHERE LOWER(category_name) LIKE LOWER($1) 
 ORDER BY purchase_count DESC;


--seller
SELECT 	P.* FROM product P JOIN users U
        ON U.user_id = P.user_id 
       WHERE LOWER(U.name) LIKE LOWER($1) AND U.user_type='seller'
   ORDER BY purchase_count DESC;


--specific product
SELECT P.*, U.name AS Shop,
      STRING_AGG(C.category_name, ', ') AS category_name,
      ROUND((P.price - COALESCE(D.discount_percentage, 0) * P.price), 2) AS new_price 
      FROM product P 
      JOIN users U ON U.user_id = P.user_id AND product_id = $1
      LEFT JOIN category C ON C.product_id = P.product_id 
      LEFT JOIN discount D ON D.product_id = P.product_id
      GROUP BY P.product_id, U.name, P.price, D.discount_percentage;


--change pass
SELECT * FROM users WHERE user_id = $1;
UPDATE users SET password = $1 WHERE user_id = $2;
--adding table for cart and wishlist to show products
 WITH pro_table AS 
 (SELECT P.* 
FROM product P
JOIN category c WHERE (P.product_id=c.product_id)
JOIN discount d WHERE(d.product_id=p.product_id))


