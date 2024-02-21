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


