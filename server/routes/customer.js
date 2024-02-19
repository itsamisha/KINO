const router = require('express').Router()
const pool = require('../database')

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
  router.put("/update", async (req, res) => {
    try {
      const { id, name, email, phone_number, preferred_payment_method } = req.body;
      const update = await pool.query(`UPDATE users SET
      name = $1,
      email = $2,
      phone_number = $3,
      preferred_payment_method = $4
      WHERE user_id = $5
      RETURNING *`, [name, email, phone_number, preferred_payment_method,id]);
      res.status(200).json(update.rows[0])
      console.log(update.rows[0])
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

  //Payment and Order Confirmation

  
  //Get Order History
  router.get("/:user_id/orders", async (req, res) => {
    try {
      const { user_id } = req.params;
      const customer = await pool.query(`SELECT P.product_id,P.name,P.photo_url,
      OI.quantity,OI.order_item_id, O.order_date
      FROM users U LEFT JOIN orders O 
      ON U.user_id = O.user_id AND U.user_id = $1
      JOIN order_items OI 
      ON OI.order_id = O.order_id
      JOIN product P
      ON P.product_id = OI.product_id
      GROUP BY O.order_date, P.product_id, OI.quantity`, [user_id]);

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
  
  //Delete Order History
  router.delete("/remove-order", async (req, res) => {
    try {
      const {order_items_id} = req.body
        await pool.query(`
            DELETE FROM order_items
            WHERE order_item_id = $1;
        `, [order_items_id]);
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error(`Error deleting wishlist: ${error.message}`);
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
  router.get("/:user_id/to-be-reviewed", async (req,res) => {
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

  //Previous reviews
  router.get("/:user_id/reviews", async (req,res) => {
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


  router.put("/change_password", async (req, res) => {
    try {
      
      console.log("here")
      
      const { id,newPassword } = req.body;
      
      // Update the password
      const update = await pool.query("UPDATE users SET password = $1 WHERE user_id = $2", [newPassword, id]);
  
      if (update.rowCount > 0) {
        res.json({ message: 'Password changed successfully' });
      } else {
        res.status(500).json({ message: 'Failed to change password' });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


module.exports = router