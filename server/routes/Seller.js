const router = require('express').Router()
const pool = require('../database')
const multer = require("multer"); // for handling file uploads
const upload = multer({ dest: "uploads/" }); // specify upload directory
// adding products
router.post("/addproduct", upload.single("photo"), async (req, res) => {
    
    try {
 
      const { userid,name, price, stockQuantity, description, categories,photoUrl} = req.body;
      console.log(req.body);
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
            console.log(categoryName.trim());
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
  router.put("/updateproduct", upload.single("photo"), async (req, res) => {
    const client = await pool.connect();
    try {
      
      const { product_id, name, price, stock_quantity, description, category, photo_url } = req.body;
      console.log(name);
      console.log(req.body);
        await client.query('BEGIN');

        // Update product details
        const updatedProduct = await pool.query(
            `UPDATE Product 
            SET name = $1, price = $2, stock_quantity = $3, description = $4, photo_url = $5
            WHERE product_id = $6`,
            [name, price, stock_quantity, description, photo_url, product_id]
        );
       console.log(category);
        // Update categories
        if (category) {
          // Split the categories string into an array
          const categoriesArray = category.split(',');
      
          console.log("Updated categories:");
          console.log(categoriesArray);
      
          // Iterate over the categories array
          for (const categoryName of categoriesArray) {
              console.log(categoryName);
      
              // Perform the update query for each category
              await pool.query(
                  `UPDATE category 
                  SET category_name = $1
                  WHERE product_id = $2`,
                  [categoryName.trim(), product_id] // Trim the category name to remove any leading or trailing whitespace
              );
          }
          await client.query('COMMIT');
      } 
      

        res.status(200).json({ success: true, data: updatedProduct.rows });
    } catch (error) {
     // await client.query('ROLLBACK');
        console.error("Error updating product:", error);
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
//Fetch Specific product
router.get("/:product_id", async (req, res) => {
  try {
    const { product_id } = req.params;
    const products = await pool.query(
      `SELECT P.*, rating(P.product_id) AS rating, U.name AS Shop,
      STRING_AGG(C.category_name, ', ') AS category_name,
      ROUND((P.price - COALESCE(D.discount_percentage, 0) * P.price), 2) AS new_price 
      FROM product P 
      JOIN users U ON U.user_id = P.user_id AND product_id = $1
      LEFT JOIN category C ON C.product_id = P.product_id 
      LEFT JOIN discount D ON D.product_id = P.product_id
      GROUP BY P.product_id, U.name, P.price, D.discount_percentage;`,
      [product_id]
    );

    if (!products.rows.length) {
      res.status(404).send("Product not found");
      return;
    }

   // console.log(products.rows[0]);
    console.log("uwu");
    res.status(200).send(products.rows[0]);
  } catch (error) {
    console.error(`Error in /popular route: ${error.message}`);
    res.status(400).send(error.message);
  }
});

//unreplied reviews

router.get("/:user_id/unrepliedreviews", async (req, res) => {
  try {
    //console.log("p");
    const { user_id } = req.params;
    const products = await pool.query(
      `SELECT *
      FROM review r
      JOIN product p1 ON r.product_id = p1.product_id
      WHERE p1.user_id = $1
      AND r.reply_text IS NULL;
      `,
      [user_id]
    );

    if (!products.rows.length) {
      res.status(200).send([]);
      return;
    }

    console.log(products.rows[0]);
    console.log("uwu");
    res.status(200).send(products.rows);
  } catch (error) {
    console.error(`Error in route: ${error.message}`);
    res.status(400).send(error.message);
  }
});

//replied reviews

router.get("/:user_id/repliedreviews", async (req, res) => {
  try {
    const { user_id } = req.params;
    console.log(user_id);
    const products = await pool.query(
      `SELECT *
      FROM review r
      JOIN product p1 ON r.product_id = p1.product_id
      WHERE p1.user_id = $1
      AND r.reply_text IS NOT NULL;
      `,
      [user_id]
    );
    
    if (!products.rows.length) {
      res.status(200).send([]);
      return;
    }

   // console.log(products.rows[0]);
    console.log("uwu");
    res.status(200).send(products.rows);
  } catch (error) {
    console.error(`Error in / route: ${error.message}`);
    res.status(400).send(error.message);
  }
});

// Route to submit a reply
router.put('/submit-reply', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { user_id, product_id, reply } = req.body;

    // Update the reply_text in the database for the specified user_id and product_id
    await pool.query(
      `UPDATE review SET reply_text = $1 WHERE user_id = $2 AND product_id = $3;`,
      [reply, user_id, product_id]
    );
    await client.query('COMMIT');
    // Return a success message
    res.status(200).json({ success: true, message: 'Reply submitted successfully' });

  } catch (error) {
    console.error('Error submitting reply:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



module.exports = router;