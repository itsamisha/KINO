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