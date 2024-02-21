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