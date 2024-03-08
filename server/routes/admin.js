const router = require('express').Router()
const pool = require('../database')
//get all users
router.get('/users', async (req, res) => {
    try {
      const usersQuery = 'SELECT * FROM users ORDER BY user_id';
      const Result = await pool.query(usersQuery);
      
      res.status(200).json(Result.rows);
    } catch (error) {
      console.error('Error fetching users:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  //top 5 users
  router.get('/top-users', async (req, res) => {
    try {
        const query = `
        SELECT u.user_id,
           u.name,
           u.email,
           COUNT(*) AS total_orders
    FROM users u
    JOIN orders o ON u.user_id = o.user_id
    GROUP BY u.user_id
    ORDER BY total_orders DESC
    LIMIT 5;
        `;
        const result = await pool.query(query);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching top users:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//get top 5 sellers
router.get('/top-sellers', async (req, res) => {
    try {
        const query = `
        SELECT * FROM users
        WHERE revenue IS NOT NULL
        ORDER BY revenue ASC
        LIMIT 5;
        
        `;
        const result = await pool.query(query);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching top sellers:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//stock khali jader
router.get('/low-stock-products', async (req, res) => {
    try {
      const {user_id}=req.params;
      const Products = await pool.query(`
      SELECT product_id,user_id, name,purchase_count,stock_quantity,(SELECT u.name AS shop_name FROM users u WHERE u.user_id=p.user_id)
      FROM product p
      GROUP BY product_id, name
      HAVING   stock_quantity=0
      ORDER BY stock_quantity;
      `);
      res.json(Products.rows);
      console.log(Products.rows);
    } catch (error) {
      console.error('Error fetching low-stock products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  //specific user and product er jonno we can use routes from seller.js and customer.js ig?
  //all gift card details
  router.get('/giftcards', async (req, res) => {
    try {
      const usersQuery = 'SELECT * FROM gift_card g1 JOIN users u1 ON (g1.user_id=u1.user_id) ORDER BY g1.user_id';
      const Result = await pool.query(usersQuery);
      
      res.status(200).json(Result.rows);
    } catch (error) {
      console.error('Error fetching cards:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  //all products
  router.get('/products', async (req, res) => {
    try {
      const usersQuery = 'SELECT d.*, r.*, o.*,p.*,u.user_id AS shop_id,u.name AS shop_name FROM product p LEFT JOIN discount d on (p.product_id=d.product_id)LEFT JOIN users u ON(p.user_id=u.user_id) LEFT JOIN  review r on (p.product_id=r.product_id)LEFT JOIN order_items o on (p.product_id=o.product_id) LEFT JOIN order_items oi ON(p.product_id=oi.product_id)order by p.product_id';
      const Result = await pool.query(usersQuery);
      
      res.status(200).json(Result.rows);
    } catch (error) {
      console.error('Error fetching cards:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  //Get Order History
  router.get("/orders", async (req, res) => {
    try {
     
      const customer = await pool.query(`SELECT P.product_id,P.name,P.photo_url,
      OI.quantity,OI.order_item_id, O.order_date
      FROM users U LEFT JOIN orders O 
      ON U.user_id = O.user_id
      JOIN order_items OI 
      ON OI.order_id = O.order_id
      JOIN product P
      ON P.product_id = OI.product_id
      GROUP BY O.order_date, P.product_id, OI.quantity`);

      if (customer.rows.length === 1) {
        res.json(customer.rows);
      } else {
        res.status(404).json({ message: ' not found' });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  //get orders
router.get('/:status/orders', async (req, res) => {
    try {
      const {status } = req.params;
      //console.log(user_id);
      
      const orderData=await pool.query(`
      SELECT * FROM get_orders_for_all_user($1)
    `, [status]);
   // console.log(status);
   // console.log(orderData.rows);
      res.json(orderData.rows);
    } catch (error) {
      console.error('Error fetching ordersellers data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  //pie chart for shipping zone
  router.get('/shippingpie', async (req, res) => {
    try {
     
      
      const orderData=await pool.query(`
      SELECT sz.division, COUNT(o.order_id) AS order_count
FROM orders o
JOIN Address a ON o.address_id = a.address_id
JOIN Shipping_Zones sz ON a.post_code = sz.post_code
GROUP BY sz.division;

    `);
   
    console.log(orderData.rows);
      res.json(orderData.rows);
    } catch (error) {
      console.error('Error fetching shipping pie data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  module.exports = router;
