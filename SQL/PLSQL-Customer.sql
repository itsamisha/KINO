--cart item count
CREATE OR REPLACE FUNCTION "public"."cart_items_quantity"("uid" numeric)
  RETURNS "pg_catalog"."numeric" AS $BODY$
DECLARE
	CI numeric;
	CNT numeric;
BEGIN
	SELECT cart_id INTO CI FROM cart
	WHERE user_id = UID;
	
	SELECT COUNT(*) INTO CNT FROM cart_items
	WHERE cart_id = CI;
	
   IF CNT>0 THEN
        RETURN CNT;
    ELSE
        RETURN -1; 
    END IF;
END;
$BODY$
  LANGUAGE plpgsql

--whether in cart
CREATE OR REPLACE FUNCTION "public"."in_cart"("uid" numeric, "pid" numeric)
  RETURNS "pg_catalog"."numeric" AS $BODY$
DECLARE
	CI numeric;
	CNT numeric;
BEGIN

	SELECT cart_id INTO CI FROM cart
	WHERE user_id = UID;
	
	SELECT COUNT(*) INTO CNT FROM cart_items
	WHERE cart_id = CI AND product_id = PID;
	
   IF CNT>0 THEN
        RETURN CI;
    ELSE
        RETURN -1; 
    END IF;
END;
$BODY$
  LANGUAGE plpgsql 

--for rating
CREATE OR REPLACE FUNCTION "public"."rating"("pid" numeric)
  RETURNS "pg_catalog"."numeric" AS $BODY$
DECLARE
	R numeric;
BEGIN
    SELECT ROUND(AVG(rating),2) INTO R FROM review
		WHERE product_id = PID;
    IF R IS NOT NULL THEN
			RETURN R;
		ELSE
			RETURN 0;
		END IF;
END;
$BODY$
  LANGUAGE plpgsql 

--updating cart quantity 
CREATE OR REPLACE FUNCTION "public"."update_cart_quantity"("uid" numeric, "pid" numeric, "q" numeric)
  RETURNS "pg_catalog"."void" AS $BODY$
DECLARE
    CI numeric;
BEGIN
    SELECT cart_id INTO CI FROM cart WHERE user_id = UID;
    UPDATE cart_items SET quantity = Q
    WHERE cart_id = CI AND product_id = PID;
END;
$BODY$
  LANGUAGE plpgsql 

--confirm orders
CREATE OR REPLACE FUNCTION confirm_order(UID numeric,AD TEXT ,D numeric)
  RETURNS void AS $BODY$
DECLARE
	CI numeric;
BEGIN
		SELECT cart_id INTO CI FROM cart WHERE user_id = UID;
    INSERT INTO orders (user_id,cart_id,order_date,estimated_delivery_date,address,order_status)VALUES((SELECT user_id FROM cart WHERE 	  cart_id = CI),CI,CURRENT_DATE,CURRENT_DATE+(D * INTERVAL '1 day'),AD,'pending');
END;
$BODY$
  LANGUAGE plpgsql 

--associated triggers
--transfer cart itmes to order items
CREATE OR REPLACE FUNCTION add_cart_items_to_order_items()
RETURNS TRIGGER AS $$
DECLARE
    cart_item_row cart_items%ROWTYPE;
BEGIN
    FOR cart_item_row IN SELECT * FROM cart_items WHERE cart_id = NEW.cart_id
    LOOP
        INSERT INTO order_items (order_id, product_id, quantity)
        VALUES (NEW.order_id, cart_item_row.product_id, cart_item_row.quantity);
    END LOOP;
    DELETE FROM cart_items WHERE cart_id = NEW.cart_id; 
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transfer_cart_items
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION add_cart_items_to_order_items();

--for updating stock quantities
CREATE OR REPLACE FUNCTION update_stock_quantity_after_order()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE product SET stock_quantity = (stock_quantity-NEW.quantity)
		WHERE product_id = NEW.product_id;
		RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stock_quantity
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_stock_quantity_after_order();