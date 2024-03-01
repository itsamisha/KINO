ALTER TABLE gift_card
DROP COLUMN cart_id;

ALTER TABLE gift_card
ADD COLUMN initial_amount numeric(10,2);

ALTER TABLE gift_card
ADD CONSTRAINT chk_initial_amount_positive CHECK (initial_amount >= 0);

ALTER TABLE gift_card
ADD COLUMN message TEXT;

ALTER TABLE gift_card
ADD COLUMN from_user_id INTEGER;


ALTER TABLE gift_card
ADD COLUMN purchase_date DATE;


ALTER TABLE gift_card
ADD COLUMN design TEXT;

ALTER TABLE gift_card
ALTER COLUMN amount SET DATA TYPE numeric(10,2);