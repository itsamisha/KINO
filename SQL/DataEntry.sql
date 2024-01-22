--Category table
INSERT INTO category (category_name, product_id)
SELECT 
    'Electronics',
    product_id
FROM 
    product
WHERE 
    user_id = 21;
