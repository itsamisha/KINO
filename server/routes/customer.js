const router = require('express').Router()
const pool = require('../database')
const bcrpyt = require('bcrypt')

router.get("/:user_id", async (req, res) => {
    try {
      const { user_id } = req.params;
      const customer = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
      if (customer.rows.length === 1) {
        res.json(customer.rows);
      } else {
        res.status(404).json({ message: 'Customer not found' });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }) 
 
 //Update Profile Info
  // router.put("/update", async (req, res) => {
  //   try {
  //     const { user_id, name, email, phone_number, preferred_payment_method } = req.body;
  //     const update = await pool.query(`UPDATE users SET
  //     name = $1,
  //     email = $2,
  //     phone_number = $3,
  //     preferred_payment_method = $4
  //     WHERE user_id = $5
  //     RETURNING *`, [name, email, phone_number, preferred_payment_method,user_id]);
  //     res.status(200).json(update.rows[0])
  //     console.log(update.rows[0])
  //   } catch (error) {
  //     console.error(error.message);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // });
  router.put("/update", async (req, res) => {
    try {
      const { user_id, name, email, phone_number, preferred_payment_method } = req.body;
  
      const update = await pool.query(`
        UPDATE users 
        SET name = $1, email = $2, phone_number = $3, preferred_payment_method = $4
        WHERE user_id = $5
        RETURNING *
      `, [name, email, phone_number, preferred_payment_method, user_id]);
  
      if (update.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(update.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  

  //Get Product Details
  router.post("/:user_id/:product_id", async (req, res) => {
    try {
      const { user_id,product_id } = req.params;
      const count = await pool.query(
        `SELECT COUNT(*),in_cart($1,$2) AS IN_CART
        FROM wishlist_items 
        WHERE wishlist_id = (SELECT W.wishlist_id
        FROM users U LEFT JOIN wishlist W
        ON U.user_id = W.user_id 
        WHERE U.user_id = $1) AND product_id = $2;`,
        [user_id,product_id]
      );
  
      if (!count.rows.length) {
        res.status(404).send("Error in checking whether this product is in the wishlist");
        return;
      }
  
      res.status(200).send(count.rows[0]);
    } catch (error) {
      console.error(`Error in /customer/:user_id/:product_id route: ${error.message}`);
      res.status(400).send(error.message);
    }
  });
  
  //Get Cart Products
  router.get("/:user_id/cart", async (req, res) => {
    try {
      const { user_id } = req.params;
      const customer = await pool.query(`SELECT P.product_id,P."name", P.photo_url, P.price,P.stock_quantity, CI.quantity 
      FROM users U LEFT JOIN cart C
      ON U.user_id = C.user_id
      AND U.user_id = $1
      JOIN cart_items CI 
      ON CI.cart_id = C.cart_id
      JOIN product P
      ON CI.product_id = P.product_id;`, [user_id]);
      
      if (customer.rows.length !== 0) {
        res.json(customer.rows);
      } else {
        res.status(404).json({ message: 'Customer not found or wishlist empty' });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

  //Get cart items count
  router.get("/:user_id/cart_items", async (req, res) => {
    try {
      const { user_id } = req.params;
      const customer = await pool.query(`SELECT cart_items_quantity($1) AS cart_items`, [user_id]);
      if (customer.rows.length !== 0) {
        res.json(customer.rows[0]);
      } else {
        res.status(404).json({ message: 'Error in /user_id/cart_items' });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

  //Add to Cart
  router.post("/add-to-cart", async (req,res) => {
    try {
        let cart_id
        const {user_id,product_id,quantity} = req.body
        const oldCart = await pool.query(`SELECT *
        FROM cart
        WHERE user_id = $1;`, [user_id])
        if(oldCart.rows.length === 0){
            const cart = await pool.query(`INSERT INTO cart (user_id,create_date) 
            VALUES ($1,CURRENT_DATE) RETURNING *`,[user_id])
            cart_id = cart.rows[0].cart_id
        }

        else{
           cart_id = oldCart.rows[0].cart_id
           const cart_item = await pool.query(`INSERT INTO cart_items 
           (cart_id,product_id,quantity) VALUES ($1,$2,$3) RETURNING *`,[cart_id,product_id,quantity])
           res.json({data: cart_item.rows})
        }
        
    } catch (error) {
        console.error(`Error in /customer/add-to-cart route: ${error.message}`);
        res.status(500).send({success: false, error: error.message})
    }
  })

  //Update Quantity in Cart 
  router.put("/update-cart-quantity", async (req, res) => {
    try {
      const { user_id, product_id, quantity } = req.body;
      const update = await pool.query(`SELECT update_cart_quantity($1,$2,$3)`, [user_id,product_id,quantity]);
      res.status(200).json(update.rows[0])
      console.log(update.rows[0])
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  //Remove from Cart
  router.delete("/delete-from-cart", async (req,res) => {
    try {
      const { user_id, product_id } = req.body;
      await pool.query(`DELETE FROM cart_items 
      WHERE cart_id = (SELECT cart_id FROM cart
        WHERE user_id = $1)
      AND product_id = $2`, [user_id,product_id]);
      res.status(200).json({message : `Cart item deleted successfully`})
    }
    catch (error) {
      console.error(`Error in "/customer/delete-from-cart"` + error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

  ////Payment and Order Confirmation

  //Redeeming gift card
  router.get("/:user_id/:gift_card_code/:total_amount", async (req, res) => {
    try {
      const { user_id ,gift_card_code, total_amount} = req.params;
      const response = await pool.query(`SELECT payment_update_with_gift_card($1,$2,$3) AS new_total_price`, [user_id,gift_card_code,total_amount]);
      if (response.rows.length !== 0) {
        res.json(response.rows[0]);
      } else {
        res.status(404).json({ message: 'Error in /user_id/gift_card_code/total_amount' });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

 //Actually using gift card
  router.get("/use_gift_card/:user_id/:gift_card_code/:total_amount", async (req, res) => {
    try {
      const { user_id ,gift_card_code, total_amount} = req.params;
      const response = await pool.query(`SELECT confirm_payment_with_gift_card($1,$2,$3) AS new_total_price`, [user_id,gift_card_code,total_amount]);
      if (response.rows.length !== 0) {
        res.json(response.rows[0]);
      } else {
        res.status(404).json({ message: 'Error in /use_gift_card/user_id/gift_card_code/total_amount' });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

  //Paying with mobile banking 
  router.post("/confirm_order_mobile_banking", async (req,res) => {
    try {
        const {user_id,house,road,post_code,day,phone_no} = req.body
            const response = await pool.query(`SELECT confirm_order_mobile_banking($1,$2,$3,$4,$5,$6);`,[user_id,house,road,post_code,day,phone_no])
            console.log(response);
        console.log(response.rows);
        res.json({ success: true, data: response.rows[0] });
      
    } catch (error) {
        console.error(`Error in /customer/confirm_order_mobile_banking: ${error.message}`);
        res.status(500).send({success: false, error: error.message})
    }
  })
  //paying with bank card
  router.post("/confirm_order_bank", async (req,res) => {
    try {
        const {user_id,house,road,post_code,day,card_no} = req.body
            const response = await pool.query(`SELECT confirm_order_bank($1,$2,$3,$4,$5,$6);`,[user_id,house,road,post_code,day,card_no])
            console.log(response);
        console.log(response.rows);
        res.json({ success: true, data: response.rows[0]});
      
    } catch (error) {
        console.error(`Error in /customer/confirm_order_bank: ${error.message}`);
        res.status(500).send({success: false, error: error.message})
    }
  })
  //Cash on delivery
  router.post("/confirm_order_COD", async (req,res) => {
    try {
        const {user_id,house,road,post_code,day} = req.body
        console.log(req.body)
            const response = await pool.query(`SELECT confirm_order_cod($1,$2,$3,$4,$5);`,[user_id,house,road,post_code,day])
            console.log(response);
        console.log(response.rows);
        res.json({ success: true, data: response.rows[0] });
      
    } catch (error) {
        console.error(`Error in /customer/confirm_order_COD: ${error.message}`);
        res.status(500).send({success: false, error: error.message})
    }
  })
    
  router.post("/get-orders", async (req, res) => {
    try {
        const { user_id, option } = req.body;
        const orders = await pool.query(`
            SELECT 
                P.name, 
                P.photo_url, 
                ROUND((P.price - (COALESCE(D.discount_percentage, 0) * P.price)), 2) AS price, 
                OI.quantity, 
                O.order_date,
                OI.order_item_id,
                O.order_id
            FROM 
                product P 
            JOIN 
                order_items OI ON P.product_id = OI.product_id
            JOIN 
                orders O ON O.order_id = OI.order_id
            LEFT JOIN 
                discount D ON D.product_id = P.product_id
            WHERE 
                O.user_id = $1 AND
                OI.order_status = $2
            ORDER BY O.order_date DESC;
        `, [user_id, option]); 
    
        if (orders.rows.length > 0) {
            res.json(orders.rows);
        } else {
            res.status(404).json({ message: 'No pending orders found for the user' });
        }
    } catch (error) {
        console.error(`Error in /customer/get-orders: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


  //Get Wishlist 
  router.get("/:user_id/wishlist", async (req, res) => {
    try {
      const { user_id } = req.params;
      const customer = await pool.query(`SELECT P.product_id,P.name,P.photo_url,WI.wishlist_item_id,in_cart($1,P.product_id) AS in_cart,
      ROUND(COALESCE(D.discount_percentage, 0)*100) AS discount
      FROM users U LEFT JOIN wishlist W 
      ON U.user_id = W.user_id AND U.user_id = $1
      JOIN wishlist_items WI 
      ON WI.wishlist_id = W.wishlist_id
      JOIN product P 
      ON P.product_id = WI.product_id
      LEFT JOIN discount D ON D.product_id = P.product_id;
      `, [user_id]);
      
      if (customer.rows.length !== 0) {
        res.json(customer.rows);
      } else {
        res.status(404).json({ message: 'Customer not found or wishlist empty' });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

  //Add to wishlist
  router.post("/add-to-wishlist", async (req,res) => {
    try {
        let wishlist_id 
        const {user_id,product_id} = req.body
        const oldWishlist = await pool.query(`SELECT *
        FROM wishlist
        WHERE user_id = $1;`, [user_id])
        if(oldWishlist.rows.length === 0){
            const wishlist = await pool.query(`INSERT INTO wishlist (user_id) 
            VALUES ($1) RETURNING *`,[user_id])
            wishlist_id = wishlist.rows[0].wishlist_id
        }

        else{
           wishlist_id = oldWishlist.rows[0].wishlist_id
        }
        const existingItem = await pool.query(`SELECT *
        FROM wishlist_items
        WHERE wishlist_id = $1 AND product_id = $2;`, [wishlist_id, product_id]);

        if (existingItem.rows.length > 0) {
            res.json({ message: "Product already exists in the wishlist" });
            return;
        }

        const insertNewItem = await pool.query(`INSERT INTO wishlist_items 
        (wishlist_id, product_id) VALUES ($1, $2) RETURNING *;`, [wishlist_id, product_id]);

    } catch (error) {
        console.error(`Error in /customer/add-to-wishlist route: ${error.message}`);
        res.status(500).send({success: false, error: error.message})
    }
  })

  //Delete from wishlist
  router.delete("/remove-from-wishlist", async (req, res) => {
      try {
        const {user_id,product_id} = req.body
          await pool.query(`
          DELETE FROM wishlist_items
          WHERE wishlist_item_id = 
          (SELECT WI.wishlist_item_id
          FROM wishlist_items WI 
          JOIN wishlist W ON WI.wishlist_id = W.wishlist_id
          JOIN product P ON WI.product_id = P.product_id
          WHERE W.user_id = $1
          AND P.product_id = $2);
          `, [user_id,product_id]);
          res.json({ message: 'Wishlist item deleted successfully' });
      } catch (error) {
          console.error(`Error deleting wishlist: ${error.message}`);
          res.status(500).json({ error: 'Internal Server Error' });
      }
  })
  
  //To be reviewed products
  router.get("/:user_id/", async (req,res) => {
    try {
      const {user_id} = req.params;
      const products = await pool.query(`SELECT P.product_id, P."name", P.photo_url, O.order_date, R.rating
      FROM orders O LEFT JOIN review R
      ON O.user_id = R.user_id
      AND O.user_id = $1
      AND R.rating IS NULL
      JOIN product P
      ON R.product_id = P.product_id;`,[user_id])

      if(products.rows.length===0){
        res.json({message:'No products left to be reviewed'})
      }
      else{
        res.json(products.rows)
      }
    } catch (error) {
      console.error(`Error /customer/to-be-reviewed: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

  //Add Review
  router.post("/add-review", async (req,res) => {
    try {
        console.log(req.body)
        const {user_id, product_id, review_text, rating} = req.body;
        const review = await pool.query(`INSERT INTO review (user_id,product_id,review_text,rating,created_at) VALUES($1,$2,$3,$4,CURRENT_DATE) 
        RETURNING *`,[user_id,product_id,review_text,rating])
        res.json({ message: `Review -- user -- ${user_id} -- product_id -- ${product_id}` });
    } catch (error) {
        console.error(`Error in /customer/add-review route: ${error.message}`);
        res.status(500).send({success: false, error: error.message})
    }
  })

  //Delete review
  router.delete("/delete-review", async (req, res) => {
    try {
      const {user_id,product_id} = req.body
        await pool.query(`
        DELETE FROM review
        WHERE user_id = $1
        AND product_id = $2
        `, [user_id,product_id]);
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error(`Error deleting review: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  })

  router.put("/edit-review", async (req, res) => {
    try {
      const { user_id, product_id, new_rating, new_review_text } = req.body;
      await pool.query(`
        UPDATE review
        SET rating = $1,
            review_text = $2
        WHERE user_id = $3
        AND product_id = $4
      `, [new_rating, new_review_text, user_id, product_id]);
  
      res.json({ message: 'Review updated successfully' });
    } catch (error) {
      console.error(`Error updating review: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  router.post("/reviews", async (req, res) => {
    try {
      const { userId, selectedOption } = req.body;
      if(selectedOption === 'previous'){
        const products = await pool.query(`
        SELECT R.review_text, R.reply_text, R.created_at, R.rating, P.photo_url, P.name, P.product_id AS PID FROM review R JOIN users U ON R.user_id = U.user_id
        JOIN product P ON P.product_id = R.product_id
        WHERE U.user_id = $1;`,[userId])
  
        if(products.rows.length===0){
          return res.json({message:'No products left to be reviewed'})
        } else {
          return res.json(products.rows)
        }
      }

      else{
        const products = await pool.query(`SELECT DISTINCT P.photo_url, P.name, P.product_id AS pid FROM users U 
          JOIN orders O ON U.user_id = O.user_id
          JOIN order_items OI 
          ON OI.order_id = O.order_id
          JOIN product P
          ON P.product_id = OI.product_id
          LEFT JOIN review R 
          ON R.product_id = P.product_id AND R.user_id = U.user_id
          WHERE U.user_id = $1
          AND R.rating IS NULL
          AND OI.order_status = 'history'`,[userId])

        if(products.rows.length===0){
          return res.json({message:'No products left to be reviewed'})
        } else {
          return res.json(products.rows)
        }
      }
  
    } catch (error) {
      console.error(`Error fetching reviews: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  
  router.get("/:user_id/to-review", async (req,res) => {
    try {
      const {user_id} = req.params;
      const products = await pool.query(`SELECT P.product_id AS p_id, P."name", P.photo_url, O.order_date, R.*, S."name" AS shop
      FROM orders O LEFT JOIN review R
      ON O.user_id = R.user_id
      AND O.user_id = 1
      AND R.rating IS NULL
      JOIN product P
      ON R.product_id = P.product_id
      JOIN users S 
      ON S.user_id = P.user_id`,[user_id])

      if(products.rows.length===0){
        res.json({message:'No products left to be reviewed'})
      }
      else{
        res.json(products.rows)
      }
    } catch (error) {
      console.error(`Error /customer/to-be-reviewed: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

  router.put('/change-password', async (req, res) => {
    const { user_id, current_password, new_password } = req.body;
    // Fetch user from database using user_id
    try {
      // Query to fetch user's password from the database
      const query = 'SELECT password FROM users WHERE user_id = $1';
      const result = await pool.query(query, [user_id]);
  
      // Check if user exists
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Retrieve the hashed password from the query result
      const hashedPasswordFromDB = result.rows[0].password;
  
      // Compare current password with hashed password stored in the database
      const isPasswordMatch = await bcrpyt.compare(current_password, hashedPasswordFromDB);
  
      if (!isPasswordMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrpyt.hash(new_password, 10);
  
      // Update user's password in the database
      const updateQuery = 'UPDATE users SET password = $1 WHERE user_id = $2';
      await pool.query(updateQuery, [hashedPassword, user_id]);
  
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error updating password:', error.message);
      res.status(500).json({ message: 'Failed to update password' });
    }
  });

  //Get Address from Post Code
  router.get("/post_code/:post_code", async (req,res) => {
    try {
      const {post_code} = req.params;
      const address = await pool.query(`SELECT * FROM shipping_zones WHERE 
      post_code = $1`,[post_code])

      if(address.rows.length===0){
        res.json({message:'No such post code exists'})
      }
      else{
        res.json(address.rows)
      }
    } catch (error) {
      console.error(`Error /customer/post_code: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })




module.exports = router