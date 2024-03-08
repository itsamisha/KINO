


--update products--
--PROCESSING
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
CREATE OR REPLACE TRIGGER update_Product
AFTER INSERT
ON Product
FOR EACH ROW
EXECUTE FUNCTION update_category();


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

--all orders
CREATE OR REPLACE FUNCTION get_orders_for_all_user(
   
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
    WHERE( oi.order_status = p_order_status);
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION get_revenue(p_interval VARCHAR) RETURNS TABLE (period VARCHAR, total_revenue NUMERIC) AS $$
BEGIN
    IF p_interval = 'monthly' THEN
        RETURN QUERY
        SELECT 
            TO_CHAR(purchase_date, 'YYYY-MM') AS period,
            SUM(initial_amount) AS total_revenue
        FROM 
            gift_card
        GROUP BY 
            TO_CHAR(purchase_date, 'YYYY-MM')
        ORDER BY 
            TO_CHAR(purchase_date, 'YYYY-MM');
    ELSIF p_interval = 'weekly' THEN
        RETURN QUERY
        SELECT 
            TO_CHAR(purchase_date, 'IYYY-IW') AS period,
            SUM(initial_amount) AS total_revenue
        FROM 
            gift_card
        GROUP BY 
            TO_CHAR(purchase_date, 'IYYY-IW')
        ORDER BY 
            TO_CHAR(purchase_date, 'IYYY-IW');
    ELSE
        -- Handle invalid interval
        RAISE EXCEPTION 'Invalid interval: %', p_interval;
    END IF;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION get_shipping_revenue(p_interval VARCHAR) RETURNS TABLE (period VARCHAR, total_shipping_revenue NUMERIC) AS $$
BEGIN
    IF p_interval = 'monthly' THEN
        RETURN QUERY
        SELECT 
            TO_CHAR(shipping_date, 'YYYY-MM') AS period,
            SUM(shipping_charge) AS total_shipping_revenue
        FROM 
            orders
        GROUP BY 
            TO_CHAR(shipping_date, 'YYYY-MM')
        ORDER BY 
            TO_CHAR(shipping_date, 'YYYY-MM');
    ELSIF p_interval = 'weekly' THEN
        RETURN QUERY
        SELECT 
            TO_CHAR(shipping_date, 'IYYY-IW') AS period,
            SUM(shipping_charge) AS total_shipping_revenue
        FROM 
            orders
        GROUP BY 
            TO_CHAR(shipping_date, 'IYYY-IW')
        ORDER BY 
            TO_CHAR(shipping_date, 'IYYY-IW');
    ELSE
        -- Handle invalid interval
        RAISE EXCEPTION 'Invalid interval: %', p_interval;
    END IF;
END;
$$ LANGUAGE plpgsql;
