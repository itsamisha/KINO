CREATE OR REPLACE FUNCTION "public"."purchase_gift_card"("am" numeric, "msg" varchar, "uide" varchar, "fuid" int4, "design" varchar)
  RETURNS "pg_catalog"."void" AS $BODY$
DECLARE
	UID INTEGER;
BEGIN
    SELECT user_id INTO UID FROM users WHERE email = UIDE;
		INSERT INTO gift_card (initial_amount,amount,message,user_id,from_user_id,purchase_date,design) VALUES (AM,AM,MSG,UID,FUID,CURRENT_DATE,design);
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100


CREATE OR REPLACE FUNCTION "public"."update_order_status_job"()
  RETURNS "pg_catalog"."void" AS $BODY$
DECLARE
    order_record RECORD;
    order_item_record RECORD;
BEGIN
    FOR order_record IN
        SELECT * FROM orders WHERE estimated_delivery_date <= CURRENT_DATE
    LOOP
        FOR order_item_record IN
            SELECT * FROM order_items WHERE order_id = order_record.order_id
        LOOP
            UPDATE order_items SET order_status = 'history' WHERE order_id = order_record.order_id;
        END LOOP;
    END LOOP;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100

CREATE OR REPLACE FUNCTION "public"."payment_update_with_gift_card"("uid" numeric, "gcc" text, "total_amount" numeric)
  RETURNS "pg_catalog"."numeric" AS $BODY$
DECLARE 
    gift_card_amount numeric := -1;
    result numeric := -1;
BEGIN
    SELECT amount INTO gift_card_amount FROM gift_card WHERE gift_card_code = GCC and user_id = UID;
    IF (gift_card_amount > -1 AND total_amount <= gift_card_amount) THEN
				result := 0;
    ELSIF (gift_card_amount > -1) THEN
        result := total_amount - gift_card_amount;
		END IF;
    
    RETURN result;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100