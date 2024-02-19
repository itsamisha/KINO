const router = require('express').Router()
const pool = require('../database')
const multer = require("multer"); // for handling file uploads
const upload = multer({ dest: "uploads/" }); // specify upload directory
// adding products
router.post("/addproduct", upload.single("photo"), async (req, res) => {
    
    try {
 
      const { userid,name, price, stockQuantity, description, categories,photoUrl} = req.body;
      const count=0;
      console.log(userid);
      
      console.log(photoUrl);
      const newProduct=await pool.query
     (
        `INSERT INTO Product (name,price,stock_quantity,description,photo_url,user_id,purchase_count) VALUES($1, $2, $3, $4, $5,$6,$7) RETURNING *`,[name, price, stockQuantity, description,photoUrl,userid,count]
     );
  
    const productId = newProduct.rows[0].product_id;

        // Insert product categories into the category table
        console.log(categories);
        const jsonArray = JSON.parse(categories.replace(/'/g, '"'));
        console.log("newarray");
        console.log(jsonArray);
        for (const categoryName of jsonArray) {
            console.log(categoryName);
            await pool.query(
                `INSERT INTO category (category_name, product_id) 
                VALUES ($1, $2)`,
                [categoryName, productId]
            );
        }
     res.status(200).send({ success: true, data: newProduct.rows });
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });
  // update products
router.post("/updateproduct", upload.single("photo"), async (req, res) => {
    // Handle product creation logic here
    try {
 
      const { userid,name, price, stockQuantity, description, category } = req.body;
      const photoUrl = req.file ? req.file.path : ""; 
      const newProduct=await pool.query(
        `UPDATE Product 
        SET name = $1, price = $2, stock_quantity = $3, description = $4, photo_url = $5
        WHERE product_id = $6`,
        [name, price, stockQuantity, description, photoUrl, productId]
    );
    

    //update category
    await pool.query(
        `CREATE OR REPLACE TRIGGER update_Product
        AFTER INSERT
        ON Product
        FOR EACH ROW
        EXECUTE FUNCTION update_category();
        
        CREATE OR REPLACE FUNCTION update_category()
        RETURNS TRIGGER AS $$
        
        BEGIN
        
                DELETE FROM category WHERE product_id=NEW.product_id;
           
            FOREACH category_name IN ARRAY NEW.category_names
            LOOP
                
                    -- Insert the category
                    
                    INSERT INTO category (category_name, product_id)
                    VALUES (category_name, NEW.product_id);
               
            END LOOP;
        
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;`
    );
     res.status(200).send({ success: true, data: newProduct.rows });
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  //Get inventory
  router.get("/:user_id/inventory", async (req, res) => {
    try {
      const { user_id } = req.params;
      const customer = await pool.query(`SELECT P.product_id,P.name, P.photo_url
      FROM  product P 
      WHERE P.user_id =$1;`, [user_id]);
      
      if (customer.rows.length !== 0) {
        res.json(customer.rows);
      } else {
        res.status(404).json({ message: 'Seller not found or inventory empty' });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  //delete from inventory
  router.delete("/remove-from-inventory", async (req, res) => {
    const client = await pool.connect();
    try {
        const { user_id, product_id } = req.body;

        await client.query('BEGIN'); // Start transaction

        // Delete from Product table
        await pool.query('DELETE FROM Product WHERE product_id = $1', [product_id]);

        console.log(product_id);
        await client.query('COMMIT'); // Commit transaction
        res.json({ message: 'Inventory item deleted successfully' });
        //console.log(message);
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback transaction if error occurs
        console.error(`Error deleting inventory: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release(); // Release client back to the pool
    }
});

module.exports = router;



  


module.exports = router