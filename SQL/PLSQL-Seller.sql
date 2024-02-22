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
    IF NEW.order_status="cancelled" THEN
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
