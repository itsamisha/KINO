CREATE TABLE Shipping_Zones (
    post_code INT PRIMARY KEY,
    division VARCHAR(100),
    district VARCHAR(100),
    thana VARCHAR(100),
    suboffice VARCHAR(100),
    distance_from_dhaka INT,
    shipping_charge INT
);

CREATE TABLE Address (
    address_id SERIAL PRIMARY KEY,
    house_no VARCHAR(50),
    road_no VARCHAR(50),
    post_code INT,
    FOREIGN KEY (post_code) REFERENCES Shipping_Zones(post_code)
);

CREATE TABLE Order_Shipping_Charges (
    order_id SERIAL PRIMARY KEY,
    shipping_charge DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

--update the address in orders
ALTER TABLE orders
RENAME COLUMN address TO address_id;

ALTER TABLE orders
ALTER COLUMN address_id TYPE INT;

ALTER TABLE orders
ADD CONSTRAINT orders_unique_address_id UNIQUE (address_id);

ALTER TABLE address
ADD CONSTRAINT fk_order_address
FOREIGN KEY (address_id) REFERENCES orders(address_id)
ON DELETE CASCADE;

CREATE SEQUENCE address_id_seq;

ALTER TABLE orders
ALTER COLUMN address_id SET DEFAULT nextval('address_id_seq');

ALTER TABLE orders
ALTER COLUMN address_id TYPE INTEGER;

UPDATE orders
SET address_id = nextval('address_id_seq')
WHERE address_id IS NULL;

-- gift card
ALTER TABLE gift_card
ADD gift_card_code VARCHAR(12);

--trigger for updating the gift card code
CREATE OR REPLACE FUNCTION "public"."generate_gift_card_code"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
BEGIN
		UPDATE gift_card SET gift_card_code = LEFT(md5(NEW.gift_card_id::TEXT),12) WHERE gift_card_id = NEW.gift_card_id;
    RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100

CREATE TRIGGER gift_card_code_trigger
AFTER INSERT ON gift_cards
FOR EACH ROW
EXECUTE FUNCTION generate_gift_card_code();


--function for processing payment with gift card
CREATE OR REPLACE FUNCTION "public"."payment_with_gift_card"("uid" numeric, "gcc" text, "total_amount" numeric)
  RETURNS "pg_catalog"."numeric" AS $BODY$
DECLARE 
	gift_card_amount numeric := -1;
	result numeric := -1;
BEGIN
		SELECT amount INTO gift_card_amount FROM gift_card WHERE gift_card_code = GCC and user_id = UID;
		IF gift_card_amount > -1 THEN 
				IF (total_amount <= gift_card_amount) THEN
			UPDATE gift_card SET amount = (gift_card_amount - total_amount)  
			WHERE gift_card_code = GCC and user_id = UID;
		ELSE
			result := total_amount - gift_card_amount;
			UPDATE gift_card SET amount = 0 
			WHERE gift_card_code = GCC and user_id = UID;
		END IF;
			
		END IF;
	
		RETURN result;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100

--trigger for deleting used gift card
CREATE OR REPLACE FUNCTION delete_used_gift_cards()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM gift_card WHERE amount = 0;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE COST 100;

CREATE TRIGGER used_gift_card_trigger
AFTER UPDATE ON gift_card
FOR EACH ROW
EXECUTE FUNCTION delete_used_gift_cards();

--adding dues in payment for COD 
ALTER TABLE payment
ADD dues DECIMAL(10,2) DEFAULT 0;

--fixing prev issue
ALTER TABLE order_shipping_charges
DROP CONSTRAINT order_shipping_charges_order_id_fkey,
ADD CONSTRAINT order_shipping_charges_order_id_fkey
FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE;

--functions for order confirmation
CREATE OR REPLACE FUNCTION "public"."confirm_order_bank"("uid" numeric, "house" text, "road" text, "pc" numeric, "d" numeric, "card_no" text)
  RETURNS "pg_catalog"."void" AS $BODY$
DECLARE
    CI numeric;
    AI numeric;
    OI numeric;
    SC numeric := 0;
BEGIN
    -- Get cart_id for the given user_id
    SELECT cart_id INTO CI FROM cart WHERE user_id = uid;
    
    -- Insert into orders table and return address_id and order_id
    INSERT INTO orders (user_id, cart_id, order_date, estimated_delivery_date, order_status)
    VALUES ((SELECT user_id FROM cart WHERE cart_id = CI), CI, CURRENT_DATE, CURRENT_DATE + (d * INTERVAL '1 day'), 'pending')
    RETURNING address_id, order_id INTO AI, OI;

    -- Get shipping charge from shipping_zones based on the provided post_code
    SELECT shipping_charge INTO SC FROM shipping_zones WHERE post_code = pc;
    
    -- Add extra charge if delivery is rapid
    IF d = 0 THEN
        SC := SC + 100;
    END IF;

    -- Insert shipping charge into order_shipping_charges table
    INSERT INTO order_shipping_charges (order_id, shipping_charge) VALUES (OI, SC);
    
    -- Insert address details into the address table
    INSERT INTO address (address_id, house_no, road_no, post_code) VALUES (AI, house, road, pc);
    
    -- Insert payment details into the payment table
    INSERT INTO payment (order_id, payment_method, card_number) VALUES (OI, 'bank', card_no);
    
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100

CREATE OR REPLACE FUNCTION "public"."confirm_order_COD"("uid" numeric, "house" text, "road" text, "pc" numeric, "d" numeric, "total_amount" numeric)
  RETURNS "pg_catalog"."void" AS $BODY$
DECLARE
	CI numeric;
	AI numeric;
	OI numeric;
	SC numeric := 0;
BEGIN
	SELECT cart_id INTO CI FROM cart WHERE user_id = uid;
	INSERT INTO orders (user_id, cart_id, order_date, estimated_delivery_date, order_status)
	VALUES ((SELECT user_id FROM cart WHERE cart_id = CI), CI, CURRENT_DATE, CURRENT_DATE + (d * INTERVAL '1 day'), 'pending')
	RETURNING address_id, order_id INTO AI, OI;
	SELECT shipping_charge INTO SC FROM shipping_zones WHERE post_code = pc;
	IF d = 0 THEN
		SC := SC + 100;
	END IF;
	
	INSERT INTO order_shipping_charges (order_id, shipping_charge) VALUES (OI, SC);
	INSERT INTO address (address_id, house_no, road_no, post_code) VALUES (AI, house, road, PC);
	INSERT INTO payment (order_id, payment_method, dues) VALUES (OI, 'COD', total_amount);
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100

CREATE OR REPLACE FUNCTION "public"."confirm_order_mobile_banking"("uid" numeric, "house" text, "road" text, "pc" numeric, "d" numeric, "phone_no" text)
  RETURNS "pg_catalog"."void" AS $BODY$
DECLARE
    CI numeric;
    AI numeric;
    OI numeric;
    SC numeric := 0;
BEGIN
    -- Get cart_id for the given user_id
    SELECT cart_id INTO CI FROM cart WHERE user_id = uid;
    
    -- Insert into orders table and return address_id and order_id
    INSERT INTO orders (user_id, cart_id, order_date, estimated_delivery_date, order_status)
    VALUES ((SELECT user_id FROM cart WHERE cart_id = CI), CI, CURRENT_DATE, CURRENT_DATE + (d * INTERVAL '1 day'), 'pending')
    RETURNING address_id, order_id INTO AI, OI;

    -- Get shipping charge from shipping_zones based on the provided post_code
    SELECT shipping_charge INTO SC FROM shipping_zones WHERE post_code = pc;
    
    -- Add extra charge if delivery is rapid
    IF d = 0 THEN
        SC := SC + 100;
    END IF;

    -- Insert shipping charge into order_shipping_charges table
    INSERT INTO order_shipping_charges (order_id, shipping_charge) VALUES (OI, SC);
    
    -- Insert address details into the address table
    INSERT INTO address (address_id, house_no, road_no, post_code) VALUES (AI, house, road, pc);
    
    -- Insert payment details into the payment table
    INSERT INTO payment (order_id, payment_method, phone_number) VALUES (OI, 'bKash', phone_no);
    
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100