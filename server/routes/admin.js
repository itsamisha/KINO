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
      const usersQuery = 'SELECT * FROM product p LEFT JOIN discount d on (p.product_id=d.product_id) LEFT JOIN  review r on (p.product_id=r.product_id)LEFT JOIN order_items o on (p.product_id=o.product_id) order by p.product_id';
      const Result = await pool.query(usersQuery);
      
      res.status(200).json(Result.rows);
    } catch (error) {
      console.error('Error fetching cards:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  module.exports = router;
