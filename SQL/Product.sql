ALTER TABLE product
ADD COLUMN photo_url TEXT;

UPDATE product SET photo_url = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' WHERE product_id = 2;

UPDATE product SET photo_url = 'https://images.pexels.com/photos/1528851/pexels-photo-1528851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' WHERE product_id = 10;