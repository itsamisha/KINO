--add products--
--PROCESSING
CREATE OR REPLACE TRIGGER ADD_PROUDUCT
AFTER INSERT
ON Product
FOR EACH ROW
EXECUTE FUNCTION insert_category();

CREATE OR REPLACE FUNCTION insert_category()

RETURNS TRIGGER AS $$
BEGIN
    -- Loop through each category associated with the product
    FOREACH category_name IN ARRAY NEW.category_names
    LOOP
        
            -- Insert the category
            INSERT INTO category (category_name, product_id)
            VALUES (category_name, NEW.product_id);
       
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--deleting product
CREATE OR REPLACE FUNCTION delete_category()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete related records from other tables
    DELETE FROM category WHERE product_id = OLD.product_id;
    DELETE FROM cart_items WHERE product_id = OLD.product_id;
    DELETE FROM wishlist_items WHERE product_id = OLD.product_id;
    DELETE FROM review WHERE product_id = OLD.product_id;
    DELETE FROM discount WHERE product_id = OLD.product_id;

    RETURN OLD; -- Return the OLD row after deletion

EXCEPTION
    WHEN others THEN
        -- Log the error or handle it appropriately
        RAISE NOTICE 'Error in delete_category trigger: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

--update products--
--PROCESSING
CREATE OR REPLACE TRIGGER update_Product
AFTER INSERT
ON Product
FOR EACH ROW
EXECUTE FUNCTION update_category();

CREATE OR REPLACE FUNCTION update_category()
RETURNS TRIGGER AS $$

BEGIN

        DELETE FROM category WHERE product_id=NEW.product_id;
    -- Loop through each category associated with the product
    FOREACH category_name IN ARRAY NEW.category_names
    LOOP
        
            -- Insert the category
            
            INSERT INTO category (category_name, product_id)
            VALUES (category_name, NEW.product_id);
       
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--stock quantity update
CREATE OR REPLACE FUNCTION update_stock_quantity_after_order_cancel()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_status='cancelled' THEN
    UPDATE product SET stock_quantity = (stock_quantity+OLD.quantity)
		WHERE product_id = OLD.product_id;
    END IF;    
		RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stock_quantity
AFTER UPDATE OF order_status
ON orders
FOR EACH ROW
EXECUTE FUNCTION update_stock_quantity_after_order_cancel();

CREATE OR REPLACE FUNCTION get_orders_for_user(
    p_user_id INT,
    p_order_status VARCHAR(15)
) RETURNS TABLE(
    order_id INT,
    product_id INT,
    name VARCHAR(255),
    price DECIMAL(10, 2),
    stock_quantity INT,
    description TEXT,
    photo_url TEXT,
    order_status VARCHAR(255),
    order_date TIMESTAMP,
    estimated_delivery_date TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY 
    SELECT oi.order_id, 
           p.product_id, 
           p.name, 
           p.price, 
           p.stock_quantity, 
           p.description, 
           p.photo_url, 
           oi.order_status, 
           o.order_date,
           o.estimated_delivery_date
    FROM order_items oi
    JOIN product p ON oi.product_id = p.product_id
    JOIN orders o ON oi.order_id = o.order_id
    WHERE p.user_id = p_user_id
    AND (p_order_status <> 'history' OR oi.order_status = p_order_status);
END;
$$ LANGUAGE plpgsql;
--reply to review
CREATE OR REPLACE FUNCTION update_reply_text(
    p_user_id INT,
    p_product_id INT,
    p_reply TEXT
) 
RETURNS VARCHAR AS $$
DECLARE
    v_result VARCHAR(100);
    seller_id INT;
BEGIN
    -- Retrieve the seller ID from the product table
    
    -- Update the reply_text in the database for the specified user_id and product_id
    UPDATE review
    SET reply_text = p_reply
    WHERE user_id =  p_user_id  AND product_id = p_product_id;

    -- Check if any rows were affected by the update
    GET DIAGNOSTICS v_result = ROW_COUNT;
    IF v_result > 0 THEN
        RETURN 'Reply submitted successfully';
    ELSE
        RETURN 'No rows updated';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'Error: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql;