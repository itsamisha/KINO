const router = require('express').Router()
const pool = require('../database')
const multer = require("multer"); // for handling file uploads
const upload = multer({ dest: "uploads/" }); // specify upload directory



//get user info
router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const shop = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
    if (shop.rows.length === 1) {
      res.json(shop.rows);
    } else {
      res.status(404).json({ message: 'Shop not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}) 

//update profile info
router.put("/update", async (req, res) => {
  try {
    const { user_id, name, email, phone_number, locations,bank_account_number } = req.body;

    const update = await pool.query(`
      UPDATE users 
      SET name = $1, email = $2, phone_number = $3, locations = $4, bank_account_number = $5
      WHERE user_id = $6
      RETURNING *
    `, [name, email, phone_number, locations, bank_account_number, user_id]);

    if (update.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(update.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// adding products
router.post("/addproduct", upload.single("photo"), async (req, res) => {
    
    try {
      const { userid,name, price, stockQuantity, description,discount_percentage, categories,photoUrl} = req.body;
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
        //console.log("newarray");
        //console.log(jsonArray);
        for (const categoryName of jsonArray) {
           // console.log(categoryName.trim());
            await pool.query(
                `INSERT INTO category (category_name, product_id) 
                VALUES ($1, $2)`,
                [categoryName, productId]
            );
        }// Check if discount information is provided
if (req.body.discountPercentage && req.body.discountPercentage >= 0 && req.body.discountPercentage <= 100) {
  // Convert start and end dates to Date objects
  const start_date = new Date(req.body.start_date);
  const end_date = new Date(req.body.end_date);

  // Insert discount information into the discount table
  if(req.body.discountPercentage)
  {
    await pool.query(
      `INSERT INTO discount (product_id, start_date, end_date, discount_percentage) 
      VALUES ($1, $2, $3, $4)`,
      [productId, start_date, end_date,(req.body.discountPercentage)/100]
  );
  }
  
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
        const { product_id, name, price, stock_quantity, description, category, photo_url, startDate, end_date, discountPercentage } = req.body;
        console.log(req.body);

        await client.query('BEGIN');

        // Update product details
        const updatedProduct = await pool.query(
            `UPDATE Product 
            SET name = $1, price = $2, stock_quantity = $3, description = $4, photo_url = $5
            WHERE product_id = $6`,
            [name, price, stock_quantity, description, photo_url, product_id]
        );

        // Update categories
        if (category) {
          // Split the categories string into an array
          const categoriesArray = category.split(',');
      
          // Delete existing categories for the product
          await pool.query(
              `DELETE FROM category
              WHERE product_id = $1`,
              [product_id]
          );
      
          // Insert new categories for the product
          for (const categoryName of categoriesArray) {
              await pool.query(
                  `INSERT INTO category (category_name, product_id) 
                  VALUES ($1, $2)`,
                  [categoryName.trim(), product_id]
              );
          }
      }
      
        else{
           // Split the categories string into an array
           const categoriesArray = category.split(',');

           // Iterate over the categories array
           for (const categoryName of categoriesArray) {
               // Perform the update query for each category
               await pool.query(
                   `INSERT INTO category (category_name, product_id) 
                   VALUES ($1, $2)`,
                   [categoryName.trim(), product_id] // Trim the category name to remove any leading or trailing whitespace
               );
           }
        }

        // Check if a discount exists for the product
        const existingDiscount = await pool.query(
            `SELECT * FROM discount WHERE product_id = $1`,
            [product_id]
        );

        if (existingDiscount.rows.length === 0&& discountPercentage ) {
            // If no discount exists, insert a new discount record
            await pool.query(
                `INSERT INTO discount (product_id, start_date, end_date, discount_percentage) 
                VALUES ($1, $2, $3, $4)`,
                [product_id, startDate, end_date, discountPercentage/100 ]
            );
        } else {
            // If a discount already exists, update the existing discount information
            await pool.query(
                `UPDATE discount 
                SET start_date = $1, end_date = $2, discount_percentage = $3
                WHERE product_id = $4`,
                [startDate, end_date, discountPercentage/100, product_id]
            );
        }

        await client.query('COMMIT');

        res.status(200).json({ success: true, data: updatedProduct.rows });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error updating product:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    } finally {
        client.release();
    }
});

  //Get inventory
  router.get("/:user_id/inventory", async (req, res) => {
    try {
      const { user_id } = req.params;
      console.log(user_id);
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
        await pool.query('DELETE FROM Discount WHERE product_id = $1', [product_id]);
        await pool.query('DELETE FROM Category WHERE product_id = $1', [product_id]);


        await pool.query('DELETE FROM Product WHERE product_id = $1', [product_id]);

        console.log(product_id);
        await client.query('COMMIT'); 
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
      `SELECT r.*, p1.user_id AS product_user_id,p1.photo_url,p1.description,p1.name,u1.name AS customer_name
      FROM review r
      JOIN product p1 ON r.product_id = p1.product_id
      JOIN users u1 ON r.user_id=u1.user_id
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
   // console.log("uwu");
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
      `SELECT r.*, p1.user_id AS product_user_id,p1.photo_url,p1.description,p1.name,u1.name AS customer_name
      FROM review r
      JOIN product p1 ON r.product_id = p1.product_id
      JOIN users u1 ON r.user_id=u1.user_id
      WHERE p1.user_id = $1
      AND r.reply_text IS NOT NULL;
      
      `,
      [user_id]
    );
    console.log(products.rows);
    
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
    console.log(req.body);

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

//top rating
router.get('/:user_id/top-rated-products', async (req, res) => {
  try {
     const {user_id}=req.params;
    const topRatedProducts = await pool.query(`
    SELECT p.product_id, name, AVG(rating) AS avg_rating
    FROM product p JOIN review r 
    ON(p.product_id=r.product_id)
    GROUP BY p.product_id, name
    HAVING p.user_id=$1
    ORDER BY avg_rating DESC
    LIMIT 10;
    `,[user_id]);
    res.json(topRatedProducts.rows);
  } catch (error) {
    console.error('Error fetching top-rated products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//worst rating
router.get('/:user_id/worst-rated-products', async (req, res) => {
  try {
     const {user_id}=req.params;
    const topRatedProducts = await pool.query(`
    SELECT p.product_id, name, AVG(rating) AS avg_rating
    FROM product p JOIN review r 
    ON(p.product_id=r.product_id)
    GROUP BY p.product_id, name
    HAVING p.user_id=$1
    ORDER BY avg_rating 
    LIMIT 10;
    `,[user_id]);
    res.json(topRatedProducts.rows);
  } catch (error) {
    console.error('Error fetching top-rated products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get top-sold products
router.get('/:user_id/top-sold-products', async (req, res) => {
  try {
    const {user_id}=req.params;
    const topSoldProducts = await pool.query(`
      SELECT product_id, name,purchase_count
      FROM product
      GROUP BY product_id, name
      HAVING user_id=$1
      ORDER BY purchase_count DESC
      LIMIT 10;
    `,[user_id]);
    res.json(topSoldProducts.rows);
  } catch (error) {
    console.error('Error fetching top-sold products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Get least-sold products
router.get('/:user_id/least-sold-products', async (req, res) => {
  try {
    const {user_id}=req.params;
    const topSoldProducts = await pool.query(`
      SELECT product_id, name,purchase_count
      FROM product
      GROUP BY product_id, name
      HAVING user_id=$1
      ORDER BY purchase_count 
      LIMIT 10;
    `,[user_id]);
    res.json(topSoldProducts.rows);
  } catch (error) {
    console.error('Error fetching top-sold products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//get lowstock products
router.get('/:user_id/low-stock-products', async (req, res) => {
  try {
    const {user_id}=req.params;
    const topSoldProducts = await pool.query(`
      SELECT product_id, name,purchase_count,stock_quantity
      FROM product
      GROUP BY product_id, name
      HAVING user_id=$1 
      ORDER BY stock_quantity
      LIMIT 10;
    `,[user_id]);
    res.json(topSoldProducts.rows);
  } catch (error) {
    console.error('Error fetching low-stock products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get order status distribution
router.get('/:user_id/order-status-distribution', async (req, res) => {
  try {
    const {user_id}=req.params;
    const orderStatusDistribution = await pool.query(`
    SELECT p.product_id, name,order_status
    FROM product p 
    join order_items o ON(p.product_id=o.product_id)
    JOIN orders o1 ON(o1.order_id=o.order_id)
    GROUP BY p.product_id, name,o.order_status
    HAVING p.user_id=$1;
    `,[user_id]);
    console.log(orderStatusDistribution.rows);
    res.json(orderStatusDistribution.rows);
  } catch (error) {
    console.error('Error fetching order status distribution:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get revenue data
router.get('/:user_id/revenue-data', async (req, res) => {
  try {
    const { user_id } = req.params;
    const revenueData = await pool.query(`
    SELECT 
    SUM(
        p.price - COALESCE(
            (SELECT discount_percentage * p.price FROM discount WHERE product_id = p.product_id),
            0
        )
    ) AS revenue,
    o.order_date
FROM 
    orders o
JOIN 
    order_items o1 ON o.order_id = o1.order_id
JOIN 
    product p ON p.product_id = o1.product_id
WHERE 
    p.user_id = $1
GROUP BY 
    o.order_date;


    `, [user_id]);
    res.json(revenueData.rows);
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//get orders
router.get('/:user_id/:status/orders', async (req, res) => {
  try {
    const { user_id,status } = req.params;
    const orderData=await pool.query(`
    SELECT * FROM get_orders_for_user($1, $2)
  `, [user_id,status]);
  console.log(status);
  console.log(orderData.rows);
    res.json(orderData.rows);
  } catch (error) {
    console.error('Error fetching ordersellers data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//cancel order from seller
router.put('/cancel-order/:order_id/:product_id',async(req,res)=>{
  const client=await pool.connect();
try{
  await client.query('BEGIN');
  const{order_id,product_id}=req.params;
  await pool.query(
    `UPDATE order_items SET order_status='cancelled'
    WHERE order_id=$1 AND product_id=$2;`,
    [order_id,product_id]
  );
  await client.query('COMMIT');
  res.status(200).json({ success: true, message: 'Order cancelled successfully' });


}catch (error) {
  console.error('Error Cancelling ORDER:', error.message);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
}

}
);
//confirm order from seller
router.put('/confirm-order/:order_id/:product_id',async(req,res)=>{
  const client=await pool.connect();
try{
  await client.query('BEGIN');
  const{order_id,product_id}=req.params;
  await pool.query(
    `UPDATE order_items SET order_status='to receive'
    WHERE order_id=$1 AND product_id=$2;`,
    [order_id,product_id]
  );
  await client.query('COMMIT');
  res.status(200).json({ success: true, message: 'Order confirmed successfully' });


}catch (error) {
  console.error('Error CONFIRMING ORDER from seller:', error.message);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
}

}
);


module.exports = router;